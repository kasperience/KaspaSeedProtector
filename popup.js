// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const statusMessage = document.getElementById('status-message');
  const headerIcon = document.getElementById('header-icon');

  // Set default state first
  statusMessage.textContent = 'Protection is active.';
  statusMessage.className = 'status-ok';
  headerIcon.src = 'images/icon-default.png';

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

    const currentTabId = tabs[0].id;

    // Check session storage to see if this tab has a 'blocked' status
    chrome.storage.session.get([currentTabId.toString()], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error accessing storage:', chrome.runtime.lastError);
        // Keep default status message
        return;
      }

      if (result[currentTabId] === 'blocked') {
        // If a phishing attempt was blocked, show a warning
        statusMessage.textContent = 'Warning! A phishing attempt was blocked on this page.';
        statusMessage.className = 'status-warning';
        headerIcon.src = 'images/icon-warning.png';
      } else if (result[currentTabId] === 'detected') {
        // If seed phrase was detected but not blocked yet
        statusMessage.textContent = 'Seed phrase detected! Enhanced protection active.';
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