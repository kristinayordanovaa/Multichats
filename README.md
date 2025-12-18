# 🎮 MultiChats - Livestream Chat Aggregator

A web application that combines livestream chats from multiple platforms (Twitch, YouTube, Kick, and TikTok) into a single view, making it easy to monitor and interact with multiple chats simultaneously.

## Features

- ✨ **Multi-Platform Support**: Works with Twitch, YouTube, Kick, and TikTok
- 🎯 **Easy URL Input**: Just paste any stream or chat URL
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 💾 **Auto-Save**: Remembers your chats permanently across sessions
- 🎨 **Modern UI**: Sleek dark theme with fullscreen chat display
- 💬 **Interactive Chats**: Log in and chat directly within embedded windows
- ⚙️ **Hidden Settings Panel**: Clean interface with slide-out settings menu
- 📝 **Feedback System**: Built-in feedback form connected to Google Forms
- 🔄 **Real-Time Updates**: All chats update in real-time

## How to Use

1. **Open the App**: Open `index.html` in your web browser (or use a local server)
2. **Open Settings**: Click the ⚙️ gear icon in the top-right corner
3. **Add a Chat**: Paste a stream URL and click "Add Chat"
4. **Interact**: Log in to platforms to type and interact in chats
5. **Manage Chats**: Remove any chat by clicking the ✕ button
6. **Use Popout**: Click ⧉ button to open chat in a separate popup window (useful for Twitch/TikTok)

## Supported URL Formats

### Twitch
- `https://twitch.tv/channelname`
- `https://twitch.tv/popout/channelname/chat`

### YouTube
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/live/VIDEO_ID`
- `https://youtube.com/live_chat?v=VIDEO_ID`
- `https://studio.youtube.com/live_chat?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

### Kick
- `https://kick.com/channelname`
- `https://kick.com/channelname/chatroom`

### TikTok
- `https://tiktok.com/@username/live`

## Local Development

No build process or dependencies required! For best results, use a local server:

```bash
# Using Node.js (recommended)
npx serve

# Using Python 3
python3 -m http.server 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Technical Details

- **Pure JavaScript**: No frameworks or libraries required
- **LocalStorage**: Chats persist permanently between sessions
- **Iframe Embedding**: Uses official embed URLs from each platform
- **Responsive Grid**: Automatically adjusts layout based on screen size
- **Google Forms Integration**: Feedback submissions go directly to Google Sheets

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Hosting

### Recommended: Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant deployment with automatic HTTPS
3. Twitch/YouTube embeds work perfectly on Netlify domains

### GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Access via `https://yourusername.github.io/multichats`

### Vercel
1. Connect your GitHub repo to Vercel
2. Auto-deploys on every push

## Troubleshooting

**Chat not loading?**
- Ensure the stream is live (especially for YouTube)
- Check if the channel name is correct
- Some streams may have embedding disabled by the streamer

**Twitch chat shows "refused to connect"?**
- This happens when opening HTML directly (file://)
- Solution: Use a local server or deploy to Netlify/Vercel
- The app automatically sets the correct `parent` parameter for your domain

**Can't log in to chat?**
- Make sure you're already logged into the platform in another tab
- Try using the popup button (⧉) for a better login experience

**TikTok not embedding properly?**
- TikTok has strict embedding policies
- Use the popup button (⧉) for best experience

## Privacy & Data

- All chat data is stored locally in your browser's localStorage
- Feedback is sent to Google Forms (no personal data collected)
- No tracking or analytics
- No data sent to external servers (except feedback)

## Sending Feedback

Found a bug or have a suggestion?
1. Click the ⚙️ settings icon
2. Scroll down to "Send Feedback"
3. Type your message and click "Send Feedback"

Your feedback goes directly to our Google Form for review.

## License

MIT License - Feel free to use and modify as needed!

---

Made with ❤️ for streamers and viewers who want to monitor multiple chats at once. 🎮
