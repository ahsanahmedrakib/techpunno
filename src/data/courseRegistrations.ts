export type CourseRegistrationItem = {
  id: string;
  courseId: string;
  courseTitle: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  mobile: string;
  className: string;
  institution: string;
  status: "pending" | "approved" | "rejected";
};

export const courseRegistrations: CourseRegistrationItem[] = [];
