// content_script.js

// More comprehensive regex to detect seed phrases (case-insensitive)
const seedPhraseRegex = /^\s*([a-zA-Z]+\s+){11}[a-zA-Z]+\s*$/i;
const wordCountRegex = /\b[a-zA-Z]+\b/gi;

let isMonitoring = false;
let detectedFields = new Set();
let trustedDomains = [];

// Load trusted domains from rules.json and user settings
async function loadTrustedDomains() {
  // Start with fallback domains immediately
  const defaultDomains = ['wallet.kaspanet.io', 'kaspa-ng.org', 'localhost'];
  
  try {
    // Load custom domains from user settings first (always works)
    chrome.storage.sync.get(['customTrustedDomains'], function(result) {
      const customDomains = result.customTrustedDomains || [];
      trustedDomains = [...defaultDomains, ...customDomains];
      console.log('Kaspa Seed Protector: Loaded trusted domains:', trustedDomains);
    });

    // Optionally try to load from rules.json (this might fail, but it's not critical)
    try {
      const response = await fetch(chrome.runtime.getURL('rules.json'));
      const rules = await response.json();
      
      if (rules && rules[0] && rules[0].condition && rules[0].condition.excludedInitiatorDomains) {
        const rulesDomains = rules[0].condition.excludedInitiatorDomains;
        // Update with rules.json domains if available
        chrome.storage.sync.get(['customTrustedDomains'], function(result) {
          const customDomains = result.customTrustedDomains || [];
          trustedDomains = [...rulesDomains, ...customDomains];
          console.log('Kaspa Seed Protector: Updated domains from rules.json:', trustedDomains);
        });
      }
    } catch (fetchError) {
      console.warn('Kaspa Seed Protector: Could not fetch rules.json, using defaults:', fetchError.message);
      // This is OK - we already have default domains loaded
    }
    
  } catch (error) {
    console.error('Kaspa Seed Protector: Error in loadTrustedDomains:', error);
    // Ensure we always have some domains loaded
    trustedDomains = defaultDomains;
  }
}

// Initialize trusted domains when script loads
loadTrustedDomains();

function isSuspiciousSeedPhrase(text) {
  // Check if it matches the basic pattern
  if (!seedPhraseRegex.test(text.trim())) {
    return false;
  }
  
  // Count words more precisely
  const words = text.match(wordCountRegex);
  if (!words || words.length !== 12) {
    return false;
  }
  
  // Check if words look like typical seed phrase words (3+ characters each)
  const validWords = words.filter(word => word.length >= 3 && word.length <= 8);
  return validWords.length >= 10; // Allow some flexibility
}

function handleSeedPhraseDetection(element) {
  if (detectedFields.has(element)) {
    return; // Already processed this field
  }
  
  detectedFields.add(element);
  console.log('Kaspa Seed Protector: Potential seed phrase detected.');
  
  // Notify the background script
  chrome.runtime.sendMessage({ 
    type: "SEED_PHRASE_DETECTED",
    url: window.location.href,
    domain: window.location.hostname
  });
  // Visual feedback
  element.style.border = "2px solid #ff9800";
  element.style.backgroundColor = "#fff3e0";
  element.style.boxShadow = "0 0 5px rgba(255, 152, 0, 0.5)";
  
  // Add warning tooltip
  const warning = document.createElement('div');
  warning.textContent = '⚠️ Seed phrase detected - Enhanced protection active';
  warning.style.cssText = `
    position: absolute;
    background: #ff9800;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    pointer-events: none;
    margin-top: -25px;
  `;
  element.parentNode.insertBefore(warning, element.nextSibling);
  
  // Start enhanced monitoring
  if (!isMonitoring) {
    startEnhancedMonitoring();
  }
}

function startEnhancedMonitoring() {
  isMonitoring = true;
  
  // Monitor form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (form.tagName === 'FORM') {
      const formData = new FormData(form);
      let hasSeedPhrase = false;
      
      // Check form data for seed phrases
      for (let [key, value] of formData.entries()) {
        if (typeof value === 'string' && isSuspiciousSeedPhrase(value)) {
          hasSeedPhrase = true;
          break;
        }
      }
      
      // Also check text areas and inputs in the form
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (isSuspiciousSeedPhrase(input.value)) {
          hasSeedPhrase = true;
        }
      });
        if (hasSeedPhrase) {
        // Check if this is a trusted domain (using domains loaded from rules.json)
        const currentDomain = window.location.hostname;
        
        if (!trustedDomains.some(domain => currentDomain.includes(domain))) {
          event.preventDefault();
          event.stopImmediatePropagation();
          
          chrome.runtime.sendMessage({ 
            type: "PHISHING_ATTEMPT_DETECTED",
            url: window.location.href,
            domain: currentDomain,
            action: form.action || window.location.href
          });
          
          alert('🛡️ KASPA SEED PROTECTOR: Form submission blocked!\n\nThis appears to be a phishing attempt. Your seed phrase was NOT sent.');
          return false;
        }
      }
    }
  }, true);
}

function scanForSeedPhrase(event) {
  const element = event.target;
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const value = element.value.trim();
    if (value && isSuspiciousSeedPhrase(value)) {
      handleSeedPhraseDetection(element);
    }
  }
}

// Listen for input on the entire document
document.addEventListener('input', scanForSeedPhrase, true);

// Also scan existing content when the script loads
setTimeout(() => {
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    if (input.value && isSuspiciousSeedPhrase(input.value)) {
      handleSeedPhraseDetection(input);
    }
  });
}, 1000);