# Praveen & Kavya — Wedding Invitation

A lightweight, responsive South Indian wedding invitation with a warm burgundy, champagne-gold, and ivory colour theme. It is designed for static hosting on GitHub Pages.

## Features

- Ten-second section-by-section auto-scroll with responsive alignment
- Continuous rose, jasmine, and lavender petal animation
- Optional background music with a note-only control
- Opening invitation card that starts music on the visitor's first tap
- Kannada and English wedding messages
- Wedding dates, venue photographs, addresses, and Google Maps directions
- Live wedding and Beegara Oota countdown messages using India Standard Time
- Mobile-friendly photo gallery and sharing controls
- Responsive pre-wedding film with separate mobile and desktop encodes
- Continuous Kannada background music while the silent film is playing
- Background music trimmed to 1 minute 22 seconds for faster loading
- Reduced-motion support

## Project files

```text
praveen-weds-kavya/
├── index.html
├── style.css
├── script.js
├── wedding-music.mp3
├── assets/
│   ├── couple-hero.jpg
│   ├── welcome-hands.jpg
│   ├── venue-purvaja.jpg
│   ├── venue-hb-function-hall.webp
│   ├── moment-scooter.jpg
│   ├── moment-portrait.jpg
│   ├── moment-cooking.jpg
│   ├── prewedding-teaser-720p.mp4
│   ├── prewedding-teaser-1080p.mp4
│   ├── prewedding-teaser-poster.jpg
│   ├── social-preview.jpg
│   └── favicon.svg
└── README.md
```

## Wedding celebrations

| Occasion | Date | Time |
| --- | --- | --- |
| Reception | Tuesday, 1 December 2026 | 6:30 PM onwards |
| Muhurtham | Wednesday, 2 December 2026 | 9:30 AM |
| Beegara Oota | Sunday, 13 December 2026 | 12:30 PM onwards |

## Publish with GitHub Pages

1. Extract this ZIP.
2. Upload the contents to the root of the GitHub repository. Do not upload an extra enclosing folder or a `.git` directory.
3. In GitHub, open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Open the live invitation after the deployment finishes.

For local preview, run a small local server from the extracted folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000/.

## Pre-wedding video

The film section serves a lightweight 720p version to phones and a 1080p version to larger screens. Both use H.264 video without a separate audio track and use `preload="metadata"` so the full video is not downloaded until it is needed. The website's Kannada background song continues while the film plays.

The 414 MB camera master, `prewedding_teaser.mp4`, is intentionally excluded by `.gitignore`; do not upload it to GitHub Pages.

## WhatsApp preview

The Open Graph image is `assets/social-preview.jpg`, referenced with an absolute GitHub Pages URL for WhatsApp and other link previews. Social platforms may cache an older preview after updates.
