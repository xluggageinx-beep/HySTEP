# HySTEP

EZ-STEP에서 학교가 필요한 구성을 선택하고, 관리자스텝에서 운영자가 학교 설정을 조립하며, Hy-STEP에서 학생과 교수가 하나의 공통 차트를 서로 다른 권한으로 사용하는 Interactive Prototype입니다.

## 현재 제품 구조

- `public/index.html` — EZ-STEP 소개 및 학교 맞춤 구성 진입
- `public/builder.html` — 견적 구성
- `public/admin-step.html` — 내부 관리자스텝
- `public/hystep-preview.html` — 학생/교수 역할 기반 Prototype
- `public/chart.html` — 공통 Hy-STEP 차트
- `public/chart-integration.js` — 역할별 차트 동작 연결
- `public/prototype-store.js` — Prototype persistence adapter
- `public/prescan.html` — 기존 사전문진 화면
- `functions/api/submit-order.js` — Cloudflare Pages Function

관리자 화면과 Preview의 현재 구현은 각각 하나입니다.

- `/admin.html`과 `/admin`은 `/admin-step`으로 이동합니다.
- `/preview.html`과 `/preview`는 `/hystep-preview`로 이동합니다.

## 데이터와 구현 범위

현재 데이터는 `PrototypeStore`를 통해 동일 브라우저에 저장되며 탭 간 상태를 공유합니다. UI에서 저장소 API를 직접 다루지 않습니다.

- Prototype: 견적→학교 초안, 학생/교수 공통 차트, Section별 서명 요청·교수 평가·서명, 학교별 Section/Form 설정
- Shell: PDF/Excel 출력, roster import, 일괄 서명, 실제 AI 응답
- Future: 실제 인증, backend/database, 파일 저장소, AI provider, immutable signed snapshot

## 로컬 실행

```bash
npm install
npm start
```

기본 주소는 `http://localhost:4000`입니다.

## Cloudflare Pages

`wrangler.toml`의 `pages_build_output_dir = "public"` 설정에 따라 `public/`이 배포 Source of Truth입니다. Repository root에는 별도의 랜딩 구현을 두지 않습니다.

관리자 Prototype 인증 설정은 `public/admin-access-config.js`에 있습니다. 실제 서비스 인증 구조가 아닙니다.
