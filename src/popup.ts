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
  const copyMode = (document.getElementById('copyMode') as HTMLSelectElement | null)?.value;
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
    const showFeedback = document.getElementById('showFeedback') as HTMLInputElement | null;
    if (showFeedback) showFeedback.checked = settings.showFeedback;
    const copyMode = document.getElementById('copyMode') as HTMLSelectElement | null;
    if (copyMode) copyMode.value = settings.copyMode;
    const copyFormat = document.getElementById('copyFormat') as HTMLSelectElement | null;
    if (copyFormat) copyFormat.value = settings.copyFormat;
    const includeSize = document.getElementById('includeSize') as HTMLInputElement | null;
    if (includeSize) includeSize.checked = settings.includeSize;
    const stripAttributes = document.getElementById('stripAttributes') as HTMLInputElement | null;
    if (stripAttributes) stripAttributes.checked = settings.stripAttributes;
    updateTagOptionsVisibility();
  });

  // Add change listener for copy mode
  const copyMode = document.getElementById('copyMode');
  if (copyMode) copyMode.addEventListener('change', updateTagOptionsVisibility);
});

/**
 * Saves settings and notifies the content script
 * @listens click
 */
const saveBtn = document.getElementById('save');
if (saveBtn) saveBtn.addEventListener('click', () => {
  const showFeedback = (document.getElementById('showFeedback') as HTMLInputElement | null)?.checked;
  const copyMode = (document.getElementById('copyMode') as HTMLSelectElement | null)?.value;
  const copyFormat = (document.getElementById('copyFormat') as HTMLSelectElement | null)?.value;
  const includeSize = (document.getElementById('includeSize') as HTMLInputElement | null)?.checked;
  const stripAttributes = (document.getElementById('stripAttributes') as HTMLInputElement | null)?.checked;
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
    if (status) status.textContent = 'Settings saved!';
    setTimeout(() => {
      if (status) status.textContent = '';
    }, 1500);

    // Notify content script about settings change
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tabId = tabs[0]?.id;
      if (typeof tabId === 'number') {
        chrome.tabs.sendMessage(tabId, {
          type: 'settingsUpdated',
          settings: settings
        });
      }
    });
  });
}); 