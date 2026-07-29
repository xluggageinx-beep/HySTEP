(function(){
  'use strict';
  function open(){
    const wrap=document.createElement('div');wrap.id='adminAccessModal';wrap.style.cssText='position:fixed;inset:0;background:#102a5688;display:grid;place-items:center;z-index:99999';
    wrap.innerHTML='<div style="width:min(390px,calc(100% - 28px));background:white;border-radius:14px;padding:22px;font-family:Pretendard,Arial"><h2>Admin</h2><p style="color:#667085">Prototype 운영자 비밀번호를 입력하세요.</p><input id="adminPassword" type="password" style="width:100%;padding:11px;border:1px solid #dbe3ef;border-radius:8px"><div style="display:flex;gap:8px;margin-top:12px"><button id="adminCancel" style="flex:1;padding:10px;border:1px solid #dbe3ef;background:white;border-radius:8px">취소</button><button id="adminLogin" style="flex:1;padding:10px;border:0;background:#1976d2;color:white;border-radius:8px;font-weight:700">확인</button></div><p id="adminError" style="color:#c94040"></p></div>';
    document.body.appendChild(wrap);document.getElementById('adminCancel').onclick=()=>wrap.remove();document.getElementById('adminLogin').onclick=()=>{if(window.AdminAccess.authenticate(document.getElementById('adminPassword').value))location.href='/admin-step';else document.getElementById('adminError').textContent='비밀번호가 올바르지 않습니다.'};
  }
  document.addEventListener('DOMContentLoaded',()=>{const footer=document.querySelector('footer')||document.body;const link=document.createElement('button');link.textContent='Admin';link.setAttribute('aria-label','관리자스텝 접근');link.style.cssText='float:right;margin:12px 20px;border:0;background:transparent;color:#9aa4b2;font-size:11px;cursor:pointer';link.onclick=open;footer.appendChild(link)});
})();
