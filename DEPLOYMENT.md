# Safe deployment path

Baseline inspected: main commit c5dcdaf. Static site, no build command. Netlify settings and currently deployed commit have not been verified through an authenticated Netlify session.

1. In the existing Netlify project for streammultichat.app, verify that the linked repository is kristinayordanovaa/Multichats. Record the production branch, deployed commit/deploy ID, base directory, build command, publish directory, environment-variable names, domain aliases, and current deploy settings. Do not copy secret values into a report.
2. Keep production on main. Enable/check Deploy Previews for pull requests; verify that pushing this feature branch will not publish it to production. The intended publish directory is the repository root and there is no build command. Do not create a second production site.
3. Run `node --check app.js`, `node --check chat-urls.js`, and `node --test tests/*.test.js`; require the Checks workflow to pass.
4. Review the pull-request preview on desktop and a real mobile browser. Add an active Twitch stream and an active YouTube stream with live chat enabled. Check actual chat content, external links, refresh persistence, duplicates, removal, first-use settings, keyboard navigation, and a grid of at least six chats. Verify the iframe parent/embed_domain uses the preview hostname. YouTube inline chat is not supported on mobile web; verify its external link instead.
5. Verify Kick chatroom and TikTok LIVE external links against active accounts. Their cards intentionally do not embed chat. Test signing in on the platforms yourself; do not post test messages to public chats.
6. With the owner's agreement, submit one clearly marked feedback test and confirm receipt in the destination Google Form/Sheet. The app cannot confirm receipt itself. Confirm the existing AdSense behavior and privacy/consent requirements before release.
7. Obtain approval of the preview, then merge to main. Check the Netlify deploy status and repeat the chat/refresh/remove smoke test on streammultichat.app and its www alias if configured.
8. If a regression appears, use Netlify's previous successful deploy to restore the recorded baseline immediately, then revert the merge on GitHub so later builds do not reintroduce it. Existing legacy chat records are readable; new records retain derived URL fields for a baseline rollback. Twitch and YouTube remain readable by the baseline; Kick/TikTok cards must be re-added on a rollback because the baseline requires their old embed URLs. Record those channel names before reverting.

## Remaining work after this patch

- Verify the Netlify account/project, production commit, preview settings, response headers, and rollback permissions.
- Test authenticated platform interactions, real mobile devices, live YouTube content, external Kick/TikTok links, and actual feedback receipt.
- Replace opaque Google Forms delivery with a verifiable submission flow if confirmed feedback is required.
- Decide whether true inline Kick/TikTok chat warrants a separate supported integration project.
- Audit AdSense/privacy consent and missing social-preview artwork (og-image.png is referenced but absent).
