"use strict";
/** @type {Object} Default extension settings */
const defaultSettings = {
    showFeedback: true,
    copyMode: 'tag',
    copyFormat: 'full',
    includeSize: false,
    stripAttributes: false
};
/**
 * Updates the visibility of tag-related options based on copy mode
 * Hides tag options when only copying the image
 */
function updateTagOptionsVisibility() {
    var _a;
    const copyMode = (_a = document.getElementById('copyMode')) === null || _a === void 0 ? void 0 : _a.value;
    const tagOptions = document.querySelectorAll('.tag-options');
    tagOptions.forEach(element => {
        element.classList.toggle('hidden', copyMode === 'image');
    });
}
/**
 * Initializes the popup with saved settings
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings
    chrome.storage.sync.get(defaultSettings, (settings) => {
        const showFeedback = document.getElementById('showFeedback');
        if (showFeedback)
            showFeedback.checked = settings.showFeedback;
        const copyMode = document.getElementById('copyMode');
        if (copyMode)
            copyMode.value = settings.copyMode;
        const copyFormat = document.getElementById('copyFormat');
        if (copyFormat)
            copyFormat.value = settings.copyFormat;
        const includeSize = document.getElementById('includeSize');
        if (includeSize)
            includeSize.checked = settings.includeSize;
        const stripAttributes = document.getElementById('stripAttributes');
        if (stripAttributes)
            stripAttributes.checked = settings.stripAttributes;
        updateTagOptionsVisibility();
    });
    // Add change listener for copy mode
    const copyMode = document.getElementById('copyMode');
    if (copyMode)
        copyMode.addEventListener('change', updateTagOptionsVisibility);
});
/**
 * Saves settings and notifies the content script
 * @listens click
 */
const saveBtn = document.getElementById('save');
if (saveBtn)
    saveBtn.addEventListener('click', () => {
        var _a, _b, _c, _d, _e;
        const showFeedback = (_a = document.getElementById('showFeedback')) === null || _a === void 0 ? void 0 : _a.checked;
        const copyMode = (_b = document.getElementById('copyMode')) === null || _b === void 0 ? void 0 : _b.value;
        const copyFormat = (_c = document.getElementById('copyFormat')) === null || _c === void 0 ? void 0 : _c.value;
        const includeSize = (_d = document.getElementById('includeSize')) === null || _d === void 0 ? void 0 : _d.checked;
        const stripAttributes = (_e = document.getElementById('stripAttributes')) === null || _e === void 0 ? void 0 : _e.checked;
        const settings = {
            showFeedback: !!showFeedback,
            copyMode: copyMode || 'tag',
            copyFormat: copyFormat || 'full',
            includeSize: !!includeSize,
            stripAttributes: !!stripAttributes
        };
        // Save settings to Chrome storage
        chrome.storage.sync.set(settings, () => {
            const status = document.getElementById('status');
            if (status)
                status.textContent = 'Settings saved!';
            setTimeout(() => {
                if (status)
                    status.textContent = '';
            }, 1500);
            // Notify content script about settings change
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                var _a;
                const tabId = (_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id;
                if (typeof tabId === 'number') {
                    chrome.tabs.sendMessage(tabId, {
                        type: 'settingsUpdated',
                        settings: settings
                    });
                }
            });
        });
    });
