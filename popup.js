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
  const copyMode = document.getElementById('copyMode').value;
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
    document.getElementById('showFeedback').checked = settings.showFeedback;
    document.getElementById('copyMode').value = settings.copyMode;
    document.getElementById('copyFormat').value = settings.copyFormat;
    document.getElementById('includeSize').checked = settings.includeSize;
    document.getElementById('stripAttributes').checked = settings.stripAttributes;
    updateTagOptionsVisibility();
  });

  // Add change listener for copy mode
  document.getElementById('copyMode').addEventListener('change', updateTagOptionsVisibility);
});

/**
 * Saves settings and notifies the content script
 * @listens click
 */
document.getElementById('save').addEventListener('click', () => {
  const settings = {
    showFeedback: document.getElementById('showFeedback').checked,
    copyMode: document.getElementById('copyMode').value,
    copyFormat: document.getElementById('copyFormat').value,
    includeSize: document.getElementById('includeSize').checked,
    stripAttributes: document.getElementById('stripAttributes').checked
  };

  // Save settings to Chrome storage
  chrome.storage.sync.set(settings, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved!';
    setTimeout(() => {
      status.textContent = '';
    }, 1500);

    // Notify content script about settings change
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'settingsUpdated',
        settings: settings
      });
    });
  });
}); 