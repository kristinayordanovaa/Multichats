# 🎮 MultiChats - Livestream Chat Aggregator

A web application that combines livestream chats from multiple platforms (Twitch, YouTube, and Kick) into a single view, making it easy to monitor multiple chats simultaneously.

## Features

- ✨ **Multi-Platform Support**: Works with Twitch, YouTube, and Kick
- 🎯 **Easy URL Input**: Just paste any stream or chat URL
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 💾 **Auto-Save**: Remembers your chats across sessions
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 🔄 **Real-Time Updates**: All chats update in real-time

## How to Use

1. **Open the App**: Simply open `index.html` in your web browser
2. **Add a Chat**: Paste a stream URL in the input field and click "Add Chat"
3. **Manage Chats**: Remove any chat by clicking the ✕ button in its header
4. **Automatic Saving**: Your chats are automatically saved and restored when you reopen the app

## Supported URL Formats

### Twitch
- `https://twitch.tv/channelname`
- `https://twitch.tv/popout/channelname/chat`

### YouTube
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/live/VIDEO_ID`
- `https://youtube.com/live_chat?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

### Kick
- `https://kick.com/channelname`
- `https://kick.com/channelname/chatroom`

## Local Development

No build process or dependencies required! Just open the files in your browser:

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start adding stream chats!

## Technical Details

- **Pure JavaScript**: No frameworks or libraries required
- **LocalStorage**: Chats persist between sessions
- **Iframe Embedding**: Uses official embed URLs from each platform
- **Responsive Grid**: Automatically adjusts layout based on screen size

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: Some platforms may have embedding restrictions. For best results:
- For Twitch: Works best when served via localhost or a proper domain
- For YouTube: Requires the video to have chat enabled and be live/premiered
- For Kick: Should work with most public streams

## Hosting

To deploy this app:

### Option 1: GitHub Pages
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Access via `https://yourusername.github.io/multichats`

### Option 2: Netlify/Vercel
1. Drag and drop the folder to Netlify or Vercel
2. Get instant deployment

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

## Troubleshooting

**Chat not loading?**
- Ensure the stream is live (especially for YouTube)
- Check if the channel name is correct
- Some streams may have embedding disabled by the streamer

**Twitch chat blank?**
- Twitch requires the `parent` parameter to match your domain
- Works automatically on localhost and proper domains

**Can't add duplicate?**
- The app prevents adding the same chat twice
- This is intentional to avoid confusion

## Privacy & Data

- All data is stored locally in your browser
- No data is sent to external servers
- No tracking or analytics

## License

MIT License - Feel free to use and modify as needed!

## Credits

Created for streamers and viewers who want to monitor multiple chats at once.

---

Enjoy watching multiple streams! 🎉
