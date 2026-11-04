# ShadowBrowse

A browser-style website built with plain HTML, CSS, and JavaScript.

## Run it
1. Download and unzip `shadowbrowse.zip`.
2. Open the `shadowbrowse` folder.
3. Double-click `index.html`.

For a local development server, open a terminal in the folder and run `python -m http.server 8000`, then visit http://localhost:8000.

## Included features
- Multiple tabs (add, switch, close).
- Search and URL input.
- Bookmarks saved on this device.
- Dark and light themes.
- Settings panel and clear-bookmarks control.
- No app-side browsing history is stored.

## Important limitations
This is a browser-style interface, not a full browser engine. Many websites prevent iframe embedding, so the preview may not work for every site. Use the external-tab link when available.

It does not bypass Wi-Fi, school, workplace, or parental network restrictions. Its private-style label only means the app does not save browsing history. Bookmarks are saved locally in browser storage. Websites, your browser, and your network may still process connection information.

## Customize
Edit `index.html` for structure, `styles.css` for appearance, and `app.js` for behavior. No package installation or build step is required.
