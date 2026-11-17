# Cafeit: Design System & UI Spec (DESIGN.md)

The single source of truth for how Cafeit looks and behaves. It's built on the designer's **Cafeit Design System** sheet (logo, palette, Inter, buttons, brand keywords, moodboard) and the **low-fi wireframes**. Everything marked **🟡 proposed** is an extension that isn't in the designer's sheet yet; the designer should confirm or replace it.

Read with `PRD.md` (what to build). This file covers how it should look and feel.

---

## 1. Brand

**Personality keywords** (from the sheet): `#Intuitive` `#Friendly` `#Approachable` `#Warm` `#Calm` `#Personalized` `#Cozy`

What that means in UI:
- **Calm**: lots of whitespace, few colors per screen, no visual noise. Numbers (scores) are the loudest thing on the page.
- **Warm / Cozy**: warm off-white surfaces, rounded pill shapes, natural-light café photography.
- **Intuitive**: every attribute uses icon + label + value, the same layout everywhere.
- **Friendly / Approachable**: 해요체 copy, short sentences, encouraging empty states.
- **Personalized**: the user's current purpose is always visible and drives the scores shown.

**Tagline:** 오늘의 목적에 맞는, 나만의 카페.

### 1.1 Logo
Two overlapping blobs (tan back, brown front) with a white cup cut-out, plus the `Cafeit` wordmark with a coffee-bean tittle over the "i".

| Variant | Back blob | Front blob | Use |
|---|---|---|---|
| **Original** (default) | `#D3AB86` | `#6C3100` | Header, splash, favicon, presentation |
| **Brand palette** | `#E2C96D` | `#8C0200` | Marketing, posters, SNS |
| **Mono** | `#C0C0C0` | `#000000` | Print, low-color contexts |

Rules: wordmark color `#151515`. Minimum clear space = the height of the "C". Minimum size 24px tall (symbol only) / 80px wide (lockup). Don't recolor outside these 3 variants, stretch, or put it on photos without a solid backing. Header uses the horizontal lockup (symbol left, wordmark right) at 32px height. *The wireframes use a placeholder square; replace it with the logo.*

---

## 2. Color

### 2.1 Core palette (from the designer's sheet)

| Token | Hex | Name | Role |
|---|---|---|---|
| `--olive-900` | `#302F03` | Deep Olive (#Calm) | **Primary.** Primary buttons, active nav, selected chips, headings accent, focus ring |
| `--red-700` | `#8C0200` | Espresso Red (#Personalized) | **Accent.** LIVE indicator, rank-1 highlight, "busy" status, key emphasis. Use sparingly. |
| `--butter-300` | `#E2C96D` | Butter (#Warm) | **Highlight surface.** Score badges, "moderate" status, tips. Never as text color. |
| `--periwinkle-200` | `#C6CCE2` | Periwinkle (#Cozy) | **Info surface.** LIVE cards, info banners, partner/event tag background |
| `--black` | `#000000` | Black | Wordmark/mono logo only. Use `--ink` for text. |
| `--grey-300` | `#C0C0C0` | Silver | Dividers, disabled fills, placeholder imagery |
| `--white` | `#FFFFFF` | White | Cards, inputs |

### 2.2 Brand browns (from the logo)
| Token | Hex | Use |
|---|---|---|
| `--brown-700` | `#6C3100` | Logo, occasional warm accents (e.g. illustrations) |
| `--tan-300` | `#D3AB86` | Logo, decorative backgrounds, avatar fill |

### 2.3 🟡 Proposed supporting tokens
Needed for a working UI but missing from the sheet:

| Token | Hex | Why |
|---|---|---|
| `--cream-50` | `#FAF7F0` | Page background. Warmer than pure white, fits #Cozy. Cards stay white on it. |
| `--ink` | `#1A1A14` | Body text (softer than pure black, warm-tinted) |
| `--muted` | `#5F5E52` | Secondary text, meta (`도보 7분`, timestamps). 6.5:1 on white ✅ |
| `--border` | `#E6E4DC` | Card borders, dividers (decorative only) |
| `--border-strong` | `#86857A` | Input / radio-card / chip outlines. Meets 3:1 for UI boundaries ✅ |
| `--green-700` | `#4F5B12` | "여유 / 조용함" status (matcha/olive family from the moodboard). 7.4:1 on white ✅ |

> `#C0C0C0` on white is only **1.8:1**: fine for decorative dividers, **not** for input borders or any text. Use `--border-strong` for interactive outlines.

### 2.4 Semantic mapping

| Meaning | Color | Notes |
|---|---|---|
| Primary action | `--olive-900` bg, white text | 13.7:1 |
| Secondary action | white bg, `--olive-900` text + 1px olive border | as in the sheet |
| Selected chip / radio card | `--olive-900` bg, white text | |
| LIVE / real-time | `--red-700` dot + text | pulsing dot (see Motion) |
| Status: 여유 / 조용함 / 넉넉 | `--green-700` | always with icon + label |
| Status: 보통 | `--butter-300` bg with `--ink` text | |
| Status: 혼잡 / 시끄러움 / 만석 | `--red-700` | |
| Status: 정보 부족 | `--grey-300` bg, `--muted` text | |
| Partner / 이벤트 tag | `--periwinkle-200` bg, `--olive-900` text | must look different from score badges |
| Error (form) | `--red-700` | text + icon, not color alone |

**Rule:** color is never the only signal. Every status pairs color with an icon and a word.

### 2.5 Verified contrast pairs (WCAG 2.1)

| Foreground / background | Ratio | Pass |
|---|---|---|
| white / olive `#302F03` | 13.69 | AAA |
| white / red `#8C0200` | 9.89 | AAA |
| olive / butter `#E2C96D` | 8.35 | AAA |
| olive / periwinkle `#C6CCE2` | 8.57 | AAA |
| red / periwinkle | 6.19 | AA |
| olive / cream `#FAF7F0` | 12.80 | AAA |
| muted `#5F5E52` / cream | 6.12 | AA |
| butter / white | 1.64 | ❌ never use butter as text |
| tan `#D3AB86` / white | 2.11 | ❌ decorative only |

### 2.6 Usage ratio
Roughly **70% cream/white · 20% olive + ink · 7% periwinkle/butter surfaces · 3% red**. Red is a spice, not a sauce.

---

## 3. Typography

**Typeface:** **Inter** (from the sheet) for Latin and numerals. Inter has **no Korean glyphs**, so pair it with 🟡 **Pretendard** (Inter-based Korean font, free, visually matched).

```css
font-family: "Inter", "Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
font-feature-settings: "tnum" 1; /* on scores/stats only */
word-break: keep-all;           /* don't break Korean words mid-word */
```

### 3.1 Type scale (🟡 proposed)

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `display` | 56 / 64 | 700 | Big scores (`98점` numeral), home hero |
| `h1` | 32 / 40 | 700 | Page title (`카페 여백`, `Cafe LIVE 현황 제보`) |
| `h2` | 24 / 32 | 700 | Section title (`다시 가고 싶은 나의 장소`) |
| `h3` | 18 / 26 | 600 | Card title (café name) |
| `body` | 16 / 24 | 400 | Body, descriptions |
| `body-sm` | 14 / 22 | 400 | Card meta, form helper |
| `label` | 14 / 20 | 600 | Buttons, chips, field labels |
| `caption` | 12 / 16 | 500 | Timestamps, `(필수)`, badges |

Rules: max 3 sizes per card. Scores use `display`/`h1` with **tabular numerals** and a smaller `점` (50% size, `--muted`). Korean body text line-height ≥ 1.5. Letter-spacing: −0.02em on headings, 0 on body.

---

## 4. Spacing, layout, shape

### 4.1 Spacing (4px base)
`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80`
Card padding 20–24. Gap between cards 16. Section spacing 48–64.

### 4.2 Grid
| Breakpoint | Width | Columns | Margin | Gutter |
|---|---|---|---|---|
| Desktop (design width) | 1440 | 12 | content max 1200, centered | 24 |
| Tablet | 768–1199 | 8 | 32 | 20 |
| Mobile | 375–767 | 4 | 16 | 16 |

Desktop layouts from the wireframes:
- **카페 탐색:** list 4 cols + map 8 cols.
- **카페 상세:** main 8 cols + sticky sidebar 4 cols (LIVE, hours, location).
- **카페 LIVE:** 3-up card grid.
- **맞춤 추천:** single column of wide cards (max 1000).
- **마이페이지:** profile banner full width; saved cards 8 cols + 취향 card 4 cols.

### 4.3 Radius (🟡 proposed, consistent with the pill buttons)
| Token | Value | Use |
|---|---|---|
| `radius-pill` | 999px | Buttons, chips, tags, toggles (the sheet's buttons are pills) |
| `radius-lg` | 20px | Cards, sheets, modals |
| `radius-md` | 12px | Photos inside cards, amenity tiles, radio cards, inputs |
| `radius-sm` | 8px | Badges, small thumbnails |

### 4.4 Elevation
Mostly flat with borders (calm). One shadow for hover/raised: `0 8px 24px rgba(48,47,3,0.08)`. Modals/toasts: `0 16px 40px rgba(48,47,3,0.16)`.

---

## 5. Iconography
- Line icons, 1.5px stroke, rounded caps, 20/24px. 🟡 Suggested set: **Lucide** (matches the wireframe icons).
- Fixed icon per concept, used everywhere:

| Concept | Icon (Lucide) |
|---|---|
| 공부하기 | `book-open` |
| 작업하기 | `laptop` |
| 친구 만나기 | `messages-square` |
| 쉬어가기 | `armchair` |
| 혼잡도 | `users` |
| 소음 | `volume-1` / `volume-2` |
| 빈자리 | `armchair` |
| 와이파이 | `wifi` |
| 콘센트 | `plug` |
| 1인석 | `user` |
| 화장실 | `circle-check` (as in wireframe) |
| 저장 | `bookmark` (filled when saved) |
| 공유 | `share-2` |
| 위치 | `map-pin` |
| 제보 | `square-pen` |

---

## 6. Imagery & moodboard

From the designer's moodboard: blue wicker chairs in dappled shade, espresso steam, a pastry cross-section, people chatting at a café counter, matcha foam, a team around a wooden table, a latte pour, a tree canopy from below, croissants, a "You're invited" envelope.

Direction:
- **Warm natural light**, golden-hour tones, real textures (wood, wicker, foam, pastry).
- **People doing the purpose** (studying, chatting, working), never posed stock smiles.
- Close crops and textures work as section backgrounds or empty-state art.
- Café photos in cards: 4:3, `radius-md`, subtle bottom gradient only when text overlays.
- Use only photos the team took or royalty-free ones. No real people's faces without consent.

---

## 7. Components

Each component lists anatomy → variants → states. All interactive elements: **min 44×44px hit area**, visible focus ring `2px solid --olive-900, offset 2px`.

### 7.1 Button
- **Primary:** olive bg, white label, pill, height 48 (lg) / 40 (md) / 32 (sm), padding-x 24/20/14.
- **Secondary:** white bg, olive 1px border, olive label.
- **Ghost / text link:** olive label + `↗` or `→` (e.g. `취향 수정 ↗`, `방문 소식 남기기 →`).
- States: hover (primary: 8% lighter + raise shadow; secondary: periwinkle-50 bg), pressed (scale 0.98), disabled (grey-300 bg, muted text), loading (spinner replaces label, width locked).
- Icon placement: trailing for navigation (`자세히 보기 →`), leading for actions (`✎ 지금 카페 현황 남기기`).

### 7.2 Chip (filter / preference)
- Pill, height 36, label 14/600, optional leading icon.
- Off: white bg, `--border-strong` outline, ink text. On: olive bg, white text, optional check.
- Location chip (`📍 한양대학교 · 안산`) is a non-toggle variant with periwinkle bg.

### 7.3 Purpose selector 🟡 (Home, needs design)
- 4 large cards (desktop 4-up, mobile 2×2), icon 32px, label h3, one-line hint (`조용하고 콘센트 많은 곳`).
- Selected: olive bg, white text, check. Hover: raise.

### 7.4 Score badge / score display
- **Large (추천 card):** numeral `display` + `점` caption, right-aligned column separated by a vertical divider.
- **Small (list card, saved card):** butter pill `공부 98점`, caption 12/600, olive text.
- Always state the purpose next to the score. A bare "98" is meaningless.

### 7.5 Fit-score bars (상세 → 목적 적합도)
- Row: icon · label (w 96) · bar (flex) · score (tabular, w 48).
- Bar: 8px tall, track `--border`, fill `--olive-900`. The active purpose row gets a periwinkle row background + bold label.
- Animate fill 0 → value on first view (400ms ease-out).

### 7.6 Café card: list (카페 탐색)
- Horizontal: photo 96×96 left · name h3 · `area · 도보 N분` muted · score pill · amenities caption · bookmark top-right.
- Selected (synced with map pin): olive 2px border.

### 7.7 Café card: recommendation (맞춤 추천)
- Rank badge (top-left on photo, `1` `2` `3`; rank 1 uses red bg + white).
- Photo 200×160 · content (name, summary, key fact, live line with status dot, amenities + price) · score column (large score + button).
- Rank 1: 2px olive border + primary button. Others: 1px border + secondary button.
- Optional `제휴` tag (periwinkle) near the name, never near the score.

### 7.8 LIVE card (카페 LIVE feed)
- Photo (16:9) with freshness badge top-left (`● 2분 전 방문자 업데이트`, red dot when < 30 min).
- Name + area + `↗`.
- **Status trio:** 3 equal tiles (혼잡도 / 소음 / 빈자리), each icon + caption label + value (`여유`, `조용함`, `6석 이상`) colored by semantic status.
- Latest memo as a quote in body-sm, muted color, with quote marks. No italics (Korean italicizes poorly).

### 7.9 LIVE status card (상세 sidebar)
- Title `지금 카페는` + freshness line + confidence badge (`신뢰도 높음`).
- Same status trio, compact.
- `나도 현황 남기기 ✎` secondary button, full width.
- **`정보 부족` state:** grey trio with `–`, text `최근 3시간 동안 제보가 없어요`, CTA becomes primary `첫 제보 남기기`.

### 7.10 Stat tile (LIVE top)
- White card, icon top-right (periwinkle circle), big number `h1` + unit (`건`, `곳`), caption label.

### 7.11 Radio card (제보 form)
- Grid of 3, height 72, icon + title (label 16/600) + helper (body-sm muted), radio circle top-right.
- Off: white, `--border-strong`. Hover: periwinkle-tinted bg. On: olive border 2px + olive radio fill + status-colored icon.
- Keyboard: arrow keys move within a group (native radio semantics).

### 7.12 Form fields
- Label 14/600 + `(필수)` / `(선택)` caption muted.
- Select / input: height 48, `radius-md`, `--border-strong`, placeholder `--muted`.
- Textarea: min-height 120, counter bottom-right (`0/100`).
- Error: red 1.5px border + message with icon below (`카페를 선택해 주세요`).

### 7.13 Tabs
- Underline tabs (상세 section nav, 마이페이지): label 15/500 muted; active = ink 600 + 2px olive underline. Sticky under the header on 상세.

### 7.14 Amenity tile
- 4-up row, `radius-md`, border, icon 20 + label 14/600 (`무료 와이파이`, `자리마다 콘센트`, `1인석 12석`, `실내 화장실`). Unknown = muted `정보 없음`.

### 7.15 Header / navigation
- Desktop: height 72, white, bottom border. Logo · 4 nav items (active: ink 700 + 2px olive underline) · location chip · avatar (tan circle, initial `서연`).
- Mobile (≤767): top bar with logo + location; **bottom tab bar** (4 tabs, icon + label, active = olive).

### 7.16 Map
- Stylized static map (cream land, white roads, periwinkle water/park accents, muted labels).
- Pin: olive teardrop with score inside (`98`); selected = red, enlarged, with a preview card.
- `↻ 이 지역에서 다시 찾기` floating pill top-center.

### 7.17 Toast
- Bottom-center, olive bg, white text, icon, 3s auto-dismiss, optional action (`되돌리기`).
- Copy: `즐겨찾기에 저장했어요` · `저장을 취소했어요` · `링크를 복사했어요` · `제보가 등록됐어요. 고마워요!`

### 7.18 Empty & feedback states
- Illustration or cropped moodboard texture + one-line title + helper + 1 CTA.
- No results: `조건에 맞는 카페가 없어요` / `필터를 조금 줄여 볼까요?` / `필터 초기화`.
- No saves: `아직 저장한 카페가 없어요` / `카페 둘러보기`.
- Report success: big check (green-700), `제보가 등록됐어요`, `다른 학생들이 바로 확인할 수 있어요.`, `LIVE 피드 보기`.

### 7.19 Footer
- Cream bg with a top border, logo + tagline left, links right (`서비스 소개 · 카페 제안 · 이용약관 · 개인정보 처리방침`), caption size.

---

## 8. Motion
Calm, short, purposeful. Respect `prefers-reduced-motion` (disable all except opacity).

| Interaction | Spec |
|---|---|
| Hover raise (cards) | translateY(−2px) + shadow, 150ms ease-out |
| Chip / radio select | bg color 120ms |
| Score change on purpose switch | count up/down numerals, 400ms ease-out |
| Fit bars on first view | width 0 → value, 400ms, 60ms stagger |
| LIVE dot | 2s pulse (scale 1 → 1.8, opacity 0.6 → 0), infinite, only when < 30 min |
| Toast | slide up 12px + fade, 200ms; out 150ms |
| Page transitions | fade 150ms, no slides |

---

## 9. Content & voice

- **해요체**, warm and short: `자리가 넉넉해요`, `집중하기 좋아요`, `거의 만석이에요`.
- Lead with what the user cares about: `벽면 1인석마다 콘센트가 있어요`, not `콘센트: 있음`.
- Numbers: `도보 7분`, `98점`, `6석 이상`, `아메리카노 4,500원`, `12분 전`.
- Separators: middle dot ` · ` with spaces.
- Required/optional markers: `(필수)` / `(선택)` after labels, muted.
- Never imply a report is current if it's old: always show its age.
- Encourage contribution with impact framing: `서연님이 남긴 작은 기록이, 다른 학생의 좋은 한 자리를 만들고 있어요.`

---

## 10. Accessibility checklist
- [ ] Text contrast ≥ 4.5:1 (body) / 3:1 (≥ 24px or 19px bold); see §2.5.
- [ ] Interactive boundaries ≥ 3:1 (use `--border-strong`, not `#C0C0C0`).
- [ ] Status never conveyed by color alone (icon + word).
- [ ] Hit targets ≥ 44×44.
- [ ] Visible focus ring on every interactive element; logical tab order.
- [ ] Radio groups and tabs use native semantics / ARIA roles.
- [ ] Images have `alt` (café photos: `카페 여백 창가 1인석`).
- [ ] `lang="ko"` on the page; `word-break: keep-all`.
- [ ] Respect `prefers-reduced-motion`.

---

## 11. Design tokens (CSS)

```css
:root {
  /* core palette (designer) */
  --olive-900: #302F03;
  --red-700: #8C0200;
  --butter-300: #E2C96D;
  --periwinkle-200: #C6CCE2;
  --grey-300: #C0C0C0;
  --white: #FFFFFF;
  --black: #000000;
  /* logo */
  --brown-700: #6C3100;
  --tan-300: #D3AB86;
  --wordmark: #151515;
  /* proposed supporting */
  --cream-50: #FAF7F0;
  --ink: #1A1A14;
  --muted: #5F5E52;
  --border: #E6E4DC;
  --border-strong: #86857A;
  --green-700: #4F5B12;

  /* semantic */
  --bg: var(--cream-50);
  --surface: var(--white);
  --text: var(--ink);
  --text-muted: var(--muted);
  --primary: var(--olive-900);
  --on-primary: var(--white);
  --accent: var(--red-700);
  --status-good: var(--green-700);
  --status-mid: var(--butter-300);
  --status-bad: var(--red-700);
  --status-none: var(--grey-300);
  --info-surface: var(--periwinkle-200);
  --highlight: var(--butter-300);

  /* type */
  --font-sans: "Inter", "Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;

  /* shape */
  --radius-pill: 999px;
  --radius-lg: 20px;
  --radius-md: 12px;
  --radius-sm: 8px;

  /* elevation */
  --shadow-raise: 0 8px 24px rgba(48, 47, 3, 0.08);
  --shadow-overlay: 0 16px 40px rgba(48, 47, 3, 0.16);

  /* motion */
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 150ms;
  --dur-base: 200ms;
  --dur-slow: 400ms;
}
```

---

## 12. Screen checklist for the designer

| Screen | Wireframe | Hi-fi needed | Mobile frame |
|---|---|---|---|
| Home / purpose entry | ❌ missing | ✅ | ✅ |
| 카페 탐색 (search + map) | ✅ | ✅ | ✅ |
| 맞춤 카페 추천 | ✅ (fix nav state) | ✅ | ✅ |
| 카페 상세 | ✅ | ✅ | ✅ |
| 카페 LIVE feed | ✅ | ✅ | ✅ |
| LIVE 제보 form | ✅ | ✅ | ✅ |
| 제보 등록 완료 | ❌ missing | ✅ | optional |
| 즐겨찾기 | ❌ missing | ✅ | optional |
| 마이페이지 | ✅ | ✅ | optional |
| Empty / `정보 부족` states | ❌ missing | ✅ | — |

**Content fixes before hi-fi:** replace Seoul locations (신촌, 연희동, 서대문구 연세로, 연세대학교, 현대백화점) with ERICA-area ones; bind the review count (`리뷰 0` currently shows a review); replace the placeholder logo square with the real logo.
