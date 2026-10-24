// Parse identifiers only; never trust saved embed URLs or URL substrings.
function parseStreamUrl(input, hostname = 'localhost') {
    if (typeof input !== 'string' || input.length > 2048) return null;
    let url;
    try {
        const value = input.trim();
        url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    } catch { return null; }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.replace(/\/$/, '');
    let match;
    if (['twitch.tv', 'www.twitch.tv', 'm.twitch.tv'].includes(host)) {
        match = path.match(/^\/(?:popout\/|embed\/)?([a-zA-Z0-9_]{1,25})(?:\/chat)?$/);
        if (!match || ['directory', 'videos', 'downloads', 'settings', 'subscriptions'].includes(match[1].toLowerCase())) return null;
        const channel = match[1].toLowerCase();
        return {platform: 'Twitch', channel, color: '#9146FF',
            embedUrl: `https://www.twitch.tv/embed/${channel}/chat?parent=${encodeURIComponent(hostname)}`,
            popoutUrl: `https://www.twitch.tv/popout/${channel}/chat`};
    }
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'studio.youtube.com', 'youtu.be', 'www.youtu.be'].includes(host)) {
        let id;
        if (host.endsWith('youtu.be')) id = path.slice(1);
        else if (['/watch', '/live_chat'].includes(path)) id = url.searchParams.get('v');
        else id = path.match(/^\/(?:live|embed|v)\/([^/]+)$/)?.[1];
        if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
        return {platform: 'YouTube', channel: id, color: '#b91c1c',
            embedUrl: `https://www.youtube.com/live_chat?v=${id}&embed_domain=${encodeURIComponent(hostname)}`,
            popoutUrl: `https://www.youtube.com/live_chat?v=${id}`};
    }
    if (['kick.com', 'www.kick.com'].includes(host)) {
        match = path.match(/^\/([a-zA-Z0-9_-]{1,50})(?:\/chatroom)?$/);
        if (!match || ['categories', 'search', 'settings'].includes(match[1].toLowerCase())) return null;
        const channel = match[1].toLowerCase();
        return {platform: 'Kick', channel, color: '#236b0a', embedUrl: null,
            popoutUrl: `https://kick.com/${channel}/chatroom`};
    }
    if (['tiktok.com', 'www.tiktok.com', 'm.tiktok.com'].includes(host)) {
        match = path.match(/^\/@([a-zA-Z0-9_.]{1,24})(?:\/live)?$/);
        if (!match) return null;
        const channel = `@${match[1].toLowerCase()}`;
        return {platform: 'TikTok', channel, color: '#242424', embedUrl: null,
            popoutUrl: `https://www.tiktok.com/${channel}/live`};
    }
    return null;
}

function restoreChat(data, hostname) {
    if (!data || typeof data.channel !== 'string') return null;
    const bases = {Twitch: 'https://twitch.tv/', YouTube: 'https://youtu.be/', Kick: 'https://kick.com/', TikTok: 'https://tiktok.com/'};
    if (!bases[data.platform]) return null;
    const chat = parseStreamUrl(bases[data.platform] + data.channel, hostname);
    return chat?.platform === data.platform ? chat : null;
}
if (typeof module !== 'undefined') module.exports = {parseStreamUrl, restoreChat};
