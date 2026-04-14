import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const entries = await getCollection("docs");
const pages = Object.fromEntries(
  entries.map(({ data, id }) => [id, { data }])
);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_id, page: (typeof pages)[string]) => ({
    title: page.data.title,
    description: page.data.description || "",
    bgGradient: [[25, 25, 25]],
    font: {
      title: {
        families: ["Geist", "Inter", "sans-serif"],
        weight: "Bold",
        color: [245, 245, 245],
        size: 64,
      },
      description: {
        families: ["Inter", "sans-serif"],
        weight: "Normal",
        color: [180, 180, 180],
        size: 28,
      },
    },
    fonts: [
      "https://fonts.googleapis.com/css2?family=Geist:wght@700&display=swap",
      "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap",
    ],
    logo: {
      path: "./public/logo.png",
      size: [120],
    },
    border: {
      color: [107, 92, 231],
      width: 4,
      side: "block-end",
    },
  }),
});
