// Light-themed browser window frame — matches SaaS aesthetic
function BrowserWindow({ url = 'ezstep.clinic', width = '100%', height = 480, children }) {
  return (
    <div style={{
      width,
      borderRadius: 14,
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 30px 80px rgba(13, 42, 94, 0.28), 0 0 0 1px rgba(11, 18, 32, 0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Titlebar */}
      <div style={{
        height: 40,
        background: 'linear-gradient(180deg, #F7F8FB 0%, #EEF1F6 100%)',
        borderBottom: '1px solid rgba(11, 18, 32, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 14px',
      }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FF605C' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#FFBD44' }} />
          <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#00CA4E' }} />
        </div>
        <div style={{
          flex: 1,
          maxWidth: 320,
          margin: '0 auto',
          height: 24,
          borderRadius: 6,
          background: '#fff',
          border: '1px solid rgba(11, 18, 32, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 10px',
          fontSize: 11.5,
          fontFamily: 'var(--font-mono)',
          color: '#5A6785',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7B87A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="10" width="16" height="10" rx="2"/>
            <path d="M8 10V7a4 4 0 018 0v3"/>
          </svg>
          {url}
        </div>
        <div style={{ width: 46 }} />
      </div>
      <div style={{ height, background: '#fff', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

window.BrowserWindow = BrowserWindow;
