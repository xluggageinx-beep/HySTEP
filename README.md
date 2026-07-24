# Handoff: EZ-STEP (Hy-STEP) Landing Page

## Overview

**EZ-STEP** (브랜드명 대안: **Hy-STEP**)는 치위생학과 학생·교수를 위한 웹 기반 임상실습 디지털 차트 SaaS 서비스입니다. 본 핸드오프는 해당 서비스를 **학교/기관에 소개하고 주문받는 랜딩 페이지**의 하이파이 디자인 프로토타입입니다.

- 타겟: 치위생학과 교수 · 학과장 · 보건계열 대학 관계자
- 목표 액션: **"우리 학교 차트 만들기"** CTA 클릭 → 이메일 문의 (`dlwlalsdentalchart@gmail.com`)
- 톤: 모던 SaaS × 의료/교육 신뢰감 (Linear/Notion 톤 + 딥 네이비 브랜드 컬러)

---

## About the Design Files

이 번들에 포함된 파일들은 **HTML로 제작된 디자인 레퍼런스**입니다 — 최종 결과물의 외관·인터랙션·구조를 시각적으로 확인할 수 있도록 만든 프로토타입으로, 프로덕션 코드로 그대로 복사해 배포하는 것을 목적으로 하지 않습니다.

이 프로토타입은 React + Babel Standalone(브라우저 트랜스파일)로 구성되어 있어 실서비스에는 부적합합니다. 개발자의 임무는:

1. 대상 코드베이스의 기존 프론트엔드 환경(Next.js / Vite + React / Nuxt / SvelteKit 등)이 있다면 → 그 환경의 컨벤션·컴포넌트·디자인 토큰 시스템에 맞게 **본 디자인을 재구현**
2. 대상 코드베이스가 아직 없다면 → 프로젝트에 가장 적합한 프레임워크(권장: **Next.js 14 App Router + TailwindCSS**)를 선택해 **본 디자인을 구현**

---

## Fidelity

**High-fidelity (hifi)** — 최종 컬러, 타이포그래피, 간격, 인터랙션이 모두 확정된 픽셀 단위 목업입니다. 개발자는 이 디자인을 **픽셀 퍼펙트**하게 재현해야 합니다. 컬러 hex 값, 폰트, 그림자, 라운드 값이 모두 명시되어 있습니다.

---

## Tech Stack (원본 프로토타입)

| 항목 | 사용 |
|---|---|
| 마크업 | 순수 HTML5 |
| 스타일 | CSS3 (CSS Variables 기반 디자인 토큰) |
| 렌더링 | React 18.3.1 + Babel Standalone |
| 폰트 | Pretendard Variable (한글), Inter (Latin), JetBrains Mono (숫자·라벨) |
| 아이콘 | 인라인 SVG (24×24 stroke-based line icons) |
| 인터랙션 | IntersectionObserver(scroll reveal) + CSS Transitions |

> **프로덕션 재구현 시 권장 스택**: Next.js 14 (App Router) + TailwindCSS + shadcn/ui, 또는 기존 코드베이스 컨벤션 우선.

---

## Design Tokens

### Colors (기본 팔레트 = Navy Blue)

```css
--brand-900: #0A1E4A;   /* 가장 어두운 네이비 (footer 시작) */
--brand-800: #0D2A5E;   /* 히어로 그라디언트 시작 */
--brand-700: #123878;
--brand-600: #1E5FBF;
--brand-500: #1E74D4;   /* 히어로 그라디언트 끝 · 프라이머리 액센트 */
--brand-400: #4A96E8;
--brand-300: #7EC8FF;   /* 액센트 · 하이라이트 */
--brand-100: #E8F1FE;   /* eyebrow 배경, 아이콘 컨테이너 */
--brand-50:  #F4F8FF;

/* Neutrals */
--ink-900: #0B1220;     /* 본문 텍스트, primary 버튼 배경 */
--ink-800: #17223A;
--ink-700: #2A3654;
--ink-500: #5A6785;     /* 서브 텍스트 */
--ink-400: #7B87A5;     /* placeholder, meta */
--ink-300: #A9B2CB;
--ink-200: #D8DEEC;
--ink-100: #EBEFF8;
--ink-50:  #F5F7FC;

--bg:      #F8FAFC;     /* 페이지 배경 */
--card:    #FFFFFF;
--line:    rgba(11, 18, 32, 0.08);
--line-strong: rgba(11, 18, 32, 0.14);

/* Semantic (달성도 뱃지) */
--met:     #2B9868  bg:rgba(59, 189, 137, 0.14)  border:rgba(59, 189, 137, 0.3)
--partial: #B87D14  bg:rgba(245, 179, 66, 0.15)  border:rgba(245, 179, 66, 0.35)
--unmet:   #C9464A  bg:rgba(233, 100, 100, 0.14) border:rgba(233, 100, 100, 0.32)
```

### Alternate Palettes (Tweaks 토글로 제공, 프로덕션은 Navy 확정)

- **Teal**: `#0B3B4A → #14A8A0`, 액센트 `#8CE8DD`
- **Indigo**: `#1A1B4B → #4F46E5`, 액센트 `#A5B4FC`
- **Slate**: `#0F172A → #334155`, 액센트 `#38BDF8`

프로덕션에서는 **Navy 기본값 확정** — 다른 팔레트는 실제 서비스에 반영하지 않아도 됩니다.

### Typography

```css
font-family: "Pretendard", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
font-family (mono): "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

| Role | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero H1 | `clamp(38px, 5.6vw, 68px)` | 800 | 1.05 | -0.03em |
| Section title (h2) | `clamp(30px, 3.6vw, 46px)` | 800 | 1.15 | -0.025em |
| Card title (h3/h4) | 16-18px | 700 | 1.2 | -0.01em |
| Body | 15-16px | 400-500 | 1.6-1.7 | 0 |
| Small / meta | 12-14px | 500-600 | 1.5 | 0 |
| Eyebrow (uppercase) | 12px | 600 | 1 | 0.08em |
| Mono numbers | 11-13px | 600-700 | 1 | 0.02em |

### Spacing

- Container max-width: **1240px**
- Container padding: `clamp(20px, 4vw, 40px)`
- Section padding (vertical): `clamp(70px, 10vw, 120px)`

### Border Radius

```css
--r-sm: 8px;    /* small pills, inputs */
--r-md: 14px;   /* cards, inner elements */
--r-lg: 20px;   /* feature cards, addon cards */
--r-xl: 28px;   /* CTA hero card */
button, pill:  999px (fully rounded)
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(11, 18, 32, 0.04), 0 2px 6px rgba(11, 18, 32, 0.04);
--shadow-md: 0 4px 12px rgba(11, 18, 32, 0.06), 0 12px 32px rgba(11, 18, 32, 0.06);
--shadow-lg: 0 12px 32px rgba(13, 42, 94, 0.12), 0 24px 60px rgba(13, 42, 94, 0.16);
```

### Motion

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease`)
- Standard transition: 0.2s (hover), 0.3-0.35s (color inversion), 0.5-0.7s (scroll reveal)
- Reveal-on-scroll: `opacity 0→1` + `translateY(20px)→0`, stagger `40-60ms` between siblings

---

## Screens / Views

랜딩 페이지는 **단일 페이지 스크롤형**입니다. 섹션 순서는 아래와 같습니다.

### 1. Fixed Header

- **Position**: `position: fixed; top: 0; z-index: 100`
- **Height**: 64px (padding 16px 상하)
- **초기 상태**: 투명 배경, 흰 텍스트 (히어로 위 오버레이)
- **스크롤 후** (`window.scrollY > 40`):
  - 배경: `rgba(255, 255, 255, 0.72)` + `backdrop-filter: blur(20px) saturate(180%)`
  - 하단 보더: 1px `var(--line)`
  - 로고·nav 텍스트: `var(--ink-900)` / `var(--ink-700)`
- **좌**: 로고 마크 (10px 그라디언트 dot + 브랜드명 "EZ-STEP")
- **우 (Nav)**: 서비스 · 차트 구성 · 도입 절차 · About · **CTA 버튼** ("차트 만들기 →")
- **모바일**: `.nav` display:none (햄버거 메뉴는 별도 구현 필요)

### 2. Hero Section

- **배경**:
  ```css
  radial-gradient(ellipse 900px 500px at 85% 20%, #2E90FF 0%, transparent 55%),
  radial-gradient(ellipse 700px 400px at 15% 90%, rgba(255,255,255,0.05) 0%, transparent 55%),
  linear-gradient(160deg, #0D2A5E 0%, #1E74D4 100%);
  ```
- **오버레이 텍스처**: `repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 60px)` (미세한 대각선 라인)
- **하단 그라디언트 페이드**: 마지막 80px가 `var(--bg)`로 페이드
- **패딩**: `140px 0 90px` (상단 header 여백 확보)
- **레이아웃**: 2단 grid (`minmax(0,1fr) minmax(0,1.05fr)`, gap `clamp(32px, 5vw, 64px)`)
  - **좌**: 배지 → h1 → 서브카피 → CTA 2개 → 메타 리스트
  - **우**: Browser frame 안에 차트 UI 목업 (약간 3D 기울임: `perspective(1600px) rotateY(-4deg) rotateX(3deg)`)
- **모바일 (<1024px)**: 1단으로 스택, 3D 기울임 제거

**Hero 좌측 텍스트 (variation A — 기본):**

- Badge: `Hy-STEP 지원생학과 교육용 전자차트` 또는 `치위생학과 임상실습 디지털 플랫폼` — pill `NEW` + 텍스트
- H1: `수기 차트의 시대는 끝났습니다.` (개행) `임상실습, [한 번의 클릭]으로.`
  - `[한 번의 클릭]`은 `background: linear-gradient(90deg, #fff 0%, #7EC8FF 100%)` + `background-clip: text` 그라디언트 텍스트
- Subcopy: `EZ-STEP은 치위생학과 학생·교수를 위한 웹 기반 임상 차트 시스템입니다. 9개 섹션의 표준 흐름과 회차별 데이터 기록, AI 임상 가이드까지 — 학교마다 맞춤형으로 구성해 드립니다.`
- CTA Primary (`btn-brand`): `우리 학교 차트 만들기 →` — 흰 배경 · 네이비 텍스트 · shadow
- CTA Secondary (`btn-ghost`): `👁 차트 미리보기` — 반투명 흰색 border + backdrop-blur
- Meta line: `✓ 학교 단위 구독 · ✓ 커스텀 섹션 설계 · ✓ 데이터 백업·보안`

**Hero 우측 (Browser Window 컴포넌트):**

- Frame: `border-radius: 14px; box-shadow: 0 30px 80px rgba(13, 42, 94, 0.28)`
- Titlebar 40px: gradient `#F7F8FB → #EEF1F6`, 좌측 3 dots (`#FF605C #FFBD44 #00CA4E`), 중앙 URL 캡슐(자물쇠 아이콘 + `ezstep.clinic/chart` monospace)
- Content 480px: **차트 UI 목업** (아래 Section 별도 상세)

### 3. Trust Bar

- **높이**: `padding: 30px 0`
- **배경**: `#fff` + `border-bottom: 1px solid var(--line)`
- **레이아웃**: flex, space-between, wrap
- **좌**: 라벨 `FUNNED WITH PARTNERS` (uppercase, 12px, 600, tracking 0.14em, color `var(--ink-400)`)
- **우**: 5개 파트너 로고 슬롯 (플레이스홀더)
  - 각 로고: shield SVG(16px, opacity 0.55) + 텍스트 (`대학 A`, `치위생학과 B`, …)
  - `color: var(--ink-400)`, `font-weight: 700`

### 4. Features Grid (6 cards)

- **섹션 헤더** (2단 grid):
  - 좌: eyebrow `CORE FEATURES` + h2 `임상실습 워크플로우를 통째로 디지털화합니다.`
  - 우: aside 문단 (`수기 차트에서는 놓치기 쉬웠던 …`, max-width 420px, color `var(--ink-500)`)
- **Grid**: 3열 × 2행 (`repeat(3, 1fr)`, gap 16px)
- **Feature Card**:
  - 배경 `#fff`, border `var(--line)`, radius 20px, padding 28px, min-height 240px
  - 44×44 아이콘 컨테이너 (radius 12px, bg `var(--brand-100)`, color `var(--brand-600)`)
  - h3 (18px, 700) + p (14px, `var(--ink-500)`, line-height 1.65)
  - 하단 태그 (12px 600, 컬러 `var(--brand-600)`, 앞에 6px dot)
  - **호버 시**: 배경 `var(--ink-900)`, 텍스트 흰색, 아이콘 배경 반투명 흰색·컬러 액센트, `translateY(-4px)` + shadow-lg
    - transition 0.35s ease

**6개 카드 데이터:**

| # | 아이콘 | 제목 | 설명 | 태그 |
|---|---|---|---|---|
| 1 | Clipboard | 학생용 디지털 차트 | 문진부터 목표 달성도 평가까지, 9개 섹션으로 구성된 완전한 임상실습 차트를 웹에서 사용합니다. | 9 Sections |
| 2 | Dashboard | 관리자 대시보드 | 교수님이 학생 실습 진행 상황과 회차별 데이터를 학급 단위로 한눈에 관리할 수 있는 관리자 뷰. | 실시간 |
| 3 | AI(sparkle) | AI 채팅 어시스턴트 | Google Gemini 연동으로 학생이 입력한 환자 데이터에 대한 실시간 임상 가이드를 제공합니다. | Gemini |
| 4 | Calculator | 데이터 자동 계산 | PI · O'Leary index · Calculus rate 등 필수 임상 지표를 실시간 자동 연산… | 자동 연산 |
| 5 | Camera | 멀티미디어 사진 업로드 | 구강 내외 사진, 방사선 사진 등 시각적 자료를 회차별로 첨부해 더욱 완성도 높은 임상 기록… | 5매·6매법 |
| 6 | Calendar | 예약 시스템 연동 | 대상자 예약부터 회차 지정까지 캘린더와 연결된 통합 스케줄링… | 통합 관리 |

### 5. Chart Sections (9-item list)

- **배경**: `linear-gradient(180deg, #fff 0%, var(--brand-50) 100%)`
- **레이아웃**: 2단 grid (`minmax(0, 0.9fr) minmax(0, 1.1fr)`, gap `clamp(40px, 6vw, 80px)`)
- **좌 (Header)**:
  - eyebrow `CHART STRUCTURE`
  - h2 `한 학기 임상실습을, 9개 섹션에 담았습니다.`
  - subcopy
  - 배지 리스트: `회차별 기록 (1~3회차)` · `지표 자동 연산` · `대상자 통합 관리` (흰 배경 + border, radius 999px, 12px)
- **우 (Items)**: 세로 리스트, 각 아이템 `grid: 44px 1fr auto` (num · info · chevron)
  - num: `SEC 01` monospace 13px, color `var(--brand-600)`
  - info h4 (16px, 700) + p (13.5px, `var(--ink-500)`)
  - 각 아이템 위·아래 border 1px `var(--line)`, padding `20px 4px`
  - **호버**: 배경 `rgba(255,255,255,0.6)`, chevron 우측으로 3px 슬라이드 + 컬러 변경

**9개 섹션 데이터:**

| # | 이름 | 설명 |
|---|---|---|
| 01 | 문진 | 기본 인적사항, 병력, 구강 위생 습관 등 초기 상담 데이터 입력. |
| 02 | 치주검사 | Probing depth, BOP, 부착치은 등 치주 상태의 전방위 기록. |
| 03 | PI 측정 | O'Leary index 기반 플라그 지표 회차별 자동 계산. |
| 04 | 진단 | 수집된 데이터를 기반으로 한 임상 진단 소견 정리. |
| 05 | 목표 설정 | 단·중·장기 목표를 회차별로 명시하고 성과를 추적합니다. |
| 06 | 교육 | 대상자에게 제공한 구강 위생 교육 항목과 반응 기록. |
| 07 | 처치 | 스케일링, 치면세마 등 실제 시행 처치의 상세 기록. |
| 08 | 치위생평가 | 처치 후 변화된 치주·PI 지표의 재측정 및 비교. |
| 09 | 달성도평가 | 설정 목표별 Met · Partial Met · Unmet 자동 판정 및 리포트. |

### 6. Add-ons (4 cards)

- **배경**: `#fff`
- **헤더 중앙정렬**: eyebrow `ADD-ONS` + h2 `필요한 기능만 골라, 학교에 맞게.` + subcopy
- **Grid**: 4열 (`repeat(4, 1fr)`, gap 14px), 반응형: <1024px 2열, <640px 1열
- **Card**:
  - 배경 `var(--ink-50)`, border `var(--line)`, radius 20px, padding 26px, position:relative
  - 우상단 badge (10px 700, 컬러 `var(--brand-700)`, bg `var(--brand-100)`, radius 999px)
  - 48×48 glyph (white bg + border, radius 14px, icon color `var(--brand-600)`)
  - h4 (16px 700) + p (13.5px, `var(--ink-500)`)
  - **호버**: 배경 `#fff`, border `var(--brand-300)`, shadow-md, `translateY(-3px)`

| Badge | 아이콘 | 제목 | 설명 |
|---|---|---|---|
| PHOTO | Camera | 사진 업로드 | 5매법·6매법 세트를 회차별로 관리. 시각 자료 기반 진행 확인. |
| AI | Sparkle | AI 어시스턴트 | Gemini 기반 임상 가이드. 학생 질문에 실시간으로 응답합니다. |
| FACULTY | Teacher | 교수평가·서명 | 섹션별 평가·서명 등록. 학생-교수 사이의 피드백 루프를 마감합니다. |
| ADMIN | Dashboard | 대시보드·설문 | 학급 현황과 실습 성과를 한 화면에서. 만족도 설문 자동 배포. |

### 7. Big Preview (실제 화면 미리보기)

- **배경**: `radial-gradient(ellipse 800px 400px at 50% 0%, rgba(30, 116, 212, 0.12) 0%, transparent 60%), var(--bg)`
- **헤더 중앙정렬**: eyebrow `LIVE PREVIEW` + h2 `실제 차트 화면을 그대로 살펴보세요.` + subcopy
- **본문**: 큰 Browser Window (`url="ezstep.clinic/chart/sec03"`, height 560px) 내부에 **차트 UI 목업** (Section 8 상세 참조)
- Frame 뒤에 halo blur 배경 (60% × 40% 타원 blur 30px, `rgba(30, 116, 212, 0.14)`)

### 8. Chart UI Mockup (Browser Window 내부 콘텐츠)

이 목업은 **히어로 우측**과 **Big Preview**, 두 곳에서 재사용됩니다. `ChartMockup` 컴포넌트.

- **레이아웃**: 좌 사이드바 180px + 메인 (grid template `180px 1fr`)
- **배경**: `#F5F7FC`

**Sidebar (180px)**:
- 배경 `#fff`, right border 1px `rgba(11,18,32,0.06)`, padding `18px 12px`
- 타이틀: `대상자 · 김OO (24세)` (10px 700, uppercase, color `#7B87A5`, padding `4px 10px 10px`)
- 9개 섹션 아이템 (각 `9px 10px` padding, radius 8px):
  - 20×20 번호 뱃지 (monospace 10px, radius 6px)
  - 라벨 (12.5px)
  - **비활성**: color `#5A6785`, num bg `#EBEFF8` / color `#7B87A5`
  - **활성 (Section 03)**: bg `var(--brand-100)`, color `var(--brand-700)`, num bg `var(--brand-600)` / color `#fff`, font-weight 600

**Main (padding 20px 24px)**:
- 헤더 (flex space-between):
  - 좌: breadcrumb `Section 03 · 2회차` (11px, `#7B87A5`) + h2 `PI 측정 및 O'Leary Index` (16px, 700, -0.01em)
  - 우: 3-way 회차 탭 (`1회차` / `2회차` active / `3회차`) — pill 그룹, bg `#EBEFF8`, padding 3px; 활성 pill은 흰 배경 + shadow

- **카드 그리드 (2열)**:
  - **O'Leary Index**: label uppercase 10px, value `58.2%` (22px 800, 단위는 14px 500), progress bar 6px height + linear-gradient fill (58.2% width, `var(--brand-500) → var(--brand-300)`)
  - **Calculus Rate**: 동일 구조, `32.4%`, fill `#F5B342 → #FBD989`

- **목표 달성도 카드**: label `SECTION 05 · 목표 달성도`, 3개 pill (flex, gap 6px)
  - `목표1 Met` — 초록 계열 (`#2B9868` on `rgba(59, 189, 137, 0.14)`)
  - `목표2 Partial` — 앰버 계열 (`#B87D14` on `rgba(245, 179, 66, 0.15)`)
  - `목표3 Unmet` — 레드 계열 (`#C9464A` on `rgba(233, 100, 100, 0.14)`)
  - 각 pill: 6-8px padding, 10.5px 700, radius 6px, border 1px matching color

- **AI 카드**:
  - 배경 `linear-gradient(135deg, #F4F8FF 0%, #E8F1FE 100%)`, border `var(--brand-100)`, radius 12px, padding `14px 16px`
  - 26×26 AI 글리프 (radius 8px, `linear-gradient(135deg, var(--brand-600), var(--brand-400))`, 흰색 "AI" 800/11px)
  - `Gemini 어시스턴트` (10px 700 uppercase, tracking 0.06em, color `var(--brand-700)`)
  - 본문: `PI가 개선 중입니다. 하악 좌측 구치부의 인접면 세정을 집중 지도하세요.` (12px, line-height 1.5, `#2A3654`)

### 9. How it works (4 steps)

- **배경**: `linear-gradient(180deg, var(--bg) 0%, #fff 100%)`
- **헤더 중앙정렬**: eyebrow `HOW IT WORKS` + h2 `우리 학교 전용 차트, 4단계로 완성.` + subcopy
- **Grid**: `repeat(4, 1fr)`, gap 14px
- **뒤 데코 라인**: 카드 상단 34px 지점에 1.5px dashed `var(--brand-300)` 가로 라인 (좌우 8% inset), z-index 0
- **Step 카드** (z-index 1, position:relative):
  - 배경 `#fff`, border `var(--line)`, radius 20px, padding 24px
  - 36×36 번호 원 (radius 12px, `linear-gradient(135deg, var(--brand-600), var(--brand-500))`, 흰색 monospace 14px 700, box-shadow `0 6px 20px rgba(30, 116, 212, 0.28)`)
  - h4 (16px 700) + p (13.5px, `var(--ink-500)`)
  - meta 라인: 상단 1px border `var(--line)` + `Step N` 좌측 + custom text 우측 (12px, `var(--ink-400)`)

| # | 제목 | 설명 | Meta |
|---|---|---|---|
| 01 | 기본 정보 입력 | 학교명·담당자 정보와 예상 사용자 수를 입력합니다. | 5분 이내 |
| 02 | 차트 섹션 선택 | 기본 9개 섹션 중 필요한 항목만 골라 구성합니다. | 커스텀 가능 |
| 03 | 부가기능 선택 | AI·대시보드·사진 업로드 등 애드온을 조합합니다. | 학교별 맞춤 |
| 04 | 미리보기 & 신청 | 완성된 차트를 미리 체험하고 견적 요청을 발송합니다. | 이메일 회신 |

### 10. Dark Brand Section

- **배경**: `linear-gradient(160deg, var(--brand-800) 0%, var(--brand-600) 100%)` + 대각선 라인 오버레이 (히어로와 동일)
- **레이아웃**: 2단 grid (`minmax(0, 0.95fr) minmax(0, 1.05fr)`, gap `clamp(40px, 6vw, 80px)`)
- **좌**:
  - Hy-STEP 로고 이미지 (180px wide, opacity 0.95)
  - h2 흰색 `치위생학과 전용 [break] 디지털 차트 플랫폼`
  - desc `Dental Hygiene · Student Training E-Platform. 치위생 임상실습의 표준을 새롭게 정의합니다.` (15px, `rgba(255,255,255,0.72)`)
  - 6개 체크리스트 (check icon in 20×20 원 + 텍스트, gap 12px):
    - 치과병력 · 목표달성도까지 9개 섹션 커스텀 지원
    - O'Leary PI · Calculus rate 실시간 자동 계산
    - 전악 치식 기호 입력 지원 및 index 연동
    - Google Gemini AI 임상 어시스턴트 내장
    - 학교 독립 데이터베이스 운영 & 백업
    - 예약시스템 연동, 대상자 예약부터 차트작성까지
- **우 (Chart Preview compact)**:
  - Container: `rgba(255,255,255,0.04)` + backdrop-blur 20px + border `rgba(255,255,255,0.1)`, radius 28px, padding 24px, shadow `0 30px 80px rgba(0,0,0,0.25)`
  - 안에 3개 카드 (각 배경 `rgba(255,255,255,0.06)`, radius 14px, padding `18px 20px`, 하단 gap 12px):
    - **Section 03 · PI 측정**: label(accent color 11px 700 uppercase) + `O'Leary Index · 58.2%` (22px 800 흰색) + progress bar (`--accent → white`, 78% width)
    - **Section 05 · 목표 달성도**: 3개 goal pill (Met/Partial/Unmet, 위 chart mockup과 동일한 계열이지만 다크 배경 대응 컬러: `#86EAB6` / `#F7C56E` / `#F49B9B`)
    - **AI 카드**: `rgba(126, 200, 255, 0.1)` bg, border `rgba(126, 200, 255, 0.25)`, 좌측 32×32 accent-색 사각형 with 흰 "AI" + Gemini 라인

### 11. Final CTA

- **배경**: `var(--bg)`, 상하 padding `clamp(70px, 10vw, 110px)`
- **CTA Card** (컨테이너 내부):
  - 배경: `radial-gradient(ellipse 500px 240px at 100% 0%, rgba(126, 200, 255, 0.4) 0%, transparent 60%), linear-gradient(135deg, var(--brand-800) 0%, var(--brand-600) 100%)`
  - 오버레이 대각선 라인 텍스처
  - radius 28px, padding `clamp(50px, 7vw, 80px)`
  - shadow `0 30px 80px rgba(13, 42, 94, 0.25)`
- 콘텐츠:
  - h2 `지금 바로 우리 학교 [break] 차트를 만들어보세요.` (max-width 640px, clamp 30-48px, 800, -0.028em)
  - p `학교 전용 치위생 임상실습 디지털 차트 시스템이 완성됩니다. 베타 기간 동안 특별 혜택을 제공합니다.` (16px, `rgba(255,255,255,0.75)`)
  - 액션 2개: `btn-brand` (차트 빌더 시작하기 → `mailto:dlwlalsdentalchart@gmail.com`) · `btn-ghost` (문의하기)

### 12. Footer

- **배경**: `linear-gradient(160deg, #0A1535 0%, #06101F 100%)`
- **텍스트**: `rgba(255,255,255,0.7)`, font-size 14px
- **상단 padding**: 70px, **하단 padding**: 40px
- **Grid**: 4열 (`2fr 1fr 1fr 1fr`), gap 40px
- **Column 1 (Brand)**: Hy-STEP 로고 (130px, opacity 0.9) + 짧은 설명 문단 (13px, `rgba(255,255,255,0.55)`)
- **Column 2 (Product)**: 서비스 기능 · 차트 구성 · 미리보기
- **Column 3 (Company)**: About EZ-STEP · 도입 절차 · 문의하기
- **Column 4 (Contact)**: `dlwlalsdentalchart@gmail.com` · 학교 단위 구독 · 견적 문의
- 각 컬럼 h5는 12px 700 uppercase 흰색 tracking 0.1em
- 하단 bottom line (border-top 1px `rgba(255,255,255,0.08)`, padding-top 30px):
  - 좌: `© 2026 EZ-STEP · Dental Hygiene Student Training E-Platform`
  - 우: `보건의료 임상 실습 교육 플랫폼`

---

## Interactions & Behavior

### Sticky header
- 스크롤 40px 초과 시 `.header` 에 `.scrolled` 클래스 부여 (React state로 관리 or IntersectionObserver 센티넬)
- 전환 시간: `background 0.3s`, `border-color 0.3s`, `backdrop-filter 0.3s`
- 이징: `cubic-bezier(0.22, 1, 0.36, 1)`

### Scroll reveal
- 모든 `.reveal` 요소는 초기 `opacity: 0, translateY(20px)` → 뷰포트 진입 시 `.in` 클래스 부여 → `opacity: 1, translateY(0)`
- `IntersectionObserver({ threshold: 0.05, rootMargin: '0px 0px -40px 0px' })`
- **중요**: 마운트 시점에 이미 뷰포트에 있는 요소는 즉시 `.in` 부여 (히어로가 blank 상태로 남지 않도록)
- Fallback: 마운트 후 2초 뒤 남아있는 `.reveal:not(.in)` 전부 `.in` 부여
- Stagger: 카드 그리드에서 `transition-delay: ${idx * 40-60}ms`

### Feature card hover (color inversion)
- 배경 흰색 → 잉크블랙, 텍스트 반전, 아이콘 컨테이너 반투명 흰색, translateY(-4px), shadow-lg
- 전환 시간 0.35s, 전체 프로퍼티

### Section list item hover
- 배경 반투명 흰색, chevron 우측 3px 이동, chevron 컬러 변경

### Add-on card hover
- 배경 `--ink-50` → 흰색, border → `--brand-300`, shadow-md, translateY(-3px)

### Buttons
- `.btn-primary`, `.btn-brand`, `.btn-ghost`, `.btn-outline` 4종
- 모든 버튼 호버: `translateY(-1px ~ -2px)` + shadow enhancement
- 화살표 아이콘 있는 경우: 호버 시 `translateX(3px)` (`.arrow`)

### Hero 3D tilt (Variation A)
- 우측 브라우저 프레임: `perspective(1600px) rotateY(-4deg) rotateX(3deg)`
- Hover 시: `rotateY(-2deg) rotateX(1.5deg) translateY(-4px)` (0.5s ease)
- **모바일에서는 3D transform 제거**

### CTA click behavior
- **"우리 학교 차트 만들기" / "차트 빌더 시작하기"** → `mailto:dlwlalsdentalchart@gmail.com` (또는 실제 서비스에서는 `/builder` 라우팅)
- **"차트 미리보기"** → `#preview` 앵커 스크롤 (Big Preview 섹션)
- **Nav 링크들** → 해당 섹션 앵커 (`smooth` scroll 활성화, `html { scroll-behavior: smooth; }`)

---

## About Page (별도 상세 페이지 — Pending)

사용자는 About 페이지를 **별도 라우트**로 만들기를 원했으나(index.html 내 앵커가 아닌 `/about`), 상세 내용이 아직 전달되지 않아 이번 핸드오프 범위에서는 **placeholder**로 남깁니다.

**개발자 액션**:
- `/about` 라우트를 별도 페이지로 생성
- 헤더/푸터는 랜딩과 공유
- 콘텐츠 영역은 팀·서비스 소개 (사용자로부터 콘텐츠 전달 예정)

---

## State Management

랜딩 페이지 자체는 **거의 무상태**입니다. 필요한 상태는:

- `headerScrolled: boolean` — 스크롤 위치 40px 초과 감지
- **Tweaks 관련 상태는 프로덕션에서 제거**:
  - `palette` (컬러 팔레트 전환) — Navy로 고정
  - `heroVariant` (A/B 히어로 레이아웃) — A로 고정
  - `brandName` (EZ-STEP / Hy-STEP) — **최종 결정 필요** (README 상단에서는 EZ-STEP을 우선 사용)

폼(문의) 관련 상태는 후속 페이지(`/builder`)로 이관.

---

## Responsive Breakpoints

| Breakpoint | 변경 사항 |
|---|---|
| **≥1024px** (desktop) | 기본 레이아웃 (grid 3열, hero 2단, footer 4열) |
| **<1024px** (tablet) | features 3→2열, addons 4→2열, how 4→2열, footer 4→2열, hero 2단→1단 (visual 아래로), 3D tilt 제거, `.how-grid::before` 데코 라인 숨김 |
| **<640px** (mobile) | 모든 grid 1열, nav 숨김 (햄버거 필요), hero padding `120px 0 70px` |

---

## Assets

프로덕션 재구현 시 함께 옮겨야 할 정적 에셋:

| 파일 | 용도 | 원본 위치 |
|---|---|---|
| `hy-step-logo.png` | Hy-STEP 워드마크 (흰색 반투명 텍스트) | `assets/hy-step-logo.png` |
| `reference-design.jpeg` | 최초 참고 디자인 (참고용만, 배포 X) | `assets/reference-design.jpeg` |

**아이콘**: 모두 인라인 SVG (line-based, 24×24, stroke 1.6). Lucide / Heroicons 아이콘 라이브러리 사용을 권장:
- `IconClipboard` → lucide `Clipboard`
- `IconDashboard` → lucide `LayoutDashboard`
- `IconAi` → lucide `Sparkles`
- `IconCalculator` → lucide `Calculator`
- `IconCamera` → lucide `Camera`
- `IconCalendar` → lucide `Calendar`
- `IconTeacher` → lucide `GraduationCap` 또는 `UserSquare`
- `IconArrow`, `IconCheck`, `IconChevron`, `IconEye` → lucide 동명

**폰트**:
- Pretendard Variable (v1.3.9) — jsDelivr CDN 또는 self-host (`.woff2`, ~1.4MB)
- Inter (Google Fonts, weight 400/500/600/700/800)
- JetBrains Mono (Google Fonts, weight 500/600/700)

---

## Files

이 번들에 포함된 프로토타입 소스:

| 파일 | 설명 |
|---|---|
| `index.html` | 진입점 (스크립트 로드, `#root` 마운트) |
| `styles.css` | 전체 스타일 (디자인 토큰 + 모든 섹션 CSS) |
| `app.jsx` | 메인 React 컴포넌트 (섹션별 컴포넌트 12개 + Header/Footer + Tweaks) |
| `chart-mockup.jsx` | `ChartMockup` — 차트 UI 목업 (히어로/big preview 재사용) |
| `browser-frame.jsx` | `BrowserWindow` — 라이트 테마 브라우저 프레임 |
| `icons.jsx` | 17개 라인 SVG 아이콘 컴포넌트 |
| `tweaks_panel.jsx` | Tweaks UI (프로덕션에서는 제거) |
| `assets/hy-step-logo.png` | Hy-STEP 워드마크 로고 |

---

## Migration Checklist (프로덕션 재구현)

1. **프레임워크 셋업** — Next.js 14 App Router + TypeScript + Tailwind (권장)
2. **디자인 토큰** — `styles.css`의 CSS 변수를 `tailwind.config.js`의 `theme.extend`로 이관 (colors, fontFamily, borderRadius, boxShadow, spacing scale)
3. **폰트** — Next.js `next/font/local` 또는 `next/font/google`로 Pretendard/Inter/JetBrains Mono 로드
4. **컴포넌트 분리** — `components/landing/` 하위에 섹션별 분리 (`Header.tsx`, `Hero.tsx`, `Features.tsx`, `ChartSections.tsx`, `Addons.tsx`, `BigPreview.tsx`, `HowItWorks.tsx`, `DarkBrandSection.tsx`, `FinalCTA.tsx`, `Footer.tsx`, `ChartMockup.tsx`, `BrowserWindow.tsx`)
5. **Reveal 훅** — `useReveal()` 커스텀 훅 or `framer-motion`의 `whileInView` 사용
6. **아이콘 교체** — 커스텀 SVG → `lucide-react` 임포트
7. **라우팅** — `/` (랜딩), `/about` (별도 페이지, 콘텐츠 확인 후 구현), `/builder` (주문 폼, 후속 스코프), `/preview` (차트 미리보기, 후속 스코프)
8. **폼/이메일** — 프로토타입은 `mailto:` 링크만 사용. 프로덕션은 서버 API 라우트(`app/api/inquiry/route.ts`) + Nodemailer or Resend로 이관
9. **접근성 검토** — 모든 이미지 alt, 버튼 aria-label, 색상 대비 (히어로 서브카피 `rgba(255,255,255,0.78)` on brand-800 = 대비 확인 필요), 키보드 포커스 링
10. **성능** — Pretendard subset 로드, hero visual `<img>` 대신 CSS 그라디언트/컴포넌트 사용 유지, LCP 최적화
11. **Tweaks 시스템 제거** — `tweaks_panel.jsx` 및 `TweaksControls`, `useTweaks` 관련 코드 제거. `palette="navy"`, `heroVariant="A"`, `brandName="EZ-STEP"` 확정값 사용
12. **SEO** — `app/layout.tsx`에 metadata (title, description, OG image), sitemap.xml, robots.txt

---

## Contact

- 서비스 문의 이메일: **dlwlalsdentalchart@gmail.com**
- 브랜드명 확정: **EZ-STEP** (또는 Hy-STEP — 클라이언트 최종 결정 필요)
