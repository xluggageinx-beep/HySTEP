/**
 * EZ-STEP 반자동 배포 스크립트
 * 사용법: npm run create-school -- --id=ORD-1234567890
 */
const fs = require('fs');
const path = require('path');

// 인수 파싱
const args = process.argv.slice(2);
const getArg = (key) => {
  const found = args.find(a => a.startsWith(`--${key}=`));
  return found ? found.split('=').slice(1).join('=') : null;
};

const orderId = getArg('id');

if (!orderId) {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  EZ-STEP 반자동 배포 스크립트
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  사용법: npm run create-school -- --id=ORD-XXXXX

  주문 목록 확인: orders/ 디렉토리 참조
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  process.exit(0);
}

// 주문 파일 로드
const orderPath = path.join(__dirname, '..', 'orders', `${orderId}.json`);
if (!fs.existsSync(orderPath)) {
  console.error(`❌ 주문을 찾을 수 없습니다: ${orderId}`);
  console.log(`   파일 경로: ${orderPath}`);
  process.exit(1);
}

const order = JSON.parse(fs.readFileSync(orderPath, 'utf8'));

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📋 주문 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  주문 ID   : ${order.id}
  학교명    : ${order.schoolName}
  학년      : ${(order.grades || []).join(', ')}
  섹션 수   : ${Object.keys(order.sections || {}).length}개
  부가기능  : ${Object.entries(order.addons || {}).filter(([,v])=>v).map(([k])=>k).join(', ') || '없음'}
  신청 시각 : ${new Date(order.submittedAt).toLocaleString('ko-KR')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

// 학교명을 URL 슬러그로 변환
const slug = order.schoolName
  .replace(/\s+/g, '-')
  .replace(/[^a-zA-Z0-9가-힣\-]/g, '')
  .toLowerCase();

console.log(`📌 배포 가이드 (반자동 방식)`);
console.log(``);
console.log(`  1단계: Cloudflare에 새 Workers 프로젝트 생성`);
console.log(`  ─────────────────────────────────────────────`);
console.log(`  npx wrangler pages project create "${slug}-hystep"`);
console.log(``);
console.log(`  2단계: D1 데이터베이스 생성`);
console.log(`  ─────────────────────────────────────────────`);
console.log(`  npx wrangler d1 create "${slug}-hystep-db"`);
console.log(`  → 출력된 database_id를 wrangler.jsonc에 입력`);
console.log(``);
console.log(`  3단계: 메인 차트 프로젝트 설정 복사 및 배포`);
console.log(`  ─────────────────────────────────────────────`);
console.log(`  # ../src/index.tsx 에서 학교 정보를 아래와 같이 설정:`);
console.log(`  학교명   : "${order.schoolName}"`);
console.log(`  학년     : "${(order.grades||[]).join(', ')}"`);
console.log(`  사용 섹션: ${Object.keys(order.sections||{}).join(', ')}`);
console.log(`  AI 기능  : ${order.addons?.ai ? '✅ 활성화' : '❌ 비활성화'}`);
console.log(`  대시보드 : ${order.addons?.dashboard ? '✅ 활성화' : '❌ 비활성화'}`);
console.log(`  사진     : ${order.addons?.photo ? '✅ 활성화' : '❌ 비활성화'}`);
console.log(``);
console.log(`  4단계: 배포 실행`);
console.log(`  ─────────────────────────────────────────────`);
console.log(`  npm run deploy:prod`);
console.log(``);
console.log(`  5단계: 생성된 링크 전달`);
console.log(`  ─────────────────────────────────────────────`);
console.log(`  예상 링크: https://${slug}-hystep.gensparkspace.com`);
console.log(`  이 링크를 ${order.schoolName} 담당자에게 전달하세요.`);
console.log(``);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`  ⏱  예상 소요 시간: 약 4~5분`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

// 배포 설정 파일 자동 생성
const deployConfig = {
  orderId: order.id,
  schoolName: order.schoolName,
  slug: slug,
  grades: order.grades,
  sections: Object.keys(order.sections || {}),
  addons: order.addons,
  generatedAt: new Date().toISOString(),
  deployTarget: `https://${slug}-hystep.gensparkspace.com`
};

const deployConfigPath = path.join(__dirname, '..', 'orders', `${orderId}_deploy.json`);
fs.writeFileSync(deployConfigPath, JSON.stringify(deployConfig, null, 2), 'utf8');
console.log(`\n✅ 배포 설정 파일 생성됨: ${deployConfigPath}\n`);
