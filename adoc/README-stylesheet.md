# illumos Documentation Stylesheet

This directory contains a modern, responsive light/dark mode stylesheet for the illumos documentation.

## Features

- **Pure CSS Solution**: No JavaScript required
- **Automatic Light/Dark Mode**: Responds to system `prefers-color-scheme` setting
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern Typography**: Fluid typography using `clamp()` for better readability
- **Accessibility**: Supports high contrast mode, reduced motion, and keyboard navigation
- **Print Friendly**: Optimized styles for printing

## Usage

The stylesheet is automatically included in all AsciiDoc files via the frontmatter:

```asciidoc
:stylesdir: .
:stylesheet: illumos-docs.css
```

## Building HTML

To generate HTML files with the custom stylesheet and scroll-spy functionality:

```bash
# Single file
asciidoctor dtrace.adoc

# All files
asciidoctor *.adoc
```

The scroll-spy JavaScript is automatically included via passthrough blocks at the end of each AsciiDoc file.

## Theme Switching

The stylesheet automatically switches between light and dark modes based on:

- **System Setting**: Uses `prefers-color-scheme: dark` media query
- **Browser Setting**: Respects user's browser dark mode preference
- **OS Setting**: Follows macOS/Windows dark mode settings

### Light Mode (Default)
- Clean, professional appearance
- High contrast for readability
- Optimized for documentation

### Dark Mode
- Reduced eye strain in low light
- Maintains readability and contrast
- Professional dark theme

## Browser Support

- Chrome/Edge 88+
- Firefox 89+
- Safari 14+
- All modern browsers with CSS custom properties support

## File Structure

```
adoc/
├── illumos-docs.css          # Main stylesheet
├── scroll-spy.js             # Scroll-spy enhancement script
├── *.adoc                    # Documentation files (with scroll-spy passthrough blocks)
└── README-stylesheet.md      # This file
```

## Scroll-Spy Table of Contents

The stylesheet includes scroll-spy functionality that highlights the current section in the table of contents:

### CSS-Only Mode (Default)
- Smooth scrolling to sections
- Basic highlighting when clicking TOC links
- No JavaScript required

### Enhanced Mode (with JavaScript)
When you include the JavaScript file, you get:

```html
<script src="scroll-spy.js"></script>
```

**Enhanced features:**
- **Real-time highlighting** as you scroll through the document
- **Automatic section detection** using Intersection Observer
- **Parent section highlighting** for nested TOCs
- **Smooth performance** with minimal DOM manipulation
- **Browser navigation support** (back/forward, direct URL access)

**Note:** The scroll-spy JavaScript is automatically included when generating HTML files via passthrough blocks at the end of each AsciiDoc file.

## Customization

The stylesheet uses CSS custom properties (variables) for easy customization:

```css
:root {
  --bg-color: #ffffff;        /* Background color */
  --text-color: #212529;      /* Text color */
  --link-color: #0d6efd;      /* Link color */
  /* ... more variables */
}
```

To customize, modify the CSS variables in `illumos-docs.css`.

## Testing

Test the themes by:

1. **System Dark Mode**: Enable dark mode in your OS settings
2. **Browser Dark Mode**: Use browser developer tools to simulate dark mode
3. **Responsive Design**: Test on different screen sizes

Example developer tools command:
```
prefers-color-scheme: dark
```