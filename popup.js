// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const statusMessage = document.getElementById('status-message');
  const headerIcon = document.getElementById('header-icon');
  const settingsBtn = document.getElementById('settings-btn');
  const openOptionsBtn = document.getElementById('open-options');

  // Set default state first
  statusMessage.textContent = 'Protection is active.';
  statusMessage.className = 'status-ok';
  headerIcon.src = 'images/icon-default.png';

  // Add event listeners for settings buttons
  if (settingsBtn) {
    settingsBtn.addEventListener('click', openOptionsPage);
  }
  
  if (openOptionsBtn) {
    openOptionsBtn.addEventListener('click', openOptionsPage);
  }

  function openOptionsPage() {
    chrome.runtime.openOptionsPage();
    window.close(); // Close the popup after opening options
  }

  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error('Error querying tabs:', chrome.runtime.lastError);
      statusMessage.textContent = 'Extension error. Please reload.';
      statusMessage.className = 'status-error';
      return;
    }

    if (tabs.length === 0) {
      statusMessage.textContent = 'Cannot determine tab status.';
      statusMessage.className = 'status-error';
      return;
    }

    const currentTabId = tabs[0].id;    // Check session storage to see if this tab has any protection status
    chrome.storage.session.get([
      currentTabId.toString(), 
      `${currentTabId}_url`, 
      `${currentTabId}_domain`,
      `${currentTabId}_action`,
      `${currentTabId}_timestamp`
    ], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error accessing storage:', chrome.runtime.lastError);
        // Keep default status message
        return;
      }

      const status = result[currentTabId];
      const url = result[`${currentTabId}_url`];
      const domain = result[`${currentTabId}_domain`];
      const action = result[`${currentTabId}_action`];
      const timestamp = result[`${currentTabId}_timestamp`];

      if (status === 'blocked') {
        // If a phishing attempt was blocked, show detailed warning
        let message = `⚠️ THREAT BLOCKED! A phishing attempt was detected and blocked.`;
        if (domain) {
          message += `\n\nSuspicious domain: ${domain}`;
        }
        if (timestamp) {
          const timeAgo = Math.round((Date.now() - timestamp) / 1000);
          message += `\nBlocked ${timeAgo} seconds ago`;
        }
        
        statusMessage.textContent = message;
        statusMessage.className = 'status-warning';
        headerIcon.src = 'images/icon-warning.png';
        
      } else if (status === 'detected') {
        // If seed phrase was detected but not blocked yet
        let message = 'Seed phrase detected! Enhanced protection is active.';
        if (domain) {
          message += `\n\nOn domain: ${domain}`;
        }
        
        statusMessage.textContent = message;
        statusMessage.className = 'status-caution';
        headerIcon.src = 'images/icon48.png';
        
      } else {
        // Otherwise, show the default protection message
        statusMessage.textContent = 'Protection is active. No threats detected.';
        statusMessage.className = 'status-ok';
        headerIcon.src = 'images/icon-default.png';
      }
    });
  });
});