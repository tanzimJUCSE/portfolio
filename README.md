# Tanzim Mahfuz — personal website

A fast, static academic website. All of your content lives in plain text files under `src/data/`,
and you edit them through a **visual admin panel with forms** — no coding, no software to install.

- **Edit content:** [app.pagescms.org](https://app.pagescms.org) (sign in with GitHub)
- **Hosting:** GitHub Pages, free, automatic HTTPS
- **Publishing:** every save rebuilds and republishes the site in about a minute

---

## Part 1 — One-time setup

Your repository is `github.com/tanzimJUCSE/portfolio` and your domain is `tanzim-mahfuz.me`.
Everything is configured for both, the code is pushed, and the first deploy has already succeeded.

**Only Step 4 is still outstanding.** Steps 1–3 are done and recorded here for reference.

### Step 1 — Photo and CV ✅ done

Both files are already in place and already wired up:

| File | Used for |
| --- | --- |
| `public/media/profile.jpg` | The homepage portrait |
| `public/media/Tanzim_Mahfuz_CV.pdf` | Every "Download CV" button |

To swap either one later, upload the new file in the admin panel's **Media** section and select it
under **Site settings → Profile photo / CV**.

### Step 2 — Push the project to GitHub ✅ done

This folder is a git repository whose `origin` is
[github.com/tanzimJUCSE/portfolio](https://github.com/tanzimJUCSE/portfolio), on the `main` branch.
All 56 project files were pushed, including `.github/workflows/deploy.yml` and `.pages.yml`.
`node_modules` and `dist` are excluded by `.gitignore`.

You should not need git again — the admin panel commits for you. But if you ever edit a file on this
computer, publish it with:

```bash
git add -A
git commit -m "describe what changed"
git push
```

### Step 3 — Turn on GitHub Pages ✅ done

Pages is building from **GitHub Actions**, and the first run of "Build and deploy website" finished
green. Every future push triggers another one; watch them in the repository's **Actions** tab.

The published site is not usable at `tanzimjucse.github.io/portfolio` — it is built for the root of
your own domain, so its links and images point at `/`, not `/portfolio/`. That is expected and
resolves itself the moment Step 4 is finished.

### Step 4 — Point tanzim-mahfuz.me at the site

The address `https://tanzim-mahfuz.me` is already saved in **Site settings → Website address**, and
the build writes the matching `CNAME` file automatically.

**In your repository — this is the one step still outstanding.** Go to **Settings → Pages → Custom
domain**, type `tanzim-mahfuz.me`, and click **Save**. Until you do this, GitHub does not know which
repository to serve for the domain and returns a 404, even though DNS is correct. A `CNAME` file in
the build output is *not* enough on its own when deploying through GitHub Actions — the domain has to
be registered once in these settings.

Once saved, GitHub issues a TLS certificate (usually a few minutes). When the **Enforce HTTPS**
checkbox becomes available, tick it.

**In Namecheap — already done.** For reference, these are the records the domain needs, under
**Domain List → Manage → Advanced DNS**:

| Type | Host | Value |
| --- | --- | --- |
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `tanzim-mahfuz.me.` |

Your `www` record points at the apex domain, which works because the apex has the four A records
above. GitHub's docs suggest `tanzimjucse.github.io.` instead; either is fine, so there is no need to
change it.

Delete any "Parking page" or "URL Redirect" records Namecheap adds by default, or they will shadow
the site. Optionally add four `AAAA` records on host `@` so the site loads on IPv6-only networks:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**Renewal:** `.me` costs roughly $15–20/year after the first year. If you would rather not pay that,
[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) sells `.com` at wholesale
(about $10–11/year with no renewal markup and free WHOIS privacy). Switching later is a DNS change
plus one field in **Site settings**, not a rebuild.

### Step 5 — Connect the admin panel

1. Go to [app.pagescms.org](https://app.pagescms.org) and **Sign in with GitHub**.
2. Grant it access to the `portfolio` repository.
3. Open the repository in Pages CMS. You will see the sidebar: Site settings, News & updates,
   Publications, Patents, Talks, Awards, Certifications, Experience, Education, Service, Projects,
   Publication venues, Beyond research, and Media.

That's it. This is where you will do all future edits.

---

## Part 2 — Day-to-day: how to update the site

Everything below happens at [app.pagescms.org](https://app.pagescms.org). Save, wait about a minute,
refresh your site. No other steps.

### A paper got accepted

1. **Publications → Add an entry**.
2. Fill in Title, Authors, Journal or conference, Year, Type, Status.
3. Optional extras: publisher link, preprint link, impact factor, CORE rank.
4. Turn on **Feature on homepage** if you want it in the homepage highlights.
5. For papers you cannot share publicly (GOMACTech, for example), turn on
   **Distribution restricted** — the site then lists the title and venue with a "Distribution
   restricted" notice and no link.
6. **Save**.

The publication count, the homepage statistics, and the year grouping all update themselves.

### Quick announcement

**News & updates → Add an item** at the top of the list. Two fields: when, and what happened. This is
the fastest possible update and it shows on the homepage.

### A new award, talk, or job

Same pattern — open the matching section, add an entry, save.

### New photos for the hobbies page

1. **Media → Upload** your photos.
2. **Beyond research →** pick a section → **Photos → Add** → choose the image, add a caption.
3. **Save**.

### A new version of your CV

**Media → Upload** the new PDF, then **Site settings → CV** and select it. Every download button on
the site updates at once.

---

## Part 3 — Where things live (only if you're curious)

```
src/data/            all of your content
  site.yml           name, role, bio, links, page intros
  publications/      one file per paper
  patents.yml  awards.yml  talks.yml  news.yml
  experience.yml  education.yml  service.yml
  projects.yml  certifications.yml  venues.yml  hobbies.yml
src/pages/           one file per page of the site
src/components/      reusable pieces (header, footer, publication card)
src/styles/global.css  all styling, including light and dark themes
public/media/        your photo, CV, and uploaded images
.pages.yml           tells the admin panel what forms to show
.github/workflows/   the automation that rebuilds and publishes the site
```

To run it on your own computer (never required):

```bash
npm install
npm run dev
```

---

## Part 4 — Optional things you may still want

All six profile links, all four certification links, and both project links are filled in from your
CV. Anything left empty is hidden from the site automatically, so nothing here is urgent.

- **Availability badge** — currently reads "Open to internships, full-time roles, and research
  collaborations". Edit or clear it in Site settings.
- **Your phone number** is deliberately left off the site to avoid spam. To publish it, fill in Phone
  and switch on "Show phone number publicly".
- **Hobby photos** — the three Beyond Research sections have text but no images yet. Upload some in
  **Media**, then add them under **Beyond research**.
- **Award and talk links** — your CV had a few commented-out links (the NYU CSAW winners page, the
  HeLLO CTF results, a UMaine news article). Awards and talks have no link field today; ask if you
  want one added.
- **A social preview image** — `ogImage` in Site settings is empty, so link previews on LinkedIn and
  X fall back to your profile photo. That is a reasonable default.

## Troubleshooting

**The Actions run failed.** Open the Actions tab and click the red run. Ninety-nine percent of the
time it is a YAML typo — a missing quote around a title containing a colon. The error message names
the file. Fixing it in the admin panel and saving triggers a fresh, successful run.

**My change isn't showing.** Give it 90 seconds, then hard-refresh (Ctrl+Shift+R). Check the Actions
tab shows a green tick for your latest save.

**The photo is a broken image.** The filename in Site settings → Profile photo must match the file in
`public/media/` exactly, including capital letters and the `.jpg` or `.png` ending.

**The domain shows a GitHub 404.** Almost always the **Custom domain** field in Settings → Pages is
empty or misspelled. DNS pointing at GitHub is not sufficient on its own: GitHub hosts millions of
sites on those same four IP addresses and uses that setting to decide which repository your domain
belongs to. Confirm it reads exactly `tanzim-mahfuz.me`. Failing that, DNS may still be propagating.

**HTTPS shows a certificate warning.** GitHub issues the certificate only after the custom domain is
saved and verified, which takes a few minutes. Until then use `http://`, and once **Enforce HTTPS**
is available, tick it.
