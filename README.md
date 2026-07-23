# EZ-STEP Builder

치위생학과 임상실습 차트 빌더 웹사이트

## 배포 구조

- **정적 페이지** → Cloudflare Pages (`public/`)
- **이메일 API** → Cloudflare Pages Functions (`functions/api/submit-order.js`)
- **이메일 서비스** → Resend API

## 환경변수 (Cloudflare Pages 대시보드에서 설정)

| 변수명 | 설명 |
|--------|------|
| `RESEND_API_KEY` | Resend API 키 |

## 로컬 개발

```bash
npm install
node server.js
# http://localhost:4000
```

## 배포

GitHub에 push하면 Cloudflare Pages가 자동 배포합니다.
