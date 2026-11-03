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
const K = { black: C.text1, white: C.background1, ink: C.text2, panel: C.background2, blue: C.accent1, green: C.accent2, amber: C.accent3, red: C.accent4, grey: C.accent5, darkblue: C.accent6 };
const HEAD = THEME.headFontFace; // used only where a run must be the heading font outside a title placeholder
const MONO = "Courier New";
const FOOTER = "Roy · Wix Domains QA home assignment · not an official Wix document";
const W = 13.333, M = 0.6;

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: K.white },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: W - 2 * M, h: 0.8, fontFace: HEAD, fontSize: 34, bold: true, color: K.black, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 1.2, w: W - 2 * M, h: 0.5, fontSize: 18, color: K.ink, valign: "top", margin: 0 }, text: "" } },
    { text: { text: FOOTER, options: { x: M, y: 6.98, w: 6.5, h: 0.3, fontSize: 10, color: HEX.muted, margin: 0, valign: "middle" } } },
  ],
  slideNumber: { x: 12.33, y: 6.98, w: 0.4, h: 0.3, fontSize: 10, color: HEX.muted, align: "right" },
});
pres.defineSlideMaster({
  title: "DARK",
  background: { color: K.black },
  objects: [
    { text: { text: FOOTER, options: { x: M, y: 6.98, w: 8, h: 0.3, fontSize: 10, color: "AEB8C2", margin: 0, valign: "middle" } } },
  ],
});

// ---------- helpers ----------
function content(title, key, notes, section) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  s.addText(key, { placeholder: "body" });
  s.addNotes(notes);
  return s;
}
function deepDive(s, label, url) {
  s.addText([{ text: "Deep dive → ", options: { color: HEX.muted } }, { text: label, options: { color: K.blue, bold: true, hyperlink: { url, tooltip: url } } }],
    { x: 7.2, y: 6.98, w: 5.0, h: 0.3, fontSize: 11, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Deep dive link" });
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
const sevFill = { S2: K.red, S3: K.amber, S4: K.grey, P1: K.red, P2: K.amber, P3: K.grey };
const sevText = { S2: K.white, S3: K.ink, S4: K.white, P1: K.white, P2: K.ink, P3: K.white };

// =====================================================================
// 1. Title
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "DARK", sectionTitle: "Intro" });
  s.addText("Can I get this name?", { x: M + 0.2, y: 1.3, w: 7.2, h: 2.0, fontFace: HEAD, fontSize: 60, bold: true, color: K.white, margin: 0, valign: "top", isTextBox: true, objectName: "Title" });
  txt(s, "QA for the four Wix Domains doors", { x: M + 0.2, y: 3.75, w: 6.8, h: 0.6, fontSize: 26, color: K.white, objectName: "Subtitle" });
  txt(s, "Roy · QA Engineer home assignment · November 2026", { x: M + 0.2, y: 4.6, w: 6.8, h: 0.4, fontSize: 16, color: "AEB8C2", objectName: "Meta" });
  // drawn search pill (not a screenshot)
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.75, y: 3.0, w: 5.0, h: 0.95, fill: { color: K.white }, line: { type: "none" }, rectRadius: 0.47, objectName: "Search pill" });
  txt(s, "qa-wix-1793698242.com", { x: 8.15, y: 3.0, w: 2.9, h: 0.95, fontSize: 17, color: K.black, valign: "middle", fit: "none", objectName: "Search text" });
  pill(s, 11.05, 3.2, 1.5, 0.55, "Available", K.blue, K.white, 14, "Available chip");
  txt(s, "free · taken · not sold here", { x: 8.15, y: 4.15, w: 4.5, h: 0.4, fontSize: 14, color: "AEB8C2", objectName: "Answers" });
  s.addText([{ text: "github.com/kazes5/WixAssignment", options: { hyperlink: { url: "https://github.com/kazes5/WixAssignment" }, color: HEX.lightblue } }],
    { x: 7.2, y: 6.98, w: 5.53, h: 0.3, fontSize: 11, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Repo link" });
  s.addNotes(
    "Hi, I'm Roy. This is my QA home assignment for Wix Domains.\n\n" +
    "Four doors answer one question for the user: 'Can I get this name?' They are the domain storefront, the Business Name Generator, WHOIS lookup and the public Domain Search API.\n\n" +
    "I ran the work as a small team of AI agents (a system architect, a senior QA engineer, an automation engineer and a designer). I managed them and reviewed every handoff. The AI_LOG.md file explains what the AI did, where it was wrong and what stayed human.\n\n" +
    "The talk has four parts: test scope, architecture, test structure, and coverage with results and findings. Every slide links to the file in the repo for the full detail.\n\n" +
    "Repo: https://github.com/kazes5/WixAssignment");
}

// =====================================================================
// 2. Four doors
pres.addSection({ title: "1 Test scope" });
{
  const s = content("Four doors answer one question", "A wrong answer means a lost sale, or a user trying to buy a name they can't get.",
    "The scenario from Requirements.md: a user wants to know 'Can I get this name?' and Wix has four doors that answer it.\n\n" +
    "- Domain storefront: wix.com/domains. Type a name, see if it's free, with a price and a buy button.\n" +
    "- Business Name Generator: wix.com/tools/business-name-generator. Describe your business, get AI-generated names and domains for them.\n" +
    "- WHOIS lookup: wix.com/domains/whois. See registration data for a domain.\n" +
    "- Public Domain Search API: wixapis.com/domain-search/v2. Availability and suggestions for developers, with an account-level API key.\n\n" +
    "Environment: tested on 2026-11-03 from Israel, logged in to my own Wix account, Chrome desktop plus a narrow width. Prices show in shekels and .co.il is suggested. That's expected per 'Domain basics' in Requirements.md.",
    "1 Test scope");
  const cards = [
    ["Domain storefront", "Search a name, see if it's free", "wix.com/domains"],
    ["Business Name Generator", "Describe your business, get names and domains", "wix.com/tools/business-name-generator"],
    ["WHOIS lookup", "See who registered a domain", "wix.com/domains/whois"],
    ["Public API", "Developers check names in code", "wixapis.com/domain-search/v2"],
  ];
  const cw = 2.85, gap = 0.233;
  cards.forEach((c, i) => {
    const x = M + i * (cw + gap), y = 2.1;
    panel(s, x, y, cw, 3.4, K.panel, "Door card " + (i + 1));
    pill(s, x + 0.3, y + 0.3, 0.55, 0.55, String(i + 1), K.blue, K.white, 16, "Door number " + (i + 1));
    txt(s, c[0], { x: x + 0.3, y: y + 1.05, w: cw - 0.6, h: 0.8, fontFace: HEAD, fontSize: 20, bold: true, color: K.black, objectName: "Door name " + (i + 1) });
    txt(s, c[1], { x: x + 0.3, y: y + 1.9, w: cw - 0.6, h: 0.8, fontSize: 15, objectName: "Door purpose " + (i + 1) });
    txt(s, c[2], { x: x + 0.3, y: y + 2.8, w: cw - 0.5, h: 0.4, fontFace: MONO, fontSize: 10, color: HEX.muted, objectName: "Door URL " + (i + 1) });
  });
  txt(s, "Tested on 3 Nov 2026 from Israel, so prices in ₪ are expected.", { x: M, y: 5.95, w: 10, h: 0.4, fontSize: 15, color: HEX.muted, objectName: "Environment note" });
  deepDive(s, "Requirements.md", GH + "Requirements.md");
}

// =====================================================================
// 3. In / out of scope
{
  const s = content("What we tested, and what we left out", "Scope follows customer impact and the assignment rules.",
    "In scope (TEST_PLAN.md section 1): all four doors plus cross-door consistency. Test types: functional, UI, accessibility, and multi-language / RTL (right-to-left, e.g. Hebrew).\n\n" +
    "Left out on purpose (TEST_PLAN.md section 4):\n" +
    "- Completing a purchase: assignment rule. Testing stops at the hand-off to manage.wix.com/premium-domains.\n" +
    "- Load, performance and brute-force testing: assignment rule, and the API budget.\n" +
    "- All 415 TLDs Wix sells (ARCHITECTURE.md 2.1): a representative set instead: .com, .co.il, .store, .online, and the unsold .de.\n" +
    "- Testing from several countries: no VPN here. Noted as a risk.\n" +
    "- Also out: a full screen-reader pass (replaced by DOM checks), deep logged-in vs logged-out comparison, visual regression.\n\n" +
    "Not reported as bugs, per 'Domain basics': unsold TLDs, suggestions that vary, location-based prices and currency, redacted WHOIS data, availability that changes, premium pricing, the API's TLD formats.\n\n" +
    "API budget: about 119 calls with the API key in total, against a target under 200 (EXECUTION_PLAN.md budget table).",
    "1 Test scope");
  const pw = 5.9, py = 2.05, ph = 3.0;
  panel(s, M, py, pw, ph, K.panel, "In scope panel");
  pill(s, M + 0.35, py + 0.35, 1.3, 0.45, "In scope", K.green, K.white, 13, "In scope label");
  txt(s, bullets(["All 4 doors, and whether they agree", "Functional and UI checks", "Accessibility", "Other languages, including Hebrew"]), { x: M + 0.35, y: py + 1.0, w: pw - 0.7, h: 1.9, fontSize: 16, objectName: "In scope list" });
  const x2 = M + pw + 0.3;
  panel(s, x2, py, pw, ph, K.panel, "Out of scope panel");
  pill(s, x2 + 0.35, py + 0.35, 1.6, 0.45, "Left out", K.ink, K.white, 13, "Out of scope label");
  txt(s, bullets(["Buying a domain (assignment rule)", "Load testing (assignment rule)", "All 415 TLDs (endings like .com): a sample", "Other countries (no VPN)"]), { x: x2 + 0.35, y: py + 1.0, w: pw - 0.7, h: 1.9, fontSize: 16, objectName: "Out of scope list" });
  // bottom strip
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.35, w: 8.4, h: 1.25, fill: { color: K.white }, line: { color: HEX.line, width: 1 }, rectRadius: 0.18, objectName: "Not bugs border" });
  txt(s, [{ text: "Not bugs, by design: ", options: { bold: true, color: K.black } }, { text: "changing suggestions, local prices, hidden WHOIS owner data, endings Wix doesn't sell." }],
    { x: M + 0.35, y: 5.35, w: 7.7, h: 1.25, fontSize: 15, valign: "middle", objectName: "Not bugs text" });
  panel(s, 9.3, 5.35, 3.43, 1.25, K.blue, "Budget block");
  txt(s, [{ text: "~119", options: { fontFace: HEAD, fontSize: 30, bold: true, color: K.white, breakLine: true } }, { text: "API calls · budget under 200", options: { fontSize: 13, color: K.white } }],
    { x: 9.6, y: 5.42, w: 3.0, h: 1.1, valign: "middle", objectName: "Budget text" });
  deepDive(s, "TEST_PLAN.md · scope", GH + "TEST_PLAN.md#4-deliberately-left-out-and-why");
}

// =====================================================================
// 4. Architecture diagram
pres.addSection({ title: "2 Architecture" });
{
  const s = content("The web doors and the API share one search service", "The storefront, WHOIS and the API ask the same service. Only the login differs.",
    "Redrawn from the Mermaid diagram in ARCHITECTURE.md section 1, gathered with browser developer tools on 2026-11-03.\n\n" +
    "- All three web doors are pages on www.wix.com, built on Wix's own site platform with React 18. Each has a landing page and a results page under /domain/result/.\n" +
    "- The shared Domain Search service: the storefront and WHOIS call www.wix.com/domain-search/v2/... These are the same paths as the public API at www.wixapis.com/domain-search/v2/... Calls: check-domain-availability, suggest-domains, plus bulk availability and suggested TLDs on the web.\n" +
    "- The Name Generator calls suggest-domains for the chosen name, but no availability check.\n" +
    "- Web-only serverless services: the TLD list (415 TLDs), per-TLD display prices in local currency, AI business names, and WHOIS / RDAP parsing.\n" +
    "- WHOIS calls the registry's RDAP server (for .com, rdap.verisign.com) directly from the browser.\n" +
    "- Buy buttons go to manage.wix.com/premium-domains, the 'Domain Purchase' page. We stop there.\n" +
    "- Auth: web doors use the browser session (cookies plus an XSRF token); the API uses an account-level API key and account ID.\n\n" +
    "The internal endpoint paths are observed, not a documented contract, so the UI tests assert on what the user sees.",
    "2 Architecture");
  const doors = ["Domain storefront", "Name Generator", "WHOIS lookup", "Public API"];
  const dx = M, dw = 2.6, dh = 0.72, dys = [2.05, 3.02, 3.99, 4.96];
  doors.forEach((d, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: dx, y: dys[i], w: dw, h: dh, fill: { color: i === 3 ? K.black : K.panel }, line: { type: "none" }, rectRadius: 0.15, objectName: "Door " + d });
    txt(s, d, { x: dx, y: dys[i], w: dw, h: dh, fontSize: 15, bold: true, color: i === 3 ? K.white : K.black, align: "center", valign: "middle", objectName: "Door label " + d });
  });
  // shared service
  const sx = 4.35, sw = 3.9;
  const shY = 2.05, shH = 1.7;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sx, y: shY, w: sw, h: shH, fill: { color: K.blue }, line: { type: "none" }, rectRadius: 0.18, objectName: "Shared service box" });
  txt(s, "Domain Search service (shared)", { x: sx + 0.25, y: shY + 0.18, w: sw - 0.5, h: 0.4, fontSize: 16, bold: true, color: K.white, objectName: "Shared service title" });
  txt(s, bullets(["Check availability", "Suggest domains"], { color: K.white }), { x: sx + 0.25, y: shY + 0.7, w: sw - 0.5, h: 0.9, fontSize: 14, color: K.white, objectName: "Shared service calls" });
  // web-only
  const woY = 4.25, woH = 1.43;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: sx, y: woY, w: sw, h: woH, fill: { color: K.white }, line: { color: HEX.ink, width: 1.25 }, rectRadius: 0.18, objectName: "Web-only box" });
  txt(s, "Web-only services", { x: sx + 0.25, y: woY + 0.15, w: sw - 0.5, h: 0.4, fontSize: 16, bold: true, color: K.black, objectName: "Web-only title" });
  txt(s, "Prices · TLD list · AI names · WHOIS data", { x: sx + 0.25, y: woY + 0.6, w: sw - 0.5, h: 0.7, fontSize: 14, objectName: "Web-only list" });
  // connectors: door right edge -> box left edge
  const x1 = dx + dw, x2 = sx;
  function link(fromY, toY, color, width, dash) {
    const up = toY < fromY;
    s.addShape(pres.shapes.LINE, { x: x1, y: Math.min(fromY, toY), w: x2 - x1, h: Math.max(Math.abs(toY - fromY), 0.001), flipV: up, line: { color, width, endArrowType: "triangle", dashType: dash || "solid" }, objectName: "Connector" });
  }
  const shC = shY + shH / 2, woC = woY + woH / 2;
  dys.forEach((y, i) => {
    const c = y + dh / 2;
    link(c, shC - 0.45 + i * 0.3, HEX.blue, 1.75);
    if (i < 3) link(c, woC - 0.35 + i * 0.35, HEX.muted, 1.25, "dash");
  });
  // right column
  const rx = 9.05, rw = 3.68;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: 2.05, w: rw, h: 1.7, fill: { color: K.white }, line: { color: HEX.red, width: 1.5, dashType: "dash" }, rectRadius: 0.18, objectName: "Purchase box" });
  txt(s, [{ text: "Purchase page", options: { bold: true, color: K.black, breakLine: true } }, { text: "Buy buttons on the web doors lead here. Testing stops here.", options: { fontSize: 13 } }],
    { x: rx + 0.25, y: 2.2, w: rw - 0.5, h: 1.4, fontSize: 16, objectName: "Purchase text" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: rx, y: woY, w: rw, h: woH, fill: { color: K.panel }, line: { type: "none" }, rectRadius: 0.18, objectName: "Registry box" });
  txt(s, [{ text: "Domain registry", options: { bold: true, color: K.black, breakLine: true } }, { text: "Outside Wix. WHOIS asks it straight from the browser.", options: { fontSize: 13 } }],
    { x: rx + 0.25, y: woY + 0.15, w: rw - 0.5, h: 1.2, fontSize: 16, objectName: "Registry text" });
  s.addShape(pres.shapes.LINE, { x: sx + sw, y: woC, w: rx - (sx + sw), h: 0, line: { color: HEX.muted, width: 1.25, endArrowType: "triangle" }, objectName: "Connector to registry" });
  // legend
  s.addShape(pres.shapes.LINE, { x: M, y: 6.2, w: 0.5, h: 0, line: { color: HEX.blue, width: 1.75 }, objectName: "Legend shared line" });
  txt(s, "Shared calls", { x: M + 0.6, y: 6.05, w: 1.6, h: 0.3, fontSize: 12, color: HEX.muted, valign: "middle", objectName: "Legend shared" });
  s.addShape(pres.shapes.LINE, { x: 2.75, y: 6.2, w: 0.5, h: 0, line: { color: HEX.muted, width: 1.25, dashType: "dash" }, objectName: "Legend web line" });
  txt(s, "Web doors only", { x: 3.35, y: 6.05, w: 1.8, h: 0.3, fontSize: 12, color: HEX.muted, valign: "middle", objectName: "Legend web" });
  txt(s, "Web doors log in with the browser session. The API uses an API key.", { x: 5.4, y: 6.05, w: 7.33, h: 0.3, fontSize: 12, color: HEX.muted, valign: "middle", objectName: "Auth note" });
  deepDive(s, "ARCHITECTURE.md", GH + "ARCHITECTURE.md#1-the-big-picture");
}

// =====================================================================
// 5. Matrix
{
  const s = content("Same engine, so the answer must match everywhere", "Availability must agree on every door. Suggestions may differ.",
    "From ARCHITECTURE.md section 3, 'How the doors relate'.\n\n" +
    "- Availability: the storefront, WHOIS and the API all call check-domain-availability. For the same name at the same moment they must agree. If they don't, it's a real bug. This is why cross-door checks (X-01, X-02) are P0.\n" +
    "- Suggestions come from one engine with different inputs and limits: 50 on the storefront and Name Generator, 5 on WHOIS. The Name Generator sends the generated name, not the business description. Different suggestions are expected, but each one should be available and in a TLD Wix sells.\n" +
    "- Prices exist only on the web doors, per TLD. The API has only a 'premium' flag.\n" +
    "- Only the storefront does bulk availability (same name, other endings) for a taken name.\n" +
    "- The architect handed six risks to QA, such as the ~8 second wait for alternatives on a taken name and Name Generator relevance.\n\n" +
    "Testing rule from ARCHITECTURE.md section 5: assert on what the user sees, not on internal endpoints that can change without notice.",
    "2 Architecture");
  const Y = { text: "✓", options: { color: K.green, bold: true, align: "center", fontSize: 18 } };
  const N = { text: "–", options: { color: K.grey, align: "center", fontSize: 18 } };
  const hdr = (t) => ({ text: t, options: { bold: true, color: K.black, align: "center", fill: { color: K.panel }, fontSize: 13 } });
  const row = (label, cells) => [{ text: label, options: { bold: true, color: K.black, fontSize: 14 } }].concat(cells.map((c) => (c ? Y : N)));
  s.addTable([
    [{ text: "", options: { fill: { color: K.panel } } }, hdr("Storefront"), hdr("Name Gen."), hdr("WHOIS"), hdr("API")],
    row("Availability check", [1, 0, 1, 1]),
    row("Suggestions", [1, 1, 1, 1]),
    row("Prices", [1, 1, 1, 0]),
    row("AI business names", [0, 1, 0, 0]),
    row("Owner data", [0, 0, 1, 0]),
  ], { x: M, y: 2.1, w: 7.3, colW: [2.5, 1.2, 1.2, 1.2, 1.2], rowH: 0.62, valign: "middle", color: K.ink, border: { type: "solid", pt: 0.75, color: HEX.line }, objectName: "Capability matrix" });
  const tk = [
    ["Availability must agree", "Same service, so a mismatch is a real bug. P0 test."],
    ["Different suggestions are normal", "One engine, different inputs per door."],
    ["Test what users see", "Internal calls can change without notice."],
  ];
  tk.forEach((t, i) => {
    const y = 2.1 + i * 1.3;
    panel(s, 8.3, y, 4.43, 1.1, K.panel, "Takeaway " + (i + 1));
    txt(s, [{ text: t[0], options: { bold: true, color: K.black, fontSize: 16, breakLine: true } }, { text: t[1], options: { fontSize: 13 } }],
      { x: 8.6, y: y + 0.15, w: 3.95, h: 0.85, objectName: "Takeaway text " + (i + 1) });
  });
  deepDive(s, "ARCHITECTURE.md · how the doors relate", GH + "ARCHITECTURE.md#3-how-the-doors-relate");
}

// =====================================================================
// 6. Priorities
pres.addSection({ title: "3 Test structure" });
{
  const s = content("Priorities follow customer impact", "P0 protects the answer itself. The rest is ranked by how much it hurts users.",
    "From TEST_PLAN.md section 3.\n\n" +
    "- P0: the core answer (free or taken), consistency between doors, and the path to purchase. A wrong answer means a lost sale, or a user who tries to buy a name they can't get. This is the whole purpose of the doors.\n" +
    "- P1: input handling, TLD rules, premium, API validation and auth, WHOIS edge cases, Name Generator relevance. Also accessibility of search and results: search is the only way into the funnel, and it's a legal-compliance area.\n" +
    "- P2: UI polish, narrow-width layout, loading states, wording. And multi-language / RTL: Wix serves a global audience, and Hebrew is a natural right-to-left case because .co.il is sold and suggested.",
    "3 Test structure");
  const bands = [
    ["P0", K.blue, K.white, "Free or taken, the same on every door, path to buy", "A wrong answer is a lost sale"],
    ["P1", K.black, K.white, "Input handling, API rules, WHOIS errors, accessibility", "Misleads or blocks users"],
    ["P2", K.grey, K.white, "Layout, loading, wording, other languages", "Hurts trust, rarely blocks"],
  ];
  bands.forEach((b, i) => {
    const y = 2.05 + i * 1.45;
    panel(s, M, y, W - 2 * M, 1.2, K.panel, b[0] + " band");
    pill(s, M + 0.3, y + 0.3, 1.1, 0.6, b[0], b[1], b[2], 20, b[0] + " tag");
    txt(s, b[3], { x: M + 1.75, y: y, w: 6.9, h: 1.2, fontSize: 18, bold: true, color: K.black, valign: "middle", objectName: b[0] + " what" });
    txt(s, b[4], { x: 8.9, y: y, w: 3.6, h: 1.2, fontSize: 15, color: K.ink, valign: "middle", objectName: b[0] + " why" });
  });
  deepDive(s, "TEST_PLAN.md · priorities", GH + "TEST_PLAN.md#3-priorities-and-why");
}

// =====================================================================
// 7. Format + evidence
{
  const s = content("Every step has a result and proof", "One format for all 43 scenarios. Results were written only after running the step.",
    "The format asked for in the assignment: test scope, scenario description, then a table of test step, expected result, actual result, evidence, pass or fail (TEST_PLAN.md section 6).\n\n" +
    "Example on the slide, SF-01 (P0), 'A user searches for a name that is free', step 2: expected 'Available, the domain, a price and a buy button'. Actual: 'Exact Match · Available now!', qa-wix-1793698242.com, a struck-through ₪21.47 per year and ₪0.00 per year 'Free for 1 year', and 'Make It Yours'. Pass. Screenshot: evidence/SF-01/free-name-result.jpg.\n\n" +
    "Evidence discipline:\n" +
    "- 56 manual evidence files (screenshots and API responses as JSON), indexed in capture order with UTC and Israel times in evidence/README.md.\n" +
    "- The API key is never stored in evidence.\n" +
    "- Free test names use a timestamp, like qa-wix-1793698242.com, so they're never registered.\n" +
    "- Every unexpected result was checked against 'Domain basics' before it was marked as a fail.",
    "3 Test structure");
  const chips = ["Scope", "Scenario", "Step", "Expected", "Actual", "Evidence", "Pass / Fail"];
  const cw = 1.6, gap = 0.15;
  chips.forEach((c, i) => {
    const last = i === chips.length - 1;
    pill(s, M + i * (cw + gap), 2.0, cw, 0.5, c, last ? K.blue : K.panel, last ? K.white : K.black, 13, "Format chip " + c);
  });
  const h = (t) => ({ text: t, options: { bold: true, color: K.black, fill: { color: K.panel }, fontSize: 12 } });
  s.addTable([
    [h("Step"), h("Expected"), h("Actual"), h("Result")],
    [{ text: "Read the main card" }, { text: "Available, the domain, a price and a buy button" }, { text: "\"Available now!\", the domain, ₪0.00/yr, \"Make It Yours\"" },
      { text: "Pass", options: { bold: true, color: K.white, fill: { color: K.green }, align: "center" } }],
  ], { x: M, y: 2.95, w: 6.55, colW: [1.4, 2.1, 2.2, 0.85], fontSize: 12, color: K.ink, valign: "middle", border: { type: "solid", pt: 0.75, color: HEX.line }, objectName: "SF-01 step table" });
  txt(s, "SF-01 (P0): a user searches for a name that is free", { x: M, y: 4.1, w: 6.9, h: 0.3, fontSize: 12, color: HEX.muted, objectName: "SF-01 caption" });
  // screenshot (cropped) with border
  const iw = 5.2, ih = iw * 145 / 490;
  s.addImage({ path: path.join(IMG, "sf01.jpg"), x: 7.53, y: 2.95, w: iw, h: ih, altText: "Evidence SF-01: storefront result card showing Exact Match, Available now!, a price and Make It Yours", objectName: "SF-01 screenshot" });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.53, y: 2.95, w: iw, h: ih, fill: { type: "none" }, line: { color: HEX.line, width: 1 }, objectName: "Screenshot border" });
  txt(s, "Evidence: evidence/SF-01/free-name-result.jpg", { x: 7.53, y: 2.95 + ih + 0.1, w: iw, h: 0.3, fontSize: 11, color: HEX.muted, fontFace: MONO, objectName: "Screenshot caption" });
  // stats
  const stats = [["43", "scenarios, one format"], ["56", "evidence files, time-stamped"], ["8", "test areas, functional to languages"]];
  stats.forEach((st, i) => {
    const x = M + i * 4.1;
    panel(s, x, 5.2, 3.85, 1.35, K.panel, "Stat " + st[0]);
    txt(s, st[0], { x: x + 0.3, y: 5.2, w: 1.1, h: 1.35, fontFace: HEAD, fontSize: 36, bold: true, color: K.blue, valign: "middle", objectName: "Stat number " + i });
    txt(s, st[1], { x: x + 1.4, y: 5.2, w: 2.3, h: 1.35, fontSize: 14, valign: "middle", objectName: "Stat label " + i });
  });
  deepDive(s, "TEST_PLAN.md · scenarios", GH + "TEST_PLAN.md#6-scenarios-and-results");
}

// =====================================================================
// 8. Manual vs automated + code
{
  const s = content("Automate the stable checks, keep judgement manual", "24 Playwright tests cover 21 of 43 scenarios. The rest need a human, or would enter checkout.",
    "From README.md 'Automation choices'.\n\n" +
    "Automated (Playwright, TypeScript): API-01 to API-11, SF-01, SF-02, SF-04, SF-05, SF-07, SF-08 in part (the premium flag), UI-01 at a real 390 px phone width, UI-04, A11Y-04 (axe scan) and X-01 (API vs storefront). That's 21 of the 43 scenarios, fully or in part.\n\n" +
    "Stayed manual, and why:\n" +
    "- SF-03 'Make It Yours': clicking enters the purchase flow, and the rule is to stop before checkout.\n" +
    "- WHOIS: it calls registry servers outside Wix (slow, third-party), and Finding 2 needs a human to judge the message.\n" +
    "- Name Generator: AI output changes on every run.\n" +
    "- Premium pricing: no available premium domain found within budget.\n" +
    "- Hebrew display, keyboard-only and screen-reader review: they need human judgement.\n\n" +
    "Design choices:\n" +
    "- Assert on availability, status and response shape. Never on exact prices or suggestions.\n" +
    "- No test clicks a buy button.\n" +
    "- API-07 is kept as test.fail(), an expected failure, so the known bug stays visible without a red build. If Wix fixes it, Playwright reports 'unexpectedly passed'.\n" +
    "- The axe accessibility scan reports but doesn't fail the build.\n" +
    "- Traces are off where the API key is sent. 1 worker, 1 retry, to be a polite guest.\n" +
    "- Two small helpers (wixApi.ts, storefront.ts) instead of a page-object framework.",
    "3 Test structure");
  const pw = 3.95, py = 2.05, ph = 3.75;
  panel(s, M, py, pw, ph, K.panel, "Automated panel");
  pill(s, M + 0.3, py + 0.3, 1.5, 0.45, "Automated", K.blue, K.white, 13, "Automated label");
  txt(s, bullets(["API answers and rules", "Storefront answers", "API and storefront agree", "Accessibility scan"]), { x: M + 0.3, y: py + 1.0, w: pw - 0.6, h: 2.4, fontSize: 16, objectName: "Automated list" });
  const x2 = M + pw + 0.25;
  panel(s, x2, py, pw, ph, K.panel, "Manual panel");
  pill(s, x2 + 0.3, py + 0.3, 1.2, 0.45, "Manual", K.black, K.white, 13, "Manual label");
  txt(s, [
    { text: "Buying flow", options: { bold: true, color: K.black, breakLine: true } }, { text: "would enter checkout", options: { fontSize: 13, breakLine: true, paraSpaceAfter: 8 } },
    { text: "WHOIS", options: { bold: true, color: K.black, breakLine: true } }, { text: "depends on outside registries", options: { fontSize: 13, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Name Generator", options: { bold: true, color: K.black, breakLine: true } }, { text: "AI output changes every run", options: { fontSize: 13, breakLine: true, paraSpaceAfter: 8 } },
    { text: "Screen reader, Hebrew display", options: { bold: true, color: K.black, breakLine: true } }, { text: "need a human eye", options: { fontSize: 13 } },
  ], { x: x2 + 0.3, y: py + 1.0, w: pw - 0.6, h: 3.4, fontSize: 15, objectName: "Manual list" });
  const x3 = x2 + pw + 0.25, w3 = W - M - x3;
  panel(s, x3, py, w3, ph, K.black, "Code panel");
  txt(s, [
    { text: "tests/", options: { color: K.white, bold: true, breakLine: true } },
    { text: "  api/     4 files", options: { color: "D6DEE6", breakLine: true } },
    { text: "  web/     2 files", options: { color: "D6DEE6", breakLine: true } },
    { text: "  cross/   1 file", options: { color: "D6DEE6", breakLine: true } },
    { text: "  support/ 2 helpers", options: { color: "D6DEE6", breakLine: true } },
    { text: " ", options: { breakLine: true } },
    { text: "One command:", options: { color: "AEB8C2", breakLine: true } },
    { text: "npm test", options: { color: HEX.lightblue, bold: true, fontSize: 18 } },
  ], { x: x3 + 0.3, y: py + 0.35, w: w3 - 0.5, h: ph - 0.6, fontFace: MONO, fontSize: 14, objectName: "Code tree" });
  s.addText([{ text: "test code", options: { color: K.blue, bold: true, hyperlink: { url: GH_TREE + "tests", tooltip: GH_TREE + "tests" } } }],
    { x: x3 + 0.3, y: py + ph - 0.55, w: w3 - 0.6, h: 0.35, fontSize: 12, margin: 0, isTextBox: true, color: K.blue, objectName: "Tests link" });
  txt(s, "Tests check the answer and the response shape, never exact prices or suggestions. No test clicks a buy button.", { x: M, y: 6.05, w: W - 2 * M, h: 0.45, fontSize: 14, color: HEX.muted, objectName: "Assertion rule note" });
  deepDive(s, "README.md · automation choices", GH + "README.md#automation-choices");
}

// =====================================================================
// 9. Results chart
pres.addSection({ title: "4 Coverage" });
{
  const s = content("The core answer works: every P0 scenario passed", "43 scenarios: 23 pass, 12 pass with a note, 6 fail, 2 partial.",
    "From the results summary at the top of TEST_PLAN.md. All 43 scenarios were run by hand on 2026-11-03.\n\n" +
    "Per area (pass / pass with observation / fail / partial):\n" +
    "- Storefront 8: 4 / 3 / 0 / 1\n- Public API 12: 9 / 1 / 1 / 1\n- WHOIS 4: 2 / 1 / 1 / 0\n- Name Generator 3: 1 / 2 / 0 / 0\n- Cross-door 2: 2 / 0 / 0 / 0\n- UI 4: 1 / 2 / 1 / 0\n- Accessibility 4: 2 / 0 / 2 / 0\n- Multi-language / RTL 6: 2 / 3 / 1 / 0\n\n" +
    "Every P0 scenario passed: free names show as available, taken names as taken, and the storefront, WHOIS, Name Generator and API agree.\n\n" +
    "The 6 fails: API-07, WH-03, A11Y-03, I18N-02, UI-04, and A11Y-04 (the automated scan that confirms A11Y-03).\n" +
    "The 2 partial: SF-08 and API-08. No available premium domain was found within the call budget, so premium price display is untested.",
    "4 Coverage");
  const stats = [["43", "scenarios", K.black], ["23", "pass", K.green], ["12", "pass with a note", K.amber], ["6", "fail", K.red], ["2", "partial", K.grey]];
  const sw = 2.3, gap = 0.15;
  stats.forEach((st, i) => {
    const x = M + i * (sw + gap);
    panel(s, x, 1.95, sw, 1.2, K.panel, "Total " + st[1]);
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 2.12, w: 0.2, h: 0.2, fill: { color: st[2] }, line: { type: "none" }, objectName: "Dot " + st[1] });
    txt(s, st[0], { x: x + 0.65, y: 1.95, w: 1.5, h: 0.75, fontFace: HEAD, fontSize: 32, bold: true, color: K.black, valign: "bottom", objectName: "Total number " + st[1] });
    txt(s, st[1], { x: x + 0.65, y: 2.72, w: 1.6, h: 0.35, fontSize: 13, color: K.ink, objectName: "Total label " + st[1] });
  });
  const areas = ["Storefront", "Public API", "WHOIS", "Name Generator", "Cross-door", "UI", "Accessibility", "Languages / RTL"];
  const data = [
    { name: "Pass", labels: areas, values: [4, 9, 2, 1, 2, 1, 2, 2] },
    { name: "Pass with a note", labels: areas, values: [3, 1, 1, 2, 0, 2, 0, 3] },
    { name: "Fail", labels: areas, values: [0, 1, 1, 0, 0, 1, 2, 1] },
    { name: "Partial", labels: areas, values: [1, 1, 0, 0, 0, 0, 0, 0] },
  ];
  s.addChart(pres.charts.BAR, data, {
    x: M, y: 3.35, w: W - 2 * M, h: 3.45, barDir: "bar", barGrouping: "stacked", barGapWidthPct: 45,
    chartColors: [HEX.green, HEX.amber, HEX.red, HEX.grey],
    showValue: true, dataLabelPosition: "ctr", dataLabelFormatCode: "0;;;", dataLabelColor: "FFFFFF", dataLabelFontSize: 11, dataLabelFontFace: "+mn-lt", dataLabelFontBold: true,
    catAxisLabelColor: HEX.ink, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin",
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisLineShow: false,
    showLegend: true, legendPos: "t", legendFontSize: 12, legendFontFace: "+mn-lt", legendColor: HEX.ink,
    showTitle: false, objectName: "Results by area chart", altText: "Stacked bar chart of manual results per area",
  });
  deepDive(s, "TEST_PLAN.md · results summary", GH + "TEST_PLAN.md#results-summary");
}

// =====================================================================
// 10. Automated run
{
  const s = content("One command, 24 tests, all green", "The suite runs in about 45 seconds and keeps the known API bug visible on purpose.",
    "Representative run: full 'npm test' on 2026-11-03 at 10:38 UTC, logged out, headless Chromium, 1 worker. 24 tests, 24 passed in 44.0 seconds, no retries used (evidence/automation/run-summary.txt).\n\n" +
    "- Split: 13 API tests, 9 web tests (7 storefront and 2 axe scans), 2 cross-door tests.\n" +
    "- The web tests passed 3 runs in a row without retries (10:34 to 10:38 UTC).\n" +
    "- Clean-clone check: fresh clone of main from GitHub, npm ci, .env added: 24 of 24 passed in 46 seconds (EXECUTION_PLAN.md piece 5.4).\n" +
    "- One full run makes 19 calls with the API key (17 API plus 2 cross-door).\n" +
    "- The report and evidence were scanned for the key and account ID: 0 hits.\n\n" +
    "API-07 shows as a cross in the terminal but counts as passed: it asserts the documented 401/403, and it's marked as an expected failure for Finding 1. If Wix fixes the API, the test 'unexpectedly passes' and the marker gets removed.\n\n" +
    "The terminal lines on the slide are shortened from the real output.",
    "4 Coverage");
  const st = [["24/24", "tests passed"], ["44 s", "for the full suite"], ["3 in a row", "green web runs"], ["24/24", "from a fresh clone"]];
  st.forEach((v, i) => {
    const x = M + (i % 2) * 3.05, y = 2.05 + Math.floor(i / 2) * 1.75;
    panel(s, x, y, 2.85, 1.55, K.panel, "Run stat " + i);
    txt(s, v[0], { x: x + 0.3, y: y + 0.2, w: 2.4, h: 0.7, fontFace: HEAD, fontSize: 30, bold: true, color: i === 0 ? K.green : K.black, valign: "middle", objectName: "Run stat number " + i });
    txt(s, v[1], { x: x + 0.3, y: y + 0.92, w: 2.4, h: 0.4, fontSize: 14, objectName: "Run stat label " + i });
  });
  txt(s, "API-07 is a known bug (Finding 1). It's marked as an expected failure, so the build stays green and a fix gets noticed.",
    { x: M, y: 5.7, w: W - 2 * M, h: 0.6, fontSize: 14, color: HEX.muted, objectName: "API-07 note" });
  const tx = 7.0, tw = W - M - tx;
  panel(s, tx, 2.05, tw, 3.3, K.black, "Terminal");
  const L = (t, c, b) => ({ text: t, options: { color: c, bold: !!b, breakLine: true } });
  txt(s, [
    L("$ npm test", "AEB8C2"),
    L("Running 24 tests using 1 worker", "AEB8C2"),
    L("✘ API-07 no API key is refused", "FF8A9B"),
    L("    (expected failure: Finding 1)", "AEB8C2"),
    L("✓ API-01 fresh name is available", "7EE2A8"),
    L("✓ API-02 registered name is taken", "7EE2A8"),
    L("✓ SF-01 free name: price + buy button", "7EE2A8"),
    L("✓ SF-02 taken name: alternatives", "7EE2A8"),
    L("✓ X-01 API and storefront agree", "7EE2A8"),
    L("  …", "AEB8C2"),
    { text: "24 passed (44.0s)", options: { color: K.white, bold: true } },
  ], { x: tx + 0.3, y: 2.25, w: tw - 0.5, h: 2.95, fontFace: MONO, fontSize: 13, objectName: "Terminal text" });
  deepDive(s, "run-summary.txt", GH + "evidence/automation/run-summary.txt");
}

// =====================================================================
// 11. Findings table
{
  const s = content("Five real findings, rated by customer impact", "Each one was reproduced at least twice and checked against \"Domain basics\".",
    "From FINDINGS.md. Severity is how bad it is for the person affected. Priority is how soon to fix it, adding how many people hit it, business or legal risk, and cost to fix.\n\n" +
    "1. The public API answers without any API key (S2 Major, P1 High). The docs say an account-level key is required. Anyone can call both endpoints anonymously, so Wix can't identify, rate-limit or bill callers per account. The data itself is public, which is why it isn't S1.\n" +
    "2. WHOIS shows a fake 'connection issue' for invalid input and adds .com twice (S3 Moderate, P2 Medium). The user can recover by retyping. The storefront already handles the same input well, so the fix is cheap.\n" +
    "3. The results page is hard to use with a screen reader (S2 Major, P2 Medium). It blocks a user group from the purchase funnel. Legal exposure under the European Accessibility Act. Fixes are small; P1 if accessibility is a goal this quarter.\n" +
    "4. A Hebrew domain is shown as punycode, the encoded xn-- form, in the main card (S3 Moderate, P3 Low). The answer is correct and the list below shows the Hebrew. Few users, but more important in Israel.\n" +
    "5. The message says 'fewer than 63 characters', but 63 is allowed (S4 Minor, P3 Low). A one-word copy fix.\n\n" +
    "Scales: S1 Critical to S4 Minor; P0 Now to P3 Low.",
    "4 Coverage");
  const h = (t, al) => ({ text: t, options: { bold: true, color: K.black, fill: { color: K.panel }, fontSize: 13, align: al || "left" } });
  const tag = (t) => ({ text: t, options: { bold: true, color: sevText[t.slice(0, 2)], fill: { color: sevFill[t.slice(0, 2)] }, align: "center", fontSize: 13 } });
  const rows = [
    ["1", "The API answers without an API key", "Public API", "S2 Major", "P1 High"],
    ["2", "WHOIS blames your internet for a typo", "WHOIS", "S3 Moderate", "P2 Medium"],
    ["3", "Results page is hard to use with a screen reader", "Storefront, WHOIS", "S2 Major", "P2 Medium"],
    ["4", "Hebrew name shown in encoded form (xn--…)", "Storefront, WHOIS", "S3 Moderate", "P3 Low"],
    ["5", "Says \"fewer than 63 characters\", but 63 works", "Storefront", "S4 Minor", "P3 Low"],
  ];
  s.addTable([[h("#", "center"), h("Finding"), h("Door"), h("Severity", "center"), h("Priority", "center")]].concat(rows.map((r) => [
    { text: r[0], options: { bold: true, color: K.blue, align: "center", fontSize: 16 } }, { text: r[1], options: { color: K.black, fontSize: 15 } }, { text: r[2] }, tag(r[3]), tag(r[4]),
  ])), { x: M, y: 2.0, w: W - 2 * M, colW: [0.6, 6.0, 2.3, 1.611, 1.622], rowH: 0.6, fontSize: 14, color: K.ink, valign: "middle", border: { type: "solid", pt: 0.75, color: HEX.line }, objectName: "Findings table" });
  txt(s, [{ text: "Severity", options: { bold: true, color: K.black } }, { text: " = how bad it is.   " }, { text: "Priority", options: { bold: true, color: K.black } }, { text: " = how soon to fix it." }],
    { x: M, y: 5.95, w: 9, h: 0.4, fontSize: 15, objectName: "Scale caption" });
  deepDive(s, "FINDINGS.md", GH + "FINDINGS.md#summary");
}

// =====================================================================
// 12. Findings 1 & 2
{
  const s = content("Findings 1 and 2 up close", "The API ignores its own key rule, and WHOIS blames the user for a typo.",
    "Finding 1 (S2 Major, P1 High). Steps: call check-domain-availability for google.com with no headers, with only the account ID, and with an invalid key; also call suggest-domains with no headers. Expected 401 or 403 and no data, as the docs say ('This call requires an account level API key'). Actual: 200 with full data every time. 7 of 7 attempts, on both endpoints, in three sessions (manual run, re-check, and the automated test API-07). Evidence on the slide: evidence/API-07/missing-key.json. If anonymous access is intended, this becomes a documentation bug.\n\n" +
    "Finding 2 (S3 Moderate, P2 Medium). Steps: on wix.com/domains/whois type my_bakery!.com and press Enter. The page goes to /domain/result/whois?query=my_bakery!.com.com (.com added twice) and shows 'We couldn't load this page. There is a connection issue. Check your internet and try again.' 'Try Again' can never work. Reproduced from two entry points (landing page and results page). The storefront handles the same input with a clear message (SF-07). Evidence: evidence/WH-03/invalid-input-from-landing-page.jpg.",
    "4 Coverage");
  const cw = 5.95, cy = 2.0, ch = 4.6;
  panel(s, M, cy, cw, ch, K.panel, "Finding 1 card");
  txt(s, "1 · The API answers without a key", { x: M + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 1 title" });
  panel(s, M + 0.3, cy + 0.9, cw - 0.6, 1.6, K.black, "Finding 1 code");
  const CL = (t, c) => ({ text: t, options: { color: c, breakLine: true } });
  txt(s, [CL("GET …/check-domain-availability", "D6DEE6"), CL("    ?domain=google.com", "D6DEE6"), CL("auth: no auth headers", "FF8A9B"), CL("status: 200", "7EE2A8"), { text: "\"available\": false", options: { color: "D6DEE6" } }],
    { x: M + 0.55, y: cy + 1.05, w: cw - 1.1, h: 1.35, fontFace: MONO, fontSize: 13, objectName: "Finding 1 code text" });
  txt(s, "Docs say a key is required. 7 of 7 tries, both endpoints.", { x: M + 0.3, y: cy + 3.0, w: cw - 0.6, h: 0.7, fontSize: 15, objectName: "Finding 1 summary" });
  pill(s, M + 0.3, cy + 3.85, 1.3, 0.42, "S2 Major", K.red, K.white, 12, "Finding 1 severity");
  pill(s, M + 1.75, cy + 3.85, 1.3, 0.42, "P1 High", K.red, K.white, 12, "Finding 1 priority");
  const x2 = M + cw + 0.23;
  panel(s, x2, cy, cw, ch, K.panel, "Finding 2 card");
  txt(s, "2 · WHOIS blames your internet", { x: x2 + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 2 title" });
  const iw = cw - 0.6, ih = iw * 140 / 480;
  s.addImage({ path: path.join(IMG, "wh03.jpg"), x: x2 + 0.3, y: cy + 0.9, w: iw, h: ih, altText: "Evidence WH-03: WHOIS page saying We couldn't load this page. There is a connection issue.", objectName: "WH-03 screenshot" });
  s.addShape(pres.shapes.RECTANGLE, { x: x2 + 0.3, y: cy + 0.9, w: iw, h: ih, fill: { type: "none" }, line: { color: HEX.line, width: 1 }, objectName: "WH-03 border" });
  txt(s, [{ text: "Typed ", options: {} }, { text: "my_bakery!.com", options: { fontFace: MONO, color: K.black } }, { text: ". The page says there is a connection issue, and adds .com twice." }],
    { x: x2 + 0.3, y: cy + 3.0, w: cw - 0.6, h: 0.75, fontSize: 15, objectName: "Finding 2 summary" });
  pill(s, x2 + 0.3, cy + 3.85, 1.5, 0.42, "S3 Moderate", K.amber, K.ink, 12, "Finding 2 severity");
  pill(s, x2 + 1.95, cy + 3.85, 1.4, 0.42, "P2 Medium", K.amber, K.ink, 12, "Finding 2 priority");
  deepDive(s, "FINDINGS.md · Findings 1–2", GH + "FINDINGS.md#finding-1-the-public-domain-search-api-works-without-any-api-key");
}

// =====================================================================
// 13. Findings 3–5
{
  const s = content("Findings 3 to 5: the results page is where it breaks", "The page where users decide to buy has the accessibility, Hebrew and wording issues.",
    "Finding 3 (S2 Major, P2 Medium): on the results page, html lang is empty, the search box has no accessible name, the clear and search icon buttons have no name, there's no main landmark, and nothing announces the results (no live region). Found by a manual DOM review (A11Y-03), then confirmed by the automated axe scan in Playwright (A11Y-04): button-name critical on 3 buttons, label critical on the search box, html-has-lang serious. The landing page passes the same checks. WCAG 3.1.1, 4.1.2, 1.3.1, 4.1.3.\n\n" +
    "Finding 4 (S3 Moderate, P3 Low): searching קפהטעים.com shows xn--8dbidqxju.com in the 'Exact Match' card. That's punycode, the encoded form DNS uses. The availability answer is correct, and the list right below shows the Hebrew correctly. Evidence: evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg. Seen from the storefront and from WHOIS.\n\n" +
    "Finding 5 (S4 Minor, P3 Low): 70 characters gives 'Domains should contain fewer than 63 characters', but exactly 63 is accepted. The API itself says 'maximum allowed ... 63 characters'. Evidence: evidence/automation/UI-04/70-chars-length-message.png and 63-chars-accepted.png.",
    "4 Coverage");
  const cw = 3.85, gap = 0.275, cy = 2.0, ch = 4.6;
  const cols = [M, M + cw + gap, M + 2 * (cw + gap)];
  cols.forEach((x, i) => panel(s, x, cy, cw, ch, K.panel, "Finding " + (i + 3) + " card"));
  // 3
  let x = cols[0];
  txt(s, "3 · Screen readers", { x: x + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 3 title" });
  txt(s, "Automated axe scan of the results page:", { x: x + 0.3, y: cy + 0.8, w: cw - 0.6, h: 0.35, fontSize: 13, objectName: "Finding 3 intro" });
  const a = [["Buttons with no name", "critical"], ["Search box with no label", "critical"], ["Page language missing", "serious"]];
  a.forEach((r, j) => {
    const y = cy + 1.3 + j * 0.62;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y, w: cw - 0.6, h: 0.5, fill: { color: K.white }, line: { type: "none" }, rectRadius: 0.1, objectName: "Axe row " + j });
    txt(s, r[0], { x: x + 0.45, y, w: 2.1, h: 0.5, fontSize: 12, color: K.black, valign: "middle", objectName: "Axe rule " + j });
    txt(s, r[1], { x: x + 2.45, y, w: 0.95, h: 0.5, fontSize: 12, bold: true, color: r[1] === "critical" ? K.red : HEX.ink, align: "right", valign: "middle", objectName: "Axe impact " + j });
  });
  txt(s, "Found by hand first, then confirmed by the scan.", { x: x + 0.3, y: cy + 3.2, w: cw - 0.6, h: 0.55, fontSize: 13, objectName: "Finding 3 note" });
  pill(s, x + 0.3, cy + 3.95, 1.3, 0.4, "S2 Major", K.red, K.white, 12, "Finding 3 severity");
  pill(s, x + 1.7, cy + 3.95, 1.3, 0.4, "P2 Medium", K.amber, K.ink, 12, "Finding 3 priority");
  // 4
  x = cols[1];
  txt(s, "4 · Hebrew name", { x: x + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 4 title" });
  const iw = cw - 0.6, ih = iw * 305 / 600;
  s.addImage({ path: path.join(IMG, "i18n02.jpg"), x: x + 0.3, y: cy + 0.85, w: iw, h: ih, altText: "Evidence I18N-02: main card shows xn--8dbidqxju.com while the list below shows the Hebrew name", objectName: "I18N-02 screenshot" });
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.3, y: cy + 0.85, w: iw, h: ih, fill: { type: "none" }, line: { color: HEX.line, width: 1 }, objectName: "I18N-02 border" });
  txt(s, "The main card shows punycode (the encoded xn-- form). The list below shows the Hebrew.", { x: x + 0.3, y: cy + 2.6, w: cw - 0.6, h: 1.2, fontSize: 13, objectName: "Finding 4 summary" });
  pill(s, x + 0.3, cy + 3.95, 1.5, 0.4, "S3 Moderate", K.amber, K.ink, 12, "Finding 4 severity");
  pill(s, x + 1.9, cy + 3.95, 1.1, 0.4, "P3 Low", K.grey, K.white, 12, "Finding 4 priority");
  // 5
  x = cols[2];
  txt(s, "5 · Length message", { x: x + 0.3, y: cy + 0.25, w: cw - 0.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: K.black, objectName: "Finding 5 title" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: cy + 0.85, w: cw - 0.6, h: 1.1, fill: { color: K.white }, line: { type: "none" }, rectRadius: 0.12, objectName: "Quote box" });
  txt(s, "“Domains should contain fewer than 63 characters.”", { x: x + 0.5, y: cy + 0.85, w: cw - 1.0, h: 1.1, fontSize: 15, italic: true, color: K.black, valign: "middle", objectName: "Finding 5 quote" });
  const uw = cw - 0.6, uh = uw * 110 / 1000;
  s.addImage({ path: path.join(IMG, "ui04.jpg"), x: x + 0.3, y: cy + 2.1, w: uw, h: uh, altText: "Evidence UI-04: storefront message for a 70-character name", objectName: "UI-04 screenshot" });
  txt(s, "But exactly 63 characters is accepted.", { x: x + 0.3, y: cy + 2.6, w: cw - 0.6, h: 0.8, fontSize: 13, objectName: "Finding 5 summary" });
  pill(s, x + 0.3, cy + 3.95, 1.3, 0.4, "S4 Minor", K.grey, K.white, 12, "Finding 5 severity");
  pill(s, x + 1.7, cy + 3.95, 1.1, 0.4, "P3 Low", K.grey, K.white, 12, "Finding 5 priority");
  deepDive(s, "FINDINGS.md · Findings 3–5", GH + "FINDINGS.md#finding-3-the-results-page-isnt-usable-with-a-screen-reader");
}

// =====================================================================
// 14. Risks
{
  const s = content("Twelve risks noted, not called bugs", "Some things look wrong but are expected, a product choice, or not proven yet.",
    "From FINDINGS.md, 'Risks and observations'. Twelve items, R1 to R12. Highlights on the slide:\n" +
    "- R1: taken famous names get trademark-style suggestions like googleassistantapp.com and googlebranding.com. Suggestions are generated (Domain basics), but it's a legal (UDRP) risk for buyers.\n" +
    "- R2: the struck-through .com price is ₪21.47, but the renewal price in the page's own data is ₪90.19. Users may misread what they pay in year 2. The tooltip wasn't checked.\n" +
    "- R4: in the Name Generator, the name 'Rise' for a sourdough bakery gets traprise.com, myfundadvance.com, topfundrise.com. Only the short name is sent to the suggestion engine. Screenshot: evidence/BNG-02/rise-unrelated-domains.jpg.\n" +
    "- R12: when wix.com's price services were rate limited (429), the page still showed 'Available now!' and active buy buttons with no price. Seen once, caused by our own test volume. Not reproduced on purpose (no load testing).\n\n" +
    "Others: no Hebrew or Arabic version of the pages (R3), unrelated API suggestions for a Hebrew query (R5), ~8 s for alternatives (R6), empty search gives no hint (R7), internal 'another Wix account' label for google.com (R8), premium pricing untested (R9), business description in the URL (R10), long names cut in the middle of the main card (R11).\n\n" +
    "Not reported: axe flagged colour contrast on the landing page's 'Search Domains' button. A manual check of the real colour gives about 5.1:1, which passes, so it's a false positive.",
    "4 Coverage");
  const items = [
    ["Brand-name suggestions", "like googlebranding.com: legal risk"],
    ["Price clarity", "struck-through ₪21.47, renewal ₪90.19"],
    ["Name Generator", "\"Rise\" for a bakery gets finance domains"],
    ["Busy price service", "\"Available now!\" shown with no price"],
  ];
  items.forEach((it, i) => {
    const y = 2.05 + i * 1.02;
    s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.12, w: 0.5, h: 0.5, fill: { color: K.amber }, line: { type: "none" }, objectName: "Risk dot " + i });
    txt(s, String(i + 1), { x: M, y: y + 0.12, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: K.ink, align: "center", valign: "middle", objectName: "Risk number " + i });
    txt(s, [{ text: it[0], options: { bold: true, color: K.black, fontSize: 17, breakLine: true } }, { text: it[1], options: { fontSize: 14 } }],
      { x: M + 0.75, y: y, w: 5.6, h: 0.85, objectName: "Risk text " + i });
  });
  txt(s, "Not reported: one automated colour-contrast alert. We checked it by hand, and it passes.", { x: M, y: 6.15, w: 6.4, h: 0.5, fontSize: 13, color: HEX.muted, objectName: "False positive note" });
  const iw = 5.6, ih = iw * 370 / 590, ix = W - M - iw;
  s.addImage({ path: path.join(IMG, "bng02.jpg"), x: ix, y: 2.05, w: iw, h: ih, altText: "Evidence BNG-02: name Rise shows traprise.com, myfundadvance.com and other unrelated domains", objectName: "BNG-02 screenshot" });
  s.addShape(pres.shapes.RECTANGLE, { x: ix, y: 2.05, w: iw, h: ih, fill: { type: "none" }, line: { color: HEX.line, width: 1 }, objectName: "BNG-02 border" });
  txt(s, "Evidence: evidence/BNG-02/rise-unrelated-domains.jpg", { x: ix, y: 2.05 + ih + 0.1, w: iw, h: 0.3, fontSize: 11, fontFace: MONO, color: HEX.muted, objectName: "BNG-02 caption" });
  deepDive(s, "FINDINGS.md · risks", GH + "FINDINGS.md#risks-and-observations-not-reported-as-bugs");
}

// =====================================================================
// 15. Closing
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
  s.addText([{ text: "Deep dive → ", options: { color: "AEB8C2" } }, link("README.md", GH + "README.md#quality-strategy-for-wix-domains-5-lines"), { text: "  ·  ", options: { color: "AEB8C2" } }, link("AI_LOG.md", GH + "AI_LOG.md"), { text: "  ·  ", options: { color: "AEB8C2" } }, link("Repo", "https://github.com/kazes5/WixAssignment")],
    { x: 6.2, y: 6.98, w: 6.53, h: 0.3, fontSize: 11, align: "right", margin: 0, valign: "middle", isTextBox: true, objectName: "Closing links" });
  s.addNotes(
    "Quality strategy for Wix Domains, in 5 lines (README.md):\n" +
    "1. Protect the one answer. 'Can I get this name?' has to be correct and the same across all four doors, so cross-door checks are P0 on every change.\n" +
    "2. Test the shared service first, then a few journeys. Contract tests on the domain-search service give fast, stable feedback. A thin layer of UI tests per door covers what the user actually sees.\n" +
    "3. Assert behaviour, not data. Check availability, status and response shape. Never exact prices or suggestions.\n" +
    "4. Test in the user's world: several countries and currencies, IDN and RTL input, accessibility and mobile, because that's where the bugs in this assignment were found.\n" +
    "5. Watch production: synthetic checks on each door, plus funnel metrics (search, available, cart) and error-message tracking.\n\n" +
    "With another week (README.md): run the suite in CI on every PR and nightly; run it from 3 to 4 regions and compare; use Playwright's page.route to simulate 429, 500 and slow responses instead of load (R12); deeper cross-door checks, including Name Generator suggestions against the API; close the gaps: an available premium domain for SF-08, a real VoiceOver or NVDA pass, an axe baseline that fails only on new violations; and ask the API team whether keyless access (Finding 1) is intended.\n\n" +
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
