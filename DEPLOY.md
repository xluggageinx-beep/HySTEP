# 배포 가이드 — GitHub + Cloudflare Pages

이 문서는 `design_handoff_ezstep_landing/` 폴더의 파일들을 **`xluggageinx-beep/HySTEP`** GitHub 저장소에 올리고, **Cloudflare Pages** (`Xluggageinx@gmail.com` 계정)로 `hystep` 프로젝트를 배포하는 절차를 안내합니다.

---

## ⚠️ 시작 전 알아둘 것

지금 파일들은 **`.html` + `.css` + Babel로 브라우저에서 트랜스파일되는 `.jsx`** 조합입니다.
- **장점**: 빌드 도구(Vite/Webpack) 없이 정적 파일 그대로 Cloudflare Pages에 올리면 바로 동작합니다.
- **단점**: 브라우저에서 Babel이 매번 JSX를 컴파일하므로 첫 로드가 살짝 느립니다. 실서비스 성능이 중요하면 나중에 Vite로 빌드 파이프라인 전환을 권장합니다 (별도 작업).

**지금은 "GitHub에 올려서 Cloudflare Pages로 즉시 배포"가 목표이므로 그대로 진행합니다.**

---

## 📦 저장소에 올릴 파일 목록

```
HySTEP/
├── index.html              ← 메인 랜딩 페이지
├── styles.css              ← 전체 스타일 (팔레트 토큰 포함)
├── app.jsx                 ← React 앱 진입점
├── browser-frame.jsx       ← 브라우저 프레임 컴포넌트
├── chart-mockup.jsx        ← 차트 UI 목업
├── icons.jsx               ← SVG 아이콘 라이브러리
├── tweaks_panel.jsx        ← Tweaks 패널 (컬러/레이아웃 전환)
├── assets/
│   └── hy-step-logo.png    ← Hy-STEP 로고 (흰색 투명 PNG)
└── README.md               ← (선택) 저장소 설명
```

`reference-design.jpeg`는 참고용 이미지라 저장소에 올리지 않아도 됩니다.

---

## 🚀 방법 1 — GitHub 웹에서 직접 업로드 (가장 쉬움)

### 1단계. 프로젝트 파일 다운로드
- 이 대화창의 다운로드 카드에서 `design_handoff_ezstep_landing.zip` 을 받아 압축 해제.
- 압축을 풀면 위의 파일 구조가 나옵니다.

### 2단계. GitHub에서 저장소 열기
1. https://github.com/xluggageinx-beep/HySTEP 접속
2. 만약 저장소가 비어 있으면 초록색 **"uploading an existing file"** 링크가 보입니다. 클릭.
3. 저장소에 이미 파일이 있으면 상단의 **"Add file" → "Upload files"** 클릭.

### 3단계. 파일 드래그 & 드롭
1. 압축 푼 폴더에서 파일 전체를 GitHub 페이지에 드래그 & 드롭.
   - `index.html`, `styles.css`, 모든 `.jsx` 파일들
   - `assets/` 폴더 (그대로 드래그 하면 폴더 구조 유지됨)
2. 하단 **Commit changes** 영역에서:
   - 메시지: `Initial upload: Hy-STEP landing page`
   - **Commit directly to the main branch** 선택
3. **Commit changes** 버튼 클릭.

### 4단계. 파일이 잘 올라갔는지 확인
- 저장소 루트에서 `index.html`이 보이면 성공.

---

## 🚀 방법 2 — Git 커맨드라인 (터미널 익숙하면)

```bash
# 압축 푼 폴더로 이동
cd design_handoff_ezstep_landing

# git 초기화 & 첫 커밋
git init
git add .
git commit -m "Initial upload: Hy-STEP landing page"

# 원격 저장소 연결
git branch -M main
git remote add origin https://github.com/xluggageinx-beep/HySTEP.git

# 푸시
git push -u origin main
```

인증을 물어보면 GitHub 사용자명 + **Personal Access Token** (비밀번호 아님) 입력.
- 토큰이 없다면: https://github.com/settings/tokens 에서 발급받아 사용.

---

## ☁️ Cloudflare Pages 배포

### 1단계. Cloudflare Dashboard 접속
1. https://dash.cloudflare.com/ 에 `Xluggageinx@gmail.com` 계정으로 로그인.
2. 좌측 메뉴에서 **"Workers & Pages"** 클릭.

### 2단계. 새 프로젝트 만들기
1. **"Create application"** → **"Pages"** 탭 → **"Connect to Git"** 클릭.
2. GitHub 계정 연결 승인 (처음이면 Cloudflare가 GitHub 앱 설치를 요청).
3. 저장소 목록에서 **`xluggageinx-beep/HySTEP`** 선택 → **"Begin setup"**.

### 3단계. 빌드 설정 (중요)
| 항목 | 값 |
|------|------|
| **Project name** | `hystep` |
| **Production branch** | `main` |
| **Framework preset** | **None** |
| **Build command** | (비워두기 — 아무것도 입력 안 함) |
| **Build output directory** | `/` (또는 비워두기) |
| **Environment variables** | (없음) |

> 이 프로젝트는 **정적 HTML/CSS/JS** 만 있으므로 빌드 스텝이 필요 없습니다. 위와 같이 두면 Cloudflare가 저장소의 파일을 그대로 서빙합니다.

### 4단계. 배포
1. **"Save and Deploy"** 클릭.
2. 1~2분 후 배포 완료. Cloudflare가 자동으로 URL을 발급:
   - `https://hystep.pages.dev` ← 이 URL에서 사이트 확인 가능.

### 5단계. 커스텀 도메인 연결 (선택)
- 프로젝트 페이지에서 **"Custom domains"** 탭 → **"Set up a custom domain"**.
- 원하는 도메인 (예: `hystep.co.kr`, `ezstep.clinic` 등) 입력 후 DNS 설정 안내대로 진행.

---

## 🔄 이후 업데이트 흐름

파일을 수정한 뒤:
1. GitHub 저장소에 변경사항을 커밋 & 푸시 (웹 편집기든 커맨드라인이든).
2. Cloudflare Pages가 **자동으로 감지해서 재배포**합니다. (약 1~2분)
3. `https://hystep.pages.dev` 새로고침하면 반영됨.

---

## 🐛 배포 후 확인할 것

배포된 사이트에서 다음을 체크하세요:

- [ ] 로고 이미지 (`assets/hy-step-logo.png`)가 상단·다크섹션·푸터에서 정상 표시되는가?
- [ ] Pretendard 폰트 (한글) + Inter (영문) 로딩되는가?
- [ ] React 앱이 렌더링되는가? (히어로 텍스트가 보임)
- [ ] 브라우저 프레임 안의 차트 목업이 정상 표시되는가?
- [ ] 스크롤 시 헤더가 반투명 유리 효과로 바뀌는가?
- [ ] Tweaks 패널 (우측 하단 톱니바퀴) — 데스크탑 우클릭이나 툴바 통해 열림.

---

## 📌 문제 발생 시

### CDN이 차단됐다는 에러
- `unpkg.com`, `cdn.jsdelivr.net`, `fonts.googleapis.com` 에서 파일을 불러옵니다.
- 사내망이나 특수한 방화벽에서는 이 도메인들이 막힐 수 있습니다.
- 이 경우 파일들을 로컬로 다운받아 저장소에 함께 올리는 방식으로 전환 필요.

### JSX가 렌더링 안 됨
- 브라우저 개발자도구 (F12) **Console** 탭 확인.
- 대부분 경로 문제입니다. `<script src="...">` 경로가 저장소 구조와 정확히 일치해야 합니다.

### 로고가 안 보임
- `assets/hy-step-logo.png` 파일이 저장소에 올라갔는지 확인.
- 대소문자까지 정확히 맞아야 합니다 (`assets` vs `Assets` 다름).

---

## ✉️ About 페이지 (별도 상세페이지) 관련

이전 대화에서 언급하신 About 상세페이지 (`about.html`)는 아직 만들어지지 않았습니다.
크레딧 복구 후 다음 세션에서:
1. About 페이지 내용 텍스트 전달
2. 페이지 디자인 톤 (메인과 동일 톤 or 다른 느낌)
3. 헤더/푸터 공유 여부

정해서 요청해 주시면 이어서 만들어 드리겠습니다.

---

**요약**: GitHub 업로드 → Cloudflare Pages 프로젝트 생성 → 자동 배포. 빌드 커맨드는 없고 정적 파일 그대로 서빙합니다.
