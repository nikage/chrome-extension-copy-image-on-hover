# Image Tag Copier Chrome Extension

A powerful Chrome extension that allows you to copy image tags and actual images by hovering over them and pressing Cmd+C (Mac) or Ctrl+C (Windows/Linux).

## Features

- **Multiple Copy Modes**:
  - Copy HTML tag only
  - Copy actual image only
  - Copy both tag and image
  
- **Flexible Tag Formats**:
  - Full tag with all attributes
  - Minimal tag (src only)
  - Markdown format
  
- **Customization Options**:
  - Toggle visual feedback
  - Include/exclude width and height attributes
  - Strip all attributes except src
  
- **User-Friendly Interface**:
  - Clean, modern popup design
  - Real-time settings updates
  - Visual feedback on copy
  
- **Cross-Platform Support**:
  - Works on Mac (Cmd+C)
  - Works on Windows/Linux (Ctrl+C)

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files

## Usage

### Basic Usage

1. Hover over any image on a webpage
2. Press Cmd+C (Mac) or Ctrl+C (Windows/Linux)
3. The image and/or tag will be copied according to your settings
4. A green border will briefly appear around the image to confirm the copy (if enabled)

### Configuration

Click the extension icon in your Chrome toolbar to access settings:

#### Copy Mode
- **HTML tag only**: Copies just the HTML tag
- **Image only**: Copies the actual image to clipboard
- **Both**: Copies both the tag and the image

#### Tag Format (when copying tags)
- **Full tag**: Includes all original attributes
- **Minimal tag**: Includes only the src attribute
- **Markdown**: Formats as a Markdown image link

#### Additional Options
- **Show visual feedback**: Toggle the green border effect
- **Include width/height**: Keep or remove size attributes
- **Strip all attributes**: Keep only the src attribute

## Examples

### Copy Formats

1. **Full Tag**:
   ```html
   <img src="image.jpg" alt="Example" width="100" height="100" class="photo">
   ```

2. **Minimal Tag**:
   ```html
   <img src="image.jpg">
   ```

3. **Markdown**:
   ```markdown
   ![Example](image.jpg)
   ```

## Technical Details

### Permissions Used

- `activeTab`: To interact with the current webpage
- `clipboardWrite`: To copy content to clipboard
- `storage`: To save user preferences

### File Structure

```
chrome-ext-cp-img-on-hover/
├── manifest.json        # Extension configuration
├── content.js          # Main content script
├── popup.html          # Settings popup interface
├── popup.css          # Popup styles
├── popup.js           # Popup functionality
└── icons/             # Extension icons
```

### Storage

The extension uses Chrome's sync storage to save settings, which means your preferences will sync across devices when you're signed into Chrome.

Settings stored:
- `showFeedback`: boolean
- `copyMode`: 'tag' | 'image' | 'both'
- `copyFormat`: 'full' | 'minimal' | 'markdown'
- `includeSize`: boolean
- `stripAttributes`: boolean

## Browser Compatibility

- Chrome: 73+
- Edge (Chromium-based): 79+
- Opera: 60+

The extension requires support for:
- Clipboard API
- Canvas API
- Chrome Extension Manifest V3

## Development

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chrome-ext-cp-img-on-hover.git
   ```

2. Make your changes

3. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the extension directory

### Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Common Issues

1. **Image not copying**
   - Check if the website allows image copying
   - Ensure the image is fully loaded
   - Try refreshing the page

2. **Extension not working**
   - Check if the extension is enabled
   - Ensure you're using a compatible browser version
   - Try reloading the extension

3. **Settings not saving**
   - Clear extension storage
   - Reinstall the extension

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes and version history. 