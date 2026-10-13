// Shared helpers for the shop page and the admin page.

const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ddd"/>' +
  '<text x="50" y="54" font-size="10" text-anchor="middle" fill="#888" font-family="sans-serif">No photo</text></svg>');

const fmt = n => SHOP.currency + Number(n).toFixed(2).replace(/\.00$/, "");

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Only allow http(s) links so a typo can't turn into a javascript: link.
function safeUrl(u) {
  return /^https?:\/\//i.test(u || "") ? u : "";
}

function retailLink(p) {
  const url = safeUrl(p.retail_url);
  if (!url) return "";
  const label = p.retail_price ? `Retail <s>${fmt(p.retail_price)}</s>` : "See retail price";
  return `<a class="retail" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
}

let _db;
function getDb() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !window.supabase) return null;
  return _db ||= window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
