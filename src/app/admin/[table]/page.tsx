import { notFound } from "next/navigation";
import { collections, isCollectionKey, type CollectionKey } from "@/lib/collections";
import CollectionManager from "@/components/admin/CollectionManager";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;

  if (!isCollectionKey(collection)) {
    notFound();
  }

  const config = collections[collection as CollectionKey];

  return (
    <CollectionManager
      collectionKey={collection as CollectionKey}
      config={config}
    />
  );
}
