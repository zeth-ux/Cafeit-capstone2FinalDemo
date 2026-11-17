# Cafeit: Product Requirements Document (Final Demo)

| | |
|---|---|
| **Product** | Cafeit (카페잇) |
| **Tagline** | 오늘의 목적에 맞는, 나만의 카페. |
| **Team** | SWag (Team 18): Hanyang University ERICA, SW Capstone Design |
| **Document owner** | 임란 (planning) · UI/UX: 마이사랏 |
| **Status** | Draft v1.0 for the final clickable demo |
| **Last updated** | 2026-11-14 |
| **Final submission** | 2026-11-30 |

Source material: midterm report (사업계획서 초안·중간보고서), designer's Design System sheet (`Cafeit_DesignSystem.pdf`), low-fi wireframes (`Cafeit_LowFid_Wireframes.pdf`), and the IA / user flow in the midterm report.

---

## 1. Summary

Cafeit recommends cafés around Hanyang University ERICA based on **why the user is going** (study, work, meeting friends, resting) instead of an overall star rating. Every café is described with the same structured attributes (noise, outlets, Wi-Fi, seating) and scored per purpose. Visitors keep the information current through **카페 LIVE**, quick 3-tap reports on crowd and noise, each shown with how old it is.

The final deliverable is a **clickable front-end demo**. There is no database and no authentication, and all data is mock data. The demo must feel like a real product during a ~90-second walkthrough in the final presentation.

## 2. Problem

From the midterm report and the team survey (n = 91 valid responses):

- **76.9% (70/91)** said they struggle to find a café that suits their visit purpose.
- Map apps (네이버 지도) rank by overall rating and reviews, but a highly rated café can be a bad place to study, or a bad place to chat.
- Noise, outlets, seats, and Wi-Fi are scattered across free-text reviews, so users read many reviews or just show up and hope.
- Existing niche tools (카공지도) cover studying only and have little fresh, user-contributed data.

## 3. Goals and non-goals

### Goals (demo)
1. Show **purpose-based recommendation** end to end: pick a purpose → set conditions → ranked results → café detail.
2. Make **per-purpose fit scores** understandable at a glance: the same café scores differently for different purposes.
3. Show **카페 LIVE** as trustworthy: every report shows its age, and stale data is labelled `정보 부족`.
4. Make contributing feel effortless: a LIVE report takes **3 taps** plus an optional memo.
5. Look like a finished product in the designer's visual language (see `DESIGN.md`).

### Non-goals (this phase)
- Real database, API, accounts, login, or sign-up. The user is always logged in as the demo persona **서연**.
- Real map SDK (Kakao/Naver/Google). Use a stylized static map with positioned pins.
- Real recommendation engine. Scores are precomputed in mock data, with a documented formula (§8).
- Partner (B2B) dashboard for café owners. It's mentioned in the business model, but out of scope for the demo.
- Native apps.

## 4. Target users

| Persona | Who | Purpose | Cares about |
|---|---|---|---|
| **김서연** (primary, demo persona) | 22, ERICA 3rd-year, ISTJ | 공부하기: solo study, exam prep, laptop for hours | Quiet, outlets, Wi-Fi, 1인석, knowing it's quiet *before* going |
| **박민준** | 24, 4th-year, ENFP | 친구 만나기 / 팀플: groups, chatting | Group tables, free seats, atmosphere, map comparison |
| **이준호** | 32, IT worker, INTJ | 작업하기: remote work | Stable Wi-Fi, outlets, comfortable seats, recent updates |

Initial market: ERICA students and staff. Later: Ansan young adults, remote workers, residents.

## 5. Platform and scope decisions

| Decision | Choice for demo | Note |
|---|---|---|
| Form factor | **Desktop web (1440px design width), responsive to 375px mobile** | The designer's wireframes are desktop. The midterm report says "mobile web". Both must work, and the presentation will use desktop. **Open question (§13).** |
| Language | **Korean UI** | Matches the report, wireframes, and audience. |
| Data | Mock JSON in the front end | 8–10 fictional cafés near ERICA. |
| State | In-memory, optionally `localStorage` | Saves, reports, and preferences persist during the demo session. |
| Auth | None | Header always shows 서연 as signed in. |

## 6. Information architecture

From the midterm IA; wireframes confirm the 4 top-level menus.

```
홈 (purpose entry)
├── 카페 탐색      검색창 · 방문 목적 선택 · 주변 카페(지도) · 조건 필터 · 카페 목록 → 맞춤 추천 → 카페 상세
├── 카페 LIVE      최근 현황 목록 · 혼잡도 정보 · 방문 현황 제보 · 제보 등록 완료
├── 즐겨찾기       즐겨찾기 목록 · 저장한 카페 상세
└── 마이페이지     내 정보 · 내 리뷰 · 방문 소식 · 취향 설정
```

Global header: `Cafeit` logo · 카페 탐색 · 카페 LIVE · 즐겨찾기 · 마이페이지 · location chip `한양대학교 · 안산` · avatar `서연`.
Global footer: `Cafeit 오늘의 목적에 맞는, 나만의 카페.` · 서비스 소개 · 카페 제안 · 이용약관 · 개인정보 처리방침.

## 7. Core user flow (demo script)

Follows 김서연's journey map: 필요 인식 → 카페 탐색 → 조건 비교 → 방문 결정 → 방문 및 공유.

1. **Home** → picks `공부하기`.
2. **맞춤 카페 추천**: preferences prefilled (`조용한 공간`, `와이파이 필수`, `콘센트 필수`, `1인석 선호`, `한양대학교 · 도보 15분`). Ranked list: #1 98점, #2 94점, #3 87점.
3. Clicks **자세히 보기** on #1 → **카페 상세**.
4. **목적 적합도** shows 공부하기 98 · 작업하기 95 · 친구 만나기 72 · 쉬어가기 88. *The "aha" moment: switching purpose changes the headline score.*
5. Checks the **LIVE card**: `여유 · 조용함 · 6석 이상 · 12분 전 업데이트`.
6. Clicks **저장** → toast `즐겨찾기에 저장했어요`.
7. At the café: **나도 현황 남기기** → report form, prefilled with this café → 혼잡도 `여유` → 소음 `조용함` → **제보 등록하기** → confirmation.
8. The new report appears at the top of **카페 LIVE** with `방금 전`.

Secondary flows: browse via **카페 탐색** (search + map + list); view saved cafés in **즐겨찾기**; **마이페이지 → 나의 공부 취향 → 이 취향으로 카페 찾기** (re-enters step 2).

## 8. Functional requirements

Priority: **P0** = must ship in the demo · **P1** = should ship · **P2** = nice to have.

### 8.1 Home / purpose entry. *Not in wireframes; needs design.* (P0)
- FR-H1 Hero question: `어떤 목적으로 카페에 가시나요?`
- FR-H2 Four large purpose cards: 📖 공부하기 · 💻 작업하기 · 💬 친구 만나기 · ☕ 쉬어가기. Selecting one opens 맞춤 카페 추천 with that purpose.
- FR-H3 Secondary entry points: search bar (→ 카페 탐색), a LIVE summary strip (`최근 30분 안에 들려온 소식 N건`).

### 8.2 카페 탐색: search and map (wireframe 1) (P0)
- FR-E1 Filter chips: `영업 중`, purpose chip (e.g. `공부하기`), `조용한 공간`, `콘센트`, `전체 필터`. Chips toggle on/off; active chips use the selected style.
- FR-E2 Search input with clear (×) and `검색` button. Searches café name and area. Empty result → empty state.
- FR-E3 View toggle: `지도 + 목록` / `목록만`.
- FR-E4 List cards: photo, name, `area · 도보 N분`, `공부 목적 98점` (current purpose), key amenities (`와이파이 · 1인석 · 콘센트`), bookmark icon. Shows 3, then `카페 N곳 더 보기`.
- FR-E5 Map: pins for listed cafés. Selecting a pin or card highlights both and shows a preview (`도보 7분 · 22:00까지`, `상세 정보 보기 ↗`). `이 지역에서 다시 찾기` button (P1: mock behavior).
- FR-E6 Cards and previews link to 카페 상세.

### 8.3 맞춤 카페 추천 (wireframe 4) (P0)
- FR-R1 Preference bar shows active conditions as chips (`한양대학교 · 도보 15분`, `조용한 공간`, `와이파이 필수`, `콘센트 필수`, `1인석 선호`, `여유로운 곳`) and a `취향 수정 ↗` link (opens a filter panel/modal, P1).
- FR-R2 Ranked list (top 3, P1: more). Each card has a rank badge, photo, name, one-line summary (`작은 대화도 적은, 차분한 공부 공간`), a key fact (`벽면 1인석마다 콘센트가 있어요`), a live line (`지금은 여유 · 빈자리 6석 이상`), amenities + price (`아메리카노 4,500원`), a large score (`98점`), `자세히 보기 →`, and bookmark.
- FR-R3 Rank 1 is visually emphasized (heavier border, primary button). Others use the secondary button.
- FR-R4 Ranking = fit score for the selected purpose. **Partner status never changes rank or score.** Partner cafés may show a separate `제휴` / `이벤트` tag.
- FR-R5 Nav highlights **카페 탐색**. *(The wireframe highlights 즐겨찾기, which is a bug to fix.)*

### 8.4 카페 상세 (wireframe 6) (P0)
- FR-D1 Header: café name (H1), `저장` toggle (`저장됨` when on), `공유하기` (copies the link and shows a toast).
- FR-D2 Gallery: 1 large + 2 small photos, `사진 12장 보기` (P2 lightbox).
- FR-D3 Section tabs (anchor scroll, sticky): 공간 소개 · 목적 적합도 · 카페 현황 · 리뷰 N · 위치 안내.
- FR-D4 공간 소개: atmosphere tags (`잔잔한 음악`, `햇살 드는 창가`, `혼자 머물기 좋아요`, `노트북 이용 가능`).
- FR-D5 목적 적합도: 4 rows with icon, label, bar, and score. The currently selected purpose is highlighted. Clicking a row switches the active purpose across the app (P1).
- FR-D6 Amenity tiles: `무료 와이파이`, `자리마다 콘센트`, `1인석 12석`, `실내 화장실`. Show only facts we have; unknown = `정보 없음`.
- FR-D7 Reviews: purpose-tagged review (`공부하기 추천`, `2026년 10월 24일 방문 · 공부하기`), `리뷰 N개 모두 보기` (P1 expand). Review count in the tab must match.
- FR-D8 Sidebar LIVE card: `지금 카페는` → 혼잡도 / 소음 / 빈자리 with values, freshness label, `나도 현황 남기기` button (→ report form prefilled with this café).
- FR-D9 Sidebar hours: `매일 09:00–22:00`, `마지막 주문 21:30 · 정기 휴무 없음`, open/closed status.
- FR-D10 Sidebar location: mini map, address, `도보 길찾기` button (P2: opens an external map link; demo can show a toast).

### 8.5 카페 LIVE: feed (wireframe 2) (P0)
- FR-L1 Primary CTA at top: `지금 카페 현황 남기기 ✎` → report form.
- FR-L2 Three stat tiles: `최근 30분 안에 들려온 소식 N건`, `지금 여유로운 카페 N곳`, `조용하다고 알려준 카페 N곳`. Values computed from mock + session reports.
- FR-L3 Filter chips: `한양대학교 · 안산` (location), `전체 현황`, `여유로운 곳`, `조용한 곳`, `저장한 카페`.
- FR-L4 Cards: photo with freshness badge (`2분 전 방문자 업데이트`), name, area, 혼잡도 / 소음 / 빈자리 trio with icons, the latest memo as a quote, link to detail.
- FR-L5 Prompt card at the bottom: `지금 카페에 계신가요? 방문 소식 남기기 →`.
- FR-L6 Sorted by most recent report.

### 8.6 카페 LIVE: 현황 제보 form (wireframe 3) (P0)
- FR-F1 Title `Cafe LIVE 현황 제보`, subtitle `방문한 카페의 현황을 간단히 공유해 주세요.`
- FR-F2 `카페 선택 (필수)` select; prefilled when entered from a café page.
- FR-F3 `혼잡도 (필수)` radio cards: `여유 – 자리가 넉넉해요` · `보통 – 적당히 있어요` · `혼잡 – 거의 만석이에요`.
- FR-F4 `소음 수준 (필수)` radio cards: `조용함 – 집중하기 좋아요` · `보통 – 대화 소리가 적당해요` · `시끄러움 – 많이 시끄러워요`.
- FR-F5 `추가 메모 (선택)` textarea, placeholder `예) 창가 자리가 좋아요. 지금은 집중하기 좋아요.`, max 100 characters with a counter.
- FR-F6 `취소` (secondary) / `제보 등록하기` (primary). Primary stays disabled until the required fields are set.
- FR-F7 On submit: success state `제보가 등록됐어요. 고마워요!` (IA: 제보 등록 완료), then return to the LIVE feed with the new card on top marked `방금 전`. The café's LIVE card and the stat tiles update.
- FR-F8 Optional: `빈자리` (6석 이상 / 3–5석 / 1–2석 / 없음). The wireframe's LIVE cards show 빈자리 but the form doesn't collect it. **Decide (§13).**

### 8.7 즐겨찾기 (P1). *No wireframe; needs design.*
- FR-S1 Grid of saved cafés with the fit score for the current purpose, the latest LIVE status, and an unsave button.
- FR-S2 Empty state: `아직 저장한 카페가 없어요` + `카페 둘러보기` button.

### 8.8 마이페이지 (wireframe 5) (P1)
- FR-M1 Profile header: avatar, `서연`, `프로필 수정 ↗`, counters `저장한 카페 2 · 내가 쓴 리뷰 3 · 남긴 방문 소식 5`. Counters reflect session actions.
- FR-M2 Tabs: 저장한 카페 · 내 리뷰 · 방문 소식 · 취향 설정.
- FR-M3 `다시 가고 싶은 나의 장소`: saved-café cards with score badge (`공부 98점`).
- FR-M4 `나의 공부 취향` card: 주로 가는 동네, 공간 분위기, 선호하는 자리, 꼭 필요한 시설 → `이 취향으로 카페 찾기 →` (→ 맞춤 카페 추천).
- FR-M5 `최근에 쓴 리뷰` + `방문 소식 남기기 →` banner (`서연님이 남긴 작은 기록이, 다른 학생의 좋은 한 자리를 만들고 있어요.`).

### 8.9 Global (P0)
- FR-G1 Header nav with the active state on the current section; works on every screen.
- FR-G2 Toasts for save, unsave, share, and report submitted.
- FR-G3 Responsive: on ≤768px the nav collapses to a bottom tab bar (4 tabs), the map sits above the list in a toggle, and the sidebar stacks below the main content.
- FR-G4 Every screen in the wireframe prototype links is reachable by clicking; no dead buttons in the demo path.

## 9. Fit-score model (mock)

Each café has normalized attributes (0–1):

| Attribute | Source |
|---|---|
| `quiet` | inverse of baseline noise (team survey and visits) |
| `outlets` | share of seats with outlets |
| `wifi` | measured or reported stability |
| `soloSeats` | 1인석 availability |
| `groupSeats` | 4+ person tables |
| `comfort` | sofa / cushioned seating |
| `space` | spaciousness, crowd baseline |
| `ambience` | music, light, view |

Per-purpose weights (sum = 1):

| Purpose | quiet | outlets | wifi | soloSeats | groupSeats | comfort | space | ambience |
|---|---|---|---|---|---|---|---|---|
| 공부하기 | .30 | .20 | .15 | .15 | 0 | .05 | .10 | .05 |
| 작업하기 | .20 | .20 | .25 | .10 | 0 | .10 | .10 | .05 |
| 친구 만나기 | 0 | 0 | .05 | 0 | .30 | .20 | .20 | .25 |
| 쉬어가기 | .15 | 0 | 0 | .05 | .05 | .30 | .15 | .30 |

`score = round(100 × Σ weight × attribute)`. In the demo, scores are precomputed in mock data; the formula exists so the team can explain it when asked. **Partner/payment status is not an input.**

## 10. LIVE freshness and trust rules

| Report age | Label | Visual |
|---|---|---|
| < 30 min | `N분 전` | Full color, LIVE dot |
| 30 min – 2 h | `N분 전` / `N시간 전` | Normal |
| 2 – 3 h | `N시간 전` | Muted, "may have changed" |
| > 3 h or no reports | `정보 부족` | Neutral state; show baseline info instead |

Confidence badge (from the midterm deck): **낮음 / 보통 / 높음**, based on the number of reports in the last 2 h (0–1 / 2–3 / 4+) and recency. A displayed status is the most common value among recent reports.

## 11. Mock data spec

- **8–10 fictional cafés** near ERICA: 한대앞역, 사동, 본오동, ERICA 정문 / 후문. Keep the designer's names (카페 여백, 오후의 온도) and replace Seoul references (see §13).
- Per café: `id, name, area, walkMinutes, address, hours, lastOrder, closedDays, price (아메리카노), photos[], tags[], amenities{wifi, outlets, soloSeats, toilet}, attributes{…§9}, scores{study, work, social, rest}, summary, keyFact, partner (bool), reviews[], live[] (reports with timestamps)`.
- LIVE timestamps are **relative to page load** (e.g. `now − 2 min`) so the demo always looks live.
- Cafés should cover the spread: 2–3 strong study spots, 2 group spots, 1 work-friendly, 1 loud/popular (low study score, to make the contrast obvious), and 1 with no recent reports (shows `정보 부족`).
- Photos: royalty-free or team-taken photos only, matching the moodboard (warm, natural light).

## 12. Success metrics

**Demo (final presentation)**
- The full demo path (§7) runs with zero dead ends in ≤ 90 s.
- Usability test (planned 11/9–11/16): ≥ 80% of testers complete "find a quiet café with outlets and save it" without help; ≥ 80% can explain what the score means.

**Product (post-launch, from the report)**
- WAU, recommendation CTR, LIVE reports per café per day, information freshness (% of cafés with a report < 2 h), partner paid-conversion rate.

## 13. Open questions and design-review notes

| # | Item | Proposed resolution | Owner |
|---|---|---|---|
| 1 | Wireframes are desktop; the report says mobile web. | Desktop-first for the presentation, responsive required. Designer to provide at least the Home + 추천 + 상세 mobile frames. | 마이사랏 |
| 2 | Wireframe content uses Seoul locations (신촌 · 창천동, 연희동, 서대문구 연세로, `서연 · 연세대학교`, 현대백화점). | Replace with ERICA-area places (한대앞역, 사동, ERICA 정문) and `서연 · 한양대학교 ERICA`. Consider renaming `연희의 문장` (it refers to 연희동). | Designer + 임란 |
| 3 | 맞춤 카페 추천 highlights 즐겨찾기 in the nav. | Highlight 카페 탐색. Design a real 즐겨찾기 screen. | 마이사랏 |
| 4 | No Home / purpose-selection screen, the core differentiator. | Design it (FR-H1–H3). | 마이사랏 |
| 5 | Detail tab says `리뷰 0` but shows a review. | Bind the count to data. | Dev |
| 6 | LIVE cards show 빈자리, but the form doesn't collect it. | Add an optional 빈자리 field, or derive it from 혼잡도. | Team |
| 7 | 제보 등록 완료 and empty / `정보 부족` states have no wireframes. | Design them. | 마이사랏 |
| 8 | Purposes: wireframes use 4 (공부/작업/친구/쉬어가기); the report also mentions 팀플 and 데이트. | Keep 4 for the demo; treat 팀플 as part of 친구 만나기. | 디나 |
| 9 | Inter has no Korean glyphs. | Pair with Pretendard (see DESIGN.md). | 마이사랏 |

## 14. Timeline (from the midterm schedule)

| Dates | Milestone |
|---|---|
| 11/09 – 11/16 | User testing of the demo flow, check that recommendations match purpose/conditions |
| 11/14 – 11/18 | Hi-fi screens in the design system; front-end build of the P0 screens |
| 11/17 – 11/27 | Iterate on test feedback, P1 screens, write the report section |
| 11/23 – 11/30 | Final QA, presentation rehearsal, submission |
