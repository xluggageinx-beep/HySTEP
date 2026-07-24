// Line-style SVG icons (stroke-based, matches modern SaaS aesthetic)
const IconBase = ({ children, size = 22, stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const IconChart = (p) => (<IconBase {...p}><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M8 14v3M12 10v7M16 7v10"/></IconBase>);
const IconDashboard = (p) => (<IconBase {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></IconBase>);
const IconAi = (p) => (<IconBase {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="4"/></IconBase>);
const IconCalculator = (p) => (<IconBase {...p}><rect x="5" y="3" width="14" height="18" rx="2.5"/><rect x="8" y="6" width="8" height="3" rx="0.5"/><circle cx="9" cy="13" r="0.5" fill="currentColor"/><circle cx="12" cy="13" r="0.5" fill="currentColor"/><circle cx="15" cy="13" r="0.5" fill="currentColor"/><circle cx="9" cy="16" r="0.5" fill="currentColor"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/><circle cx="15" cy="16" r="0.5" fill="currentColor"/></IconBase>);
const IconCamera = (p) => (<IconBase {...p}><path d="M4 8a2 2 0 0 1 2-2h1.5l1.5-2h6l1.5 2H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"/><circle cx="12" cy="13" r="3.5"/></IconBase>);
const IconCalendar = (p) => (<IconBase {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></IconBase>);
const IconTeacher = (p) => (<IconBase {...p}><circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-3.5 3-6 7-6s7 2.5 7 6"/><path d="M14 15l3 6M10 15l-3 6"/></IconBase>);
const IconSignature = (p) => (<IconBase {...p}><path d="M3 17c3 0 3-8 6-8s3 8 6 8"/><path d="M15 17c1.5 0 3-1 3-2s-1-2-2-1"/><path d="M3 21h18"/></IconBase>);
const IconClipboard = (p) => (<IconBase {...p}><rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h4"/></IconBase>);
const IconTooth = (p) => (<IconBase {...p}><path d="M12 3c-3 0-6 1.5-6 5 0 2 0.5 3 0.5 5.5 0 3 0.5 7.5 2 7.5s1.5-4 3.5-4 2 4 3.5 4 2-4.5 2-7.5c0-2.5 0.5-3.5 0.5-5.5 0-3.5-3-5-6-5Z"/></IconBase>);
const IconArrow = (p) => (<IconBase {...p}><path d="M5 12h14M13 6l6 6-6 6"/></IconBase>);
const IconCheck = (p) => (<IconBase {...p}><path d="M5 12l5 5L20 7"/></IconBase>);
const IconChevron = (p) => (<IconBase {...p}><path d="M9 6l6 6-6 6"/></IconBase>);
const IconSparkle = (p) => (<IconBase {...p}><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/><path d="M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3"/></IconBase>);
const IconShield = (p) => (<IconBase {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="M9 12l2 2 4-4"/></IconBase>);
const IconLayers = (p) => (<IconBase {...p}><path d="M12 3l9 5-9 5-9-5 9-5Z"/><path d="M3 13l9 5 9-5M3 17l9 5 9-5"/></IconBase>);
const IconEye = (p) => (<IconBase {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></IconBase>);

Object.assign(window, {
  IconChart, IconDashboard, IconAi, IconCalculator, IconCamera, IconCalendar,
  IconTeacher, IconSignature, IconClipboard, IconTooth, IconArrow, IconCheck,
  IconChevron, IconSparkle, IconShield, IconLayers, IconEye,
});
