import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.esm.min.mjs";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  themeVariables: {
    fontFamily: getComputedStyle(document.documentElement).fontFamily,
  },
});

await document.fonts.ready;
await mermaid.run();
