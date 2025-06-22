"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @type {HTMLImageElement|null} Currently hovered image element */
let hoveredImage = null;
/** @type {Object} Extension settings */
let settings = {
    showFeedback: true,
    copyMode: 'tag',
    copyFormat: 'full',
    includeSize: false,
    stripAttributes: false
};
// Load settings when script starts
chrome.storage.sync.get({
    showFeedback: true,
    copyMode: 'tag',
    copyFormat: 'full',
    includeSize: false,
    stripAttributes: false
}, (loadedSettings) => {
    settings = loadedSettings;
});
/**
 * Listens for settings updates from the popup
 * @listens chrome.runtime.onMessage
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'settingsUpdated') {
        settings = message.settings;
    }
});
/**
 * Tracks the currently hovered image
 * @param {MouseEvent} event - The mouseover event
 */
document.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (target && target.tagName === 'IMG') {
        hoveredImage = target;
    }
});
/**
 * Clears the hovered image when mouse leaves
 * @param {MouseEvent} event - The mouseout event
 */
document.addEventListener('mouseout', (event) => {
    const target = event.target;
    if (target && target.tagName === 'IMG') {
        hoveredImage = null;
    }
});
/**
 * Formats the image tag according to user settings
 * @param {HTMLImageElement} img - The image element to format
 * @returns {string} The formatted image tag or markdown
 */
function getFormattedImageTag(img) {
    if (settings.stripAttributes) {
        return `<img src="${img.src}">`;
    }
    switch (settings.copyFormat) {
        case 'minimal':
            return `<img src="${img.src}">`;
        case 'markdown':
            const altText = img.alt || 'image';
            return `![${altText}](${img.src})`;
        case 'full':
        default:
            let tag = img.outerHTML;
            if (!settings.includeSize) {
                tag = tag.replace(/ width="[^"]*"/, '')
                    .replace(/ height="[^"]*"/, '');
            }
            return tag;
    }
}
/**
 * Copies an image to the clipboard using the Canvas API
 * @param {HTMLImageElement} img - The image element to copy
 * @returns {Promise<boolean>} Whether the copy was successful
 */
function copyImageToClipboard(img) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return false;
            ctx.drawImage(img, 0, 0);
            const blob = yield new Promise(resolve => canvas.toBlob(resolve));
            if (!blob)
                return false;
            const data = new ClipboardItem({
                'image/png': blob
            });
            yield navigator.clipboard.write([data]);
            return true;
        }
        catch (err) {
            console.error('Failed to copy image:', err);
            return false;
        }
    });
}
/**
 * Handles the copy operation based on user settings
 * @returns {Promise<void>}
 */
function handleCopy() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!hoveredImage)
            return;
        try {
            let success = true;
            if (settings.copyMode === 'both' || settings.copyMode === 'image') {
                success = yield copyImageToClipboard(hoveredImage);
            }
            if (settings.copyMode === 'both' || settings.copyMode === 'tag') {
                const imgTag = getFormattedImageTag(hoveredImage);
                yield navigator.clipboard.writeText(imgTag);
            }
            if (settings.showFeedback && success && hoveredImage) {
                const originalBorder = hoveredImage.style.border;
                hoveredImage.style.border = '2px solid #4CAF50';
                setTimeout(() => {
                    if (hoveredImage)
                        hoveredImage.style.border = originalBorder;
                }, 500);
            }
        }
        catch (err) {
            console.error('Failed to copy:', err);
        }
    });
}
/**
 * Listens for the copy keyboard shortcut
 * @param {KeyboardEvent} event - The keydown event
 */
document.addEventListener('keydown', (event) => {
    if (hoveredImage && (event.metaKey || event.ctrlKey) && event.key === 'c') {
        handleCopy();
    }
});
