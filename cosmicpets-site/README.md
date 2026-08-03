# Cosmic Pets

The cosmicpets.co.uk website, rebuilt by hand to replace the Webflow site
(£29/month) with plain HTML, CSS and one small JS file. Ready for GitHub Pages,
not deployed yet. See "Go live" below.

**No build step.** Edit the HTML directly, commit, push.

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
CNAME.disabled      The custom domain, parked until launch.

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

### 2. Go live

The site is deliberately **not deployed yet**. Pages is off, the deploy
workflow is manual-only so commits do not fail with a red X, and the domain
file is parked as `CNAME.disabled` so it cannot hijack the preview URL.

A note on privacy, because the two settings are easy to confuse:

- **Repo visibility.** GitHub Pages runs from public repos on the free plan.
  Publishing from a *private* repo needs GitHub Pro, currently $4/month.
- **Site visibility.** A Pages site is reachable by anyone on the internet
  either way. Restricting who can view it needs GitHub Enterprise Cloud, so
  it is not realistically an option for a personal account.

In other words there is no free way to have a *live but private* site here.
Keeping the repo private and Pages switched off costs nothing, which is the
current state.

When you are ready to launch:

1. Settings > Pages > Source: **GitHub Actions**.
2. Uncomment the `push` trigger in `.github/workflows/pages.yml`.
3. Rename `CNAME.disabled` back to `CNAME`, after the DNS below resolves.

### 3. Point the domain at GitHub Pages

**Neither the domain nor the email lives at Webflow.** Checked against live DNS
on 2026-08-03:

- Nameservers are `ns-cloud-b1..b4.googledomains.com`, so DNS is managed at
  Google, not Webflow. Cancelling Webflow cannot take the domain with it.
- Mail is **Zoho** (`mx.zoho.eu`, `mx2`, `mx3`). hello@cosmicpets.co.uk is not
  a Webflow service either, so cancelling cannot break your email.
- There is no `CAA` record, so GitHub's Let's Encrypt certificate will issue
  without any extra step.

So the migration is only two record changes.

**Change these two:**

| Type  | Name | From               | To                   |
|-------|------|--------------------|----------------------|
| A     | @    | `198.202.211.1`    | `185.199.108.153`    |
| A     | @    |                    | `185.199.109.153`    |
| A     | @    |                    | `185.199.110.153`    |
| A     | @    |                    | `185.199.111.153`    |
| CNAME | www  | `cdn.webflow.com`  | `irinacsapo.github.io` |

`198.202.211.1` and `cdn.webflow.com` are Webflow's. They are the only two
records pointing there.

**Do not touch these, or email stops working:**

| Type | Name      | Value                                     |
|------|-----------|-------------------------------------------|
| MX   | @         | `10 mx.zoho.eu`, `20 mx3.zoho.eu`, `50 mx2.zoho.eu` |
| TXT  | @         | `v=spf1 include:zoho.eu ~all`              |
| TXT  | `_dmarc`  | `v=DMARC1; p=none; rua=...`                |

Deleting the MX or SPF records while repointing the site is the single most
common way this migration goes wrong. Edit the two records above, do not clear
the zone and start again.

Then in the repo: **Settings → Pages → Custom domain** → `www.cosmicpets.co.uk`,
and tick **Enforce HTTPS** once the certificate has been issued (up to an hour).

`CNAME.disabled` already holds the domain. Rename it to `CNAME` and Pages picks
it up. It is parked under the other name so it cannot redirect the
irinacsapo.github.io preview URL to a domain that is not pointed here yet.

### Order of operations for leaving Webflow

DNS changes take time to propagate and the HTTPS certificate is issued only
after the domain resolves to GitHub. Cancel last, not first.

1. Repo public, Pages on, site live and checked at `irinacsapo.github.io/cosmicpets-site/`.
2. Rename `CNAME.disabled` to `CNAME`, uncomment the push trigger, push.
3. Change the two DNS records above. Leave MX, SPF and DMARC alone.
4. Wait for `www.cosmicpets.co.uk` to serve the new site, then wait for the
   certificate, then tick Enforce HTTPS.
5. Send yourself a test email at hello@cosmicpets.co.uk and confirm it arrives.
6. Submit the form once and confirm the FormSubmit activation email.
7. **Only now** cancel Webflow.

Step 7 last matters for one more reason: the original portraits are still
served from Webflow's CDN today. Copies now live in `assets/portraits/`, so
nothing is lost either way, but there is no reason to remove the fallback
before the replacement is proven.

### 4. Analytics (optional)

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
- See `LICENSE.md`. The artwork is all rights reserved, the website code is MIT.
- `robots.txt` asks the major AI training crawlers to stay away. That does not
  affect Google or Bing search rankings, `Google-Extended` covers Gemini
  training only and is separate from `Googlebot`. Delete the block to undo.
- **Aventi Bold needs a decision.** It is a commercial font, self-hosted in
  `assets/fonts/`. Serving it from a website is normal webfont use and is what
  Webflow was already doing. Committing the file to a *public* repo is closer to
  redistribution, which most font licences forbid. Either check your licence
  covers it, or swap `--display` in `site.css` for a free display serif. Playfair
  Display and Bodoni Moda are both close in feel and free for any use.
