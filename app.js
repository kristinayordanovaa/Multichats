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

        // Load saved chats from localStorage
        this.loadChats();
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('open');
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
        fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        }).then(() => {
            // Show success message (we can't check response due to no-cors)
            this.feedbackStatus.textContent = '✓ Thank you for your feedback!';
            this.feedbackStatus.className = 'feedback-status success';
            this.feedbackText.value = '';

            // Hide status after 3 seconds
            setTimeout(() => {
                this.feedbackStatus.className = 'feedback-status';
            }, 3000);
        }).catch(() => {
            this.feedbackStatus.textContent = 'Failed to send. Please try again.';
            this.feedbackStatus.className = 'feedback-status error';
        });
    }

    parseStreamUrl(url) {
        url = url.trim();
        
        // Remove protocol if present
        url = url.replace(/^(https?:\/\/)?(www\.)?/, '');

        // Twitch
        if (url.includes('twitch.tv')) {
            const twitchMatch = url.match(/twitch\.tv\/(?:popout\/)?([^\/\?]+)(?:\/chat)?/);
            if (twitchMatch) {
                const channel = twitchMatch[1];
                // Use Twitch's embed chat with parent parameter
                const hostname = window.location.hostname || 'localhost';
                return {
                    platform: 'Twitch',
                    channel: channel,
                    embedUrl: `https://www.twitch.tv/embed/${channel}/chat?parent=${hostname}`,
                    popoutUrl: `https://www.twitch.tv/popout/${channel}/chat`,
                    color: '#9146FF',
                    needsPopout: true  // Flag to indicate this might need popup
                };
            }
        }

        // YouTube
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = null;
            
            // Extract from various YouTube URL formats
            const patterns = [
                /youtube\.com\/watch\?v=([^&]+)/,
                /youtube\.com\/live\/([^?&]+)/,
                /youtube\.com\/embed\/([^?&]+)/,
                /youtube\.com\/v\/([^?&]+)/,
                /youtu\.be\/([^?&]+)/,
                /youtube\.com\/live_chat\?.*v=([^&]+)/,
                /studio\.youtube\.com\/live_chat\?.*v=([^&]+)/  // Studio URL
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                    videoId = match[1];
                    break;
                }
            }

            if (videoId) {
                return {
                    platform: 'YouTube',
                    channel: videoId,
                    embedUrl: `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname || 'localhost'}`,
                    color: '#FF0000'
                };
            }
        }

        // Kick
        if (url.includes('kick.com')) {
            const kickMatch = url.match(/kick\.com\/([^\/\?]+)/);
            if (kickMatch) {
                const channel = kickMatch[1];
                return {
                    platform: 'Kick',
                    channel: channel,
                    embedUrl: `https://kick.com/${channel}/chatroom`,
                    color: '#53FC18'
                };
            }
        }

        // TikTok
        if (url.includes('tiktok.com')) {
            const tiktokMatch = url.match(/tiktok\.com\/@([^\/\?]+)(?:\/live)?/);
            if (tiktokMatch) {
                const username = tiktokMatch[1];
                return {
                    platform: 'TikTok',
                    channel: `@${username}`,
                    embedUrl: `https://www.tiktok.com/embed/@${username}/live`,
                    popoutUrl: `https://www.tiktok.com/@${username}/live`,
                    color: '#000000',
                    needsPopout: true
                };
            }
        }

        return null;
    }

    addChat() {
        const url = this.streamInput.value.trim();
        
        if (!url) {
            this.showError('Please enter a stream URL');
            return;
        }

        const chatData = this.parseStreamUrl(url);
        
        if (!chatData) {
            this.showError('Invalid URL. Please enter a valid Twitch, YouTube, or Kick stream URL');
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
        this.toggleSettings(); // Close settings after adding
    }

    renderChat(chat) {
        const chatCard = document.createElement('div');
        chatCard.className = 'chat-card';
        chatCard.dataset.chatId = chat.id;

        // If platform needs popout, add a popup button
        const popoutButton = chat.needsPopout ? 
            `<button class="btn-popout" onclick="multiChats.openPopout(${chat.id})" title="Open in popup window">⧉</button>` : '';

        chatCard.innerHTML = `
            <div class="chat-header" style="background: ${chat.color}">
                <div class="chat-info">
                    <div class="chat-platform">${chat.platform}</div>
                    <div class="chat-channel">${chat.channel}</div>
                </div>
                <div class="header-buttons">
                    ${popoutButton}
                    <button class="btn-remove" onclick="multiChats.removeChat(${chat.id})">✕</button>
                </div>
            </div>
            <div class="chat-iframe-container">
                <iframe 
                    class="chat-iframe" 
                    src="${chat.embedUrl}"
                    allow="autoplay; encrypted-media; clipboard-write"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-modals"
                ></iframe>
            </div>
        `;

        this.chatsContainer.appendChild(chatCard);
    }

    openPopout(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat && chat.popoutUrl) {
            window.open(chat.popoutUrl, `chat-${chatId}`, 'width=400,height=600,menubar=no,toolbar=no,location=no');
        }
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
                <p>Add your first livestream chat URL above to get started</p>
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

        errorDiv.textContent = message;
        errorDiv.classList.add('show');

        // Hide after 5 seconds
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }

    saveChats() {
        const chatsToSave = this.chats.map(chat => ({
            platform: chat.platform,
            channel: chat.channel,
            embedUrl: chat.embedUrl,
            color: chat.color
        }));
        localStorage.setItem('multiChats', JSON.stringify(chatsToSave));
    }

    loadChats() {
        const saved = localStorage.getItem('multiChats');
        if (saved) {
            try {
                const savedChats = JSON.parse(saved);
                savedChats.forEach(chatData => {
                    const chatId = this.chatIdCounter++;
                    const chat = {
                        id: chatId,
                        ...chatData
                    };
                    this.chats.push(chat);
                    this.renderChat(chat);
                });
                
                if (this.chats.length > 0) {
                    this.hideEmptyState();
                }
            } catch (e) {
                console.error('Failed to load saved chats:', e);
            }
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
