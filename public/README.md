# Public assets for Hero Carousel

Place your hero images in this folder and reference them from the carousel, e.g.:

- /public/hero/plumber.jpg  -> use as url('/hero/plumber.jpg')
- /public/hero/roofer.jpg   -> use as url('/hero/roofer.jpg')

Recommended file names (create a `hero/` subfolder under `public/`):
- plumber.jpg
- roofer.jpg
- hvac.jpg
- electrician.jpg
- landscaper.jpg
- cleaning.jpg
- pest-control.jpg
- painter.jpg
- solar.jpg
- handyman.jpg

In `src/components/ExactHeroCarousel.tsx`, you can replace the Unsplash URLs like:

```tsx
style={{ backgroundImage: "url('/hero/plumber.jpg')" }}
```

Vite serves files in `/public` at the site root, so `/public/hero/plumber.jpg` is available at `/hero/plumber.jpg` in the browser.
