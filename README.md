# TimeStamp Decoder Extension

A browser extension that converts selected Unix timestamps to human-readable dates via context menu.

## Demo

<img src="@data/demo.gif" alt="TimeStamp Decoder Extension Demo" width="600" autoplay loop>

_Select any Unix timestamp on a webpage, right-click, and choose "Decode Timestamp" to see the human-readable date._

## Development Mode

To load this extension in development mode:

### Chrome / Chromium-based browsers

1. **Enable Developer Mode**:

   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle on "Developer mode" in the top-right corner

2. **Load the Extension**:

   - Click "Load unpacked" button
   - Select the root directory of this project (the folder containing `manifest.json`)

3. **Test the Extension**:
   - Navigate to any webpage with Unix timestamps
   - Select a timestamp (e.g., `1609459200`)
   - Right-click and look for "Decode Timestamp" in the context menu

### Firefox (Alternative)

1. **Temporary Installation**:
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file

### Making Changes

After modifying the code:

- For content scripts and background scripts: Reload the extension by clicking the refresh icon on the extension card
- For manifest changes: Remove and re-load the extension

## Usage

1. Select any Unix timestamp on a webpage
2. Right-click to open context menu
3. Click "Decode Timestamp" to see the human-readable date
