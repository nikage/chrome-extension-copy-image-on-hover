chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'screenshot') {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      sendResponse({ dataUrl });
    });
    return true; // Indicates async response
  }
}); 