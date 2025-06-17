// Default settings
const defaultSettings = {
  showFeedback: true,
  copyFormat: 'full',
  includeSize: false,
  stripAttributes: false
};

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(defaultSettings, (settings) => {
    document.getElementById('showFeedback').checked = settings.showFeedback;
    document.getElementById('copyFormat').value = settings.copyFormat;
    document.getElementById('includeSize').checked = settings.includeSize;
    document.getElementById('stripAttributes').checked = settings.stripAttributes;
  });
});

// Save settings when button is clicked
document.getElementById('save').addEventListener('click', () => {
  const settings = {
    showFeedback: document.getElementById('showFeedback').checked,
    copyFormat: document.getElementById('copyFormat').value,
    includeSize: document.getElementById('includeSize').checked,
    stripAttributes: document.getElementById('stripAttributes').checked
  };

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