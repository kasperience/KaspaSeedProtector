# Quick Installation & Testing Guide

## 🚀 Install the Extension

1. **Open Chrome Extensions Page**
   - Go to `chrome://extensions/` in your Chrome browser
   - Or click the three dots menu → More tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select this folder: `c:\[your_local_location]\KaspaSeedProtector`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Kaspa Seed Protector" in your extensions list
   - The extension icon should appear in your Chrome toolbar

## 🧪 Test the Extension

### Method 1: Use the Test Page
1. Open the test page: `file:///c:/[your_local_location]/KaspaSeedProtector/test-page.html`
2. Click "Fill Test Data" button
3. Try to submit the form - it should be blocked!
4. Check the extension popup (click the icon) for status

### Method 2: Manual Testing
1. Go to any website
2. Open the extension popup by clicking its icon
3. Should show "Protection is active"
4. Enter a 12-word phrase in any text field
5. The field should be highlighted in orange
6. Extension popup should show "Seed phrase detected!"

## 🔍 What to Look For

### ✅ Working Correctly:
- Extension icon appears in toolbar
- Popup opens when clicked
- Test form submissions are blocked
- Seed phrase detection highlights fields
- Notifications appear when threats are blocked

### ❌ Troubleshooting:
- **No icon**: Extension may not be loaded properly
- **Popup doesn't open**: Check for JavaScript errors in console
- **No blocking**: Verify rules.json is valid
- **Network errors**: Old aggressive rules may still be cached

## 🛠️ Debug Steps

If something isn't working:

1. **Check Extension Status**
   - Go to `chrome://extensions/`
   - Make sure "Kaspa Seed Protector" is enabled
   - Click "Reload" if needed

2. **View Console Logs**
   - Right-click the extension icon → "Inspect popup"
   - Check for JavaScript errors in the console

3. **Check Background Script**
   - Go to `chrome://extensions/`
   - Click "Service worker" link under the extension
   - Check for errors in the console

4. **Test Network Blocking**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try the test page
   - Look for blocked requests

## 📋 Key Features Fixed

1. **Overly Aggressive Blocking**: Fixed the rules.json that was blocking all network requests
2. **Proper Error Handling**: Added error handling in popup.js
3. **Enhanced Detection**: Improved seed phrase detection algorithm
4. **Better UX**: Added visual feedback and status indicators
5. **Comprehensive Testing**: Included test page for validation

## 🎯 Next Steps

After confirming the extension works:
1. Test on various websites to ensure no false positives
2. Try different seed phrase formats
3. Test with real phishing sites (be careful!)
4. Consider adding more trusted domains to the whitelist

---

**Remember**: This extension is a security tool. Always verify it's working properly before relying on it for protection!
