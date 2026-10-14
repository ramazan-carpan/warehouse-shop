// Shared helpers for the shop page and the admin page.

const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ddd"/>' +
  '<text x="50" y="54" font-size="10" text-anchor="middle" fill="#888" font-family="sans-serif">No photo</text></svg>');

const LINK_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>';

const fmt = n => SHOP.currency + Number(n).toFixed(2).replace(/\.00$/, "");

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Only allow http(s) links so a typo can't turn into a javascript: link.
function safeUrl(u) {
  return /^https?:\/\//i.test(u || "") ? u : "";
}

// All photos of a product as [{ path, url }]. Older products only have image_url.
function photosOf(p) {
  if (Array.isArray(p.images) && p.images.length) return p.images;
  return p.image_url ? [{ path: p.image_path, url: p.image_url }] : [];
}

// Percentage saved against the retail price, or 0.
function savePct(p) {
  return p.retail_price > p.price ? Math.round((1 - p.price / p.retail_price) * 100) : 0;
}

function retailLink(p) {
  const url = safeUrl(p.retail_url);
  if (!url) return "";
  let host = "";
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch {}
  const label = p.retail_price ? `Retail price ${fmt(p.retail_price)}` : "See retail price";
  return `<a class="retail" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${LINK_ICON}` +
    `<span>${label}${host ? ` <small>at ${esc(host)}</small>` : ""}</span></a>`;
}

let _db;
function getDb() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) return null;
  return _db ||= window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
