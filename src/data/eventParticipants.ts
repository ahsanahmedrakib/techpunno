export type EventParticipantItem = {
  id: string;
  eventId: string;
  eventTitle: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  className: string;
  institution: string;
  status: "pending" | "approved" | "rejected";
};

export const eventParticipants: EventParticipantItem[] = [];
