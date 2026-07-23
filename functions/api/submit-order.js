/**
 * Cloudflare Pages Function
 * POST /api/submit-order
 * Resend API로 이메일 발송
 */

const MAIL_TO = 'dlwlalsdentalchart@gmail.com';

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
    <div style="background:linear-gradient(135deg,#1976D2,#0D47A1);padding:28px 32px;">
      <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">📋 새 차트 생성 신청</h1>
      <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px;">EZ-STEP Builder | ${submittedAt}</p>
    </div>
    <div style="padding:28px 32px;">
      <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
        <span style="font-size:12px;color:#1D4ED8;font-weight:600;">신청 번호</span>
        <p style="font-size:18px;font-weight:700;color:#1E3A8A;margin:4px 0 0;letter-spacing:1px;">${order.id}</p>
      </div>
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
      <div style="background:#1E293B;border-radius:8px;padding:16px 20px;">
        <p style="color:#94A3B8;font-size:12px;margin:0 0 8px;">신청 ID</p>
        <code style="color:#38BDF8;font-size:14px;font-weight:600;">${order.id}</code>
      </div>
    </div>
    <div style="background:#F8FAFC;padding:16px 32px;border-top:1px solid #E2E8F0;">
      <p style="font-size:12px;color:#94A3B8;margin:0;text-align:center;">EZ-STEP Builder · 자동 발송 메일입니다</p>
    </div>
  </div>
</body>
</html>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS 헤더
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const order = await request.json();
    const orderId = 'ORD-' + Date.now();
    const orderData = {
      id: orderId,
      submittedAt: new Date().toISOString(),
      ...order
    };

    // Resend API로 이메일 발송
    const RESEND_API_KEY = env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return Response.json(
        { success: false, error: 'RESEND_API_KEY 환경변수가 설정되지 않았습니다.' },
        { status: 500, headers: corsHeaders }
      );
    }

    const contactName = order.contact?.name || '미입력';
    const contactOrg  = order.contact?.org  || '미입력';

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EZ-STEP Builder <onboarding@resend.dev>',
        to: [MAIL_TO],
        subject: `[EZ-STEP] 새 차트 신청 — ${order.schoolName} (${contactName}/${contactOrg})`,
        html: buildEmailHtml(orderData),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend 오류:', errText);
      return Response.json(
        { success: false, error: 'Resend 이메일 발송 실패: ' + errText },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json(
      { success: true, orderId },
      { headers: corsHeaders }
    );

  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
