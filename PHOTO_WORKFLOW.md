# Photo Upload Workflow — ikzienix β

Follow this exactly when stock arrives and photos are ready.

---

## Step 1 — Shoot the photos

**Minimum:** 1 photo per pair (25 total)  
**Recommended:** 2–3 per pair (front + 3/4 angle + detail)

**Shot checklist per pair:**
- [ ] Clean white or dark background (consistent across all 25)
- [ ] Good lighting — no harsh shadows on the lenses
- [ ] Straight-on front view as the **hero shot** (this is the thumbnail)
- [ ] Optional: 3/4 angle, side profile, on-face lifestyle shot

---

## Step 2 — Edit & export

**Dimensions:** 1200×1200px minimum (square)  
**Format:** JPG, quality 85–90%  
**Size:** Keep under 500KB per image after compression

**Free tools:**
- **Squoosh** (squoosh.app) — drag, resize, compress, done
- **Lightroom Mobile** (free) — if you want consistent colour grading

---

## Step 3 — Name the files

Name each file exactly after its product slug. The slug is visible in the URL when you visit the product page (e.g. `/shop/shadow-classic`).

| Product         | Filename                  |
|-----------------|---------------------------|
| Shadow Classic  | `shadow-classic.jpg`      |
| The Default     | `the-default.jpg`         |
| Zero            | `zero.jpg`                |
| Flat Black      | `flat-black.jpg`          |
| Frame           | `frame.jpg`               |
| Oversized Void  | `oversized-void.jpg`      |
| Wide Load       | `wide-load.jpg`           |
| The Block       | `the-block.jpg`           |
| Low Profile     | `low-profile.jpg`         |
| Signal          | `signal.jpg`              |
| Sport Wrap      | `sport-wrap.jpg`          |
| Circuit         | `circuit.jpg`             |
| Track           | `track.jpg`               |
| Flex            | `flex.jpg`                |
| Node            | `node.jpg`                |
| Retro Arc       | `retro-arc.jpg`           |
| Dot             | `dot.jpg`                 |
| Orbit           | `orbit.jpg`               |
| Small Hours     | `small-hours.jpg`         |
| Lens            | `lens.jpg`                |
| The Statement   | `the-statement.jpg`       |
| Glitch          | `glitch.jpg`              |
| Error           | `error.jpg`               |
| Patch Notes     | `patch-notes.jpg`         |
| Null            | `null.jpg`                |

If you have multiple photos per pair, name them:
- `shadow-classic.jpg` (hero/thumbnail)
- `shadow-classic-2.jpg`
- `shadow-classic-3.jpg`

---

## Step 4 — Drop files into the project

Place all photos here:

```
site/
└── public/
    └── images/
        └── products/
            ├── shadow-classic.jpg
            ├── the-default.jpg
            └── ... (all 25)
```

Create the folder if it doesn't exist.

---

## Step 5 — Run the update script

```bash
cd "C:\Users\night\Documents\Brands\ikzienix\site"
npm run photos:update
```

This script scans the `public/images/products/` folder, matches files to products by slug, and updates the database automatically. No manual editing needed.

It will print:
```
✓ shadow-classic     → /images/products/shadow-classic.jpg (+ 2 extras)
✓ the-default        → /images/products/the-default.jpg
  retro-arc          → no photo yet, keeping placeholder
...
```

---

## Step 6 — Check it locally

```bash
npm run dev
```

Open localhost:3000/shop and verify every card shows a real photo.

---

## Step 7 — Deploy

```bash
git add .
git commit -m "add product photos — beta drop"
git push
```

Vercel picks it up automatically and deploys within ~60 seconds.

---

## Notes

- Photos in `/public/images/products/` are served by Vercel's CDN automatically — no extra setup needed
- You can update photos any time by replacing the file and rerunning `npm run photos:update`
- If a slug has no matching photo file, the placeholder image stays — nothing breaks
