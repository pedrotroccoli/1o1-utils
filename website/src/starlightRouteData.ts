import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware((context) => {
  const slug = context.locals.starlightRoute.id || "index";
  const ogImageUrl = new URL(
    `/1o1-utils/og/${slug}.png`,
    context.site
  );

  context.locals.starlightRoute.head.push(
    { tag: "meta", attrs: { property: "og:image", content: ogImageUrl.href } },
    { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
    { tag: "meta", attrs: { property: "og:image:height", content: "630" } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:image", content: ogImageUrl.href } }
  );
});
