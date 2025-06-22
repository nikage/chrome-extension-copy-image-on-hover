chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  if (message.type === 'screenshot') {
    chrome.tabs.captureVisibleTab({ format: 'png' }, (dataUrl) => {
      sendResponse({ dataUrl });
    });
    return true; // Indicates async response
  }
}); 