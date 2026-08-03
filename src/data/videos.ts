export type Video = {
  id: string;
  title: string;
  url: string;
};

export const getYouTubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
};

export const youtubeEmbed = (url: string) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
};

export const youtubeThumb = (url: string) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
};

export const videos: Video[] = [
  {
    id: "1",
    title: "Stay Safe Online: Cyber Awareness 101",
    url: "https://www.youtube.com/watch?v=VEQd-jmVs44&pp=ygUeY3liZXIgYXdhcmVuZXNzIGFuaW1hdGVkIHZpZGVv0gcJCaMLAYcqIYzv",
  },
  {
    id: "2",
    title: "Phishing Traps & How to Avoid Them",
    url: "https://www.youtube.com/watch?v=XBkzBrXlle0",
  },
  {
    id: "3",
    title: "Digital Literacy for Students",
    url: "https://www.youtube.com/watch?v=3uLLivFGlfE",
  },
];

export const featuredVideo = videos[0];

