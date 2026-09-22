# LiftIQ Website

Source for **[liftiqsolutions.app](https://liftiqsolutions.app)**: the marketing site for LiftIQ, an AI-powered lifting and nutrition app for iOS.

Download LiftIQ on the App Store: <https://apps.apple.com/app/id6759868402>

This repo contains only the public website (static HTML, hosted on GitHub Pages). The LiftIQ app source code lives in a separate, private repository.

## Channel links

HeyCatch channel links are served as static redirect pages because GitHub Pages does not provide an SPA fallback for one-letter routes. `/f`, `/i`, `/l`, `/r`, `/t`, `/x`, and `/y` lead to the homepage with `utm_source=heycatch` and `utm_campaign=<letter>`, matching the short-link redirect in `@heycatch/sdk@0.7.0`. A visible link also works if the browser blocks automatic refresh. The homepage SDK records the campaign. Keep these mappings aligned with the HeyCatch Short links dashboard.

### App Store attribution

`app-store-campaign.js` carries the three current social channels from their short links into the App Store download buttons and QR codes on both language pages:

| Public link | Apple campaign token |
| --- | --- |
| `https://liftiqsolutions.app/i` | `instagram_organic` |
| `https://liftiqsolutions.app/t` | `tiktok_organic` |
| `https://liftiqsolutions.app/f` | `facebook_organic` |
| Homepage or legacy `/app` without a recognized channel | `website_organic` |

The public provider token `128606648` was obtained from LiftIQ's App Store Connect campaign generator on September 22, 2026. It identifies the developer account, not an individual visitor. All campaign destinations use app ID `6759868402` and `mt=8`. Example:

`https://apps.apple.com/app/apple-store/id6759868402?pt=128606648&ct=instagram_organic&mt=8`

Attribution works independently of the HeyCatch SDK. The script preserves recognized channel parameters through language, privacy, terms, and support navigation without cookies or browser storage. Unknown sources use the generic website campaign; the script never accepts a redirect destination from the URL. Without JavaScript, download buttons and QR codes still work with the generic website campaign. No source can be inferred reliably from the old shared `/app` link, so social profiles should use their assigned short link.

The four SVG files in `qr/` encode the same Apple campaign destinations. They were generated using `qrcode` 1.5.4 with error correction M and a four-module quiet zone. If tokens change, regenerate and decode all four QR assets as well as updating the script and static fallback links.

Apple reports campaign data after at least 24 hours and enough qualifying traffic, including first-time downloads from five individual users. Successful routing tests do not establish download attribution or create real conversions. See [Apple's campaign documentation](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links).

`llms.txt` provides a concise product summary. Keep its features and prices aligned with the homepage and App Store.
