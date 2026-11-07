# Substack Inbox Post Button

A small Chrome extension that adds an **Open in Inbox** button to Substack posts (`.../p/<slug>`). Clicking it opens the post in the Substack inbox view:

```
https://substack.com/inbox/post/<post_id>
```

## How it works

- Runs on pages matching `*://*/p/*` and only acts if the page looks like Substack (this covers custom-domain publications).
- Gets the `post_id` from the same-site API (`/api/v1/posts/<slug>`), falling back to the data embedded in the page.
- Re-checks on client-side navigation between posts.
- Collects no data and makes no requests to third parties.

## Install (unpacked)

1. Clone or download this repo.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Files

- `manifest.json` - Manifest V3 config
- `content.js` - finds the post id and adds the button
