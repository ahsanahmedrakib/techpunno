import fs from "fs";
import path from "path";
import { deleteImageFromDB, saveImageToDB } from "./imageStore";
import { EXTENSION_MAP } from "./imageTypes";

const ALLOWED_FOLDERS = [
  "services",
  "projects",
  "blogs",
  "team",
  "hero",
  "settings",
  "events",
  "news",
  "uploads",
  "advisors",
  "coreteam",
  "volunteers",
  "certificateconfig",
  "volunteerconfig",
];

function validateFolderName(folderName: string): void {
  if (!ALLOWED_FOLDERS.includes(folderName)) {
    throw new Error(`Invalid folder name: "${folderName}"`);
  }
}

function sanitizeImageId(id: string | number): string {
  const str = String(id);
  if (!/^[a-zA-Z0-9_-]+$/.test(str)) {
    throw new Error("Invalid image resource ID");
  }
  return str;
}

export async function saveImage(
  base64Data: string,
  folderName: string,
  id: string | number,
): Promise<string> {
  if (!base64Data || !base64Data.startsWith("data:image/")) {
    return base64Data;
  }

  validateFolderName(folderName);

  const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches?.length !== 3) {
    throw new Error("Invalid base64 image data");
  }

  const fileType = matches[1].toLowerCase();
  const extension = EXTENSION_MAP[fileType];
  if (!extension) {
    throw new Error(`Unsupported image type: ${fileType}`);
  }

  const buffer = Buffer.from(matches[2], "base64");

  if (process.env.NODE_ENV === "production") {
    return saveImageToDB(base64Data, folderName, id);
  }

  const relativeDir = `/images/api/${folderName}`;
  const targetDir = path.join(process.cwd(), "public", relativeDir);

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const fileName = `${sanitizeImageId(id)}_${Date.now()}.${extension}`;
    const filePath = path.join(targetDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return `${relativeDir}/${fileName}`;
  } catch {
    return saveImageToDB(base64Data, folderName, id);
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  if (imageUrl.startsWith("/api/image/")) {
    await deleteImageFromDB(imageUrl);
    return;
  }

  if (!imageUrl.startsWith("/images/api/")) {
    return;
  }

  if (imageUrl.includes("..") || imageUrl.includes("\\")) {
    return;
  }

  try {
    const filePath = path.join(process.cwd(), "public", imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // File may already be missing or shared; ignore.
  }
}

export async function deleteImageFiles(
  doc: Record<string, unknown>,
  imageFields: string[],
): Promise<void> {
  for (const field of imageFields) {
    const value = doc[field];
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item) {
          await deleteImage(item);
        }
      }
    } else if (typeof value === "string" && value) {
      await deleteImage(value);
    }
  }
}

