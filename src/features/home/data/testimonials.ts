export type TestimonialItem = {
  id: string;
  name: string;
  institution: string;
  message: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
};

export const testimonials: TestimonialItem[] = [
  {
    id: "t1",
    name: "Rafiul Islam",
    institution: "Gopalganj Government High School",
    message:
      "The cyber awareness workshop completely changed how I think about online safety. Now I check links before clicking and use strong passwords everywhere!",
    rating: 5,
    status: "approved",
  },
  {
    id: "t2",
    name: "Sumaiya Akter",
    institution: "Gopalganj Govt. Women's College",
    message:
      "TechPunno's webinar on privacy was eye-opening. I learned how to protect my personal information and stay safe from social media scams.",
    rating: 5,
    status: "approved",
  },
  {
    id: "t3",
    name: "Tanvir Ahmed",
    institution: "Kashiani Pilot High School",
    message:
      "The digital literacy bootcamp was practical and fun. I now help my parents and neighbours stay safe online too.",
    rating: 4,
    status: "approved",
  },
];
