let hoveredImage = null;
let settings = {
  showFeedback: true,
  copyFormat: 'full',
  includeSize: false,
  stripAttributes: false
};

// Load settings when script starts
chrome.storage.sync.get({
  showFeedback: true,
  copyFormat: 'full',
  includeSize: false,
  stripAttributes: false
}, (loadedSettings) => {
  settings = loadedSettings;
});

// Listen for settings updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'settingsUpdated') {
    settings = message.settings;
  }
});

document.addEventListener('mouseover', (event) => {
  if (event.target.tagName === 'IMG') {
    hoveredImage = event.target;
  }
});

document.addEventListener('mouseout', (event) => {
  if (event.target.tagName === 'IMG') {
    hoveredImage = null;
  }
});

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

document.addEventListener('keydown', (event) => {
  if (hoveredImage && (event.metaKey || event.ctrlKey) && event.key === 'c') {
    const imgTag = getFormattedImageTag(hoveredImage);
    navigator.clipboard.writeText(imgTag).then(() => {
      if (settings.showFeedback) {
        const originalBorder = hoveredImage.style.border;
        hoveredImage.style.border = '2px solid #4CAF50';
        setTimeout(() => {
          hoveredImage.style.border = originalBorder;
        }, 500);
      }
    }).catch(err => {
      console.error('Failed to copy image tag:', err);
    });
  }
}); 