/** @type {HTMLImageElement|null} Currently hovered image element */
let hoveredImage: HTMLImageElement | null = null;

/** @type {Object} Extension settings */
let settings: {
  showFeedback: boolean,
  copyMode: string,
  copyFormat: string,
  includeSize: boolean,
  stripAttributes: boolean
} = {
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
  settings = loadedSettings as typeof settings;
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
  const target = event.target as HTMLElement | null;
  if (target && target.tagName === 'IMG') {
    hoveredImage = target as HTMLImageElement;
  }
});

/**
 * Clears the hovered image when mouse leaves
 * @param {MouseEvent} event - The mouseout event
 */
document.addEventListener('mouseout', (event) => {
  const target = event.target as HTMLElement | null;
  if (target && target.tagName === 'IMG') {
    hoveredImage = null;
  }
});

import { getFormattedImageTag } from './utils';

/**
 * Copies an image to the clipboard using the Canvas API
 * @param {HTMLImageElement} img - The image element to copy
 * @returns {Promise<boolean>} Whether the copy was successful
 */
async function copyImageToClipboard(img: HTMLImageElement): Promise<boolean> {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
    if (!blob) return false;
    const data = new ClipboardItem({
      'image/png': blob
    });
    await navigator.clipboard.write([data]);
    return true;
  } catch (err) {
    console.error('Failed to copy image:', err);
    return false;
  }
}

/**
 * Handles the copy operation based on user settings
 * @returns {Promise<void>}
 */
async function handleCopy(): Promise<void> {
  if (!hoveredImage) return;
  try {
    let success = true;
    if (settings.copyMode === 'both' || settings.copyMode === 'image') {
      success = await copyImageToClipboard(hoveredImage);
    }
    if (settings.copyMode === 'both' || settings.copyMode === 'tag') {
      const imgTag = getFormattedImageTag(hoveredImage, settings);
      await navigator.clipboard.writeText(imgTag);
    }
    if (settings.showFeedback && success && hoveredImage) {
      const originalBorder = hoveredImage.style.border;
      hoveredImage.style.border = '2px solid #4CAF50';
      setTimeout(() => {
        if (hoveredImage) hoveredImage.style.border = originalBorder;
      }, 500);
    }
  } catch (err) {
    console.error('Failed to copy:', err);
  }
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