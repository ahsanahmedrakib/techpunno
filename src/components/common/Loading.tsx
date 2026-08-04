import Image from "next/image";

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <div className="relative h-12 w-12 animate-pulse">
        <Image
          src="/logo.png"
          alt="TechPunno"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-sm font-medium text-ink-soft">{text}</p>
    </div>
  );
}
