import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightTypeDoc from "starlight-typedoc";

export default defineConfig({
  site: "https://pedrotroccoli.github.io",
  base: "/1o1-utils",
  prefetch: {
    prefetchAll: true,
  },
  integrations: [
    starlight({
      title: "1o1-utils",
      logo: {
        src: "./public/logo.png",
        alt: "1o1-utils logo",
      },
      favicon: "/favicon.png",
      description: "Lightweight, tree-shakeable TypeScript utility library",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/pedrotroccoli/1o1-utils",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/pedrotroccoli/1o1-utils/edit/main/website/",
      },
      plugins: [
        starlightTypeDoc({
          entryPoints: ["../src/index.ts"],
          tsconfig: "../tsconfig.json",
          output: "api",
          sidebar: {
            label: "API Reference",
            collapsed: true,
          },
          typeDoc: {
            excludePrivate: true,
            excludeProtected: true,
            excludeInternal: true,
          },
        }),
      ],
      sidebar: [
        {
          label: "Start Here",
          items: [
            { label: "Why 1o1-utils", link: "/why-1o1-utils/" },
            { label: "Getting Started", link: "/getting-started/" },
            { label: "Benchmarks", link: "/benchmarks/" },
            { label: "Contributing", link: "/contributing/" },
          ],
        },
        {
          label: "Compare",
          items: [
            { label: "vs lodash", link: "/compare/vs-lodash/" },
            { label: "vs radash", link: "/compare/vs-radash/" },
            { label: "vs es-toolkit", link: "/compare/vs-es-toolkit/" },
            { label: "vs just", link: "/compare/vs-just/" },
          ],
        },
        {
          label: "Arrays",
          autogenerate: { directory: "arrays" },
        },
        {
          label: "Numbers",
          autogenerate: { directory: "numbers" },
        },
        {
          label: "Objects",
          autogenerate: { directory: "objects" },
        },
        {
          label: "Strings",
          autogenerate: { directory: "strings" },
        },
        {
          label: "Async",
          autogenerate: { directory: "async" },
        },
        {
          label: "Comparisons",
          autogenerate: { directory: "comparisons" },
        },
        {
          label: "Formatters",
          autogenerate: { directory: "formatters" },
        },
        {
          label: "Functions",
          autogenerate: { directory: "functions" },
        },
        {
          label: "Validators",
          autogenerate: { directory: "validators" },
        },
      ],
      lastUpdated: true,
      routeMiddleware: "./src/starlightRouteData.ts",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: true,
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Geist:wght@500;600;700;800;900&display=swap",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            href: "/1o1-utils/apple-touch-icon.png",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "help",
            type: "text/markdown",
            title: "LLM instructions",
            href: "/1o1-utils/llms.txt",
          },
        },
      ],
      components: {
        Head: "./src/components/Head.astro",
      },
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
