import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.16.0/dist/mermaid.esm.min.mjs";
import elkLayouts from "https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0.2.3/dist/mermaid-layout-elk.esm.min.mjs";

mermaid.registerLayoutLoaders(elkLayouts);

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  themeVariables: {
    fontFamily: getComputedStyle(document.documentElement).fontFamily,
  },
});

await document.fonts.ready;
await mermaid.run();
