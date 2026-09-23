import type { Metadata } from "next";
import EventTokenCollector from "@/features/events/components/EventTokenCollector";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ event?: string; token?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Collect Event Token — TechPunno",
    description:
      "Collect your digital event token using the mobile number you registered with. Download your token after admin approval.",
  };
}

export default async function CollectTokenPage({ searchParams }: Props) {
  const { event, token } = await searchParams;
  return (
    <main className="flex-1 bg-cream">
      <EventTokenCollector initialEventId={event} verifyToken={token} />
    </main>
  );
}