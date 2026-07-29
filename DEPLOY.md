# HySTEP Deployment

## 배포 기준

- GitHub repository: `xluggageinx-beep/HySTEP`
- Platform: Cloudflare Pages
- Output directory: `public`
- Configuration: `wrangler.toml`
- Pages Functions: `functions/`

별도의 build 결과물을 생성하지 않습니다. Cloudflare Pages는 repository의 `public/` 디렉터리를 직접 배포합니다.

## 배포되는 주요 경로

- `/` — EZ-STEP
- `/builder` — 학교 맞춤 구성 및 견적 요청
- `/admin-step` — 관리자스텝
- `/hystep-preview` — 학생/교수 Hy-STEP Preview
- `/chart` — 공통 Hy-STEP chart
- `/prescan` — 사전문진

Compatibility:

- `/admin`, `/admin.html` → `/admin-step`
- `/preview`, `/preview.html` → `/hystep-preview`

## 로컬 확인

```bash
npm install
npm start
```

`server.js`는 로컬 정적 확인과 확장자 없는 경로를 위한 개발 서버입니다. 구형 주문 저장 API나 학교 생성 명령은 사용하지 않습니다.

## 배포 전 확인

1. `public/index.html`, Builder, 관리자스텝, Hy-STEP Preview 경로 확인
2. 학생→서명 요청→교수 평가·서명 흐름 확인
3. Section/Form 설정 적용 확인
4. redirect compatibility 확인
5. `public/prescan.html`, `functions/api/submit-order.js`, `wrangler.toml` 보호 파일 해시 확인
