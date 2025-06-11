// Options page functionality
document.addEventListener('DOMContentLoaded', function() {
    const newDomainInput = document.getElementById('newDomain');
    const addDomainBtn = document.getElementById('addDomain');
    const customDomainsContainer = document.getElementById('customDomains');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const resetSettingsBtn = document.getElementById('resetSettings');
    const statusMessage = document.getElementById('statusMessage');

    // Default trusted domains (cannot be removed)
    const defaultDomains = ['wallet.kaspanet.io', 'kaspa-ng.org', 'localhost'];
    
    // Load and display current settings
    loadSettings();

    // Event listeners
    addDomainBtn.addEventListener('click', addDomain);
    newDomainInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addDomain();
        }
    });
    saveSettingsBtn.addEventListener('click', saveSettings);
    resetSettingsBtn.addEventListener('click', resetSettings);

    function loadSettings() {
        chrome.storage.sync.get(['customTrustedDomains'], function(result) {
            if (chrome.runtime.lastError) {
                console.error('Error loading settings:', chrome.runtime.lastError);
                return;
            }
            
            const customDomains = result.customTrustedDomains || [];
            displayCustomDomains(customDomains);
        });
    }

    function displayCustomDomains(domains) {
        customDomainsContainer.innerHTML = '';
        
        if (domains.length === 0) {
            customDomainsContainer.innerHTML = '<p style="color: #666; font-style: italic;">No custom domains added</p>';
            return;
        }

        domains.forEach(domain => {
            const domainItem = document.createElement('div');
            domainItem.className = 'domain-item';
            domainItem.innerHTML = `
                <span class="domain">${escapeHtml(domain)}</span>
                <div>
                    <span class="badge custom">Custom</span>
                    <button class="remove-btn" data-domain="${escapeHtml(domain)}">Remove</button>
                </div>
            `;
            
            // Add remove functionality
            const removeBtn = domainItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                removeDomain(domain);
            });
            
            customDomainsContainer.appendChild(domainItem);
        });
    }

    function addDomain() {
        const domain = newDomainInput.value.trim().toLowerCase();
        
        if (!domain) {
            showStatus('Please enter a domain name', 'error');
            return;
        }

        // Validate domain format
        if (!isValidDomain(domain)) {
            showStatus('Please enter a valid domain name (e.g., example.com)', 'error');
            return;
        }

        // Check if it's already a default domain
        if (defaultDomains.includes(domain)) {
            showStatus('This domain is already in the default trusted list', 'error');
            return;
        }

        // Get current custom domains
        chrome.storage.sync.get(['customTrustedDomains'], function(result) {
            if (chrome.runtime.lastError) {
                showStatus('Error accessing storage', 'error');
                return;
            }

            const customDomains = result.customTrustedDomains || [];
            
            // Check if domain already exists
            if (customDomains.includes(domain)) {
                showStatus('Domain already exists in custom list', 'error');
                return;
            }

            // Add new domain
            customDomains.push(domain);
            
            // Save updated list
            chrome.storage.sync.set({ customTrustedDomains: customDomains }, function() {
                if (chrome.runtime.lastError) {
                    showStatus('Error saving domain', 'error');
                    return;
                }
                
                displayCustomDomains(customDomains);
                newDomainInput.value = '';
                showStatus('Domain added successfully', 'success');
            });
        });
    }

    function removeDomain(domainToRemove) {
        chrome.storage.sync.get(['customTrustedDomains'], function(result) {
            if (chrome.runtime.lastError) {
                showStatus('Error accessing storage', 'error');
                return;
            }

            const customDomains = result.customTrustedDomains || [];
            const updatedDomains = customDomains.filter(domain => domain !== domainToRemove);
            
            chrome.storage.sync.set({ customTrustedDomains: updatedDomains }, function() {
                if (chrome.runtime.lastError) {
                    showStatus('Error removing domain', 'error');
                    return;
                }
                
                displayCustomDomains(updatedDomains);
                showStatus('Domain removed successfully', 'success');
            });
        });
    }

    function saveSettings() {
        // Settings are saved automatically when domains are added/removed
        // This button provides user feedback and could trigger other save operations
        showStatus('Settings saved successfully!', 'success');
        
        // Notify background script to update rules
        chrome.runtime.sendMessage({ 
            type: 'UPDATE_TRUSTED_DOMAINS' 
        }, function(response) {
            if (chrome.runtime.lastError) {
                console.log('Background script not responding (this is normal)');
            }
        });
    }

    function resetSettings() {
        if (confirm('Are you sure you want to remove all custom trusted domains? This cannot be undone.')) {
            chrome.storage.sync.set({ customTrustedDomains: [] }, function() {
                if (chrome.runtime.lastError) {
                    showStatus('Error resetting settings', 'error');
                    return;
                }
                
                displayCustomDomains([]);
                showStatus('Settings reset to defaults', 'success');
                
                // Notify background script
                chrome.runtime.sendMessage({ 
                    type: 'UPDATE_TRUSTED_DOMAINS' 
                });
            });
        }
    }

    function isValidDomain(domain) {
        // Basic domain validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/;
        return domainRegex.test(domain) && domain.length > 2 && domain.length < 255;
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message show ${type}`;
        
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 3000);
    }
});
