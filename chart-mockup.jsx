// Chart UI mockup — displays inside browser frame in hero
const chartMockupStyles = {
  root: {
    background: '#F5F7FC',
    height: '100%',
    minHeight: '480px',
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    fontFamily: 'var(--font-sans)',
    color: '#0B1220',
    fontSize: '13px',
  },
  sidebar: {
    background: '#fff',
    borderRight: '1px solid rgba(11, 18, 32, 0.06)',
    padding: '18px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sbTitle: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#7B87A5',
    padding: '4px 10px 10px',
  },
  sbItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 10px',
    borderRadius: '8px',
    background: active ? 'var(--brand-100)' : 'transparent',
    color: active ? 'var(--brand-700)' : '#5A6785',
    fontWeight: active ? 600 : 500,
    fontSize: '12.5px',
    cursor: 'pointer',
  }),
  sbNum: (active) => ({
    width: '20px',
    height: '20px',
    borderRadius: '6px',
    background: active ? 'var(--brand-600)' : '#EBEFF8',
    color: active ? '#fff' : '#7B87A5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    flexShrink: 0,
  }),
  main: {
    padding: '20px 24px',
    overflow: 'hidden',
  },
  mainHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  crumb: { fontSize: '11px', color: '#7B87A5', marginBottom: '4px' },
  h2: { fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em' },
  tabs: {
    display: 'flex',
    gap: '4px',
    padding: '3px',
    background: '#EBEFF8',
    borderRadius: '999px',
  },
  tab: (active) => ({
    padding: '5px 10px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '999px',
    background: active ? '#fff' : 'transparent',
    color: active ? '#0B1220' : '#7B87A5',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
  }),
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '10px',
  },
  card: {
    background: '#fff',
    border: '1px solid rgba(11, 18, 32, 0.06)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  cardLabel: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#7B87A5',
    marginBottom: '8px',
  },
  cardVal: {
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#0B1220',
  },
  cardValSmall: { fontSize: '14px', color: '#5A6785', marginLeft: '4px', fontWeight: 500 },
  progress: {
    height: '6px',
    background: '#EBEFF8',
    borderRadius: '999px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    background: color,
    borderRadius: '999px',
  }),
  goalRow: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px',
  },
  goalPill: (variant) => {
    const map = {
      met: { bg: 'rgba(59, 189, 137, 0.14)', color: '#2B9868', border: 'rgba(59, 189, 137, 0.3)' },
      partial: { bg: 'rgba(245, 179, 66, 0.15)', color: '#B87D14', border: 'rgba(245, 179, 66, 0.35)' },
      unmet: { bg: 'rgba(233, 100, 100, 0.14)', color: '#C9464A', border: 'rgba(233, 100, 100, 0.32)' },
    };
    const s = map[variant];
    return {
      flex: 1,
      padding: '6px 8px',
      textAlign: 'center',
      fontSize: '10.5px',
      fontWeight: 700,
      background: s.bg,
      color: s.color,
      borderRadius: '6px',
      border: `1px solid ${s.border}`,
    };
  },
  aiCard: {
    background: 'linear-gradient(135deg, #F4F8FF 0%, #E8F1FE 100%)',
    border: '1px solid var(--brand-100)',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  aiIcon: {
    width: '26px', height: '26px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--brand-600), var(--brand-400))',
    color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800,
    fontSize: '11px',
    flexShrink: 0,
  },
  aiWho: { fontSize: '10px', fontWeight: 700, color: 'var(--brand-700)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' },
  aiText: { fontSize: '12px', lineHeight: 1.5, color: '#2A3654' },
};

const chartSections = [
  { n: '01', label: '문진' },
  { n: '02', label: '치주검사' },
  { n: '03', label: 'PI 측정', active: true },
  { n: '04', label: '진단' },
  { n: '05', label: '목표 설정' },
  { n: '06', label: '교육' },
  { n: '07', label: '처치' },
  { n: '08', label: '치위생평가' },
  { n: '09', label: '달성도평가' },
];

function ChartMockup() {
  return (
    <div style={chartMockupStyles.root}>
      {/* Sidebar */}
      <aside style={chartMockupStyles.sidebar}>
        <div style={chartMockupStyles.sbTitle}>대상자 · 김OO (24세)</div>
        {chartSections.map((s) => (
          <div key={s.n} style={chartMockupStyles.sbItem(s.active)}>
            <span style={chartMockupStyles.sbNum(s.active)}>{s.n.slice(1)}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </aside>

      {/* Main */}
      <div style={chartMockupStyles.main}>
        <div style={chartMockupStyles.mainHead}>
          <div>
            <div style={chartMockupStyles.crumb}>Section 03 · 2회차</div>
            <div style={chartMockupStyles.h2}>PI 측정 및 O'Leary Index</div>
          </div>
          <div style={chartMockupStyles.tabs}>
            <div style={chartMockupStyles.tab(false)}>1회차</div>
            <div style={chartMockupStyles.tab(true)}>2회차</div>
            <div style={chartMockupStyles.tab(false)}>3회차</div>
          </div>
        </div>

        <div style={chartMockupStyles.cardsGrid}>
          <div style={chartMockupStyles.card}>
            <div style={chartMockupStyles.cardLabel}>O'Leary Index</div>
            <div>
              <span style={chartMockupStyles.cardVal}>58.2</span>
              <span style={chartMockupStyles.cardValSmall}>%</span>
            </div>
            <div style={chartMockupStyles.progress}>
              <div style={chartMockupStyles.progressFill(58.2, 'linear-gradient(90deg, var(--brand-500), var(--brand-300))')} />
            </div>
          </div>
          <div style={chartMockupStyles.card}>
            <div style={chartMockupStyles.cardLabel}>Calculus Rate</div>
            <div>
              <span style={chartMockupStyles.cardVal}>32.4</span>
              <span style={chartMockupStyles.cardValSmall}>%</span>
            </div>
            <div style={chartMockupStyles.progress}>
              <div style={chartMockupStyles.progressFill(32.4, 'linear-gradient(90deg, #F5B342, #FBD989)')} />
            </div>
          </div>
        </div>

        <div style={chartMockupStyles.card}>
          <div style={chartMockupStyles.cardLabel}>Section 05 · 목표 달성도</div>
          <div style={chartMockupStyles.goalRow}>
            <div style={chartMockupStyles.goalPill('met')}>목표1 Met</div>
            <div style={chartMockupStyles.goalPill('partial')}>목표2 Partial</div>
            <div style={chartMockupStyles.goalPill('unmet')}>목표3 Unmet</div>
          </div>
        </div>

        <div style={{ marginTop: '10px', ...chartMockupStyles.aiCard }}>
          <div style={chartMockupStyles.aiIcon}>AI</div>
          <div>
            <div style={chartMockupStyles.aiWho}>Gemini 어시스턴트</div>
            <div style={chartMockupStyles.aiText}>PI가 개선 중입니다. 하악 좌측 구치부의 인접면 세정을 집중 지도하세요.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ChartMockup = ChartMockup;
