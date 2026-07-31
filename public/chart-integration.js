(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (params.get('prototype') !== '1' || !window.PrototypeStore) return;

  const previewMode = params.get('mode') === 'preview';
  const role = params.get('role') === 'professor' ? 'professor' : 'student';
  const participantId = params.get('participant');
  const Store = window.PrototypeStore;
  const participant = Store.getParticipant(participantId);
  if (!participant) return;
  const school = Store.getSchoolForParticipant(participantId) || {
    schoolId: null, sections: Store.getDefaultSections(),
    features: { photo: false, professor: false, inlineAi: false }
  };
  const allSections = school.sections;
  const sections = allSections.filter(section => section.enabled);
  const memory = {
    chart: { participantId, sectionData: {}, sectionRevisions: {} },
    requests: [],
    evaluations: []
  };
  let activeSection = sections[0]?.sectionId || 's1';
  let observer = null;
  let rendering = false;

  const data = {
    chart: () => previewMode ? memory.chart : Store.getChart(participantId),
    requests: () => previewMode ? memory.requests : Store.getSignatureRequests(),
    evaluations: () => previewMode ? memory.evaluations : Store.getEvaluations(participantId),
    saveChart(sectionData) {
      if (previewMode) {
        memory.chart.sectionData[activeSection] = sectionData;
        memory.chart.sectionRevisions[activeSection] =
          (memory.chart.sectionRevisions[activeSection] || 0) + 1;
        return;
      }
      const chart = Store.getChart(participantId);
      chart.sectionData ||= {};
      chart.sectionData[activeSection] = sectionData;
      Store.saveChart(chart, activeSection);
    },
    toggleRequest() {
      const index = this.requests().findIndex(request =>
        request.participantId === participantId && request.sectionId === activeSection);
      if (previewMode) {
        if (index >= 0) memory.requests.splice(index, 1);
        else memory.requests.push({
          participantId, sectionId: activeSection, requestedAt: new Date().toISOString()
        });
        return;
      }
      index >= 0
        ? Store.withdrawSignature(participantId, activeSection)
        : Store.requestSignature(participantId, activeSection);
    },
    sign(publicComment, privateComment) {
      if (previewMode) {
        const revision = memory.chart.sectionRevisions[activeSection] || 0;
        memory.evaluations = memory.evaluations.filter(item => item.sectionId !== activeSection);
        memory.evaluations.push({
          participantId, sectionId: activeSection, publicComment, privateComment,
          signedAt: new Date().toISOString(), signedRevision: revision, modifiedAfterSign: false
        });
        memory.requests = memory.requests.filter(item => item.sectionId !== activeSection);
        return;
      }
      Store.signSection({ participantId, sectionId: activeSection, publicComment, privateComment });
    }
  };

  const style = document.createElement('style');
  style.textContent = `
    .v4-section-integration{margin:22px 0 8px;padding:18px;background:var(--card,#fff);border:1px solid var(--line,rgba(11,18,32,.1));border-radius:var(--r-lg,16px);box-shadow:var(--shadow-sm,0 2px 8px rgba(0,0,0,.05));font-family:inherit}
    .v4-integration-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}.v4-integration-title{font-size:15px;font-weight:800;color:var(--ink-900,#172033)}
    .v4-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.v4-btn{border:0;border-radius:9px;padding:9px 12px;font:inherit;font-size:13px;font-weight:750;cursor:pointer}.v4-primary{background:var(--brand-600,#1976d2);color:white}.v4-ghost{background:white;color:var(--ink-700,#344054);border:1px solid var(--line-strong,#ccd5e2)}
    .v4-eval{display:grid;grid-template-columns:1fr 1fr;gap:12px}.v4-eval label{font-size:12px;font-weight:700}.v4-eval textarea{width:100%;min-height:82px;margin-top:6px;border:1px solid var(--line-strong,#ccd5e2);border-radius:9px;padding:10px;font:inherit}
    .v4-comment,.v4-warning,.v4-preview{margin-top:12px;padding:12px;border-radius:10px}.v4-comment{background:var(--brand-50,#f2f7ff)}.v4-warning{background:#fff7e8;color:#8b5b00;border:1px solid #f0d59d}.v4-preview{background:#eef7ff;color:#24517d;border:1px solid #c8def2;font-size:12px}
    .v4-ai-anchor{position:relative!important}.v4-ai-field{position:absolute;right:5px;top:5px;z-index:5;border:1px solid #c9d7ea;background:#fff;color:#245aa7;border-radius:7px;padding:3px 7px;font-size:10px;font-weight:800;line-height:1.2}.v4-ai-overlay{position:fixed;right:24px;bottom:24px;z-index:1200;width:min(360px,calc(100vw - 32px));background:#fff;border:1px solid #cdd9e8;border-radius:16px;box-shadow:0 18px 48px rgba(16,42,86,.22);padding:18px}.v4-ai-overlay[hidden]{display:none}.v4-ai-overlay-head{display:flex;justify-content:space-between;align-items:center}.v4-ai-overlay textarea{width:100%;min-height:90px;margin-top:12px;border:1px solid #d6deea;border-radius:10px;padding:10px;font:inherit}
    .v4-nav{position:sticky;top:0;z-index:900;display:flex;gap:7px;align-items:center;padding:8px 14px;background:rgba(255,255,255,.94);border-bottom:1px solid var(--line,#dbe3ef);backdrop-filter:blur(10px)}.v4-nav span{font-size:12px;color:var(--ink-500,#667085);margin-right:auto}
    .v4-runtime-hidden{display:none!important}@media(max-width:680px){.v4-eval{grid-template-columns:1fr}.v4-section-integration{padding:14px}.v4-nav{position:static;flex-wrap:wrap}}
  `;
  document.head.appendChild(style);

  const nav = document.createElement('div');
  nav.className = 'v4-nav';
  nav.innerHTML = `<span>${escapeHtml(participant.name)} · ${role === 'student' ? '학생' : '교수'} · ${previewMode ? 'Preview (저장 안 됨)' : '실제 모드'}</span>${role === 'professor' ? '<button class="v4-btn v4-ghost" id="v4Prev">이전</button><button class="v4-btn v4-ghost" id="v4Next">다음</button>' : ''}<button class="v4-btn v4-ghost" id="v4Back">대시보드</button>`;
  document.body.prepend(nav);
  document.getElementById('v4Back').onclick = () =>
    location.href = `/hystep-preview?schoolId=${encodeURIComponent(school.schoolId || Store.DEFAULT_SCHOOL_ID)}`;
  if (role === 'professor') {
    document.getElementById('v4Prev').onclick = () => queueMove(-1);
    document.getElementById('v4Next').onclick = () => queueMove(1);
  }

  function sectionFromDom() {
    const title = document.querySelector('.sec-sticky .ss-ko')?.textContent?.trim();
    return allSections.find(section => section.name === title || title?.startsWith(section.name))?.sectionId || activeSection;
  }
  function sectionRoot() {
    const sticky = document.querySelector('.sec-sticky');
    return sticky?.parentElement || document.querySelector('.main>div') || document.querySelector('.main');
  }
  function snapshot() {
    const values = {};
    sectionRoot()?.querySelectorAll('input,select,textarea,[contenteditable="true"]').forEach((element, index) => {
      if (element.closest('.v4-section-integration')) return;
      const key = element.id || element.name || `field-${index}`;
      values[key] = element.type === 'checkbox' ? element.checked : (element.value ?? element.textContent);
    });
    return values;
  }
  function restore() {
    const values = data.chart().sectionData?.[activeSection] || {};
    sectionRoot()?.querySelectorAll('input,select,textarea,[contenteditable="true"]').forEach((element, index) => {
      if (element.closest('.v4-section-integration')) return;
      const key = element.id || element.name || `field-${index}`;
      if (!(key in values)) return;
      if (element.type === 'checkbox') element.checked = Boolean(values[key]);
      else if ('value' in element) element.value = values[key];
      else element.textContent = values[key];
    });
    window.dispatchEvent(new CustomEvent('hystep-section-restore', { detail: values }));
  }
  function applyRuntimeMapping() {
    const config = allSections.find(section => section.sectionId === activeSection);
    config?.items.forEach(form => (form.runtimeTargets || []).forEach(id => {
      document.getElementById(id)?.classList.toggle('v4-runtime-hidden', !config.enabled || !form.enabled);
    }));
  }
  function save() { data.saveChart(snapshot()); renderIntegration(); }
  function toggleRequest() { data.toggleRequest(); renderIntegration(); }
  function sign() {
    data.sign(
      document.getElementById('v4Public')?.value || '',
      document.getElementById('v4Private')?.value || ''
    );
    renderIntegration();
  }
  function runtimeConfig(id) {
    const target = Store.getSchoolForParticipant(id);
    return encodeURIComponent(JSON.stringify({
      sections: (target?.sections || []).filter(section => section.enabled).map(section => section.sectionId),
      formTargets: (target?.sections || []).filter(section => section.enabled).flatMap(section =>
        (section.items || []).filter(item => item.enabled).flatMap(item => item.runtimeTargets || [])),
      dashboard: true, photo: Boolean(target?.features?.photo)
    }));
  }
  function queueMove(delta) {
    const requests = previewMode
      ? memory.requests
      : [...Store.getState().signatureRequests].filter(request =>
          Store.getParticipant(request.participantId)?.schoolId === school.schoolId);
    const ids = [...new Set(requests.sort((a, b) => a.requestedAt.localeCompare(b.requestedAt)).map(request => request.participantId))];
    const index = ids.indexOf(participantId);
    const next = ids[index + delta];
    if (next) location.href = `/chart?prototype=1&mode=${previewMode ? 'preview' : 'actual'}&role=professor&participant=${next}&queueIndex=${index + delta}&config=${runtimeConfig(next)}`;
  }
  function applyVisibility() {
    document.querySelectorAll('.nav-heading').forEach(element => {
      if (element.textContent.includes('공용 Component')) element.style.display = 'none';
    });
    if (!school.features?.photo) document.querySelectorAll('button').forEach(element => {
      if (element.textContent.trim() === '포토') element.style.display = 'none';
    });
    ensureAiShell();
  }
  function statusFor(sectionId) {
    const evaluation = data.evaluations().find(item => item.sectionId === sectionId);
    const request = data.requests().find(item => item.participantId === participantId && item.sectionId === sectionId);
    const hasData = Object.keys(data.chart().sectionData?.[sectionId] || {}).length > 0;
    return evaluation ? 'done' : request ? 'review' : hasData ? 'wip' : 'empty';
  }
  function publishStatuses() {
    window.__hystepSectionStatuses = Object.fromEntries(sections.map(section => [section.sectionId, statusFor(section.sectionId)]));
    window.__hystepRole = role;
    window.dispatchEvent(new CustomEvent('hystep-status-change'));
  }
  window.__hystepToggleSignatureRequest = sectionId => {
    activeSection = sectionId;
    data.toggleRequest();
    renderIntegration();
  };
  function ensureAiShell() {
    if (!school.features?.inlineAi) return;
    if (!document.getElementById('v4AiOverlay')) {
      const overlay = document.createElement('aside');
      overlay.id = 'v4AiOverlay'; overlay.className = 'v4-ai-overlay'; overlay.hidden = true;
      overlay.innerHTML = '<div class="v4-ai-overlay-head"><b>AI Assistant</b><button class="v4-btn v4-ghost" id="v4AiClose">닫기</button></div><p style="font-size:12px;color:#667085">현재 입력된 차트 내용을 바탕으로 작성만 지원합니다. 진단 도구가 아닙니다.</p><textarea id="v4AiPrompt" placeholder="작성 중 궁금한 내용을 입력하세요."></textarea><div class="v4-actions"><button class="v4-btn v4-primary" id="v4AiApply">적용</button><button class="v4-btn v4-ghost" id="v4AiEvidence">근거 보기</button></div>';
      document.body.appendChild(overlay);
      overlay.querySelector('#v4AiClose').onclick = () => overlay.hidden = true;
      overlay.querySelector('#v4AiApply').onclick = applySuggestion;
      overlay.querySelector('#v4AiEvidence').onclick = () => alert('현재 활성 Section의 입력 내용을 근거로 참조합니다.');
    }
    const photoButton = [...document.querySelectorAll('.nav-item')].find(button => button.textContent.trim() === 'Photo');
    if (photoButton && !document.getElementById('v4AiMenu')) {
      const aiMenu = document.createElement('button'); aiMenu.id = 'v4AiMenu'; aiMenu.className = 'nav-item';
      aiMenu.innerHTML = '<span class="sign-dot placeholder"></span><span class="idx"></span><span class="name">AI Assistant</span><span class="pct"></span>';
      aiMenu.onclick = () => { document.getElementById('v4AiOverlay').hidden = false; };
      photoButton.after(aiMenu);
    }
    sectionRoot()?.querySelectorAll('input,textarea,[contenteditable="true"]').forEach(field => {
      if (field.closest('.v4-section-integration,.photo-modal,.photo-page') || field.id === 'tooth-model-state' || field.dataset.aiBound) return;
      const parent = field.parentElement; if (!parent) return;
      parent.classList.add('v4-ai-anchor'); field.dataset.aiBound = 'true';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'v4-ai-field'; button.textContent = 'AI';
      button.onclick = event => { event.preventDefault(); document.getElementById('v4AiOverlay').hidden = false; };
      parent.appendChild(button);
    });
  }
  function renderIntegration() {
    if (rendering) return;
    rendering = true;
    observer?.disconnect();
    try {
      activeSection = sectionFromDom();
      const root = sectionRoot();
      if (!root) return;
      applyVisibility();
      applyRuntimeMapping();
      root.querySelectorAll('[data-hystep-integration="true"]').forEach(node => node.remove());
      const request = data.requests().find(item => item.participantId === participantId && item.sectionId === activeSection);
      const evaluation = data.evaluations().find(item => item.sectionId === activeSection);
      const block = document.createElement('section');
      block.className = 'v4-section-integration';
      block.dataset.hystepIntegration = 'true';
      block.innerHTML = `${role === 'professor' ? '<div class="v4-integration-head"><div class="v4-integration-title">교수 평가</div><button class="v4-btn v4-ghost" id="v4Request">' + (request ? '서명 요청 철회' : '서명 요청') + '</button></div>' : ''}${previewMode ? '<div class="v4-preview">Preview 입력은 이 페이지의 메모리에만 유지되며 새로고침하면 초기화됩니다.</div>' : ''}${evaluation?.modifiedAfterSign && role === 'professor' ? '<div class="v4-warning">⚠ 서명 이후 내용이 수정되었습니다.</div>' : ''}${role === 'student' ? studentUi(evaluation) : professorUi(evaluation)}`;
      root.appendChild(block);
      if (role === 'student') {
        block.querySelector('#v4Save').onclick = save;
      } else {
        block.querySelector('#v4Request').onclick = toggleRequest;
        block.querySelector('#v4Sign').onclick = sign;
      }
      publishStatuses();
    } finally {
      rendering = false;
      observeChartRoot();
    }
  }
  function studentUi(evaluation) {
    return `${evaluation?.signedAt && evaluation.publicComment ? `<div class="v4-comment"><b>교수 공개 코멘트</b><div>${escapeHtml(evaluation.publicComment)}</div></div>` : ''}<div class="v4-actions"><button class="v4-btn v4-primary" id="v4Save">차트 저장</button></div>`;
  }
  function professorUi(evaluation) {
    return `<div class="v4-eval"><label>공개 코멘트<textarea id="v4Public">${escapeHtml(evaluation?.publicComment || '')}</textarea></label><label>비공개 코멘트<textarea id="v4Private">${escapeHtml(evaluation?.privateComment || '')}</textarea></label></div><div class="v4-actions"><button class="v4-btn v4-primary" id="v4Sign">서명</button><span style="font-size:12px;color:var(--ink-500,#667085)">코멘트 없이도 서명할 수 있습니다.</span></div>`;
  }
  function applySuggestion() {
    const first = [...(sectionRoot()?.querySelectorAll('input,textarea,[contenteditable="true"]') || [])]
      .find(element => !element.closest('.v4-section-integration'));
    if (!first) return;
    const suggestion = '자가관리 실천 내용을 추가 확인했습니다.';
    if ('value' in first) first.value = `${first.value ? `${first.value} ` : ''}${suggestion}`;
    else first.textContent += ` ${suggestion}`;
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }
  function integrationOwned(node) {
    return node.nodeType === 1 &&
      (node.matches?.('[data-hystep-integration="true"]') || node.closest?.('[data-hystep-integration="true"]'));
  }
  function integrationOnly(mutations) {
    return mutations.every(mutation =>
      integrationOwned(mutation.target) ||
      [...mutation.addedNodes, ...mutation.removedNodes].every(node => node.nodeType === 3 || integrationOwned(node)));
  }
  function observeChartRoot() {
    const root = document.querySelector('#root');
    if (!root) return;
    observer?.disconnect();
    observer.observe(root, { childList: true, subtree: true });
  }

  let timer;
  observer = new MutationObserver(mutations => {
    if (rendering || integrationOnly(mutations)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const next = sectionFromDom();
      const missing = !document.querySelector('[data-hystep-integration="true"]');
      if (next !== activeSection || missing) {
        activeSection = next;
        restore();
        renderIntegration();
      }
    }, 80);
  });
  observeChartRoot();
  setTimeout(() => {
    activeSection = sectionFromDom();
    restore();
    renderIntegration();
  }, 250);
})();
