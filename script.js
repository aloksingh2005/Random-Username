/**
 * GenPass Pro - Advanced Username & Password Generator
 * Enhanced version with premium features and professional UX
 */

class GenPassPro {
    constructor() {
        this.initializeApp();
        this.bindEvents();
        this.loadSettings();
        this.setupTheme();
    }

    // ===== INITIALIZATION =====
    initializeApp() {
        this.results = [];
        this.history = this.loadFromStorage('history') || [];
        this.favorites = this.loadFromStorage('favorites') || [];
        this.settings = this.loadFromStorage('settings') || this.getDefaultSettings();
        this.totalGenerated = this.loadFromStorage('totalGenerated') || 0;
        this.selectedItems = new Set();

        // Update stats display
        this.updateStats();

        // Username generation data
        this.usernameData = this.initializeUsernameData();

        // Password generation data
        this.passwordChars = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            similar: '0O1lI',
            ambiguous: '{}[]()/\\\'"`~,;.<>'
        };
    }

    initializeUsernameData() {
        return {
            professional: {
                prefixes: ['admin', 'manager', 'director', 'lead', 'senior', 'chief', 'head'],
                words: ['tech', 'pro', 'expert', 'ace', 'master', 'elite', 'prime', 'core', 'max'],
                suffixes: ['2025', 'pro', 'tech', 'admin', 'lead', 'expert', 'ace']
            },
            gamer: {
                prefixes: ['Shadow', 'Dark', 'Fire', 'Ice', 'Storm', 'Night', 'Blood', 'Death', 'Cyber'],
                words: ['Hunter', 'Killer', 'Master', 'Lord', 'King', 'Slayer', 'Warrior', 'Ninja', 'Phantom'],
                suffixes: ['X', 'XX', 'XXX', '2025', '99', '77', '88', 'Pro', 'Elite']
            },
            creative: {
                prefixes: ['Artisan', 'Creator', 'Dreamer', 'Visionary', 'Mystic', 'Cosmic', 'Luna', 'Stellar'],
                words: ['Paint', 'Canvas', 'Brush', 'Color', 'Design', 'Art', 'Create', 'Dream', 'Vision'],
                suffixes: ['Studio', 'Art', 'Create', 'Design', 'Vision', 'Dream', 'Color']
            },
            tech: {
                prefixes: ['Code', 'Dev', 'Tech', 'Cyber', 'Digital', 'Quantum', 'Neural', 'Binary'],
                words: ['Ninja', 'Wizard', 'Master', 'Guru', 'Expert', 'Hacker', 'Coder', 'Developer'],
                suffixes: ['Dev', 'Code', 'Tech', '2025', 'Pro', 'X', 'Labs', 'Hub']
            },
            fantasy: {
                prefixes: ['Dragon', 'Phoenix', 'Unicorn', 'Griffin', 'Fairy', 'Elf', 'Dwarf', 'Mage'],
                words: ['Fire', 'Magic', 'Crystal', 'Moon', 'Star', 'Light', 'Shadow', 'Wind'],
                suffixes: ['Born', 'Heart', 'Soul', 'Wing', 'Fire', 'Light', 'Magic', 'Crystal']
            },
            cool: {
                prefixes: ['Cool', 'Ice', 'Frost', 'Snow', 'Chill', 'Frozen', 'Arctic', 'Winter'],
                words: ['Vibe', 'Wave', 'Flow', 'Style', 'Mode', 'Zone', 'Feel', 'Beat'],
                suffixes: ['Vibes', 'Wave', 'Flow', 'Style', 'Zone', 'Cool', 'Ice', 'Chill']
            },
            cute: {
                prefixes: ['Sweet', 'Cute', 'Lovely', 'Pretty', 'Sunny', 'Happy', 'Jolly', 'Merry'],
                words: ['Panda', 'Kitten', 'Puppy', 'Bunny', 'Bear', 'Fox', 'Owl', 'Deer'],
                suffixes: ['Love', 'Heart', 'Sweet', 'Cute', 'Joy', 'Happy', 'Smile', 'Hug']
            },
            random: {
                prefixes: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Prime', 'Ultra', 'Super'],
                words: ['Force', 'Power', 'Energy', 'Boost', 'Charge', 'Spark', 'Flash', 'Bolt'],
                suffixes: ['X', 'Pro', 'Max', 'Plus', 'Ultra', 'Super', '2025', 'Elite']
            }
        };
    }

    getDefaultSettings() {
        return {
            theme: 'light',
            animations: true,
            notifications: true,
            autoSave: true,
            maxHistory: 50,
            defaultUsernameLength: 8,
            defaultPasswordLength: 12
        };
    }

    // ===== EVENT BINDING =====
    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Help modal
        document.getElementById('helpBtn').addEventListener('click', () => this.showModal('helpModal'));

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => this.generateCredentials());

        // Range inputs
        this.bindRangeInputs();

        // Toggle switches
        this.bindToggleSwitches();

        // Action buttons
        this.bindActionButtons();

        // Footer buttons
        this.bindFooterButtons();

        // Modal events
        this.bindModalEvents();

        // Keyboard shortcuts
        this.bindKeyboardShortcuts();

        // Auto-save settings
        this.bindSettingsAutoSave();
    }

    bindRangeInputs() {
        const rangeInputs = [
            { input: 'usernameLength', display: 'usernameLengthValue' },
            { input: 'passwordLength', display: 'passwordLengthValue' }
        ];

        rangeInputs.forEach(({ input, display }) => {
            const element = document.getElementById(input);
            const displayElement = document.getElementById(display);

            element.addEventListener('input', (e) => {
                displayElement.textContent = e.target.value;
            });
        });
    }

    bindToggleSwitches() {
        const toggles = ['usernameEnabled', 'passwordEnabled'];

        toggles.forEach(toggleId => {
            document.getElementById(toggleId).addEventListener('change', (e) => {
                const card = e.target.closest('.generator-card');
                const content = card.querySelector('.card-content');

                if (e.target.checked) {
                    content.style.opacity = '1';
                    content.style.pointerEvents = 'auto';
                } else {
                    content.style.opacity = '0.5';
                    content.style.pointerEvents = 'none';
                }
            });
        });
    }

    bindActionButtons() {
        // Results actions
        document.getElementById('selectAllBtn')?.addEventListener('click', () => this.selectAllResults());
        document.getElementById('copyAllBtn')?.addEventListener('click', () => this.copyAllResults());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.showModal('exportModal'));
        document.getElementById('clearAllBtn')?.addEventListener('click', () => this.clearAllResults());

        // History actions
        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => this.clearHistory());

        // Favorites actions
        document.getElementById('clearFavoritesBtn')?.addEventListener('click', () => this.clearFavorites());
    }

    bindFooterButtons() {
        document.getElementById('aboutBtn')?.addEventListener('click', () => this.showAbout());
        document.getElementById('privacyBtn')?.addEventListener('click', () => this.showPrivacy());
        document.getElementById('historyToggle')?.addEventListener('click', () => this.toggleHistory());
        document.getElementById('favoritesToggle')?.addEventListener('click', () => this.toggleFavorites());
    }

    bindModalEvents() {
        // Close modals
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.hideModal(e.target.closest('.modal').id);
            });
        });

        // Close modals on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Export options
        document.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.exportResults(format);
                this.hideModal('exportModal');
            });
        });
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter - Generate
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.generateCredentials();
            }

            // Escape - Close modals
            if (e.key === 'Escape') {
                this.hideAllModals();
            }

            // Ctrl/Cmd + A - Select all results
            if ((e.ctrlKey || e.metaKey) && e.key === 'a' && this.results.length > 0) {
                e.preventDefault();
                this.selectAllResults();
            }

            // Ctrl/Cmd + C - Copy selected
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && this.selectedItems.size > 0) {
                e.preventDefault();
                this.copySelectedResults();
            }
        });
    }

    bindSettingsAutoSave() {
        // Auto-save settings when form elements change
        const settingsElements = [
            'usernameLength', 'usernameStyle', 'usernamePrefix', 'usernameSuffix', 'usernameCount',
            'passwordLength', 'includeUppercase', 'includeLowercase', 'includeNumbers',
            'includeSymbols', 'excludeSimilar', 'excludeAmbiguous'
        ];

        settingsElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('change', () => {
                    if (this.settings.autoSave) {
                        this.saveSettings();
                    }
                });
            }
        });
    }

    // ===== CORE GENERATION FUNCTIONS =====
    generateCredentials() {
        this.showLoading();

        // Small delay for better UX
        setTimeout(() => {
            const usernameEnabled = document.getElementById('usernameEnabled').checked;
            const passwordEnabled = document.getElementById('passwordEnabled').checked;

            if (!usernameEnabled && !passwordEnabled) {
                this.showToast('Please enable at least one generator', 'warning');
                this.hideLoading();
                return;
            }

            const count = parseInt(document.getElementById('usernameCount').value);
            const newResults = [];

            for (let i = 0; i < count; i++) {
                const result = {
                    id: this.generateId(),
                    timestamp: new Date().toISOString(),
                    username: usernameEnabled ? this.generateUsername() : null,
                    password: passwordEnabled ? this.generatePassword() : null,
                    favorite: false,
                    selected: false
                };

                newResults.push(result);
            }

            this.results = newResults;
            this.totalGenerated += count;

            // Add to history
            this.addToHistory({
                timestamp: new Date().toISOString(),
                count: count,
                usernameEnabled,
                passwordEnabled,
                results: newResults
            });

            this.displayResults();
            this.updateStats();
            this.saveToStorage('totalGenerated', this.totalGenerated);
            this.hideLoading();

            this.showToast(`Generated ${count} credential${count > 1 ? 's' : ''}`, 'success');

            // Scroll to results
            document.getElementById('resultsSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 500);
    }

    generateUsername() {
        const length = parseInt(document.getElementById('usernameLength').value);
        const style = document.getElementById('usernameStyle').value;
        const prefix = document.getElementById('usernamePrefix').value.trim();
        const suffix = document.getElementById('usernameSuffix').value.trim();

        const data = this.usernameData[style] || this.usernameData.random;

        let username = '';

        // Add custom prefix
        if (prefix) {
            username += prefix;
        }

        // Generate core username
        const remainingLength = length - username.length - (suffix ? suffix.length : 0);

        if (remainingLength > 0) {
            const coreUsername = this.generateCoreUsername(data, remainingLength);
            username += coreUsername;
        }

        // Add custom suffix
        if (suffix && username.length + suffix.length <= length) {
            username += suffix;
        }

        // Ensure we don't exceed length
        if (username.length > length) {
            username = username.substring(0, length);
        }

        // Ensure minimum length
        while (username.length < Math.min(length, 4)) {
            username += this.getRandomNumber(0, 9);
        }

        return username;
    }

    generateCoreUsername(data, maxLength) {
        const patterns = [
            () => this.getRandomFromArray(data.prefixes) + this.getRandomFromArray(data.words),
            () => this.getRandomFromArray(data.words) + this.getRandomFromArray(data.suffixes),
            () => this.getRandomFromArray(data.prefixes) + this.getRandomNumber(10, 99),
            () => this.getRandomFromArray(data.words) + this.getRandomNumber(100, 999),
            () => this.getRandomFromArray(data.prefixes) + this.getRandomFromArray(data.words).substring(0, 3),
        ];

        const pattern = this.getRandomFromArray(patterns);
        let result = pattern();

        // Truncate if too long
        if (result.length > maxLength) {
            result = result.substring(0, maxLength);
        }

        return result;
    }

    generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;
        const excludeSimilar = document.getElementById('excludeSimilar').checked;
        const excludeAmbiguous = document.getElementById('excludeAmbiguous').checked;

        let charset = '';

        if (includeUppercase) charset += this.passwordChars.uppercase;
        if (includeLowercase) charset += this.passwordChars.lowercase;
        if (includeNumbers) charset += this.passwordChars.numbers;
        if (includeSymbols) charset += this.passwordChars.symbols;

        if (!charset) {
            this.showToast('Please select at least one character type for passwords', 'warning');
            return null;
        }

        // Remove similar/ambiguous characters if requested
        if (excludeSimilar) {
            charset = this.removeChars(charset, this.passwordChars.similar);
        }
        if (excludeAmbiguous) {
            charset = this.removeChars(charset, this.passwordChars.ambiguous);
        }

        let password = '';

        // Ensure at least one character from each selected type
        if (includeUppercase) password += this.getRandomFromString(this.passwordChars.uppercase);
        if (includeLowercase) password += this.getRandomFromString(this.passwordChars.lowercase);
        if (includeNumbers) password += this.getRandomFromString(this.passwordChars.numbers);
        if (includeSymbols) password += this.getRandomFromString(this.passwordChars.symbols);

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += this.getRandomFromString(charset);
        }

        // Shuffle the password
        return this.shuffleString(password);
    }

    // ===== PASSWORD STRENGTH CALCULATION =====
    calculatePasswordStrength(password) {
        if (!password) return { score: 0, label: 'No Password', class: '' };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            longLength: password.length >= 12,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password),
            variety: new Set(password).size >= password.length * 0.7
        };

        // Score calculation
        if (checks.length) score += 1;
        if (checks.longLength) score += 1;
        if (checks.uppercase) score += 1;
        if (checks.lowercase) score += 1;
        if (checks.numbers) score += 1;
        if (checks.symbols) score += 1;
        if (checks.variety) score += 1;

        // Length bonus
        if (password.length >= 16) score += 1;
        if (password.length >= 20) score += 1;

        // Determine strength level
        if (score <= 3) return { score, label: 'Weak', class: 'strength-weak' };
        if (score <= 5) return { score, label: 'Medium', class: 'strength-medium' };
        if (score <= 7) return { score, label: 'Strong', class: 'strength-strong' };
        return { score, label: 'Very Strong', class: 'strength-very-strong' };
    }

    // ===== DISPLAY FUNCTIONS =====
    displayResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsGrid = document.getElementById('resultsGrid');

        if (this.results.length === 0) {
            resultsSection.style.display = 'none';
            return;
        }

        resultsSection.style.display = 'block';
        resultsGrid.innerHTML = '';

        this.results.forEach((result, index) => {
            const resultElement = this.createResultElement(result, index);
            resultsGrid.appendChild(resultElement);
        });
    }

    createResultElement(result, index) {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.style.animationDelay = `${index * 0.1}s`;

        const hasUsername = result.username !== null;
        const hasPassword = result.password !== null;

        div.innerHTML = `
            <div class="result-header">
                <div class="result-meta">
                    <span><i class="fas fa-hashtag"></i> ${index + 1}</span>
                    <span><i class="fas fa-clock"></i> ${this.formatTime(result.timestamp)}</span>
                </div>
                <div class="result-actions">
                    <button class="select-btn ${result.selected ? 'active' : ''}" 
                            onclick="genPass.toggleSelection('${result.id}')" 
                            title="Select">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="favorite-btn ${result.favorite ? 'active' : ''}" 
                            onclick="genPass.toggleFavorite('${result.id}')" 
                            title="Add to Favorites">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
            <div class="result-content">
                ${hasUsername ? this.createCredentialItem('Username', result.username, result.id + '_username') : ''}
                ${hasPassword ? this.createCredentialItem('Password', result.password, result.id + '_password', true) : ''}
            </div>
        `;

        return div;
    }

    createCredentialItem(label, value, id, isPassword = false) {
        const strengthInfo = isPassword ? this.calculatePasswordStrength(value) : null;

        return `
            <div class="credential-item">
                <span class="credential-label">${label}:</span>
                <div class="credential-value" id="${id}">${value}</div>
                <div class="credential-actions">
                    <button class="copy-btn" onclick="genPass.copyToClipboard('${id}')" title="Copy">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
                ${strengthInfo ? `
                    <div class="password-strength">
                        <div class="strength-label">${strengthInfo.label} (${strengthInfo.score}/9)</div>
                        <div class="strength-bar">
                            <div class="strength-fill ${strengthInfo.class}" 
                                 style="width: ${(strengthInfo.score / 9) * 100}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ===== INTERACTION FUNCTIONS =====
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const text = element.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Copied to clipboard!', 'success');
                this.animateElement(element, 'pulse');
            }).catch(() => {
                this.fallbackCopy(text, element);
            });
        } else {
            this.fallbackCopy(text, element);
        }
    }

    fallbackCopy(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast('Copied to clipboard!', 'success');
            this.animateElement(element, 'pulse');
        } catch (err) {
            this.showToast('Failed to copy', 'error');
        }

        document.body.removeChild(textArea);
    }

    toggleSelection(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (!result) return;

        result.selected = !result.selected;

        if (result.selected) {
            this.selectedItems.add(resultId);
        } else {
            this.selectedItems.delete(resultId);
        }

        this.displayResults();
    }

    toggleFavorite(resultId) {
        const result = this.results.find(r => r.id === resultId);
        if (!result) return;

        result.favorite = !result.favorite;

        if (result.favorite) {
            this.favorites.push({
                id: result.id,
                timestamp: result.timestamp,
                username: result.username,
                password: result.password
            });
            this.showToast('Added to favorites!', 'success');
        } else {
            this.favorites = this.favorites.filter(f => f.id !== result.id);
            this.showToast('Removed from favorites', 'info');
        }

        this.saveToStorage('favorites', this.favorites);
        this.updateStats();
        this.displayResults();
        this.displayFavorites();
    }

    // ===== BULK OPERATIONS =====
    selectAllResults() {
        this.results.forEach(result => {
            result.selected = true;
            this.selectedItems.add(result.id);
        });
        this.displayResults();
        this.showToast(`Selected ${this.results.length} items`, 'info');
    }

    copyAllResults() {
        if (this.results.length === 0) {
            this.showToast('No results to copy', 'warning');
            return;
        }

        const text = this.results.map(result => {
            let line = '';
            if (result.username) line += `Username: ${result.username}`;
            if (result.password) line += `${line ? ' | ' : ''}Password: ${result.password}`;
            return line;
        }).join('\n');

        this.copyTextToClipboard(text, `Copied ${this.results.length} credentials`);
    }

    copySelectedResults() {
        const selected = this.results.filter(r => r.selected);
        if (selected.length === 0) {
            this.showToast('No items selected', 'warning');
            return;
        }

        const text = selected.map(result => {
            let line = '';
            if (result.username) line += `Username: ${result.username}`;
            if (result.password) line += `${line ? ' | ' : ''}Password: ${result.password}`;
            return line;
        }).join('\n');

        this.copyTextToClipboard(text, `Copied ${selected.length} selected items`);
    }

    copyTextToClipboard(text, successMessage) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast(successMessage, 'success');
            });
        } else {
            this.fallbackCopyText(text, successMessage);
        }
    }

    fallbackCopyText(text, successMessage) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast(successMessage, 'success');
        } catch (err) {
            this.showToast('Failed to copy', 'error');
        }

        document.body.removeChild(textArea);
    }

    clearAllResults() {
        if (this.results.length === 0) return;

        if (confirm('Are you sure you want to clear all results?')) {
            this.results = [];
            this.selectedItems.clear();
            document.getElementById('resultsSection').style.display = 'none';
            this.showToast('Results cleared', 'info');
        }
    }

    // ===== EXPORT FUNCTIONS =====
    exportResults(format) {
        if (this.results.length === 0) {
            this.showToast('No results to export', 'warning');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        let filename = `genpass-export-${timestamp}`;
        let content = '';
        let mimeType = '';

        switch (format) {
            case 'txt':
                filename += '.txt';
                content = this.exportToText();
                mimeType = 'text/plain';
                break;
            case 'csv':
                filename += '.csv';
                content = this.exportToCsv();
                mimeType = 'text/csv';
                break;
            case 'json':
                filename += '.json';
                content = this.exportToJson();
                mimeType = 'application/json';
                break;
        }

        this.downloadFile(content, filename, mimeType);
        this.showToast(`Exported ${this.results.length} results as ${format.toUpperCase()}`, 'success');
    }

    exportToText() {
        let content = `GenPass Pro Export\n`;
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Results: ${this.results.length}\n\n`;
        content += '='.repeat(50) + '\n\n';

        this.results.forEach((result, index) => {
            content += `#${index + 1} - ${this.formatTime(result.timestamp)}\n`;
            if (result.username) content += `Username: ${result.username}\n`;
            if (result.password) {
                const strength = this.calculatePasswordStrength(result.password);
                content += `Password: ${result.password} (${strength.label})\n`;
            }
            content += '\n';
        });

        return content;
    }

    exportToCsv() {
        let content = 'Index,Timestamp,Username,Password,Password Strength\n';

        this.results.forEach((result, index) => {
            const strength = result.password ? this.calculatePasswordStrength(result.password).label : '';
            const username = result.username || '';
            const password = result.password || '';

            content += `${index + 1},"${result.timestamp}","${username}","${password}","${strength}"\n`;
        });

        return content;
    }

    exportToJson() {
        const exportData = {
            metadata: {
                generator: 'GenPass Pro',
                version: '1.0',
                exported: new Date().toISOString(),
                totalResults: this.results.length
            },
            results: this.results.map((result, index) => ({
                index: index + 1,
                id: result.id,
                timestamp: result.timestamp,
                username: result.username,
                password: result.password,
                passwordStrength: result.password ? this.calculatePasswordStrength(result.password) : null,
                favorite: result.favorite
            }))
        };

        return JSON.stringify(exportData, null, 2);
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // ===== HISTORY & FAVORITES =====
    addToHistory(entry) {
        this.history.unshift(entry);

        // Limit history size
        if (this.history.length > this.settings.maxHistory) {
            this.history = this.history.slice(0, this.settings.maxHistory);
        }

        this.saveToStorage('history', this.history);
        this.displayHistory();
    }

    displayHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-state">No generation history yet.</p>';
            return;
        }

        historyList.innerHTML = this.history.map((entry, index) => `
            <div class="history-item" style="animation-delay: ${index * 0.1}s">
                <div class="item-header">
                    <span>Generated ${entry.count} credential${entry.count > 1 ? 's' : ''}</span>
                    <span class="item-timestamp">${this.formatTime(entry.timestamp)}</span>
                </div>
                <div class="item-content">
                    ${entry.usernameEnabled ? '👤 Username' : ''} 
                    ${entry.passwordEnabled ? '🔒 Password' : ''}
                </div>
            </div>
        `).join('');
    }

    displayFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;

        if (this.favorites.length === 0) {
            favoritesList.innerHTML = '<p class="empty-state">No favorites saved yet.</p>';
            return;
        }

        favoritesList.innerHTML = this.favorites.map((favorite, index) => `
            <div class="favorite-item" style="animation-delay: ${index * 0.1}s">
                <div class="item-header">
                    <span>Favorite Credential</span>
                    <div>
                        <span class="item-timestamp">${this.formatTime(favorite.timestamp)}</span>
                        <button class="action-btn" onclick="genPass.removeFavorite('${favorite.id}')" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="item-content">
                    ${favorite.username ? `Username: ${favorite.username}<br>` : ''}
                    ${favorite.password ? `Password: ${favorite.password}` : ''}
                </div>
            </div>
        `).join('');
    }

    toggleHistory() {
        const section = document.getElementById('historySection');
        const button = document.getElementById('historyToggle');

        if (section.style.display === 'none' || !section.style.display) {
            section.style.display = 'block';
            button.textContent = 'Hide History';
            this.displayHistory();
        } else {
            section.style.display = 'none';
            button.textContent = 'History';
        }
    }

    toggleFavorites() {
        const section = document.getElementById('favoritesSection');
        const button = document.getElementById('favoritesToggle');

        if (section.style.display === 'none' || !section.style.display) {
            section.style.display = 'block';
            button.textContent = 'Hide Favorites';
            this.displayFavorites();
        } else {
            section.style.display = 'none';
            button.textContent = 'Favorites';
        }
    }

    clearHistory() {
        if (this.history.length === 0) return;

        if (confirm('Are you sure you want to clear all history?')) {
            this.history = [];
            this.saveToStorage('history', this.history);
            this.displayHistory();
            this.showToast('History cleared', 'info');
        }
    }

    clearFavorites() {
        if (this.favorites.length === 0) return;

        if (confirm('Are you sure you want to clear all favorites?')) {
            this.favorites = [];
            this.saveToStorage('favorites', this.favorites);
            this.displayFavorites();
            this.updateStats();
            this.showToast('Favorites cleared', 'info');
        }
    }

    removeFavorite(favoriteId) {
        this.favorites = this.favorites.filter(f => f.id !== favoriteId);
        this.saveToStorage('favorites', this.favorites);
        this.displayFavorites();
        this.updateStats();
        this.showToast('Favorite removed', 'info');

        // Update results if currently displayed
        const result = this.results.find(r => r.id === favoriteId);
        if (result) {
            result.favorite = false;
            this.displayResults();
        }
    }

    // ===== THEME & UI =====
    setupTheme() {
        const savedTheme = this.loadFromStorage('theme') || 'light';
        this.applyTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveToStorage('theme', newTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // ===== MODAL FUNCTIONS =====
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    hideAllModals() {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    showAbout() {
        const content = `
            <div class="modal" id="aboutModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>About GenPass Pro</h3>
                        <button class="modal-close" onclick="genPass.hideModal('aboutModal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h4>🔐 GenPass Pro v1.0</h4>
                        <p>A premium username and password generator with advanced features for secure account creation.</p>
                        
                        <h4>✨ Features</h4>
                        <ul>
                            <li>8 Different username styles</li>
                            <li>Advanced password generation</li>
                            <li>Password strength analysis</li>
                            <li>Favorites & History management</li>
                            <li>Multiple export formats</li>
                            <li>Dark/Light theme</li>
                            <li>Keyboard shortcuts</li>
                        </ul>
                        
                        <h4>🛡️ Privacy</h4>
                        <p>All generation happens locally in your browser. No data is sent to any servers.</p>
                        
                        <p style="text-align: center; margin-top: 2rem;">
                            <strong>Built with ❤️ for secure online experiences</strong>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', content);
        this.showModal('aboutModal');
    }

    showPrivacy() {
        const content = `
            <div class="modal" id="privacyModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Privacy Policy</h3>
                        <button class="modal-close" onclick="genPass.hideModal('privacyModal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h4>🔒 Data Privacy</h4>
                        <p>GenPass Pro respects your privacy completely:</p>
                        
                        <ul>
                            <li><strong>Local Processing:</strong> All username and password generation happens entirely in your browser</li>
                            <li><strong>No Data Collection:</strong> We don't collect, store, or transmit any personal data</li>
                            <li><strong>No Analytics:</strong> No tracking scripts or analytics tools are used</li>
                            <li><strong>Local Storage:</strong> Settings and favorites are stored locally on your device</li>
                            <li><strong>No Cookies:</strong> We don't use cookies or similar tracking technologies</li>
                        </ul>
                        
                        <h4>💾 Local Storage</h4>
                        <p>The app uses your browser's local storage to save:</p>
                        <ul>
                            <li>Theme preferences</li>
                            <li>Generator settings</li>
                            <li>Generation history (locally only)</li>
                            <li>Favorite credentials (locally only)</li>
                        </ul>
                        
                        <p><strong>You can clear this data anytime through your browser settings.</strong></p>
                        
                        <h4>🛡️ Security</h4>
                        <p>Your generated passwords and usernames are never transmitted over the internet. Everything stays on your device for maximum security.</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', content);
        this.showModal('privacyModal');
    }

    // ===== LOADING & NOTIFICATIONS =====
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }

    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.removeToast(toast);
        });

        document.getElementById('toastContainer').appendChild(toast);

        // Auto remove
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }

    removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // ===== UTILITY FUNCTIONS =====
    animateElement(element, animation) {
        element.style.animation = `${animation} 0.5s ease-out`;
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    updateStats() {
        document.getElementById('totalGenerated').textContent = this.totalGenerated.toLocaleString();
        document.getElementById('totalFavorites').textContent = this.favorites.length;
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomFromString(string) {
        return string[Math.floor(Math.random() * string.length)];
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    shuffleString(string) {
        return string.split('').sort(() => Math.random() - 0.5).join('');
    }

    removeChars(string, charsToRemove) {
        const removeSet = new Set(charsToRemove);
        return string.split('').filter(char => !removeSet.has(char)).join('');
    }

    // ===== STORAGE FUNCTIONS =====
    saveToStorage(key, data) {
        try {
            localStorage.setItem(`genpass_${key}`, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`genpass_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    }

    loadSettings() {
        // Apply saved settings to form elements
        if (this.settings.defaultUsernameLength) {
            document.getElementById('usernameLength').value = this.settings.defaultUsernameLength;
            document.getElementById('usernameLengthValue').textContent = this.settings.defaultUsernameLength;
        }

        if (this.settings.defaultPasswordLength) {
            document.getElementById('passwordLength').value = this.settings.defaultPasswordLength;
            document.getElementById('passwordLengthValue').textContent = this.settings.defaultPasswordLength;
        }
    }

    saveSettings() {
        this.settings = {
            ...this.settings,
            defaultUsernameLength: parseInt(document.getElementById('usernameLength').value),
            defaultPasswordLength: parseInt(document.getElementById('passwordLength').value)
        };

        this.saveToStorage('settings', this.settings);
    }
}

// ===== INITIALIZATION =====
let genPass;

document.addEventListener('DOMContentLoaded', () => {
    genPass = new GenPassPro();

    // Add CSS animation keyframes for better UX
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutRight {
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .empty-state {
            text-align: center;
            color: var(--text-muted);
            padding: 2rem;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});

// ===== SERVICE WORKER FOR OFFLINE SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swContent = `
            const CACHE_NAME = 'genpass-pro-v1';
            const urlsToCache = ['/'];
            
            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(urlsToCache))
                );
            });
            
            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => {
                            return response || fetch(event.request);
                        })
                );
            });
        `;

        const blob = new Blob([swContent], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);

        navigator.serviceWorker.register(swUrl)
            .then(() => console.log('ServiceWorker registered'))
            .catch(() => console.log('ServiceWorker registration failed'));
    });
}
