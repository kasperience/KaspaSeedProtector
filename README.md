# Kaspa Seed Protector Chrome Extension

A Chrome extension that protects users from phishing attempts targeting Kaspa wallet seed phrases.

## Features

- **Real-time Seed Phrase Detection**: Monitors input fields for 12-word seed phrases (case-insensitive)
- **Phishing Protection**: Automatically blocks form submissions containing seed phrases to untrusted domains
- **Visual Warnings**: Highlights suspicious input fields with color coding
- **Smart Blocking**: Only blocks suspicious network requests, not all traffic
- **Status Indicator**: Extension popup shows current protection status with detailed threat information
- **Custom Domain Management**: Users can add trusted domains through the options page
- **Enhanced Security Notifications**: Detailed alerts showing blocked domains and timestamps

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the extension folder containing `manifest.json`
5. The extension will appear in your toolbar
6. **Access Settings**: Click the extension icon → "Manage Trusted Domains" button, or right-click extension icon → "Options"

## How It Works

### Detection
- Monitors all input fields and textareas for 12-word phrases
- Uses pattern matching to identify potential seed phrases
- Provides immediate visual feedback when detected

### Protection
- Blocks form submissions containing seed phrases to non-whitelisted domains
- Trusted domains include: `wallet.kaspanet.io`, `kaspa-ng.org`, `localhost`
- Shows alerts when blocking attempts
- Updates extension icon to indicate threats

### Network Filtering
- Uses Chrome's `declarativeNetRequest` API for efficient blocking
- Targets suspicious API endpoints: `/api/*`, `/submit/*`, `/save/*`, `/send/*`, `/wallet/*`
- Only blocks POST/PUT requests to reduce false positives

## Testing

1. Open the included `test-page.html` in Chrome
2. Enter a fake 12-word seed phrase (e.g., "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about")
3. Try to submit the form - it should be blocked
4. Check the extension popup for status updates

## Status Indicators

- **Green**: Protection active, no threats detected
- **Orange**: Seed phrase detected, enhanced monitoring active  
- **Red**: Phishing attempt blocked
- **Pink**: Extension error

## Whitelisted Domains

The extension allows seed phrase submission to these trusted domains:
- `wallet.kaspanet.io`
- `kaspa-ng.org`
- `localhost`

## Privacy

- **No data storage**: Seed phrases are never stored or transmitted
- **Local processing**: All detection happens locally in your browser
- **No tracking**: The extension doesn't collect any personal information

## Troubleshooting

### "Network error. Request blocked" messages
- This was caused by overly aggressive blocking rules in earlier versions
- Current version only blocks suspicious requests, not general web traffic

### Extension not working
1. Check that it's enabled in `chrome://extensions/`
2. Reload the extension if needed
3. Check browser console for error messages
4. Try the test page to verify functionality

### False positives
- The extension may occasionally flag legitimate 12-word phrases
- Only seed phrase submissions to untrusted domains are blocked
- Regular web browsing should not be affected

## Development

### Files Structure
- `manifest.json`: Extension configuration
- `background.js`: Service worker handling messages and notifications
- `content_script.js`: Injected script for page monitoring
- `popup.html/js/css`: Extension popup interface
- `rules.json`: Network request blocking rules

### Key Technologies
- Chrome Extension Manifest V3
- `declarativeNetRequest` API for network blocking
- Content script injection for DOM monitoring
- Chrome storage API for state management

## Security Notes

⚠️ **Important**: This extension provides an additional layer of protection but should not be your only security measure. Always:

- Only enter seed phrases on official wallet websites
- Verify URLs carefully before entering sensitive information
- Keep your browser and extensions updated
- Use hardware wallets when possible

## License

This project is licensed under a **Non-Commercial License**. 

**✅ Permitted Uses:**
- Personal use
- Educational purposes
- Research and security analysis
- Community projects
- Open source contributions

**❌ Commercial Use Prohibited:**
- Selling the software or derivatives
- Using in commercial products/services
- Monetization through ads or subscriptions
- Incorporation into proprietary software

For commercial licensing, please contact the author.

See the [LICENSE](LICENSE) file for full terms and conditions.

## Contact

KASperience - dev@KASperience.xyz

## Donations

Support KaspaSeedProtector's development!

**Scan the QR Code or Copy the Address:**

<div align="center">
  <img src="images/kaspa-donation-qr.png" alt="Kaspa Donation QR Code" width="200"/>
</div>

```
kaspa:qr02ac46a6zwqzxgp97lcjw3th4f70x9mq24jsk6vgfmvvhy39lpyksqj24y5
```

Thank you for your support! 🙏
