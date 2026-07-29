(function(){
  'use strict';
  if(window.AdminAccess?.isAuthenticated())return;
  document.documentElement.style.visibility='hidden';
  document.addEventListener('DOMContentLoaded',()=>{
    document.body.innerHTML='<main style="max-width:420px;margin:12vh auto;font-family:Pretendard,Arial;padding:24px"><h1>관리자스텝 접근</h1><p>Prototype 운영자 비밀번호를 입력하세요.</p><input id="guardPassword" type="password" style="width:100%;padding:12px;border:1px solid #ccd5e2;border-radius:9px"><button id="guardSubmit" style="margin-top:12px;width:100%;padding:12px;border:0;border-radius:9px;background:#1976d2;color:white;font-weight:700">확인</button><p id="guardError" style="color:#c94040"></p></main>';
    document.documentElement.style.visibility='visible';
    document.getElementById('guardSubmit').onclick=()=>{if(window.AdminAccess.authenticate(document.getElementById('guardPassword').value))location.reload();else document.getElementById('guardError').textContent='비밀번호가 올바르지 않습니다.'};
  });
  throw new Error('ADMIN_AUTH_REQUIRED');
})();
