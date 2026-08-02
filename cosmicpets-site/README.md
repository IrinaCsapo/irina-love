# Cosmic Pets

The cosmicpets.co.uk website, rebuilt by hand and hosted free on GitHub Pages.
Replaces the Webflow site (£29/month) with plain HTML, CSS and one small JS file.

**No build step.** Edit the HTML directly, commit, push. GitHub Actions deploys it.

## Structure

```
index.html          Home
gallery.html        The Cosmic Crew, 15 portraits with a lightbox
prices.html         The three packages + gift vouchers + how it works
photo-guide.html    What makes a good photo
about.html          Irina's story + the making of
faqs.html           FAQs (with FAQPage structured data for Google)
contact.html        Order form + email
404.html            Not-found page

assets/css/site.css All styling. Colours are oklch, do not convert to hex.
assets/js/site.js   Nav, scroll reveals, portrait lightbox, form submit.
assets/portraits/   Portrait images. name.webp (full) + name-thumb.webp (grid).
assets/img/         Everything else.
assets/fonts/       Aventi Bold, self-hosted.

<slug>/index.html   Redirect stubs so the old Webflow URLs keep working
                    (/about, /order, /cosmic-crew, /faqs, /gift-vouchers, ...)
```

## Things you need to do once

### 1. Confirm the contact form

The form posts to [FormSubmit](https://formsubmit.co), which is free, has no
account to create and no cap on submissions. Formspree was the obvious choice
until it moved its free tier behind a paywall.

There is nothing to set up in advance. The first time anyone submits the form,
FormSubmit emails hello@cosmicpets.co.uk asking you to confirm you own it.
Click the link once and the form is live. Anything submitted before you confirm
is held for 30 days and delivered afterwards, so no early messages are lost.

Two optional tweaks once it is confirmed:

- FormSubmit will show you a random alias endpoint, something like
  `https://formsubmit.co/ajax/a1b2c3d4e5`. Swapping it into the `action` in
  `contact.html` keeps your email address out of the page source, where
  scrapers can find it.
- `_subject`, `_template` and `_captcha` are hidden fields in the form and
  control the email you receive. Their meanings are in the FormSubmit docs.

If FormSubmit is ever unreachable, or you have not confirmed it yet, `site.js`
catches the failure and offers the visitor a pre-filled email containing
everything they typed. A message can fail to send, but it cannot vanish.

### 2. Point the domain at GitHub Pages

In your domain registrar's DNS settings:

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| A     | @     | 185.199.108.153          |
| A     | @     | 185.199.109.153          |
| A     | @     | 185.199.110.153          |
| A     | @     | 185.199.111.153          |
| CNAME | www   | irinacsapo.github.io     |

Then in the repo: **Settings → Pages → Custom domain** → `www.cosmicpets.co.uk`,
and tick **Enforce HTTPS** once the certificate has been issued (can take an hour).

The `CNAME` file in this repo already holds the domain, so Pages picks it up.

### 3. Analytics (optional)

Irina self-hosts Umami at irina-umami.vercel.app. Add a *new* website there for
cosmicpets.co.uk, get its website ID, then add this to the `<head>` of every page:

```html
<script defer src="https://irina-umami.vercel.app/script.js" data-website-id="NEW-ID-HERE"></script>
```

Do not reuse the irina.love website ID, it would mix the two sites' data.

## Adding a pet to the gallery

1. Save the portrait as `assets/portraits/<name>.webp` (about 1200px wide) and
   `assets/portraits/<name>-thumb.webp` (560px wide).
2. Copy an existing `<button class="portrait">` block in `gallery.html`, change
   the name, the two image paths and the alt text.
3. Optional: add a `data-story="..."` attribute and it shows under the portrait
   in the lightbox.

## Notes

- Colours use `oklch()` throughout. Do not convert them to hex or rgb.
- Photography and portraits are WebP.
- Aventi Bold is a commercial font, self-hosted in `assets/fonts/`. It came from
  the Webflow export where it was already being served publicly. If the licence
  does not cover self-hosting, swap `--display` in `site.css` for a free display
  serif such as Playfair Display or Bodoni Moda.
