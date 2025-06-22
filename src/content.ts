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
    const blob = await new Promise<Blob | null>(resolve => {
      try {
        canvas.toBlob(resolve);
      } catch (e) {
        resolve(null);
      }
    });
    if (!blob) throw new Error('Tainted canvas or export failed');
    const data = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([data]);
    return true;
  } catch (err) {
    // Show a user-friendly message and fallback to copying the tag
    showToast('Cannot copy image due to browser security (CORS). Copied tag instead.', true);
    try {
      if (hoveredImage) {
        const copyFormat = isCopyFormat(settings.copyFormat) ? settings.copyFormat : 'full';
        const imgTag = getFormattedImageTag(hoveredImage, { ...settings, copyFormat });
        await navigator.clipboard.writeText(imgTag);
      }
    } catch (e) {
      showToast('Copy failed.', true);
    }
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
      const imgTag = getFormattedImageTag(hoveredImage, {
        ...settings,
        copyFormat: settings.copyFormat as 'full' | 'minimal' | 'markdown'
      });
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

function isCopyFormat(val: string): val is 'full' | 'minimal' | 'markdown' {
  return val === 'full' || val === 'minimal' || val === 'markdown';
}

function showToast(message: string, error: boolean = false) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.position = 'fixed';
    toast.style.maxWidth = '250px';
    toast.style.background = 'rgba(16, 19, 26, 0.98)';
    toast.style.color = error ? '#ff4c4c' : '#00eaff';
    toast.style.borderRadius = '8px';
    toast.style.padding = '10px 24px';
    toast.style.fontSize = '15px';
    toast.style.textAlign = 'center';
    toast.style.boxShadow = '0 0 8px #00eaff33';
    toast.style.opacity = '0';
    toast.style.pointerEvents = 'none';
    toast.style.zIndex = '10000';
    toast.style.transition = 'opacity 0.3s, top 0.3s, left 0.3s, bottom 0.3s';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.color = error ? '#ff4c4c' : '#00eaff';

  // Position below hovered image if available
  if (hoveredImage) {
    const rect = hoveredImage.getBoundingClientRect();
    // Default position below image
    let left = rect.left + rect.width / 2;
    let top = rect.bottom + 8;
    toast.style.left = `${left}px`;
    toast.style.top = `${top}px`;
    toast.style.bottom = '';
    toast.style.transform = 'translateX(-50%)';
    toast.style.right = '';
    // Ensure toast is not cropped by viewport
    setTimeout(() => {
      const toastRect = toast.getBoundingClientRect();
      // Adjust left if cropped on the left or right
      if (toastRect.left < 0) {
        toast.style.left = `${toastRect.width / 2 + 8}px`;
      } else if (toastRect.right > window.innerWidth) {
        toast.style.left = `${window.innerWidth - toastRect.width / 2 - 8}px`;
      }
      // Adjust top if cropped at the bottom
      if (toastRect.bottom > window.innerHeight) {
        let newTop = Math.max(window.innerHeight - toastRect.height - 8, rect.top - toastRect.height - 8);
        toast.style.top = `${newTop}px`;
      }
    }, 0);
  } else {
    toast.style.left = '50%';
    toast.style.bottom = '18px';
    toast.style.top = '';
    toast.style.transform = 'translateX(-50%)';
    toast.style.right = '';
  }

  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 1800);
} 