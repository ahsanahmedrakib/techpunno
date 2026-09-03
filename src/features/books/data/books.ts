export type BookItem = {
  id: string;
  title: string;
  author: string;
  description: string;
  pageCount?: number;
  isfree: "Free" | "Paid";
  price?: string;
  cover?: string;
  status?: string;
  slug?: string;
};

export const books: BookItem[] = [];
