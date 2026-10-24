const {test} = require('node:test');
const assert = require('node:assert/strict');
const {parseStreamUrl: parse, restoreChat} = require('../chat-urls');

test('rejects lookalike hosts, credentials, non-web protocols, and markup', () => {
    for (const value of ['https://evil.test/twitch.tv/user', 'https://twitch.tv.evil.test/user',
        'https://twitch.tv@evil.test/user', 'javascript:twitch.tv/user', 'https://twitch.tv:444/user',
        'https://twitch.tv/<img src=x onerror=alert(1)>', 'https://twitch.tv/user/extra',
        'https://youtube.com/watch?v=bad', 'https://kick.com/<svg>', 'https://tiktok.com/@<script>']) {
        assert.equal(parse(value), null, value);
    }
});

test('normalizes channel identity and all supported Twitch forms', () => {
    for (const value of ['twitch.tv/TwitchDev', 'https://www.twitch.tv/popout/TwitchDev/chat', 'https://m.twitch.tv/twitchdev/']) {
        const chat = parse(value, 'preview.example');
        assert.equal(chat.channel, 'twitchdev');
        assert.equal(new URL(chat.embedUrl).searchParams.get('parent'), 'preview.example');
        assert.equal(chat.popoutUrl, 'https://www.twitch.tv/popout/twitchdev/chat');
    }
});

test('YouTube handles query order, mobile, studio, short and live URLs', () => {
    const id = 'Abc_123-XyZ';
    for (const value of [`https://youtube.com/watch?feature=share&v=${id}`, `https://m.youtube.com/watch?v=${id}`,
        `https://studio.youtube.com/live_chat?v=${id}`, `https://youtu.be/${id}?si=abc`, `https://youtube.com/live/${id}`]) {
        const chat = parse(value, 'localhost');
        assert.equal(chat.channel, id);
        assert.equal(new URL(chat.embedUrl).searchParams.get('embed_domain'), 'localhost');
        assert.ok(chat.popoutUrl);
    }
});

test('Kick and TikTok use explicit separate-page fallbacks', () => {
    for (const value of ['kick.com/Example/chatroom', 'tiktok.com/@Example/live']) {
        const chat = parse(value);
        assert.equal(chat.embedUrl, null);
        assert.ok(chat.popoutUrl.startsWith('https://'));
    }
});

test('legacy storage is rebuilt with current host and popup URLs', () => {
    const chat = restoreChat({platform: 'Twitch', channel: 'Example', embedUrl: 'javascript:alert(1)', color: 'bad'}, 'new.example');
    assert.equal(chat.channel, 'example');
    assert.ok(chat.embedUrl.includes('parent=new.example'));
    assert.ok(chat.popoutUrl);
    assert.equal(chat.color, '#9146FF');
    assert.equal(restoreChat({platform: 'Twitch', channel: 'user/extra'}, 'host'), null);
    assert.equal(restoreChat({platform: 'Unknown', channel: 'user'}, 'host'), null);
    assert.equal(restoreChat(null, 'host'), null);
});

test('YouTube theme is explicit for new and legacy chats', () => {
    const input = 'https://www.youtube.com/watch?v=3wGwyg-IvnQ';
    const fresh = parse(input, 'preview.example');
    const restored = restoreChat({platform: 'YouTube', channel: '3wGwyg-IvnQ', embedUrl: input}, 'preview.example');
    for (const chat of [fresh, restored]) {
        const url = new URL(chat.embedUrl);
        assert.equal(url.searchParams.get('dark_theme'), '1');
        assert.equal(url.searchParams.get('embed_domain'), 'preview.example');
    }
});
