const {test} = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const {restoreChat} = require('../chat-urls');
const source = fs.readFileSync(require.resolve('../app.js'), 'utf8').split('// Add slideOut animation')[0];
function setup(saved, fail = false) {
    const status = {textContent: ''};
    let written;
    const context = vm.createContext({restoreChat, window: {location: {hostname: 'preview.example'}},
        document: {getElementById: () => status},
        localStorage: {getItem() { if (fail) throw Error('denied'); return saved; },
            setItem(key, value) { if (fail) throw Error('quota'); written = JSON.parse(value); }}});
    vm.runInContext(source + '\nthis.App = MultiChats;', context);
    const app = Object.create(context.App.prototype);
    Object.assign(app, {chats: [], chatIdCounter: 0, renderChat() {}, hideEmptyState() {}});
    return {app, status, written: () => written};
}
test('corrupt and unavailable storage does not prevent app use', () => {
    for (const [saved, fail] of [['{bad', false], ['{}', false], [null, true]]) {
        const {app, status} = setup(saved, fail);
        assert.doesNotThrow(() => app.loadChats());
        assert.match(status.textContent, /could not be loaded/);
        assert.equal(app.chats.length, 0);
    }
});
test('legacy reload skips malformed records and duplicates while restoring open links', () => {
    const {app, status} = setup(JSON.stringify([{platform: 'Twitch', channel: 'Example', embedUrl: 'https://old.example'},
        {platform: 'Twitch', channel: 'example'}, {platform: 'YouTube', channel: '<script>'}, null]));
    app.loadChats();
    assert.equal(app.chats.length, 1);
    assert.ok(app.chats[0].embedUrl.includes('parent=preview.example'));
    assert.ok(app.chats[0].popoutUrl);
    assert.match(status.textContent, /skipped/);
});
test('saving preserves rollback fields and handles quota failures without throwing', () => {
    const good = setup(null);
    good.app.loadChats();
    good.app.chats = [restoreChat({platform: 'Twitch', channel: 'example'}, 'preview.example')];
    good.app.saveChats();
    assert.ok(good.written()[0].embedUrl);
    assert.ok(good.written()[0].popoutUrl);
    const denied = setup(null, true);
    denied.app.loadChats();
    assert.doesNotThrow(() => denied.app.saveChats());
    assert.match(denied.status.textContent, /could not save/);
});

test('switching theme rebuilds existing chats, preserves IDs and saves preference', () => {
    const values = new Map();
    const root = {dataset: {}};
    const context = vm.createContext({restoreChat, window: {location: {hostname: 'preview.example'}},
        document: {documentElement: root}, localStorage: {setItem: (key, value) => values.set(key, value)}});
    vm.runInContext(source + '\nthis.App = MultiChats;', context);
    const app = Object.create(context.App.prototype);
    const rendered = [];
    Object.assign(app, {themeSelect: {}, chatsContainer: {replaceChildren() {rendered.length = 0;}},
        storageStatus: {textContent: ''}, renderChat(chat) {rendered.push(chat);},
        chats: [{id: 4, platform: 'Twitch', channel: 'example'}, {id: 7, platform: 'YouTube', channel: '3wGwyg-IvnQ'}]});
    for (const theme of ['light', 'dark', 'light']) {
        app.setTheme(theme);
        assert.equal(root.dataset.theme, theme);
        assert.equal(app.themeSelect.value, theme);
        assert.equal(values.get('multiChatsTheme'), theme);
        assert.deepEqual(Array.from(app.chats, chat => chat.id), [4, 7]);
        assert.equal(rendered.length, 2);
        assert.equal(new URL(app.chats[1].embedUrl).searchParams.get('dark_theme'), theme === 'dark' ? '1' : '0');
        assert.equal(JSON.parse(values.get('multiChats')).length, 2);
    }
});
