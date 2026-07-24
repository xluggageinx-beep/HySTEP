// Hy-STEP / EZ-STEP Landing — Main App
const { useState, useEffect, useRef } = React;

/* ----------------------------------------
   Reveal-on-scroll hook
---------------------------------------- */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    // Elements already in viewport at mount → show immediately (no wait for scroll)
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('in');
      }
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => {
      if (!el.classList.contains('in')) io.observe(el);
    });
    // Safety net — if something never triggers (e.g. offscreen capture tools), reveal all after 2s
    const fallback = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'));
    }, 2000);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
}

/* ----------------------------------------
   Sticky header state
---------------------------------------- */
function Header({ brandName }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', on, { passive: true });
    on();
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#top" className="logo-mark">
          <span className="dot" />
          {brandName}
        </a>
        <nav className="nav">
          <a href="#features">서비스</a>
          <a href="#sections">차트 구성</a>
          <a href="#how">도입 절차</a>
          <a href="#about">About</a>
          <a className="btn btn-primary btn-sm nav-cta" href="#cta">
            차트 만들기 <IconArrow size={14} stroke={2} />
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ----------------------------------------
   Hero — variation A: split with chart mockup
---------------------------------------- */
function HeroA({ brandName }) {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div>
          <div className="hero-badge reveal">
            <span className="pill">NEW</span>
            치위생학과 임상실습 디지털 플랫폼
          </div>
          <h1 className="reveal">
            수기 차트의 시대는 끝났습니다.<br />
            임상실습, <span className="grad">한 번의 클릭</span>으로.
          </h1>
          <p className="hero-sub reveal">
            {brandName}은 치위생학과 학생·교수를 위한 웹 기반 임상 차트 시스템입니다.
            9개 섹션의 표준 흐름과 회차별 데이터 기록, AI 임상 가이드까지 —
            학교마다 맞춤형으로 구성해 드립니다.
          </p>
          <div className="hero-ctas reveal">
            <a className="btn btn-brand btn-lg" href="#cta">
              우리 학교 차트 만들기 <IconArrow size={16} stroke={2} className="arrow" />
            </a>
            <a className="btn btn-ghost btn-lg" href="#preview">
              <IconEye size={16} stroke={2} /> 차트 미리보기
            </a>
          </div>
          <div className="hero-meta reveal">
            <span>✓ 학교 단위 구독</span>
            <span className="divider" />
            <span>✓ 커스텀 섹션 설계</span>
            <span className="divider" />
            <span>✓ 데이터 백업 · 보안</span>
          </div>
        </div>

        <div className="hero-visual reveal">
          <div className="halo" />
          <BrowserWindow url={`${brandName.toLowerCase()}.clinic/chart`} height={480}>
            <ChartMockup />
          </BrowserWindow>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Hero — variation B: centered
---------------------------------------- */
function HeroB({ brandName }) {
  return (
    <section className="hero" id="top" style={{ padding: '160px 0 60px', textAlign: 'center' }}>
      <div className="container" style={{ display: 'block' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div className="hero-badge reveal" style={{ margin: '0 auto' }}>
            <span className="pill">NEW</span>
            치위생학과 임상실습 디지털 플랫폼
          </div>
          <h1 className="reveal" style={{ marginTop: 24 }}>
            임상실습의 새 표준,<br />
            <span className="grad">한 학기를 한 화면에.</span>
          </h1>
          <p className="hero-sub reveal" style={{ margin: '22px auto 0', textAlign: 'center' }}>
            {brandName}은 치위생학과 학생·교수를 위한 웹 기반 임상 차트 시스템입니다.
            9개 섹션의 표준 흐름을 학교마다 맞춤 구성해 드립니다.
          </p>
          <div className="hero-ctas reveal" style={{ justifyContent: 'center' }}>
            <a className="btn btn-brand btn-lg" href="#cta">
              우리 학교 차트 만들기 <IconArrow size={16} stroke={2} className="arrow" />
            </a>
            <a className="btn btn-ghost btn-lg" href="#preview">
              <IconEye size={16} stroke={2} /> 차트 미리보기
            </a>
          </div>
        </div>

        <div className="hero-visual reveal" style={{ marginTop: 60, maxWidth: 1080, margin: '60px auto 0', transform: 'perspective(2000px) rotateX(4deg)' }}>
          <div className="halo" />
          <BrowserWindow url={`${brandName.toLowerCase()}.clinic/chart`} height={520}>
            <ChartMockup />
          </BrowserWindow>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Trust Bar (partner placeholders)
---------------------------------------- */
function TrustBar() {
  const items = [
    '대학 A',
    '치위생학과 B',
    '보건계열대학 C',
    '전문학교 D',
    '의료교육원 E',
  ];
  return (
    <div className="trustbar">
      <div className="container">
        <div className="trustbar-label">함께 도입한 파트너</div>
        <div className="trustbar-logos">
          {items.map((n, i) => (
            <div key={i} className="trustbar-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z"/>
              </svg>
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Features (6)
---------------------------------------- */
const featureData = [
  { icon: IconClipboard, tag: '9 Sections', title: '학생용 디지털 차트', desc: '문진부터 목표 달성도 평가까지, 9개 섹션으로 구성된 완전한 임상실습 차트를 웹에서 사용합니다.' },
  { icon: IconDashboard, tag: '실시간', title: '관리자 대시보드', desc: '교수님이 학생 실습 진행 상황과 회차별 데이터를 학급 단위로 한눈에 관리할 수 있는 관리자 뷰.' },
  { icon: IconAi, tag: 'Gemini', title: 'AI 채팅 어시스턴트', desc: 'Google Gemini 연동으로 학생이 입력한 환자 데이터에 대한 실시간 임상 가이드를 제공합니다.' },
  { icon: IconCalculator, tag: '자동 연산', title: '데이터 자동 계산', desc: 'PI · O\'Leary index · Calculus rate 등 필수 임상 지표를 실시간 자동 연산하여 학생들의 계산 오류를 원천 차단.' },
  { icon: IconCamera, tag: '5매·6매법', title: '멀티미디어 사진 업로드', desc: '구강 내외 사진, 방사선 사진 등 시각적 자료를 회차별로 첨부해 더욱 완성도 높은 임상 기록을 남깁니다.' },
  { icon: IconCalendar, tag: '통합 관리', title: '예약 시스템 연동', desc: '대상자 예약부터 회차 지정까지 캘린더와 연결된 통합 스케줄링. 실습 흐름을 놓치지 않습니다.' },
];

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="features-head">
          <div>
            <span className="section-eyebrow reveal">Core Features</span>
            <h2 className="section-title reveal">
              임상실습 워크플로우를<br />통째로 디지털화합니다.
            </h2>
          </div>
          <div className="aside reveal">
            수기 차트에서는 놓치기 쉬웠던 데이터 일관성, 회차별 추적, 지표 자동 계산까지.
            {' '}치위생 임상실습이 필요로 하는 모든 것을 한 시스템에서 해결합니다.
          </div>
        </div>

        <div className="features-grid">
          {featureData.map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 40}ms` }}>
              <div className="icon"><f.icon size={22} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="tag">
                <span style={{ width: 6, height: 6, background: 'currentColor', borderRadius: '50%' }} />
                {f.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Chart Sections list (9)
---------------------------------------- */
const chartSectionData = [
  { n: '01', name: '문진', desc: '기본 인적사항, 병력, 구강 위생 습관 등 초기 상담 데이터 입력.' },
  { n: '02', name: '치주검사', desc: 'Probing depth, BOP, 부착치은 등 치주 상태의 전방위 기록.' },
  { n: '03', name: 'PI 측정', desc: "O'Leary index 기반 플라그 지표 회차별 자동 계산." },
  { n: '04', name: '진단', desc: '수집된 데이터를 기반으로 한 임상 진단 소견 정리.' },
  { n: '05', name: '목표 설정', desc: '단·중·장기 목표를 회차별로 명시하고 성과를 추적합니다.' },
  { n: '06', name: '교육', desc: '대상자에게 제공한 구강 위생 교육 항목과 반응 기록.' },
  { n: '07', name: '처치', desc: '스케일링, 치면세마 등 실제 시행 처치의 상세 기록.' },
  { n: '08', name: '치위생평가', desc: '처치 후 변화된 치주·PI 지표의 재측정 및 비교.' },
  { n: '09', name: '달성도평가', desc: '설정 목표별 Met · Partial Met · Unmet 자동 판정 및 리포트.' },
];

function ChartSections() {
  return (
    <section className="section section-list" id="sections">
      <div className="container">
        <div className="section-list-grid">
          <div className="section-list-header">
            <span className="section-eyebrow reveal">Chart Structure</span>
            <h2 className="section-title reveal">
              한 학기 임상실습을,<br />9개 섹션에 담았습니다.
            </h2>
            <p className="section-sub reveal">
              치위생학회 표준 흐름을 참고해 설계한 기본 골격입니다.
              학교별 요구에 따라 섹션을 추가·재구성할 수 있습니다.
            </p>
            <div className="badge-list reveal">
              <span>회차별 기록 (1~3회차)</span>
              <span>지표 자동 연산</span>
              <span>대상자 통합 관리</span>
            </div>
          </div>

          <div className="section-list-items">
            {chartSectionData.map((s, i) => (
              <div key={s.n} className="section-list-item reveal" style={{ transitionDelay: `${i * 30}ms` }}>
                <div className="num">SEC {s.n}</div>
                <div className="info">
                  <h4>{s.name}</h4>
                  <p>{s.desc}</p>
                </div>
                <div className="chev"><IconChevron size={18} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Add-ons
---------------------------------------- */
const addonData = [
  { icon: IconCamera, badge: 'PHOTO', title: '사진 업로드', desc: '5매법·6매법 세트를 회차별로 관리. 시각 자료 기반 진행 확인.' },
  { icon: IconAi, badge: 'AI', title: 'AI 어시스턴트', desc: 'Gemini 기반 임상 가이드. 학생 질문에 실시간으로 응답합니다.' },
  { icon: IconTeacher, badge: 'FACULTY', title: '교수평가 · 서명', desc: '섹션별 평가·서명 등록. 학생-교수 사이의 피드백 루프를 마감합니다.' },
  { icon: IconDashboard, badge: 'ADMIN', title: '대시보드 · 설문', desc: '학급 현황과 실습 성과를 한 화면에서. 만족도 설문 자동 배포.' },
];

function Addons() {
  return (
    <section className="section addons">
      <div className="container">
        <div className="section-head-center">
          <span className="section-eyebrow reveal">Add-ons</span>
          <h2 className="section-title reveal">필요한 기능만 골라, 학교에 맞게.</h2>
          <p className="section-sub reveal">
            부가기능은 애드온으로 제공됩니다. 기본 차트에 원하는 기능만 선택해 도입하세요.
          </p>
        </div>
        <div className="addons-grid">
          {addonData.map((a, i) => (
            <div key={i} className="addon-card reveal" style={{ transitionDelay: `${i * 40}ms` }}>
              <span className="badge">{a.badge}</span>
              <div className="glyph"><a.icon size={22} /></div>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Big Preview (chart in browser frame)
---------------------------------------- */
function BigPreview() {
  return (
    <section className="section big-preview" id="preview">
      <div className="container">
        <div className="section-head-center">
          <span className="section-eyebrow reveal">Live Preview</span>
          <h2 className="section-title reveal">실제 차트 화면을 그대로 살펴보세요.</h2>
          <p className="section-sub reveal">
            학생이 실습 시간에 마주하는 화면입니다. 데이터 자동 계산·회차 전환·AI 가이드까지 실제와 동일하게 구현되어 있습니다.
          </p>
        </div>
        <div className="big-preview-frame reveal">
          <BrowserWindow url="ezstep.clinic/chart/sec03" height={560}>
            <ChartMockup />
          </BrowserWindow>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   How it works (4 steps)
---------------------------------------- */
const stepData = [
  { n: '01', title: '기본 정보 입력', desc: '학교명·담당자 정보와 예상 사용자 수를 입력합니다.', meta: '5분 이내' },
  { n: '02', title: '차트 섹션 선택', desc: '기본 9개 섹션 중 필요한 항목만 골라 구성합니다.', meta: '커스텀 가능' },
  { n: '03', title: '부가기능 선택', desc: 'AI·대시보드·사진 업로드 등 애드온을 조합합니다.', meta: '학교별 맞춤' },
  { n: '04', title: '미리보기 & 신청', desc: '완성된 차트를 미리 체험하고 견적 요청을 발송합니다.', meta: '이메일 회신' },
];

function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="container">
        <div className="section-head-center">
          <span className="section-eyebrow reveal">How it works</span>
          <h2 className="section-title reveal">우리 학교 전용 차트, 4단계로 완성.</h2>
          <p className="section-sub reveal">
            표준화된 도입 프로세스로 학교마다 맞춤형 차트 시스템을 빠르게 구축합니다.
          </p>
        </div>
        <div className="how-grid">
          {stepData.map((s, i) => (
            <div key={s.n} className="how-step reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
              <div className="meta">
                <span>Step {parseInt(s.n)}</span>
                <span>{s.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Dark brand section — chart preview
---------------------------------------- */
function DarkBrandSection({ brandName }) {
  return (
    <section className="section brand-dark" id="about">
      <div className="container">
        <div className="brand-dark-grid">
          <div className="reveal">
            <img src="assets/hy-step-logo.png" alt="Hy-STEP" className="logo-big" />
            <h2>
              치위생학과 전용<br />
              디지털 차트 플랫폼
            </h2>
            <p className="desc">
              Dental Hygiene · Student Training E-Platform.<br />
              치위생 임상실습의 표준을 새롭게 정의합니다.
            </p>
            <ul className="check-list">
              {[
                '치과병력 · 목표달성도까지 9개 섹션 커스텀 지원',
                "O'Leary PI · Calculus rate 실시간 자동 계산",
                '전악 치식 기호 입력 지원 및 index 연동',
                'Google Gemini AI 임상 어시스턴트 내장',
                '학교 독립 데이터베이스 운영 & 백업',
                '예약시스템 연동, 대상자 예약부터 차트작성까지',
              ].map((t, i) => (
                <li key={i}>
                  <span className="check"><IconCheck size={12} stroke={2.4} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="chart-preview reveal">
            <div className="chart-card">
              <div className="label">Section 03 · PI 측정</div>
              <div className="value">O'Leary Index · 58.2%</div>
              <div className="progress"><div className="fill" /></div>
            </div>
            <div className="chart-card">
              <div className="label">Section 05 · 목표 달성도</div>
              <div className="goal-row">
                <div className="goal met">목표1 Met</div>
                <div className="goal partial">목표2 Partial</div>
                <div className="goal unmet">목표3 Unmet</div>
              </div>
            </div>
            <div className="ai-card">
              <div className="ai-glyph">AI</div>
              <div className="ai-body">
                <div className="who">Gemini 어시스턴트</div>
                "PI가 개선 중입니다. 하악 좌측 구치부의 인접면 세정을 집중 지도하세요."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Final CTA
---------------------------------------- */
function FinalCTA({ brandName }) {
  return (
    <section className="cta-final" id="cta">
      <div className="container">
        <div className="cta-card reveal">
          <h2>지금 바로 우리 학교<br />차트를 만들어보세요.</h2>
          <p>
            학교 전용 치위생 임상실습 디지털 차트 시스템이 완성됩니다.
            베타 기간 동안 특별 혜택을 제공합니다.
          </p>
          <div className="cta-actions">
            <a className="btn btn-brand btn-lg" href="mailto:dlwlalsdentalchart@gmail.com">
              차트 빌더 시작하기 <IconArrow size={16} stroke={2} className="arrow" />
            </a>
            <a className="btn btn-ghost btn-lg" href="#preview">문의하기</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------
   Footer
---------------------------------------- */
function Footer({ brandName }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="brand-block">
            <img src="assets/hy-step-logo.png" alt="Hy-STEP" />
            <p>
              Dental Hygiene · Student Training E-Platform.<br />
              치위생 임상실습의 표준을 새롭게 정의합니다.
            </p>
          </div>
          <div>
            <h5>Product</h5>
            <ul>
              <li><a href="#features">서비스 기능</a></li>
              <li><a href="#sections">차트 구성</a></li>
              <li><a href="#preview">미리보기</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#about">About {brandName}</a></li>
              <li><a href="#how">도입 절차</a></li>
              <li><a href="mailto:dlwlalsdentalchart@gmail.com">문의하기</a></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li>dlwlalsdentalchart@gmail.com</li>
              <li>학교 단위 구독 · 견적 문의</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 {brandName} · Dental Hygiene Student Training E-Platform</div>
          <div>보건의료 임상 실습 교육 플랫폼</div>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------------
   Tweaks Panel
---------------------------------------- */
function TweaksControls({ t, setTweak }) {
  return (
    <>
      <TweakSection title="Palette" subtitle="브랜드 컬러 테마를 전환합니다.">
        <TweakRadio
          label="컬러 팔레트"
          value={t.palette}
          onChange={(v) => setTweak('palette', v)}
          options={[
            { label: 'Navy', value: 'navy' },
            { label: 'Teal', value: 'teal' },
            { label: 'Indigo', value: 'indigo' },
            { label: 'Slate', value: 'slate' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Layout" subtitle="히어로 섹션 레이아웃 변형.">
        <TweakRadio
          label="히어로 스타일"
          value={t.heroVariant}
          onChange={(v) => setTweak('heroVariant', v)}
          options={[
            { label: 'Split', value: 'A' },
            { label: 'Centered', value: 'B' },
          ]}
        />
      </TweakSection>
      <TweakSection title="Brand" subtitle="브랜드명을 전환해 미리 비교.">
        <TweakRadio
          label="브랜드명"
          value={t.brandName}
          onChange={(v) => setTweak('brandName', v)}
          options={[
            { label: 'EZ-STEP', value: 'EZ-STEP' },
            { label: 'Hy-STEP', value: 'Hy-STEP' },
          ]}
        />
      </TweakSection>
    </>
  );
}

/* ----------------------------------------
   App
---------------------------------------- */
function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "palette": "navy",
    "heroVariant": "A",
    "brandName": "EZ-STEP"
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();

  useEffect(() => {
    document.documentElement.dataset.palette = t.palette;
  }, [t.palette]);

  return (
    <>
      <Header brandName={t.brandName} />
      {t.heroVariant === 'A' ? <HeroA brandName={t.brandName} /> : <HeroB brandName={t.brandName} />}
      <TrustBar />
      <Features />
      <ChartSections />
      <Addons />
      <BigPreview />
      <HowItWorks />
      <DarkBrandSection brandName={t.brandName} />
      <FinalCTA brandName={t.brandName} />
      <Footer brandName={t.brandName} />

      <TweaksPanel title="Tweaks">
        <TweaksControls t={t} setTweak={setTweak} />
        <TweakSuggestionBar suggestions={[
          '히어로 카피를 좀 더 감성적으로',
          '차트 목업에 실제 치식 다이어그램 추가',
          '가격 섹션을 추가해줘',
          '푸터 링크 4열 → 3열로 재구성',
        ]} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
