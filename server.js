// .env 파일이 있으면 로드 (없어도 무시)
try { require('dotenv').config(); } catch(e) {}

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 견적 신청 저장 디렉토리
const ordersDir = path.join(__dirname, 'orders');
if (!fs.existsSync(ordersDir)) fs.mkdirSync(ordersDir, { recursive: true });

// ── 이메일 설정 ────────────────────────────────────────────────────
// 수신 주소는 항상 dlwlalsdentalchart@gmail.com (고정)
// 발신용 Gmail 계정은 환경변수로 설정:
//   export GMAIL_USER="your-gmail@gmail.com"
//   export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"   ← Gmail 앱 비밀번호 16자리
//   또는 .env 파일에 위 두 줄 작성
const MAIL_USER = process.env.GMAIL_USER || '';
const MAIL_PASS = process.env.GMAIL_APP_PASSWORD || '';
const MAIL_TO   = 'dlwlalsdentalchart@gmail.com';   // ← 수신 고정

let transporter = null;
if (MAIL_USER && MAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: MAIL_USER, pass: MAIL_PASS }
  });
  transporter.verify((err) => {
    if (err) console.error('❌ 이메일 설정 오류:', err.message);
    else console.log('✅ Gmail 연결 성공 — 이메일 발송 준비 완료');
  });
} else {
  console.warn('⚠️  GMAIL_USER / GMAIL_APP_PASSWORD 환경변수 미설정 → 이메일 발송 비활성');
}

// ── 이메일 본문 생성 ───────────────────────────────────────────────
function buildEmailHtml(order) {
  const selectedSections = Object.entries(order.sections || {})
    .map(([num, s]) => `Section ${num}: ${s.name}`)
    .join('<br/>');

  const enabledAddons = Object.entries(order.addons || {})
    .filter(([, enabled]) => enabled)
    .map(([key]) => ({
      dashboard: '관리자 대시보드', ai: 'AI 채팅 어시스턴트',
      calc: '데이터 자동 계산', photo: '멀티미디어 사진 업로드',
      profEval: '교수 평가', survey: '사전문진 링크 생성',
      reservation: '예약 시스템 연동'
    }[key] || key))
    .join(', ') || '없음';

  const contact = order.contact || {};
  const submittedAt = new Date(order.submittedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Apple SD Gothic Neo',sans-serif;background:#f5f7fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- 헤더 -->
    <div style="background:linear-gradient(135deg,#1976D2,#0D47A1);padding:28px 32px;">
      <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">📋 새 차트 생성 신청</h1>
      <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">EZ-STEP Builder | ${submittedAt}</p>
    </div>

    <div style="padding:28px 32px;">
      <!-- 신청 ID -->
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
        <span style="font-size:12px;color:#1D4ED8;font-weight:600;">신청 번호</span>
        <p style="font-size:18px;font-weight:700;color:#1E3A8A;margin:4px 0 0;letter-spacing:1px;">${order.id}</p>
      </div>

      <!-- 학교 정보 -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr><th colspan="2" style="background:#F8FAFC;text-align:left;padding:10px 14px;font-size:13px;color:#64748B;border-bottom:2px solid #E2E8F0;">🏫 학교 구성 정보</th></tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:11px 14px;font-size:13px;color:#64748B;width:100px;">학교명</td>
            <td style="padding:11px 14px;font-size:14px;font-weight:600;color:#1E293B;">${order.schoolName}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:11px 14px;font-size:13px;color:#64748B;">학년</td>
            <td style="padding:11px 14px;font-size:14px;font-weight:600;color:#1E293B;">${(order.grades || []).join(', ')}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:11px 14px;font-size:13px;color:#64748B;">선택 섹션</td>
            <td style="padding:11px 14px;font-size:13px;color:#1E293B;line-height:1.8;">${selectedSections}</td>
          </tr>
          <tr>
            <td style="padding:11px 14px;font-size:13px;color:#64748B;">부가기능</td>
            <td style="padding:11px 14px;font-size:14px;color:#1E293B;">${enabledAddons}</td>
          </tr>
        </tbody>
      </table>

      <!-- 신청자 정보 -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr><th colspan="2" style="background:#F8FAFC;text-align:left;padding:10px 14px;font-size:13px;color:#64748B;border-bottom:2px solid #E2E8F0;">👤 신청자 정보</th></tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:11px 14px;font-size:13px;color:#64748B;width:100px;">이름</td>
            <td style="padding:11px 14px;font-size:14px;font-weight:600;color:#1E293B;">${contact.name || '-'}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:11px 14px;font-size:13px;color:#64748B;">소속</td>
            <td style="padding:11px 14px;font-size:14px;color:#1E293B;">${contact.org || '-'}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;">
            <td style="padding:11px 14px;font-size:13px;color:#64748B;">이메일</td>
            <td style="padding:11px 14px;font-size:14px;color:#1E293B;"><a href="mailto:${contact.email}" style="color:#1976D2;">${contact.email || '-'}</a></td>
          </tr>
          <tr>
            <td style="padding:11px 14px;font-size:13px;color:#64748B;">연락처</td>
            <td style="padding:11px 14px;font-size:14px;color:#1E293B;">${contact.phone || '-'}</td>
          </tr>
        </tbody>
      </table>

      <!-- 배포 명령 -->
      <div style="background:#1E293B;border-radius:8px;padding:16px 20px;">
        <p style="color:#94A3B8;font-size:12px;margin:0 0 8px;">배포 명령어</p>
        <code style="color:#38BDF8;font-size:14px;font-weight:600;">npm run create-school -- --id=${order.id}</code>
      </div>
    </div>

    <!-- 푸터 -->
    <div style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;">
      <p style="font-size:12px;color:#94A3B8;margin:0;text-align:center;">EZ-STEP Builder · 자동 발송 메일입니다</p>
    </div>
  </div>
</body>
</html>`;
}

// ── 견적 신청 접수 API ──────────────────────────────────────────
app.post('/api/submit-order', async (req, res) => {
  try {
    const order = req.body;
    const timestamp = new Date().toISOString();
    const orderId = 'ORD-' + Date.now();

    const orderData = {
      id: orderId,
      submittedAt: timestamp,
      ...order
    };

    // 파일로 저장
    const filePath = path.join(ordersDir, `${orderId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2), 'utf8');

    console.log(`\n📨 새 견적 신청 접수!`);
    console.log(`  ID: ${orderId}`);
    console.log(`  학교: ${order.schoolName}`);
    console.log(`  학년: ${order.grades?.join(', ')}`);
    console.log(`  섹션: ${Object.keys(order.sections || {}).length}개`);
    console.log(`  부가기능: ${Object.keys(order.addons || {}).filter(k => order.addons[k]).join(', ')}`);
    if (order.contact) {
      console.log(`  신청자: ${order.contact.name} (${order.contact.org}) <${order.contact.email}>`);
    }
    console.log(`  시각: ${timestamp}`);
    console.log(`  파일: ${filePath}\n`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  👉 배포 명령어: npm run create-school -- --id=${orderId}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    // 이메일 발송 (설정된 경우)
    if (transporter && MAIL_TO) {
      try {
        const contactName = order.contact?.name || '미입력';
        const contactOrg  = order.contact?.org  || '미입력';
        await transporter.sendMail({
          from: `"EZ-STEP Builder" <${MAIL_USER}>`,
          to: MAIL_TO,
          subject: `[EZ-STEP] 새 차트 신청 — ${order.schoolName} (${contactName}/${contactOrg})`,
          html: buildEmailHtml(orderData)
        });
        console.log(`📧 이메일 발송 완료 → ${MAIL_TO}`);
      } catch (mailErr) {
        console.error('📧 이메일 발송 실패 (주문은 정상 저장됨):', mailErr.message);
      }
    }

    res.json({ success: true, orderId });
  } catch (e) {
    console.error('주문 저장 오류:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── 관리자: 주문 목록 조회 ──────────────────────────────────────
app.get('/api/orders', (req, res) => {
  try {
    const files = fs.readdirSync(ordersDir).filter(f => f.endsWith('.json'));
    const orders = files.map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(ordersDir, f), 'utf8'));
      return data;
    }).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── 기본 라우팅 ─────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/builder', (req, res) => res.sendFile(path.join(__dirname, 'public', 'builder.html')));
app.get('/preview', (req, res) => res.sendFile(path.join(__dirname, 'public', 'preview.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.listen(PORT, () => {
  console.log(`\n🚀 EZ-STEP 빌더 서버 시작!`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   관리자 페이지: http://localhost:${PORT}/admin`);
   console.log(`\n📧 이메일 설정:`);
  console.log(`   발신자: ${MAIL_USER || '(미설정 — 이메일 발송 비활성)'}`);
  console.log(`   수신자: ${MAIL_TO}  (고정)`);
  if (!MAIL_USER) {
    console.log(`\n   💡 이메일 활성화 방법 (둘 중 하나):`);
    console.log(`   ① 환경변수:`);
    console.log(`      export GMAIL_USER="your-gmail@gmail.com"`);
    console.log(`      export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"`);
    console.log(`   ② .env 파일 생성 (builder/.env):`);
    console.log(`      GMAIL_USER=your-gmail@gmail.com`);
    console.log(`      GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx`);
    console.log(`   ※ Google 계정 → 보안 → 앱 비밀번호에서 16자리 생성\n`);
  }
});
