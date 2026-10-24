# Stream Multichat

A static HTML/CSS/JavaScript app. No build step, dependencies, API keys, or backend are required.

## Run and test

- Start a local web server: `python3 -m http.server 8765 --bind 127.0.0.1`
- Open http://localhost:8765 (use HTTP rather than opening the HTML file directly).
- Run regression tests with Node 24: `node --test tests/*.test.js`.

Twitch and YouTube use chat iframes with the current page hostname. YouTube does not support embedded chat on mobile web. Each card has an external link for platform sign-in, browser restrictions, offline streams, or unavailable chats. Kick and TikTok are saved as separate-page links; this app does not claim a verified inline chat integration for them.

Chats are identified by platform/channel in localStorage, with derived URL fields retained for rollback compatibility. Legacy records are validated and rebuilt on load; saved URLs and colors are never trusted. Storage failures leave the current session usable and show a notice. Removing a card updates the saved list.

Feedback is submitted to the existing Google Form. Its cross-origin response is opaque, so delivery cannot be confirmed. The app keeps the text for retrying. Do not include private information. Embedded platforms, the existing AdSense script, and Google Forms make third-party requests; this is not a tracking-free or offline app.

## Deployment

See DEPLOYMENT.md. Keep production on the current main commit until a preview has passed review. GitHub Actions checks syntax and URL/storage regression tests.
