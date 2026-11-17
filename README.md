# Cafeit — Capstone Final Demo

**Cafeit** recommends cafés near Hanyang University ERICA based on *why* you're going (study, work, meeting friends, resting) instead of star ratings. It compares noise, outlets, Wi-Fi and seats, and shows live crowd reports (카페 LIVE) with how old each one is.

Front-end demo only: no database, no login. All cafés are fictional mock data around ERICA.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy (Vercel)

1. Push this folder to GitHub.
2. vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
4. Deploy. Every push to `main` redeploys automatically.

`vercel.json` rewrites all routes to `index.html`, so links like `/cafe/yeobaek` work on refresh.

## Demo script (~90 s)

1. **Home**: pick **공부하기** in the hero, and the list re-ranks (카페 여백 #1, 97점).
2. Tap **친구 만나기**, and the ranking flips (모임 로스터리 #1). This is the core idea.
3. Open **카페 여백**, then under 목적 적합도 tap the rows: 97 → 73 as you switch purpose.
4. Check the **지금 카페는** LIVE card: crowd, noise, seats, report age and confidence.
5. **저장** → it shows up in 즐겨찾기 and the 마이페이지 counter.
6. **나도 현황 남기기** → 여유 → 조용함 → 제보 등록하기 → **LIVE 피드 보기**: your report is on top, "방금 전".
7. Stay on 카페 LIVE: a new visitor report slides in every ~40 s.

**Reset before presenting:** press **Alt + Shift + R**, or click **데모 초기화** in the footer.

## Project structure

```
src/
  data/cafes.js        mock cafés, purposes, fit-score weights, seed LIVE reports
  lib/live.js          freshness rules, LIVE status summary, opening hours
  store.jsx            app state (purpose, saves, reports) + localStorage
  components/          Layout, CafeMap, CafeArt (illustrations), shared UI
  pages/               Home, Recommend, CafeDetail, Live, Report, Saved, MyPage
  styles.css           design tokens from DESIGN.md + all styles
```

## Swapping in real data / photos

- Edit `src/data/cafes.js` (names, areas, hours, prices, `attributes` 0–1 that drive the scores).
- To use photos, replace `<CafeArt … />` with `<img src="/photos/xxx.jpg" … />` and put the images in `public/photos/`.

## Team

SWag (Team 18): 임란, 디나, 아이라, 헤사, 샤피크, 나지하, 마이, 마이사랏
