// Chat management system
class MultiChats {
    constructor() {
        this.chats = [];
        this.chatIdCounter = 0;
        this.init();
    }

    init() {
        this.streamInput = document.getElementById('streamInput');
        this.addChatBtn = document.getElementById('addChatBtn');
        this.chatsContainer = document.getElementById('chatsContainer');
        this.settingsToggle = document.getElementById('settingsToggle');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettings = document.getElementById('closeSettings');

        this.addChatBtn.addEventListener('click', () => this.addChat());
        this.streamInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addChat();
            }
        });

        this.settingsToggle.addEventListener('click', () => this.toggleSettings());
        this.closeSettings.addEventListener('click', () => this.toggleSettings());

        // Feedback functionality
        this.feedbackText = document.getElementById('feedbackText');
        this.sendFeedbackBtn = document.getElementById('sendFeedbackBtn');
        this.feedbackStatus = document.getElementById('feedbackStatus');
        this.sendFeedbackBtn.addEventListener('click', () => this.sendFeedback());

        this.themeSelect = document.getElementById('chatTheme');
        this.theme = 'dark';
        try { if (localStorage.getItem('multiChatsTheme') === 'light') this.theme = 'light'; } catch {}
        document.documentElement.dataset.theme = this.theme;
        this.themeSelect.value = this.theme;
        this.themeSelect.addEventListener('change', () => this.setTheme(this.themeSelect.value));

        // Load saved chats from localStorage
        this.loadChats();
        this.setSettings(this.chats.length === 0);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.settingsPanel.classList.contains('open')) this.setSettings(false);
        });
    }

    setTheme(theme) {
        this.theme = theme === 'light' ? 'light' : 'dark';
        document.documentElement.dataset.theme = this.theme;
        this.themeSelect.value = this.theme;
        this.chats = this.chats.map(chat => ({...restoreChat(chat, window.location.hostname || 'localhost', this.theme), id: chat.id}));
        this.chatsContainer.replaceChildren();
        for (const chat of this.chats) this.renderChat(chat);
        if (!this.chats.length) this.showEmptyState();
        this.saveChats();
        try { localStorage.setItem('multiChatsTheme', this.theme); }
        catch { this.storageStatus.textContent = 'Theme applied for this session, but your browser could not save it.'; }
    }

    toggleSettings() {
        this.setSettings(!this.settingsPanel.classList.contains('open'));
    }

    setSettings(open) {
        this.settingsPanel.classList.toggle('open', open);
        this.settingsPanel.inert = !open;
        this.settingsToggle.setAttribute('aria-expanded', String(open));
        (open ? this.streamInput : this.settingsToggle).focus();
    }

    sendFeedback() {
        const feedback = this.feedbackText.value.trim();
        
        if (!feedback) {
            this.feedbackStatus.textContent = 'Please enter your feedback first.';
            this.feedbackStatus.className = 'feedback-status error';
            return;
        }

        // Google Form submission
        const formId = '1FAIpQLSehCZ3oYapk_N8FhYsnI6jNe0wao2p1VT24fzJhHcHg15NYBQ';
        const entryId = 'entry.1178338227';
        const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

        // Create form data
        const formData = new FormData();
        formData.append(entryId, feedback);

        // Submit using fetch with no-cors mode (Google Forms doesn't return proper CORS headers)
        this.sendFeedbackBtn.disabled = true;
        fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        }).then(() => {
            // An opaque response cannot confirm Google Forms accepted the submission.
            this.feedbackStatus.textContent = 'Feedback request sent. Delivery cannot be confirmed; your text has been kept.';
            this.feedbackStatus.className = 'feedback-status success';


        }).catch(() => {
            this.feedbackStatus.textContent = 'Failed to send. Please try again.';
            this.feedbackStatus.className = 'feedback-status error';
        }).finally(() => { this.sendFeedbackBtn.disabled = false; });
    }

    parseStreamUrl(url) {
        return parseStreamUrl(url, window.location.hostname || 'localhost', this.theme);
    }

    addChat() {
        const url = this.streamInput.value.trim();
        
        if (!url) {
            this.showError('Please enter a stream URL');
            return;
        }

        const chatData = this.parseStreamUrl(url);
        
        if (!chatData) {
            this.showError('Invalid URL. Enter a Twitch, YouTube, Kick, or TikTok stream/chat URL.');
            return;
        }

        // Check for duplicates
        const isDuplicate = this.chats.some(chat => 
            chat.platform === chatData.platform && chat.channel === chatData.channel
        );

        if (isDuplicate) {
            this.showError('This chat is already added');
            return;
        }

        const chatId = this.chatIdCounter++;
        const chat = {
            id: chatId,
            ...chatData
        };

        this.chats.push(chat);
        this.renderChat(chat);
        this.streamInput.value = '';
        this.hideEmptyState();
        this.saveChats();
        this.setSettings(false); // Close settings after adding
    }

    renderChat(chat) {
        const chatCard = document.createElement('div');
        chatCard.className = 'chat-card';
        chatCard.dataset.chatId = chat.id;

        const header = document.createElement('div');
        header.className = 'chat-header';
        header.style.background = chat.color;
        const info = document.createElement('div');
        info.className = 'chat-info';
        for (const [className, text] of [['chat-platform', chat.platform], ['chat-channel', chat.channel]]) {
            const label = document.createElement('div');
            label.className = className;
            label.textContent = text;
            info.appendChild(label);
        }
        const buttons = document.createElement('div');
        buttons.className = 'header-buttons';
        const popout = document.createElement('a');
        popout.className = 'btn-popout';
        popout.href = chat.popoutUrl;
        popout.target = '_blank';
        popout.rel = 'noopener noreferrer';
        popout.textContent = '⧉';
        popout.setAttribute('aria-label', `Open ${chat.platform} ${chat.channel} in a new tab`);
        const remove = document.createElement('button');
        remove.className = 'btn-remove';
        remove.textContent = '✕';
        remove.setAttribute('aria-label', `Remove ${chat.platform} ${chat.channel}`);
        remove.addEventListener('click', () => this.removeChat(chat.id));
        buttons.append(popout, remove);
        header.append(info, buttons);
        chatCard.appendChild(header);
        const content = document.createElement('div');
        content.className = 'chat-iframe-container';
        if (chat.platform === 'YouTube') content.classList.add('youtube-chat');
        if (chat.embedUrl) {
            const iframe = document.createElement('iframe');
            iframe.className = 'chat-iframe';
            iframe.src = chat.embedUrl;
            iframe.title = `${chat.platform} chat for ${chat.channel}`;
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-modals allow-storage-access-by-user-activation');
            content.appendChild(iframe);
        } else {
            const notice = document.createElement('p');
            notice.className = 'chat-notice';
            notice.textContent = `${chat.platform} chat is available in a separate tab. Use the open button above.`;
            content.appendChild(notice);
        }
        const fallback = document.createElement('a');
        fallback.className = 'chat-fallback';
        fallback.href = chat.popoutUrl;
        fallback.target = '_blank';
        fallback.rel = 'noopener noreferrer';
        fallback.textContent = `Open on ${chat.platform} if chat is unavailable`;
        chatCard.append(content, fallback);

        this.chatsContainer.appendChild(chatCard);
    }

    removeChat(chatId) {
        // Remove from array
        this.chats = this.chats.filter(chat => chat.id !== chatId);
        
        // Remove from DOM
        const chatCard = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (chatCard) {
            chatCard.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                chatCard.remove();
                if (this.chats.length === 0) {
                    this.showEmptyState();
                }
            }, 300);
        }

        this.saveChats();
    }

    hideEmptyState() {
        const emptyState = this.chatsContainer.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }

    showEmptyState() {
        this.chatsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <h2>No chats added yet</h2>
                <p>Open Settings to add your first livestream chat URL</p>
            </div>
        `;
    }

    showError(message) {
        // Create error message if it doesn't exist
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            const inputGroup = document.querySelector('.input-group');
            inputGroup.parentNode.insertBefore(errorDiv, inputGroup.nextSibling);
        }

        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        // Hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }

    saveChats() {
        try {
            localStorage.setItem('multiChats', JSON.stringify(this.chats.map(({platform, channel, embedUrl, popoutUrl, color}) => ({platform, channel, embedUrl, popoutUrl, color, needsPopout: true}))));
        } catch {
            this.storageStatus.textContent = 'Chats work for this session, but your browser could not save them.';
        }
    }

    loadChats() {
        this.storageStatus = document.getElementById('storageStatus');
        try {
            const saved = localStorage.getItem('multiChats');
            if (!saved) return;
            const entries = JSON.parse(saved);
            if (!Array.isArray(entries)) throw new Error('Invalid saved chats');
            let skipped = 0;
            for (const entry of entries) {
                const data = restoreChat(entry, window.location.hostname || 'localhost', this.theme);
                if (!data) { skipped++; continue; }
                if (this.chats.some(chat => chat.platform === data.platform && chat.channel === data.channel)) continue;
                const chat = {id: this.chatIdCounter++, ...data};
                this.chats.push(chat);
                this.renderChat(chat);
            }
            if (this.chats.length) this.hideEmptyState();
            if (skipped) this.storageStatus.textContent = 'Some invalid saved chats were skipped. You can add them again.';
        } catch {
            this.storageStatus.textContent = 'Saved chats could not be loaded. You can add chats for this session.';
        }
    }

}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
const multiChats = new MultiChats();
