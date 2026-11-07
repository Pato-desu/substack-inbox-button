(() => {
  const BTN_ID = "sbx-inbox-btn";

  // Only act on Substack pages (also covers custom domains).
  const looksLikeSubstack = () =>
    location.hostname.endsWith("substack.com") ||
    !!document.querySelector(
      'script[src*="substackcdn.com"], link[href*="substackcdn.com"], img[src*="substackcdn.com"], meta[property="og:site_name"][content*="Substack" i]'
    ) ||
    document.documentElement.innerHTML.includes("substackcdn.com");

  const slugFromPath = () => {
    const m = location.pathname.match(/^\/p\/([^/?#]+)/);
    return m ? m[1] : null;
  };

  async function getPostId() {
    const slug = slugFromPath();
    if (!slug) return null;

    // 1) Same-origin API (most reliable).
    try {
      const r = await fetch(`/api/v1/posts/${encodeURIComponent(slug)}`, {
        credentials: "include",
      });
      if (r.ok) {
        const j = await r.json();
        if (j && Number.isInteger(j.id)) return j.id;
      }
    } catch (_) {}

    // 2) Fallback: look in the page's embedded data.
    const html = document.documentElement.innerHTML;
    const m =
      html.match(/\?"post_id\?":\s*(\d+)/) ||
      html.match(/\?"post\?":\s*\{\s*\?"id\?":\s*(\d+)/);
    return m ? Number(m[1]) : null;
  }

  function addButton(postId) {
    if (document.getElementById(BTN_ID)) return;
    const a = document.createElement("a");
    a.id = BTN_ID;
    a.href = `https://substack.com/inbox/post/${postId}`;
    a.textContent = "Open in Inbox";
    a.title = `post_id: ${postId}`;
    a.style.cssText = [
      "position:fixed", "right:20px", "bottom:20px", "z-index:2147483647",
      "padding:10px 16px", "background:#ff6719", "color:#fff",
      "font:600 14px/1 -apple-system,Segoe UI,Roboto,sans-serif",
      "border-radius:999px", "text-decoration:none",
      "box-shadow:0 2px 10px rgba(0,0,0,.25)", "cursor:pointer",
    ].join(";");
    document.body.appendChild(a);
  }

  async function run() {
    if (!slugFromPath() || !looksLikeSubstack()) return;
    const id = await getPostId();
    if (id) addButton(id);
  }

  run();

  // Handle client-side navigation between posts.
  let last = location.href;
  new MutationObserver(() => {
    if (location.href !== last) {
      last = location.href;
      document.getElementById(BTN_ID)?.remove();
      run();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
