// Builds presentation/WixDomains_QA.pptx from the repo's real results (pptxgenjs).
// Usage: python crop.py <repoRoot> <imgDir>, then PPTX_SKILL=<pptx skill dir> node build.js <repoRoot> <imgDir>
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const REPO = process.argv[2];
const IMG = process.argv[3];
const OUT = path.join(REPO, "presentation", "WixDomains_QA.pptx");
const GH = "https://github.com/kazes5/WixAssignment/blob/main/";
const GH_TREE = "https://github.com/kazes5/WixAssignment/tree/main/";
const REPO_URL = "https://github.com/kazes5/WixAssignment";

const THEME = {
  name: "Roy QA Wix-style",
  headFontFace: "Wix Madefor Display",
  bodyFontFace: "Wix Madefor Text",
  colors: {
    dk1: "000000", lt1: "FFFFFF", dk2: "20303C", lt2: "F0F4F7",
    accent1: "116DFF", accent2: "0E8A43", accent3: "F5A623", accent4: "E62E4D",
    accent5: "6B7B88", accent6: "0B4FC2", hlink: "116DFF", folHlink: "0B4FC2",
  },
};
const HEX = { blue: "116DFF", green: "0E8A43", amber: "F5A623", red: "E62E4D", grey: "6B7B88", ink: "20303C", line: "D5DEE5", muted: "5F6B75", lightblue: "6FA8FF", darkpanel: "1A1F24" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.author = "Roy";
pres.title = "Wix Domains QA home assignment";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const K = { black: C.text1, white: C.background1, ink: C.text2, panel: C.background2, blue: C.accent1, green: C.accent2, amber: C.accent3, red: C.accent4, grey: C.accent5 };
const HEAD = THEME.headFontFace;
const MONO = "Courier New";
const FOOTER = "Roy · Wix Domains QA home assignment · not an official Wix document";
const W = 13.333, M = 0.6, CW = W - 2 * M;
const TOP = 2.15; // where slide content starts

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: K.white },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.68, w: CW, h: 0.72, fontFace: HEAD, fontSize: 32, bold: true, color: K.black, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 1.45, w: CW, h: 0.5, fontSize: 17, color: K.ink, valign: "top", margin: 0 }, text: "" } },
    { text: { text: FOOTER, options: { x: M, y: 6.98, w: 6.5, h: 0.3, fontSize: 10, color: HEX.muted, margin: 0, valign: "middle" } } },
  ],
  slideNumber: { x: 12.33, y: 6.98, w: 0.4, h: 0.3, fontSize: 10, color: HEX.muted, align: "right" },
});
pres.defineSlideMaster({
  title: "DARK",
  background: { color: K.black },
  objects: [{ text: { text: FOOTER, options: { x: M, y: 6.98, w: 8, h: 0.3, fontSize: 10, color: "AEB8C2", margin: 0, valign: "middle" } } }],
});

// ---------- helpers ----------
function content(topic, title, key, notes, section) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(topic, { x: M, y: 0.35, w: CW, h: 0.3, fontSize: 12, bold: true, color: K.blue, margin: 0, isTextBox: true, objectName: "Topic label", charSpacing: 1 });
  s.addText(title, { placeholder: "title" });
  s.addText(key, { placeholder: "body" });
  s.addNotes(notes);
  return s;
}
function deepDive(s, label, url) {
  s.addText([{ text: "Deep dive → ", options: { color: HEX.muted } }, { text: label, options: { color: K.blue, bold: true, hyperlink: { url, tooltip: url } } }],
    { x: 6.7, y: 6.98, w: 5.5, h: 0.3, fontSize: 11, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Deep dive link" });
}
function panel(s, x, y, w, h, color, name) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: color || K.panel }, line: { type: "none" }, rectRadius: 0.18, objectName: name || "Panel" });
}
function pill(s, x, y, w, h, text, fill, color, fontSize, name) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: h / 2, objectName: (name || "Pill") + " shape" });
  s.addText(text, { x, y, w, h, fontSize: fontSize || 12, bold: true, color, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: name || "Pill" });
}
function txt(s, text, o) { s.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", color: K.ink, fontSize: 16 }, o)); }
function bullets(items, o) {
  return items.map((t, i) => ({ text: t, options: Object.assign({ bullet: { indent: 18 }, breakLine: i < items.length - 1, paraSpaceAfter: 8 }, o || {}) }));
}
function img(s, file, x, y, w, pxW, pxH, alt, name) {
  const h = w * pxH / pxW;
  s.addImage({ path: path.join(IMG, file), x, y, w, h, altText: alt, objectName: name });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { type: "none" }, line: { color: HEX.line, width: 1 }, objectName: name + " border" });
  return h;
}
const hcell = (t, al) => ({ text: t, options: { bold: true, color: K.black, fill: { color: K.panel }, fontSize: 13, align: al || "left" } });
const TB = { type: "solid", pt: 0.75, color: HEX.line };
const sevFill = { S2: K.red, S3: K.amber, S4: K.grey, P1: K.red, P2: K.amber, P3: K.grey };
const sevText = { S2: K.white, S3: K.ink, S4: K.white, P1: K.white, P2: K.ink, P3: K.white };
const tag = (t) => ({ text: t, options: { bold: true, color: sevText[t.slice(0, 2)], fill: { color: sevFill[t.slice(0, 2)] }, align: "center", fontSize: 13 } });

// Door architecture slide: left = what it's made of + testing note; right = calls table + one piece of evidence.
function doorSlide(n, title, key, madeOf, calls, note, ev, notes, anchor) {
  const s = content("2 · ARCHITECTURE OF EACH DOOR · " + n + " OF 4", title, key, notes, "2 Architecture");
  const lw = 3.9;
  panel(s, M, TOP, lw, 2.75, K.panel, "Made of panel");
  txt(s, "What it's made of", { x: M + 0.3, y: TOP + 0.25, w: lw - 0.6, h: 0.4, fontSize: 16, bold: true, color: K.black, objectName: "Made of heading" });
  txt(s, bullets(madeOf), { x: M + 0.3, y: TOP + 0.8, w: lw - 0.5, h: 1.85, fontSize: 14, objectName: "Made of list" });
  panel(s, M, TOP + 2.95, lw, 1.55, "E7F0FF", "Testing note panel");
  txt(s, [{ text: "For testing", options: { bold: true, color: K.blue, breakLine: true } }, { text: note }], { x: M + 0.3, y: TOP + 3.1, w: lw - 0.6, h: 1.3, fontSize: 14, valign: "middle", objectName: "Testing note" });
  const tx = M + lw + 0.3, tw = W - M - tx, rh = 0.5;
  const rows = [[hcell("Key network call"), hcell(n === 4 ? "What it returns" : "What it drives on screen")]].concat(calls.map((c) => [
    { text: c[0], options: { fontFace: MONO, fontSize: 12, color: K.black } }, { text: c[1], options: { fontSize: 14 } },
  ]));
  s.addTable(rows, { x: tx, y: TOP, w: tw, colW: [3.4, tw - 3.4], rowH: rh, valign: "middle", color: K.ink, border: TB, objectName: "Calls table" });
  const ey = TOP + rh * rows.length + 0.35, bottom = TOP + 4.5;
  if (ev.code) {
    const ch = 1.7;
    panel(s, tx, ey, tw, ch, K.black, "Response code card");
    txt(s, ev.code.map((l, i) => ({ text: l[0], options: { color: l[1], breakLine: i < ev.code.length - 1 } })), { x: tx + 0.3, y: ey + 0.15, w: tw - 0.6, h: ch - 0.3, fontFace: MONO, fontSize: 13, valign: "middle", objectName: "Response code" });
    txt(s, ev.caption, { x: tx, y: ey + ch + 0.12, w: tw, h: 0.3, fontFace: MONO, fontSize: 10, color: HEX.muted, objectName: "Evidence caption" });
  } else {
    const eh = bottom - ey, ew = Math.min(tw * 0.6, eh * ev.px[0] / ev.px[1]);
    const h = img(s, ev.file, tx, ey, ew, ev.px[0], ev.px[1], ev.alt, "Evidence screenshot");
    txt(s, [{ text: "Evidence", options: { bold: true, color: K.black, breakLine: true } }, { text: ev.caption, options: { fontSize: 13 } }, { text: "\n" + ev.path, options: { fontFace: MONO, fontSize: 10, color: HEX.muted } }],
      { x: tx + ew + 0.3, y: ey, w: tw - ew - 0.3, h: h, fontSize: 14, valign: "middle", objectName: "Evidence caption" });
  }
  deepDive(s, "ARCHITECTURE.md · " + title.split(":")[0], GH + "ARCHITECTURE.md#" + anchor);
  return s;
}

// =====================================================================
// 1. Title
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: "Intro" });
  s.addText("Can I get this name?", { x: M + 0.2, y: 1.3, w: 7.2, h: 2.0, fontFace: HEAD, fontSize: 60, bold: true, color: K.white, margin: 0, valign: "top", isTextBox: true, objectName: "Title" });
  txt(s, "QA for the four Wix Domains doors", { x: M + 0.2, y: 3.75, w: 6.8, h: 0.6, fontSize: 26, color: K.white, objectName: "Subtitle" });
  txt(s, "Roy · QA Engineer home assignment · November 2026", { x: M + 0.2, y: 4.6, w: 6.8, h: 0.4, fontSize: 16, color: "AEB8C2", objectName: "Meta" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.75, y: 3.0, w: 5.0, h: 0.95, fill: { color: K.white }, line: { type: "none" }, rectRadius: 0.47, objectName: "Search pill" });
  txt(s, "qa-wix-1793698242.com", { x: 8.15, y: 3.0, w: 2.9, h: 0.95, fontSize: 17, color: K.black, valign: "middle", objectName: "Search text" });
  pill(s, 11.05, 3.2, 1.5, 0.55, "Available", K.blue, K.white, 14, "Available chip");
  txt(s, "free · taken · not sold here", { x: 8.15, y: 4.15, w: 4.5, h: 0.4, fontSize: 14, color: "AEB8C2", objectName: "Answers" });
  s.addText([{ text: "github.com/kazes5/WixAssignment", options: { hyperlink: { url: REPO_URL }, color: HEX.lightblue } }],
    { x: 7.2, y: 6.98, w: 5.53, h: 0.3, fontSize: 11, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Repo link" });
  s.addNotes(
    "Hi, I'm Roy. This is my QA home assignment for Wix Domains.\n\n" +
    "The deck follows six topics: the tested feature and why it matters; the architecture of each door; the manual test structure and coverage; the automated test structure and coverage; the major findings; and a summary of how each requirement is covered.\n\n" +
    "I ran the work as a small team of AI agents (system architect, senior QA engineer, automation engineer, designer). I managed them and reviewed every handoff. AI_LOG.md explains what the AI did, where it was wrong, and what stayed human.\n\n" +
    "Every content slide links to the file in the repo for the full detail. Repo: " + REPO_URL);
}

// =====================================================================
// 2. Topic 1: feature and importance
pres.addSection({ title: "1 Tested feature" });
{
  const s = content("1 · TESTED FEATURE AND ITS IMPORTANCE", "\"Can I get this name?\" is the start of every domain sale",
    "Four doors answer it. A wrong answer means a lost sale, or broken trust.",
    "The tested feature is the answer to one question: 'Can I get this name?' (Requirements.md, 'The scenario').\n\n" +
    "Four doors answer it:\n" +
    "- Domain storefront, wix.com/domains: type a name, see if it's free, with a price and a buy button.\n" +
    "- Business Name Generator, wix.com/tools/business-name-generator: describe your business, get AI-generated names and domains.\n" +
    "- WHOIS lookup, wix.com/domains/whois: registration data for a domain, plus alternatives to buy.\n" +
    "- Public Domain Search API, wixapis.com/domain-search/v2: availability and suggestions for developers, with an account-level API key.\n\n" +
    "Why it matters (TEST_PLAN.md section 3, the P0 reasoning): this answer is the entry to a domain purchase. If a free name shows as taken, Wix loses the sale. If a taken name shows as free, the user tries to buy a name they can't get, and trust breaks. The doors must also agree with each other: the same name, at the same moment, should get the same answer everywhere.\n\n" +
    "Environment: tested on 2026-11-03 from Israel, so prices show in shekels and .co.il is suggested. That's expected per 'Domain basics'.",
    "1 Tested feature");
  const cards = [
    ["Domain storefront", "Search a name, see if it's free"],
    ["Name Generator", "Describe a business, get names and domains"],
    ["WHOIS lookup", "See who registered a domain"],
    ["Public API", "Developers check names in code"],
  ];
  const cw = 2.85, gap = 0.233;
  cards.forEach((c, i) => {
    const x = M + i * (cw + gap), y = TOP;
    panel(s, x, y, cw, 2.2, K.panel, "Door card " + (i + 1));
    pill(s, x + 0.3, y + 0.3, 0.5, 0.5, String(i + 1), K.blue, K.white, 15, "Door number " + (i + 1));
    txt(s, c[0], { x: x + 0.3, y: y + 0.9, w: cw - 0.5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: K.black, objectName: "Door name " + (i + 1) });
    txt(s, c[1], { x: x + 0.3, y: y + 1.45, w: cw - 0.5, h: 0.65, fontSize: 14, objectName: "Door purpose " + (i + 1) });
  });
  // why it matters: three blocks
  const why = [
    ["Entry to a purchase", "The answer leads straight to \"Make It Yours\"."],
    ["Wrong \"taken\"", "A free name looks taken: a lost sale."],
    ["Wrong \"free\"", "A taken name looks free: broken trust."],
  ];
  const ww = (CW - 0.45) / 3;
  why.forEach((w, i) => {
    const x = M + i * (ww + 0.225), y = 4.65;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: ww, h: 1.25, fill: { color: K.white }, line: { color: HEX.line, width: 1 }, rectRadius: 0.18, objectName: "Why block " + i });
    txt(s, [{ text: w[0], options: { bold: true, color: i === 0 ? K.blue : K.black, fontSize: 17, breakLine: true } }, { text: w[1], options: { fontSize: 14 } }],
      { x: x + 0.3, y: y + 0.2, w: ww - 0.6, h: 0.9, objectName: "Why text " + i });
  });
  txt(s, "Tested on 3 Nov 2026 from Israel, so prices in ₪ are expected.", { x: M, y: 6.15, w: 9, h: 0.35, fontSize: 13, color: HEX.muted, objectName: "Environment note" });
  deepDive(s, "Requirements.md", GH + "Requirements.md");
}

// =====================================================================
// 3. Topic 2: overview diagram
pres.addSection({ title: "2 Architecture" });
{
  const s = content("2 · ARCHITECTURE OF EACH DOOR · OVERVIEW", "All four doors meet in one shared search service",
    "The storefront, WHOIS and the API ask the same service. Only the login differs.",
    "Redrawn from the Mermaid diagram in ARCHITECTURE.md section 1, gathered with browser developer tools on 2026-11-03.\n\n" +
    "- The three web doors are pages on www.wix.com, built on Wix's own site platform with React 18. Each has a landing page and a results page under /domain/result/.\n" +
    "- Shared Domain Search service: the storefront and WHOIS call www.wix.com/domain-search/v2/..., the same paths as the public API at www.wixapis.com/domain-search/v2/... The Name Generator calls suggest-domains only.\n" +
    "- Web-only serverless services: the TLD list (415 TLDs), per-TLD display prices, AI business names, WHOIS / RDAP parsing.\n" +
    "- WHOIS asks the registry's RDAP server (for .com, rdap.verisign.com) straight from the browser.\n" +
    "- Buy buttons go to manage.wix.com/premium-domains, the 'Domain Purchase' page. Testing stops there.\n" +
    "- Auth: web doors use the browser session (cookies plus an XSRF token); the API uses an account-level API key and account ID.\n\n" +
    "So: availability must agree across doors (one source of truth), while suggestions may differ (one engine, different inputs). The next four slides go door by door.",
    "2 Architecture");
  const doors = ["Domain storefront", "Name Generator", "WHOIS lookup", "Public API"];
  const dx = M, dw = 2.6, dh = 0.72, dys = [2.2, 3.15, 4.1, 5.05];
  doors.forEach((d, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: dx, y: dys[i], w: dw, h: dh, fill: { color: i === 3 ? K.black : K.panel }, line: { type: "none" }, rectRadius: 0.15, objectName: "Door " + d });
    txt(s, d, { x: dx, y: dys[i], w: dw, h: dh, fontSize: 15, bold: true, color: i === 3 ? K.white : K.black, align: "center", valign: "middle", objectName: "Door label " + d });
  });
  const sx = 4.35, sw = 3.9, shY = 2.2, shH = 1.7, woY = 4.35, woH = 1.42;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sx, y: shY, w: sw, h: shH, fill: { color: K.blue }, line: { type: "none" }, rectRadius: 0.18, objectName: "Shared service box" });
  txt(s, "Domain Search service (shared)", { x: sx + 0.25, y: shY + 0.18, w: sw - 0.5, h: 0.4, fontSize: 16, bold: true, color: K.white, objectName: "Shared service title" });
  txt(s, bullets(["Check availability", "Suggest domains"], { color: K.white }), { x: sx + 0.25, y: shY + 0.7, w: sw - 0.5, h: 0.9, fontSize: 14, color: K.white, objectName: "Shared service calls" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sx, y: woY, w: sw, h: woH, fill: { color: K.white }, line: { color: HEX.ink, width: 1.25 }, rectRadius: 0.18, objectName: "Web-only box" });
  txt(s, "Web-only services", { x: sx + 0.25, y: woY + 0.15, w: sw - 0.5, h: 0.4, fontSize: 16, bold: true, color: K.black, objectName: "Web-only title" });
  txt(s, "Prices · TLD list · AI names · WHOIS data", { x: sx + 0.25, y: woY + 0.6, w: sw - 0.5, h: 0.7, fontSize: 14, objectName: "Web-only list" });
  const x1 = dx + dw, x2 = sx;
  function link(fromY, toY, color, width, dash) {
    s.addShape(pres.shapes.LINE, { x: x1, y: Math.min(fromY, toY), w: x2 - x1, h: Math.max(Math.abs(toY - fromY), 0.001), flipV: toY < fromY, line: { color, width, endArrowType: "triangle", dashType: dash || "solid" }, objectName: "Connector" });
  }
  const shC = shY + shH / 2, woC = woY + woH / 2;
  dys.forEach((y, i) => {
    const c = y + dh / 2;
    link(c, shC - 0.45 + i * 0.3, HEX.blue, 1.75);
    if (i < 3) link(c, woC - 0.35 + i * 0.35, HEX.muted, 1.25, "dash");
  });
  const rx = 9.05, rw = 3.68;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: shY, w: rw, h: shH, fill: { color: K.white }, line: { color: HEX.red, width: 1.5, dashType: "dash" }, rectRadius: 0.18, objectName: "Purchase box" });
  txt(s, [{ text: "Purchase page", options: { bold: true, color: K.black, breakLine: true } }, { text: "Buy buttons on the web doors lead here. Testing stops here.", options: { fontSize: 13 } }],
    { x: rx + 0.25, y: shY + 0.18, w: rw - 0.5, h: 1.35, fontSize: 16, objectName: "Purchase text" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: woY, w: rw, h: woH, fill: { color: K.panel }, line: { type: "none" }, rectRadius: 0.18, objectName: "Registry box" });
  txt(s, [{ text: "Domain registry", options: { bold: true, color: K.black, breakLine: true } }, { text: "Outside Wix. WHOIS asks it straight from the browser.", options: { fontSize: 13 } }],
    { x: rx + 0.25, y: woY + 0.15, w: rw - 0.5, h: 1.2, fontSize: 16, objectName: "Registry text" });
  s.addShape(pres.shapes.LINE, { x: sx + sw, y: woC, w: rx - (sx + sw), h: 0, line: { color: HEX.muted, width: 1.25, endArrowType: "triangle" }, objectName: "Connector to registry" });
  s.addShape(pres.shapes.LINE, { x: M, y: 6.3, w: 0.5, h: 0, line: { color: HEX.blue, width: 1.75 }, objectName: "Legend shared line" });
  txt(s, "Shared calls", { x: M + 0.6, y: 6.15, w: 1.6, h: 0.3, fontSize: 12, color: HEX.muted, valign: "middle", objectName: "Legend shared" });
  s.addShape(pres.shapes.LINE, { x: 2.75, y: 6.3, w: 0.5, h: 0, line: { color: HEX.muted, width: 1.25, dashType: "dash" }, objectName: "Legend web line" });
  txt(s, "Web doors only", { x: 3.35, y: 6.15, w: 1.8, h: 0.3, fontSize: 12, color: HEX.muted, valign: "middle", objectName: "Legend web" });
  txt(s, "Web doors log in with the browser session. The API uses an API key.", { x: 5.4, y: 6.15, w: 7.33, h: 0.3, fontSize: 12, color: HEX.muted, valign: "middle", objectName: "Auth note" });
  deepDive(s, "ARCHITECTURE.md · big picture", GH + "ARCHITECTURE.md#1-the-big-picture");
}

// 4–7. One slide per door
doorSlide(1, "Domain storefront: the main answer card", "One search fires several calls. Each one fills a different part of the page.",
  ["A marketing page with a search box", "A results page under /domain/result", "Built on Wix's own site platform (React)"],
  [["check-domain-availability", "The main card: \"Available now!\" or \"already registered\""],
   ["suggest-domains", "The list of alternatives"],
   ["suggested-tld-display-prices", "Every price on the page, in local currency"],
   ["bulk availability check", "Same name in other endings, when it's taken"]],
  "check the answer text, the domain, a price and the buy button. Not exact prices.",
  { file: "sf01b.jpg", px: [455, 90], alt: "Evidence SF-01: main card with Exact Match, Available now!, price and Make It Yours", caption: "The main card, filled by the availability call.", path: "evidence/SF-01/" },
  "From ARCHITECTURE.md section 2.1.\n\n" +
  "Made of: a marketing landing page with a search box and TLD chips; submitting goes to the results page www.wix.com/domain/result/?q=<input>, which loads its data with same-origin XHR calls.\n\n" +
  "Key calls on the results page and what they drive:\n" +
  "- check-domain-availability (when the input has a TLD): the main answer card, 'Exact Match · Available now!' with price and 'Make It Yours', or '<domain> is already registered'.\n" +
  "- suggest-domains (paging.limit=50, always): the alternatives list, and both hero cards when there's no TLD.\n" +
  "- suggested-tld-display-prices: every price, with the struck-through original price, renewal price and pricing strategy, already formatted in local currency.\n" +
  "- suggested-tlds plus bulk/domain-availabilities/check (when the name is taken): the same name in other endings, ordered by location (.co.il was 3rd for an Israeli visitor).\n" +
  "- Also: list-tlds (415 TLDs Wix sells), user-domains (is it already in a Wix account), keywords and tld-promotions, the sale banner. Analytics calls drive nothing on screen.\n\n" +
  "For a taken name like google.com, skeleton loaders showed for several seconds; suggest-domains took about 8 seconds in one capture.\n\n" +
  "Buy buttons go to manage.wix.com/premium-domains/desktop-split-page, titled 'Domain Purchase'. We stop there.",
  "21-domain-storefront-httpswwwwixcomdomains");

doorSlide(2, "Business Name Generator: names first, then domains", "AI writes business names. Domains are then suggested for the chosen name only.",
  ["A page with \"Describe your business\"", "A results page under /domain/result/bng", "Two steps: pick a name, then a domain"],
  [["business-names/generate", "The 9 business names on the left"],
   ["suggest-domains", "Domains for the chosen name, on the right"],
   ["suggested-tld-display-prices", "The prices next to each domain"]],
  "only the short name is sent, not the business. No availability check.",
  { file: "bng02b.jpg", px: [395, 310], alt: "Evidence BNG-02: domains for the name Rise, such as traprise.com and myfundadvance.com", caption: "\"Rise\" for a bakery got finance domains.", path: "evidence/BNG-02/" },
  "From ARCHITECTURE.md section 2.2.\n\n" +
  "Made of: a landing page with a free-text 'Describe your business' box and a 'Generate Names' button. Submitting goes to /domain/result/bng?query=<description>, so the full description is in the URL. The results page has two steps: choose a business name on the left, then pick a domain on the right.\n\n" +
  "Key calls:\n" +
  "- business-names/generate (POST): the list of business names. Request has the query, the names already shown (excluding) and count 9. Each name has a 'reasoning' shown as a tooltip. 'Generate more names' calls it again. About 2.6 seconds.\n" +
  "- suggest-domains for the selected name (limit 50): the domain list on the right, called again each time another name is clicked.\n" +
  "- list-tlds and suggested-tld-display-prices: prices and purchasability, the same as the storefront.\n\n" +
  "For testing: the Name Generator doesn't call check-domain-availability; it relies on suggestions being available. Only the selected name is sent to suggest-domains. For 'Rise' (a sourdough bakery) the domains were funding-related, like traprise.com and topfundrise.com (risk R4, evidence/BNG-02).",
  "22-business-name-generator-httpswwwwixcomtoolsbusiness-name-generator");

doorSlide(3, "WHOIS lookup: registration data plus things to buy", "Two columns: who registered the domain, and alternatives you can buy.",
  ["A page with \"Enter a domain name or URL\"", "A results page under /domain/result/whois", "Asks the registry directly from the browser"],
  [["registry RDAP server", "The raw registration record (outside Wix)"],
   ["parse-rdap", "Domain information: created, expires, nameservers"],
   ["check-domain-availability", "The banner: \"google.com is taken\""],
   ["suggest-domains (5)", "The alternatives column"]],
  "invalid input shows a fake \"connection issue\" page (Finding 2).",
  { file: "wh01.jpg", px: [358, 242], alt: "Evidence WH-01: WHOIS domain information for wikipedia.org with created, expires and nameservers", caption: "Domain information for wikipedia.org, from the registry record.", path: "evidence/WH-01/" },
  "From ARCHITECTURE.md section 2.3.\n\n" +
  "Made of: a landing page with 'Enter a domain name or URL'. Submitting goes to /domain/result/whois?query=<input>. The results page has WHOIS information on the left and 'Explore these great alternatives' on the right.\n\n" +
  "Key calls:\n" +
  "- structured-domain-info/rdap-url: finds the registry's RDAP server for the TLD (for .com, rdap.verisign.com).\n" +
  "- The registry RDAP server itself, called directly from the browser, outside Wix: the raw registration record.\n" +
  "- parse-rdap: turns it into 'Domain Information': created, updated, expires, nameservers, status.\n" +
  "- structured-domain-info/whois: raw WHOIS text and 'registrant redacted' (expected for privacy).\n" +
  "- check-domain-availability: the status banner, e.g. 'google.com is taken. A broker might be able to get it for you.' Plus domain-broker-offers for the broker link.\n" +
  "- suggest-domains with limit 5 and insights/match-labels: the alternatives column with its labels.\n\n" +
  "Example, google.com: created September 15, 1997, expires September 14, 2028, nameservers ns1 to ns4.google.com.\n\n" +
  "For testing: an unregistered name redirects to the storefront card (WH-02). Invalid input shows 'There is a connection issue' and adds .com twice (Finding 2).",
  "23-whois-lookup-httpswwwwixcomdomainswhois");

doorSlide(4, "Public API: the same answer, for developers", "Two endpoints, an API key, and a thinner view than the web doors.",
  ["Two REST endpoints on wixapis.com", "Docs: needs an account-level API key", "Not in the API: prices, TLD list, bulk checks"],
  [["check-domain-availability", "available, premium, premiumType for one name"],
   ["suggest-domains", "A list of suggestions, with paging"]],
  "in our tests it answered without any key (Finding 1).",
  { code: [["GET …/check-domain-availability?domain=qa-wix-1793698242.com", "D6DEE6"], ["status: 200", "7EE2A8"], ["\"available\": true,  \"premium\": false", "D6DEE6"], ["\"premiumType\": \"UNKNOWN_PREMIUM_TYPE\"", "D6DEE6"]], caption: "Evidence: evidence/API-01/free-name.json (called with the key)" },
  "From ARCHITECTURE.md section 2.4 and section 3.\n\n" +
  "- Check Domain Availability: GET www.wixapis.com/domain-search/v2/check-domain-availability?domain=<name.tld>. The domain must include its TLD; 3 to 63 characters. Response: availability with domain, available, premium and premiumType (FIRST_YEAR_ONLY, FIRST_YEAR_AND_RENEWAL, or UNKNOWN_PREMIUM_TYPE when not premium).\n" +
  "- Suggest Domains: GET .../suggest-domains?query=<text>&tlds=<tld>&paging.limit=<n>. The TLD filter is passed without the dot ('com', not '.com'), which is documented and expected. Response: suggestions plus pagingMetadata (count, cursors, hasNext).\n" +
  "- Auth per the docs: Authorization with an account-level API key, and the wix-account-id header.\n" +
  "- Not in the public API: prices, the TLD list, bulk availability and suggested TLDs. They exist only on the web doors' internal endpoints.\n\n" +
  "How it relates: the API uses the same domain-search/v2 endpoints as the storefront and WHOIS, so for the same name at the same moment the answers must agree. That's checked by X-01, manually and in automation.\n\n" +
  "For testing: in our runs, the API answered with full data with no key, an invalid key, or only the account ID: Finding 1.",
  "24-public-domain-search-api");

// =====================================================================
// 8. Topic 3: manual structure
pres.addSection({ title: "3 Manual tests" });
{
  const s = content("3 · MANUAL TEST STRUCTURE AND COVERAGE", "Priorities follow customer impact, in one format",
    "P0 protects the answer itself. Every step has an expected result, an actual result and proof.",
    "From TEST_PLAN.md sections 2, 3 and 6.\n\n" +
    "Priorities:\n" +
    "- P0: the core answer (free or taken), consistency between doors, path to purchase. A wrong answer means a lost sale, or a user who tries to buy a name they can't get.\n" +
    "- P1: input handling, TLD rules, premium, API validation and auth, WHOIS edge cases, Name Generator relevance; also accessibility of search and results (the only way into the funnel, and a compliance area).\n" +
    "- P2: UI polish, narrow-width layout, loading states, wording, and multi-language / RTL.\n\n" +
    "Format, as required: test scope, scenario description, then a table of test step, expected result, actual result, evidence, pass or fail. Expected results were written before running; actual results only after running the step.\n\n" +
    "Evidence: 56 manual evidence files (screenshots and API responses as JSON), indexed in capture order with UTC and Israel times in evidence/README.md. The API key is never stored. Free test names use a timestamp, like qa-wix-1793698242.com.",
    "3 Manual tests");
  const bands = [
    ["P0", K.blue, "Free or taken, the same on every door, path to buy", "A wrong answer is a lost sale"],
    ["P1", K.black, "Input handling, API rules, WHOIS errors, accessibility", "Misleads or blocks users"],
    ["P2", K.grey, "Layout, loading, wording, other languages", "Hurts trust, rarely blocks"],
  ];
  bands.forEach((b, i) => {
    const y = TOP + i * 1.0;
    panel(s, M, y, CW, 0.85, K.panel, b[0] + " band");
    pill(s, M + 0.25, y + 0.18, 0.95, 0.5, b[0], b[1], K.white, 17, b[0] + " tag");
    txt(s, b[2], { x: M + 1.5, y, w: 7.2, h: 0.85, fontSize: 16, bold: true, color: K.black, valign: "middle", objectName: b[0] + " what" });
    txt(s, b[3], { x: 9.0, y, w: 3.5, h: 0.85, fontSize: 14, valign: "middle", objectName: b[0] + " why" });
  });
  txt(s, "Scenario format", { x: M, y: 5.3, w: 4, h: 0.35, fontSize: 14, bold: true, color: K.black, objectName: "Format heading" });
  const chips = ["Scope", "Scenario", "Step", "Expected", "Actual", "Evidence", "Pass / Fail"];
  const cw = 1.6, gap = 0.15;
  chips.forEach((c, i) => {
    const last = i === chips.length - 1;
    pill(s, M + i * (cw + gap), 5.75, cw, 0.5, c, last ? K.blue : K.panel, last ? K.white : K.black, 13, "Format chip " + c);
  });
  txt(s, "56 evidence files, time-stamped. Results written only after running the step.", { x: M, y: 6.38, w: CW, h: 0.35, fontSize: 13, color: HEX.muted, objectName: "Evidence note" });
  deepDive(s, "TEST_PLAN.md · priorities", GH + "TEST_PLAN.md#3-priorities-and-why");
}

// 9. Manual coverage
{
  const s = content("3 · MANUAL TEST STRUCTURE AND COVERAGE", "43 scenarios in 8 areas: every P0 passed",
    "23 pass, 12 pass with a note, 6 fail, 2 partial. Some things were left out on purpose.",
    "From the results summary in TEST_PLAN.md. All 43 scenarios were run by hand on 2026-11-03.\n\n" +
    "Per area (pass / pass with observation / fail / partial):\n" +
    "Storefront 8: 4/3/0/1. Public API 12: 9/1/1/1. WHOIS 4: 2/1/1/0. Name Generator 3: 1/2/0/0. Cross-door 2: 2/0/0/0. UI 4: 1/2/1/0. Accessibility 4: 2/0/2/0. Multi-language / RTL 6: 2/3/1/0.\n\n" +
    "Every P0 scenario passed: free names show as available, taken names as taken, and the storefront, WHOIS, Name Generator and API agree.\n" +
    "The 6 fails: API-07, WH-03, A11Y-03, I18N-02, UI-04, and A11Y-04 (the automated scan confirming A11Y-03).\n" +
    "The 2 partial: SF-08 and API-08. No available premium domain was found within budget.\n\n" +
    "Left out on purpose (TEST_PLAN.md section 4): completing a purchase (assignment rule); load, performance and brute-force testing (rule and API budget); all 415 TLDs (a representative set: .com, .co.il, .store, .online, unsold .de); several countries (no VPN, noted as a risk); a full screen-reader pass (replaced by DOM checks); deep logged-in vs logged-out comparison; visual regression.",
    "3 Manual tests");
  const stats = [["43", "scenarios", K.black], ["23", "pass", K.green], ["12", "pass with a note", K.amber], ["6", "fail", K.red], ["2", "partial", K.grey]];
  const sw = 2.3, gap = 0.15;
  stats.forEach((st, i) => {
    const x = M + i * (sw + gap);
    panel(s, x, TOP, sw, 1.05, K.panel, "Total " + st[1]);
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: TOP + 0.2, w: 0.2, h: 0.2, fill: { color: st[2] }, line: { type: "none" }, objectName: "Dot " + st[1] });
    txt(s, st[0], { x: x + 0.65, y: TOP + 0.05, w: 1.5, h: 0.6, fontFace: HEAD, fontSize: 28, bold: true, color: K.black, valign: "middle", objectName: "Total number " + st[1] });
    txt(s, st[1], { x: x + 0.65, y: TOP + 0.65, w: 1.6, h: 0.3, fontSize: 12, objectName: "Total label " + st[1] });
  });
  const areas = ["Storefront", "Public API", "WHOIS", "Name Generator", "Cross-door", "UI", "Accessibility", "Languages / RTL"];
  s.addChart(pres.charts.BAR, [
    { name: "Pass", labels: areas, values: [4, 9, 2, 1, 2, 1, 2, 2] },
    { name: "Pass with a note", labels: areas, values: [3, 1, 1, 2, 0, 2, 0, 3] },
    { name: "Fail", labels: areas, values: [0, 1, 1, 0, 0, 1, 2, 1] },
    { name: "Partial", labels: areas, values: [1, 1, 0, 0, 0, 0, 0, 0] },
  ], {
    x: M, y: 3.4, w: 7.7, h: 3.3, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 45,
    chartColors: [HEX.green, HEX.amber, HEX.red, HEX.grey],
    showValue: true, dataLabelPosition: "ctr", dataLabelFormatCode: "0;;;", dataLabelColor: "FFFFFF", dataLabelFontSize: 11, dataLabelFontFace: "+mn-lt", dataLabelFontBold: true,
    catAxisLabelColor: HEX.ink, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisLineShow: false,
    showLegend: true, legendPos: "t", legendFontSize: 11, legendFontFace: "+mn-lt", legendColor: HEX.ink,
    showTitle: false, objectName: "Results by area chart", altText: "Stacked bar chart of manual results per area",
  });
  const px = 8.65, pw = W - M - px;
  panel(s, px, 3.45, pw, 3.2, K.panel, "Left out panel");
  txt(s, "Left out, and why", { x: px + 0.3, y: 3.65, w: pw - 0.6, h: 0.4, fontSize: 16, bold: true, color: K.black, objectName: "Left out heading" });
  txt(s, bullets(["Buying a domain (rule)", "Load testing (rule)", "All 415 TLDs: a sample", "Other countries (no VPN)"]), { x: px + 0.3, y: 4.2, w: pw - 0.5, h: 2.4, fontSize: 14, objectName: "Left out list" });
  deepDive(s, "TEST_PLAN.md · results summary", GH + "TEST_PLAN.md#results-summary");
}

// =====================================================================
// 10. Topic 4: automated structure
pres.addSection({ title: "4 Automated tests" });
{
  const s = content("4 · AUTOMATED TEST STRUCTURE AND COVERAGE", "Playwright, kept small: 24 tests in 3 projects",
    "Tests check the answer and the response shape, never exact prices or suggestions.",
    "From README.md 'How the code is structured' and 'How deep the tests go'. Playwright with TypeScript.\n\n" +
    "Structure: playwright.config.ts defines 3 projects (api, web, cross), loads .env with dotenv, 1 worker, 1 retry.\n" +
    "- tests/api: availability, suggestions, validation, auth: 13 tests, no browser.\n" +
    "- tests/web: storefront.spec.ts (7 tests) and a11y.spec.ts (2 axe scans): 9 tests, logged out.\n" +
    "- tests/cross: x01-api-vs-storefront.spec.ts: 2 tests.\n" +
    "- tests/support: two small helpers, wixApi.ts (auth headers from .env, endpoints, shape checks, unique names) and storefront.ts (locators by data-hook and visible text). No page-object framework: it would be more code than tests.\n\n" +
    "How deep: API tests check status codes, the available boolean, the echoed domain, the error code and the field it blames, and the response shape from the docs. Storefront tests check what the user sees: the answer text, the domain, that a price exists in any currency, and that the buy button is there and enabled. No test clicks a buy button. Never asserted: exact prices or currency, which suggestions come back, card labels, banners.\n\n" +
    "API-07 asserts the documented 401/403 and is marked test.fail(), an expected failure for Finding 1. The suite stays green, the report still lists it, and if Wix fixes the API Playwright reports 'unexpectedly passed'. Deleting it would hide the bug; asserting 200 would turn a bug into a contract.\n\n" +
    "Traces are off in the api and cross projects because they would record the key.",
    "4 Automated tests");
  const cx = M, cw = 4.6;
  panel(s, cx, TOP, cw, 4.55, K.black, "Code panel");
  const L = (t, c, b) => ({ text: t, options: { color: c, bold: !!b, breakLine: true } });
  txt(s, [
    L("tests/", "FFFFFF", true),
    L("  api/      13 tests", "D6DEE6"),
    L("  web/       9 tests", "D6DEE6"),
    L("  cross/     2 tests", "D6DEE6"),
    L("  support/   2 helpers", "D6DEE6"),
    L(" ", "D6DEE6"),
    L("3 projects · 1 worker · 1 retry", "AEB8C2"),
    L(" ", "D6DEE6"),
    L("One command:", "AEB8C2"),
    { text: "npm test", options: { color: HEX.lightblue, bold: true, fontSize: 18 } },
  ], { x: cx + 0.35, y: TOP + 0.3, w: cw - 0.6, h: 3.5, fontFace: MONO, fontSize: 14, objectName: "Code tree" });
  s.addText([{ text: "Open the test code", options: { color: HEX.lightblue, bold: true, hyperlink: { url: GH_TREE + "tests", tooltip: GH_TREE + "tests" } } }],
    { x: cx + 0.35, y: TOP + 3.95, w: cw - 0.6, h: 0.35, fontSize: 13, margin: 0, isTextBox: true, objectName: "Tests link" });
  const rx = cx + cw + 0.3, rw = W - M - rx;
  const depth = [
    ["API", "Status, the \"available\" flag, error codes, response shape"],
    ["Storefront", "The answer text, a price, an enabled buy button"],
    ["Never checked", "Exact prices, which suggestions, labels"],
  ];
  depth.forEach((d, i) => {
    const y = TOP + i * 0.95;
    panel(s, rx, y, rw, 0.8, K.panel, "Depth " + i);
    txt(s, d[0], { x: rx + 0.3, y, w: 1.9, h: 0.8, fontSize: 15, bold: true, color: i === 2 ? K.red : K.black, valign: "middle", objectName: "Depth label " + i });
    txt(s, d[1], { x: rx + 2.2, y, w: rw - 2.4, h: 0.8, fontSize: 14, valign: "middle", objectName: "Depth text " + i });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: TOP + 2.95, w: rw, h: 1.6, fill: { color: K.white }, line: { color: HEX.blue, width: 1.25 }, rectRadius: 0.18, objectName: "API-07 box" });
  txt(s, [{ text: "API-07: a known bug kept visible", options: { bold: true, color: K.black, fontSize: 16, breakLine: true } },
    { text: "It expects the documented 401/403 and is marked as an expected failure (Finding 1). The build stays green; a fix gets noticed.", options: { fontSize: 14 } }],
    { x: rx + 0.3, y: TOP + 3.1, w: rw - 0.6, h: 1.3, valign: "middle", objectName: "API-07 text" });
  deepDive(s, "README.md · code structure", GH + "README.md#how-the-code-is-structured");
}

// 11. Automated coverage
{
  const s = content("4 · AUTOMATED TEST STRUCTURE AND COVERAGE", "21 of 43 scenarios automated, all green",
    "The stable checks are automated. Anything that needs a human, or would enter checkout, stays manual.",
    "Coverage (README.md 'What was automated and why'): API-01 to API-11, SF-01, SF-02, SF-04, SF-05, SF-07, SF-08 in part (the premium flag), UI-01 at a real 390 px phone width, UI-04, A11Y-04 (axe scan) and X-01 (API vs storefront). 21 of the 43 scenarios, fully or in part.\n\n" +
    "Results:\n" +
    "- Representative run, 2026-11-03 10:38 UTC: 24 tests, 24 passed in 44.0 seconds, no retries used (evidence/automation/run-summary.txt). API-07 counts as passed because it's an expected failure.\n" +
    "- The web tests passed 3 runs in a row without retries (10:34 to 10:38 UTC).\n" +
    "- Clean clone: a fresh clone of main from GitHub plus npm ci and .env: 24 of 24 passed in 46 seconds (EXECUTION_PLAN.md piece 5.4).\n" +
    "- One full run makes 19 API-key calls. The report and evidence were scanned for the key and account ID: 0 hits.\n\n" +
    "Stayed manual, and why (README.md):\n" +
    "- SF-03 'Make It Yours': clicking enters the purchase flow; the rule is to stop before checkout.\n" +
    "- WHOIS: calls registry servers outside Wix; Finding 2 needs a human to judge the message.\n" +
    "- Name Generator: AI output changes on every run.\n" +
    "- Premium pricing: no available premium domain found.\n" +
    "- Hebrew display, keyboard-only and screen-reader review: need human judgement.",
    "4 Automated tests");
  const st = [["21 / 43", "scenarios automated"], ["24 / 24", "passed in 44 s"], ["24 / 24", "from a fresh clone"], ["3 in a row", "green web runs"]];
  st.forEach((v, i) => {
    const x = M + (i % 2) * 3.05, y = TOP + Math.floor(i / 2) * 1.75;
    panel(s, x, y, 2.85, 1.55, K.panel, "Run stat " + i);
    txt(s, v[0], { x: x + 0.3, y: y + 0.2, w: 2.4, h: 0.7, fontFace: HEAD, fontSize: 28, bold: true, color: i === 1 ? K.green : (i === 0 ? K.blue : K.black), valign: "middle", objectName: "Run stat number " + i });
    txt(s, v[1], { x: x + 0.3, y: y + 0.92, w: 2.4, h: 0.4, fontSize: 14, objectName: "Run stat label " + i });
  });
  txt(s, "Split: 13 API, 9 web, 2 cross-door tests. 19 API-key calls per run.", { x: M, y: 5.75, w: 5.9, h: 0.6, fontSize: 13, color: HEX.muted, objectName: "Split note" });
  const px = 7.0, pw = W - M - px;
  panel(s, px, TOP, pw, 4.2, K.panel, "Manual panel");
  pill(s, px + 0.3, TOP + 0.3, 1.9, 0.45, "Stayed manual", K.black, K.white, 13, "Manual label");
  const man = [["Buying flow", "would enter checkout"], ["WHOIS", "depends on outside registries"], ["Name Generator", "AI output changes every run"], ["Screen reader, Hebrew display", "need a human eye"]];
  txt(s, man.flatMap((m, i) => [
    { text: m[0], options: { bold: true, color: K.black, breakLine: true } },
    { text: m[1], options: { fontSize: 13, breakLine: i < man.length - 1, paraSpaceAfter: 8 } },
  ]), { x: px + 0.3, y: TOP + 0.95, w: pw - 0.6, h: 3.1, fontSize: 15, objectName: "Manual list" });
  deepDive(s, "README.md · automation choices", GH + "README.md#automation-choices");
}

// =====================================================================
// 12. Topic 5: major findings highlight
pres.addSection({ title: "5 Findings" });
{
  const s = content("5 · FINDINGS HIGHLIGHT", "Two major issues: an open API and a screen-reader gap",
    "Both are rated S2 Major. Each one was reproduced and backed by evidence.",
    "Finding 1, S2 Major, P1 High (FINDINGS.md). The public Domain Search API works without any API key, although the docs say 'This call requires an account level API key'. Calls with no headers, only the account ID, or an invalid key all returned 200 with full data. 7 of 7 attempts, both endpoints, three sessions (manual run, re-check, automated test API-07). Evidence on the slide: evidence/API-07/missing-key.json. Why it matters: Wix can't identify, rate-limit or attribute callers per account. The data itself is public, so not S1. If anonymous access is intended, it's a documentation bug.\n\n" +
    "Finding 3, S2 Major, P2 Medium. The results page, where the answer and the buy buttons are, isn't usable with a screen reader: html lang is empty, the search box has no accessible name, icon buttons have no name, no main landmark, no live region announcing results. Found by a manual DOM review (A11Y-03, evidence/A11Y-03/results-page-dom-audit.json) and confirmed by the automated axe scan (evidence/automation/A11Y-04/axe-storefront-results.json): button-name critical on 3 buttons, label critical on the search box, html-has-lang serious. The landing page passes the same checks. WCAG 3.1.1, 4.1.2, 1.3.1, 4.1.3. Priority P2, raised to P1 if accessibility is a goal this quarter (European Accessibility Act).",
    "5 Findings");
  const cw = 5.95, cy = TOP, ch = 4.55;
  panel(s, M, cy, cw, ch, K.panel, "Finding 1 card");
  txt(s, "1 · The API answers without a key", { x: M + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 1 title" });
  panel(s, M + 0.3, cy + 0.9, cw - 0.6, 1.6, K.black, "Finding 1 code");
  const CL = (t, c) => ({ text: t, options: { color: c, breakLine: true } });
  txt(s, [CL("GET …/check-domain-availability", "D6DEE6"), CL("    ?domain=google.com", "D6DEE6"), CL("auth: no auth headers", "FF8A9B"), CL("status: 200", "7EE2A8"), { text: "\"available\": false", options: { color: "D6DEE6" } }],
    { x: M + 0.55, y: cy + 1.05, w: cw - 1.1, h: 1.35, fontFace: MONO, fontSize: 13, objectName: "Finding 1 code text" });
  txt(s, "The docs say a key is required. 7 of 7 tries, on both endpoints.", { x: M + 0.3, y: cy + 2.7, w: cw - 0.6, h: 0.7, fontSize: 15, objectName: "Finding 1 summary" });
  txt(s, "Evidence: evidence/API-07/missing-key.json", { x: M + 0.3, y: cy + 3.4, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 10, color: HEX.muted, objectName: "Finding 1 evidence" });
  pill(s, M + 0.3, cy + 3.85, 1.3, 0.42, "S2 Major", K.red, K.white, 12, "Finding 1 severity");
  pill(s, M + 1.75, cy + 3.85, 1.3, 0.42, "P1 High", K.red, K.white, 12, "Finding 1 priority");
  const x2 = M + cw + 0.23;
  panel(s, x2, cy, cw, ch, K.panel, "Finding 3 card");
  txt(s, "3 · Screen readers get lost", { x: x2 + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 3 title" });
  const a = [["Buttons with no name (3)", "critical"], ["Search box with no label", "critical"], ["Page language missing", "serious"]];
  a.forEach((r, j) => {
    const y = cy + 0.9 + j * 0.56;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x2 + 0.3, y, w: cw - 0.6, h: 0.46, fill: { color: K.white }, line: { type: "none" }, rectRadius: 0.1, objectName: "Axe row " + j });
    txt(s, r[0], { x: x2 + 0.5, y, w: 3.6, h: 0.46, fontSize: 14, color: K.black, valign: "middle", objectName: "Axe rule " + j });
    txt(s, r[1], { x: x2 + 3.9, y, w: 1.55, h: 0.46, fontSize: 13, bold: true, color: r[1] === "critical" ? K.red : HEX.ink, align: "right", valign: "middle", objectName: "Axe impact " + j });
  });
  txt(s, "On the results page, where people buy. Found by hand, confirmed by an axe scan.", { x: x2 + 0.3, y: cy + 2.7, w: cw - 0.6, h: 0.7, fontSize: 15, objectName: "Finding 3 summary" });
  txt(s, "Evidence: evidence/automation/A11Y-04/", { x: x2 + 0.3, y: cy + 3.4, w: cw - 0.6, h: 0.3, fontFace: MONO, fontSize: 10, color: HEX.muted, objectName: "Finding 3 evidence" });
  pill(s, x2 + 0.3, cy + 3.85, 1.3, 0.42, "S2 Major", K.red, K.white, 12, "Finding 3 severity");
  pill(s, x2 + 1.75, cy + 3.85, 1.4, 0.42, "P2 Medium", K.amber, K.ink, 12, "Finding 3 priority");
  deepDive(s, "FINDINGS.md · Finding 1", GH + "FINDINGS.md#finding-1-the-public-domain-search-api-works-without-any-api-key");
}

// 13. All five findings + risks
{
  const s = content("5 · FINDINGS HIGHLIGHT", "Bug summary: five findings by customer impact",
    "Severity is how bad it is. Priority is how soon to fix it. Each was checked against \"Domain basics\".",
    "From FINDINGS.md. Each finding was reproduced at least twice and checked against 'Domain basics' in Requirements.md.\n\n" +
    "1. The API answers without any API key: S2 Major, P1 High.\n" +
    "2. WHOIS shows 'There is a connection issue' for invalid input like my_bakery!.com, and adds .com twice: S3 Moderate, P2 Medium. The user can recover by retyping; the storefront already handles the same input well. Evidence: evidence/WH-03/.\n" +
    "3. The results page is hard to use with a screen reader: S2 Major, P2 Medium.\n" +
    "4. A Hebrew name (קפהטעים.com) is shown as punycode, the encoded form xn--8dbidqxju.com, in the main card, while the list below shows the Hebrew: S3 Moderate, P3 Low. Evidence: evidence/I18N-02/.\n" +
    "5. The message says 'fewer than 63 characters', but exactly 63 is accepted: S4 Minor, P3 Low. Evidence: evidence/SF-07/ and evidence/automation/UI-04/.\n\n" +
    "Twelve risks and observations (R1 to R12) are recorded but not called bugs, because they're expected, a product choice, or not proven: for example trademark-style suggestions like googlebranding.com (R1), a struck-through ₪21.47 price vs a ₪90.19 renewal (R2), no Hebrew version of the pages (R3), 'Rise' for a bakery getting finance domains (R4), and 'Available now!' with no price when the price service was rate limited (R12).\n\n" +
    "Not reported: axe flagged colour contrast on 'Search Domains'; a manual check gives about 5.1:1, which passes.",
    "5 Findings");
  const rows = [
    ["1", "The API answers without an API key", "Public API", "S2 Major", "P1 High"],
    ["2", "WHOIS blames your internet for a typo", "WHOIS", "S3 Moderate", "P2 Medium"],
    ["3", "Results page is hard to use with a screen reader", "Storefront, WHOIS", "S2 Major", "P2 Medium"],
    ["4", "Hebrew name shown in encoded form (xn--…)", "Storefront, WHOIS", "S3 Moderate", "P3 Low"],
    ["5", "Says \"fewer than 63 characters\", but 63 works", "Storefront", "S4 Minor", "P3 Low"],
  ];
  s.addTable([[hcell("#", "center"), hcell("Finding"), hcell("Door"), hcell("Severity", "center"), hcell("Priority", "center")]].concat(rows.map((r) => [
    { text: r[0], options: { bold: true, color: K.blue, align: "center", fontSize: 16 } }, { text: r[1], options: { color: K.black, fontSize: 15 } }, { text: r[2] }, tag(r[3]), tag(r[4]),
  ])), { x: M, y: TOP, w: CW, colW: [0.6, 6.0, 2.3, 1.611, 1.622], rowH: 0.56, fontSize: 14, color: K.ink, valign: "middle", border: TB, objectName: "Findings table" });
  panel(s, M, 5.75, CW, 0.85, K.panel, "Risks strip");
  pill(s, M + 0.3, 5.95, 1.1, 0.45, "12 risks", K.amber, K.ink, 13, "Risks label");
  txt(s, "Noted, not called bugs: e.g. brand-name suggestions, price clarity, Name Generator relevance.", { x: M + 1.65, y: 5.75, w: CW - 1.9, h: 0.85, fontSize: 14, valign: "middle", objectName: "Risks text" });
  deepDive(s, "FINDINGS.md · summary", GH + "FINDINGS.md#summary");
}

// =====================================================================
// 14–15. Topic 6: requirements traceability
pres.addSection({ title: "6 Requirements" });
function reqSlide(title, key, rows, notes, ddLabel, ddUrl, foot) {
  const s = content("6 · REQUIREMENTS SUMMARY AND COVERAGE", title, key, notes, "6 Requirements");
  const ok = { text: "✓ Done", options: { bold: true, color: K.white, fill: { color: K.green }, align: "center", fontSize: 12 } };
  const part = { text: "! Partly", options: { bold: true, color: K.ink, fill: { color: K.amber }, align: "center", fontSize: 12 } };
  const table = [[hcell("Requirement"), hcell("Status", "center"), hcell("Where it's covered")]].concat(rows.map((r) => [
    { text: r[0], options: { color: K.black, fontSize: 13 } },
    r[1] ? ok : part,
    { text: r[2], options: { color: K.blue, fontSize: 12, hyperlink: { url: r[3], tooltip: r[3] } } },
  ]));
  s.addTable(table, { x: M, y: TOP, w: CW, colW: [6.4, 1.3, CW - 7.7], rowH: 0.4, color: K.ink, valign: "middle", border: TB, objectName: "Requirements table" });
  if (foot) {
    const fy = TOP + 0.4 * (rows.length + 1) + 0.3;
    panel(s, M, fy, CW, 0.75, "FFF4E0", "Caveat panel");
    txt(s, [{ text: "Partly: ", options: { bold: true, color: K.black } }, { text: foot }], { x: M + 0.3, y: fy, w: CW - 0.6, h: 0.75, fontSize: 14, valign: "middle", objectName: "Caveat text" });
  }
  deepDive(s, ddLabel, ddUrl);
  return s;
}
reqSlide("Every deliverable is in the repo", "Each row links to the file that covers it.", [
  ["Architecture: parts, network calls, what each drives on screen", 1, "ARCHITECTURE.md §2", GH + "ARCHITECTURE.md#2-door-by-door"],
  ["How the doors relate to each other and to the API", 1, "ARCHITECTURE.md §3", GH + "ARCHITECTURE.md#3-how-the-doors-relate"],
  ["Diagram of doors, services and links (Mermaid)", 1, "ARCHITECTURE.md §1", GH + "ARCHITECTURE.md#1-the-big-picture"],
  ["Test plan in the required format, run by hand", 1, "TEST_PLAN.md §6", GH + "TEST_PLAN.md#6-scenarios-and-results"],
  ["What was prioritised, and what was left out, and why", 1, "TEST_PLAN.md §3–4", GH + "TEST_PLAN.md#3-priorities-and-why"],
  ["Up to 5 findings with evidence, severity and priority", 1, "FINDINGS.md", GH + "FINDINGS.md#summary"],
  ["Playwright covering the public API and a web door", 1, "tests/", GH_TREE + "tests"],
  ["Runs with one command, documented in the README", 1, "README.md · npm test", GH + "README.md#how-to-run-the-tests"],
  ["README: automation choices, another week, 5-line strategy", 1, "README.md", GH + "README.md#automation-choices"],
  ["AI_LOG: tools, prompts, AI errors, changes, what stayed human", 1, "AI_LOG.md", GH + "AI_LOG.md"],
], "Traceability from Requirements.md ('What to do', steps 1 to 5) and the original task in Agents.md, checked against the repo on 2026-11-03.\n\n" +
  "- ARCHITECTURE.md: section 2 covers each door's parts, network calls and what each call drives on screen; section 3 compares the doors and the public API; section 1 has the Mermaid diagram.\n" +
  "- TEST_PLAN.md: 43 scenarios in the required format (test scope, scenario, then step, expected, actual, evidence, pass or fail), run by hand with evidence. Section 3 explains priorities, section 4 what was left out.\n" +
  "- FINDINGS.md: exactly 5 findings, each with evidence, a severity and a priority rated separately with a one-line defence, plus 12 risks and observations.\n" +
  "- tests/: Playwright covers the public API (tests/api) and the storefront web door (tests/web), plus a cross-door test.\n" +
  "- README.md: 'How to run the tests' (npm test), 'Automation choices', 'What I'd do with another week', 'Quality strategy for Wix Domains (5 lines)'.\n" +
  "- AI_LOG.md: AI tools used, key prompts, where the AI was wrong and how it was caught, what was changed or thrown away, what I chose not to hand to AI.\n\n" +
  "The presentation itself is this deck, in presentation/.",
  "Requirements.md", GH + "Requirements.md");
reqSlide("The rules were kept, with one honest caveat", "No purchase, a small API budget, and the key never committed.", [
  ["Never complete a purchase: stop before checkout", 1, "TEST_PLAN.md SF-03", GH + "TEST_PLAN.md#61-functional-domain-storefront"],
  ["No load testing; API calls kept to a few hundred (~119 used)", 1, "EXECUTION_PLAN.md budget", GH + "EXECUTION_PLAN.md#api-call-budget"],
  ["No brute force or scraping of wix.com", 0, "FINDINGS.md R12", GH + "FINDINGS.md#risks-and-observations-not-reported-as-bugs"],
  ["Public pages and my own account only", 1, "TEST_PLAN.md §2", GH + "TEST_PLAN.md#2-approach"],
  ["API key never committed, logged or in evidence", 1, "EXECUTION_PLAN.md 5.4", GH + "EXECUTION_PLAN.md#phase-5-wrap-up"],
  ["Real commit history, not squashed (one PR per phase)", 1, "Commit history", REPO_URL + "/commits/main"],
  ["Agent configuration committed", 1, "Agents.md", GH + "Agents.md"],
  ["Installed tools used, such as the Wix plugin", 1, "AI_LOG.md · tools", GH + "AI_LOG.md#ai-tools-used"],
], "Rules from Requirements.md and Agents.md, checked against the repo.\n\n" +
  "- No purchase: SF-03 stopped at manage.wix.com/premium-domains ('Domain Purchase'); no automated test clicks a buy button (README.md).\n" +
  "- API budget: about 119 calls with the API key in total, against a target under 200 (EXECUTION_PLAN.md budget table). No load testing was done.\n" +
  "- Partly: during automation development, about 110 public page loads in a short time made wix.com's price services answer 429 Too Many Requests once (FINDINGS.md R12, README.md). It wasn't scraping, but it was more traffic than we wanted. The fix: 1 worker, and the README asks to run the suite only a few times an hour. That's why this row is marked as partly met.\n" +
  "- Public pages and my own account only: TEST_PLAN.md section 2 (logged in to my own account; automation runs logged out).\n" +
  "- Key: read only from .env, which is gitignored. No commit on any branch touches .env, and the history, report and evidence were scanned for the key and account ID with 0 hits (EXECUTION_PLAN.md 5.4).\n" +
  "- Commit history: committed piece by piece, one branch and pull request per phase (PRs #1 to #5 merged, #6 for this deck), never squashed.\n" +
  "- Agent config: Agents.md and .claude/settings.json are tracked.\n" +
  "- Tools: the Wix plugin (Wix MCP) was used for the REST docs and a domain-suggestion check (AI_LOG.md).",
  "EXECUTION_PLAN.md", GH + "EXECUTION_PLAN.md",
  "fast page loads during development made wix.com's price service answer 429 once. We cut to 1 worker.");

// =====================================================================
// 16. Closing
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: "Close" });
  s.addText("Protect the one answer, everywhere", { x: M + 0.2, y: 0.55, w: 12, h: 0.9, fontFace: HEAD, fontSize: 40, bold: true, color: K.white, margin: 0, isTextBox: true, objectName: "Closing title" });
  txt(s, "Quality strategy", { x: M + 0.2, y: 1.8, w: 6.6, h: 0.4, fontSize: 15, bold: true, color: HEX.lightblue, objectName: "Strategy heading" });
  const strat = [
    "Protect the one answer on all four doors",
    "Test the shared service first, then a few journeys",
    "Check behaviour, not exact prices or suggestions",
    "Test in the user's world: countries, languages, access",
    "Watch production: synthetic checks and funnel data",
  ];
  strat.forEach((t, i) => {
    const y = 2.35 + i * 0.68;
    pill(s, M + 0.2, y + 0.04, 0.42, 0.42, String(i + 1), K.blue, K.white, 13, "Strategy number " + (i + 1));
    txt(s, t, { x: M + 0.85, y, w: 6.5, h: 0.5, fontSize: 17, color: K.white, valign: "middle", objectName: "Strategy line " + (i + 1) });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.15, y: 1.8, w: 4.58, h: 3.6, fill: { color: HEX.darkpanel }, line: { type: "none" }, rectRadius: 0.18, objectName: "Next week panel" });
  txt(s, "With another week", { x: 8.45, y: 2.05, w: 4.0, h: 0.4, fontSize: 15, bold: true, color: HEX.lightblue, objectName: "Next week heading" });
  txt(s, bullets(["Run in CI on every PR, and nightly", "Run from 3–4 countries", "Simulate failures instead of load", "Find an available premium domain"], { color: K.white }),
    { x: 8.45, y: 2.6, w: 4.05, h: 2.6, fontSize: 16, color: K.white, objectName: "Next week list" });
  const link = (t, u) => ({ text: t, options: { color: HEX.lightblue, bold: true, hyperlink: { url: u, tooltip: u } } });
  s.addText([{ text: "Deep dive → ", options: { color: "AEB8C2" } }, link("README.md", GH + "README.md#quality-strategy-for-wix-domains-5-lines"), { text: "  ·  ", options: { color: "AEB8C2" } }, link("AI_LOG.md", GH + "AI_LOG.md"), { text: "  ·  ", options: { color: "AEB8C2" } }, link("Repo", REPO_URL)],
    { x: 6.2, y: 6.98, w: 6.53, h: 0.3, fontSize: 11, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Closing links" });
  s.addNotes(
    "Quality strategy for Wix Domains, in 5 lines (README.md):\n" +
    "1. Protect the one answer. 'Can I get this name?' has to be correct and the same across all four doors, so cross-door checks are P0 on every change.\n" +
    "2. Test the shared service first, then a few journeys. Contract tests on the domain-search service give fast, stable feedback; a thin layer of UI tests per door covers what the user sees.\n" +
    "3. Assert behaviour, not data. Check availability, status and response shape, never exact prices or suggestions.\n" +
    "4. Test in the user's world: several countries and currencies, IDN and RTL input, accessibility and mobile, because that's where the bugs in this assignment were found.\n" +
    "5. Watch production: synthetic checks on each door, funnel metrics (search, available, cart) and error-message tracking.\n\n" +
    "With another week (README.md): CI on every PR and nightly; run from 3 to 4 regions and compare; use Playwright's page.route to simulate 429, 500 and slow responses instead of load (R12); deeper cross-door checks; close the gaps (an available premium domain for SF-08, a real VoiceOver or NVDA pass, an axe baseline); and ask the API team whether keyless access (Finding 1) is intended.\n\n" +
    "Thank you. Questions?");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  // Mark the theme fonts as sans-serif (pitchFamily 34) so PowerPoint substitutes a sans such as Arial when the Madefor fonts are missing.
  const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const part = "ppt/theme/theme1.xml";
  let xml = await zip.file(part).async("string");
  xml = xml.replace(/<a:latin typeface="(Wix Madefor (?:Display|Text))"[^/]*\/>/g, '<a:latin typeface="$1" panose="020B0604020202020204" pitchFamily="34" charset="0"/>');
  zip.file(part, xml);
  fs.writeFileSync(OUT, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  console.log("written", OUT);
})();
