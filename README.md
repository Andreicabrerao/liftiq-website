# LiftIQ Website

Source for **[liftiqsolutions.app](https://liftiqsolutions.app)** — the marketing site for LiftIQ, an AI-powered lifting and nutrition app for iOS.

Download LiftIQ on the App Store: <https://apps.apple.com/app/id6759868402>

This repo contains only the public website (static HTML, hosted on GitHub Pages). The LiftIQ app source code lives in a separate, private repository.

## Channel links

HeyCatch channel links are served as static redirect pages because GitHub Pages does not provide an SPA fallback for one-letter routes. `/f`, `/i`, `/l`, `/r`, `/t`, `/x`, and `/y` lead to the homepage with `utm_source=heycatch` and `utm_campaign=<letter>`, matching the short-link redirect in `@heycatch/sdk@0.7.0`. A visible link also works if the browser blocks automatic refresh. The homepage SDK records the campaign. Keep these mappings aligned with the HeyCatch Short links dashboard.

`llms.txt` provides a concise product summary. Keep its features and prices aligned with the homepage and App Store.
