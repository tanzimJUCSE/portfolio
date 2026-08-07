# Tanzim Mahfuz — personal website

A fast, static academic website. All of your content lives in plain text files under `src/data/`,
and you edit them through a **visual admin panel with forms** — no coding, no software to install.

- **Edit content:** [app.pagescms.org](https://app.pagescms.org) (sign in with GitHub)
- **Hosting:** GitHub Pages, free, automatic HTTPS
- **Publishing:** every save rebuilds and republishes the site in about a minute

---

## Part 1 — One-time setup

Your repository is `github.com/tanzimJUCSE/portfolio` and your domain is `tanzim-mahfuz.me`.
Everything in this project is already configured for both. Four steps remain, about 20 minutes
total, and you will not write any code.

### Step 1 — Photo and CV ✅ done

Both files are already in place and already wired up:

| File | Used for |
| --- | --- |
| `public/media/profile.jpg` | The homepage portrait |
| `public/media/Tanzim_Mahfuz_CV.pdf` | Every "Download CV" button |

To swap either one later, upload the new file in the admin panel's **Media** section and select it
under **Site settings → Profile photo / CV**.

### Step 2 — Upload the project to GitHub

Open [github.com/tanzimJUCSE/portfolio](https://github.com/tanzimJUCSE/portfolio). Because the
repository is still empty, the page offers **uploading an existing file** — click that.

Now drag in *everything* from this project folder, including the `.github` folder and the
`.pages.yml` file. Then click **Commit changes**.

Two things to know:

- **Do not upload `node_modules` or `dist`** if they exist on your machine. GitHub builds the site
  itself, and the included `.gitignore` covers them.
- **Check that `.github/workflows/deploy.yml` and `.pages.yml` actually arrived.** Some browsers
  quietly drop files whose names start with a dot. If either is missing from the file list after
  committing, use **Add file → Create new file**, type the full path as the filename (for example
  `.github/workflows/deploy.yml`), and paste the contents from this folder.

### Step 3 — Turn on GitHub Pages

In your repository: **Settings → Pages → Build and deployment → Source**, choose
**GitHub Actions**. That is the only setting to change.

Now open the **Actions** tab. A run called "Build and deploy website" will be working. When it turns
green — 60 to 90 seconds — the site is built and published. It will not look right at
`tanzimjucse.github.io/portfolio` yet, because the site is built for your own domain; finish Step 4
and use `tanzim-mahfuz.me` instead.

### Step 4 — Point tanzim-mahfuz.me at the site

The address `https://tanzim-mahfuz.me` is already saved in **Site settings → Website address**, and
the build writes the matching `CNAME` file automatically. Two places left to configure.

**In Namecheap** — **Domain List → Manage → Advanced DNS**, add these five records:

| Type | Host | Value |
| --- | --- | --- |
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `tanzimjucse.github.io.` |

Keep the trailing dot on the CNAME value. Delete any "Parking page" or "URL Redirect" records
Namecheap added by default, or they will shadow the site.

Optionally add four `AAAA` records on host `@` as well, so the site loads on IPv6-only networks:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

**In your repository** — **Settings → Pages → Custom domain**, type `tanzim-mahfuz.me` and click
**Save**. GitHub then checks DNS, which takes a few minutes to a few hours. Once the check passes,
tick **Enforce HTTPS**. Your site is live.

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

## Part 4 — Left for you to fill in

Small gaps I could not fill from your CV. Each one is a single field in **Site settings**, and the
site simply hides anything left empty.

- **ResearchGate and Web of Science links** — Site settings → Profile links. Your Google Scholar and
  ORCID links are already filled in; any link left empty is hidden from the site automatically.
- **Certification links** — your CV has "(view)" links that a PDF cannot hand over. Add them under
  Certifications if you want them clickable.
- **Project links** — EchoMind and the voice-controlled desktop manager had links on your CV.
- **Availability badge** — currently reads "Open to internships, full-time roles, and research
  collaborations". Edit or clear it in Site settings.
- **Your phone number** is deliberately left off the site to avoid spam. To publish it, fill in Phone
  and switch on "Show phone number publicly".

## Troubleshooting

**The Actions run failed.** Open the Actions tab and click the red run. Ninety-nine percent of the
time it is a YAML typo — a missing quote around a title containing a colon. The error message names
the file. Fixing it in the admin panel and saving triggers a fresh, successful run.

**My change isn't showing.** Give it 90 seconds, then hard-refresh (Ctrl+Shift+R). Check the Actions
tab shows a green tick for your latest save.

**The photo is a broken image.** The filename in Site settings → Profile photo must match the file in
`public/media/` exactly, including capital letters and the `.jpg` or `.png` ending.

**The domain shows a GitHub 404.** DNS is still propagating, or the custom domain in
Settings → Pages does not exactly match the domain you bought.
