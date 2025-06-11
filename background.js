// background.js

// Listen for messages from the content script.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;

  if (request.type === "SEED_PHRASE_DETECTED") {
    // Store a 'detected' status for this specific tab ID
    chrome.storage.session.set({ [tabId]: 'detected' });
    
    // Update the action icon to show enhanced monitoring (use default icon with slight change)
    chrome.action.setIcon({ 
      path: {
        "16": "images/icon16.png",
        "48": "images/icon48.png",
        "128": "images/icon128.png"
      }, 
      tabId: tabId 
    });
    
    console.log('Background: Seed phrase detected on tab', tabId, 'URL:', request.url);
    
  } else if (request.type === "PHISHING_ATTEMPT_DETECTED") {
    // Store a 'blocked' status for this specific tab ID
    chrome.storage.session.set({ [tabId]: 'blocked' });

    // Update the action icon to show a warning for the specific tab
    chrome.action.setIcon({ 
      path: {
        "16": "images/icon16-warning.png",
        "48": "images/icon48-warning.png", 
        "128": "images/icon128-warning.png"
      },
      tabId: tabId 
    });

    // Create a desktop notification to alert the user
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/icon128.png",
      title: "Kaspa Seed Protector",
      message: `🛡️ BLOCKED: Phishing attempt on ${request.domain || 'unknown site'}\n\nYour seed phrase was protected!`
    });
    
    console.log('Background: Blocked phishing attempt on', request.domain, 'URL:', request.url);
  }
});

// Reset icon when a tab is updated (e.g., user navigates away)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    // Check if the tab had any special status
    chrome.storage.session.get([tabId.toString()], (result) => {
      if (result[tabId]) {
        // Reset the status and icon for new page loads
        chrome.storage.session.remove(tabId.toString());
        chrome.action.setIcon({ 
          path: {
            "16": "images/icon16.png",
            "48": "images/icon48.png",
            "128": "images/icon128.png"
          },
          tabId: tabId 
        });
      }
    });
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Kaspa Seed Protector installed and ready!');
  
  // Set default icon for all tabs
  chrome.action.setIcon({ 
    path: {
      "16": "images/icon16.png",
      "48": "images/icon48.png", 
      "128": "images/icon128.png"
    }
  });
});