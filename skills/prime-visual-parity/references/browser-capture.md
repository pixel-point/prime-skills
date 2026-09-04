# Browser Measurement Capture

Every audited DOM node declares:

- `data-prime-audit-id`;
- `data-prime-audit-section`;
- `data-prime-audit-kind`;
- `data-prime-audit-role`.

Use the repository-required browser tool at the exact render viewport. Wait for fonts, freeze deterministic motion, then evaluate the following logic in the page. Save the returned object as `measurements/browser.json` without editing its values.

```js
await document.fonts.ready;

const freeze = document.createElement("style");
freeze.dataset.primeAuditFreeze = "true";
freeze.textContent = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
`;
document.head.append(freeze);

const number = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const rgba = (value) => (value === "rgba(0, 0, 0, 0)" ? "transparent" : value);
const lineCount = (element) => {
  if (!(element instanceof HTMLElement) || !element.textContent?.trim())
    return null;
  const range = document.createRange();
  range.selectNodeContents(element);
  const rows = new Set(
    [...range.getClientRects()].map((rect) => Math.round(rect.top * 10) / 10),
  );
  return rows.size;
};

const elements = [...document.querySelectorAll("[data-prime-audit-id]")];
const nodes = elements.map((element, order) => {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const kind = element.getAttribute("data-prime-audit-kind") || "element";
  const parent = element.parentElement?.closest("[data-prime-audit-id]");
  return {
    id: element.getAttribute("data-prime-audit-id"),
    sectionId: element.getAttribute("data-prime-audit-section"),
    parentId: parent?.getAttribute("data-prime-audit-id") || null,
    kind,
    role: element.getAttribute("data-prime-audit-role"),
    order,
    text: ["text", "control", "icon"].includes(kind)
      ? element.textContent?.trim() || ""
      : null,
    box: {
      x: rect.x + scrollX,
      y: rect.y + scrollY,
      width: rect.width,
      height: rect.height,
    },
    style: {
      fontFamily: number(style.fontSize) === null ? null : style.fontFamily,
      fontWeight: number(style.fontWeight),
      fontSize: number(style.fontSize),
      lineHeight: number(style.lineHeight),
      letterSpacing: number(style.letterSpacing),
      color: rgba(style.color),
      backgroundColor: rgba(style.backgroundColor),
      borderWidth: number(style.borderTopWidth),
      borderRadius: [
        style.borderTopLeftRadius,
        style.borderTopRightRadius,
        style.borderBottomRightRadius,
        style.borderBottomLeftRadius,
      ].map(number),
      padding: [
        style.paddingTop,
        style.paddingRight,
        style.paddingBottom,
        style.paddingLeft,
      ].map(number),
      gap: number(style.gap),
      opacity: number(style.opacity),
    },
    lineCount: lineCount(element),
  };
});

return {
  schemaVersion: 1,
  source: "browser",
  renderViewport: { width: innerWidth, height: innerHeight },
  canvas: {
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  },
  nodes,
  mediaMasks: [],
};
```

Run the measurement twice after consecutive animation frames and require identical canvas and node boxes within `0.1px`. A changing layout is blocking. Remove the injected freeze style after all screenshots are captured.

Capture each PNG from the exact audited node matching its Figma reference. Do not capture an outer full-width section when the design reference is an inner content frame.
