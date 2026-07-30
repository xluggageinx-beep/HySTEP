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
    .v4-integration-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}.v4-integration-title{font-size:15px;font-weight:800;color:var(--ink-900,#172033)}.v4-state{font-size:12px;font-weight:800;padding:5px 9px;border-radius:999px;background:var(--ink-100,#eef2f7)}
    .v4-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.v4-btn{border:0;border-radius:9px;padding:9px 12px;font:inherit;font-size:13px;font-weight:750;cursor:pointer}.v4-primary{background:var(--brand-600,#1976d2);color:white}.v4-ghost{background:white;color:var(--ink-700,#344054);border:1px solid var(--line-strong,#ccd5e2)}
    .v4-eval{display:grid;grid-template-columns:1fr 1fr;gap:12px}.v4-eval label{font-size:12px;font-weight:700}.v4-eval textarea{width:100%;min-height:82px;margin-top:6px;border:1px solid var(--line-strong,#ccd5e2);border-radius:9px;padding:10px;font:inherit}
    .v4-comment,.v4-ai,.v4-warning,.v4-preview{margin-top:12px;padding:12px;border-radius:10px}.v4-comment{background:var(--brand-50,#f2f7ff)}.v4-ai{background:#faf8ff;border:1px solid #d9d0ff}.v4-warning{background:#fff7e8;color:#8b5b00;border:1px solid #f0d59d}.v4-preview{background:#eef7ff;color:#24517d;border:1px solid #c8def2;font-size:12px}
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
      if (element.textContent.includes('Design System')) element.style.display = 'none';
    });
    if (!school.features?.photo) document.querySelectorAll('button').forEach(element => {
      if (element.textContent.trim() === '포토') element.style.display = 'none';
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
      const hasData = Object.keys(data.chart().sectionData?.[activeSection] || {}).length > 0;
      const status = evaluation ? '서명 완료' : request ? (role === 'student' ? '서명 요청' : '서명 대기') : hasData ? '작성 중' : '미작성';
      const block = document.createElement('section');
      block.className = 'v4-section-integration';
      block.dataset.hystepIntegration = 'true';
      block.innerHTML = `<div class="v4-integration-head"><div class="v4-integration-title">${role === 'student' ? 'Section 상태와 서명 요청' : '교수 평가'}</div><span class="v4-state">${status}</span></div>${previewMode ? '<div class="v4-preview">Preview 입력은 이 페이지의 메모리에만 유지되며 새로고침하면 초기화됩니다.</div>' : ''}${evaluation?.modifiedAfterSign && role === 'professor' ? '<div class="v4-warning">⚠ 서명 이후 내용이 수정되었습니다.</div>' : ''}${role === 'student' ? studentUi(request, evaluation) : professorUi(evaluation)}`;
      root.appendChild(block);
      if (role === 'student') {
        block.querySelector('#v4Save').onclick = save;
        block.querySelector('#v4Request').onclick = toggleRequest;
        block.querySelector('#v4Apply').onclick = applySuggestion;
        block.querySelector('#v4Evidence').onclick = () => alert('근거 보기 shell: 현재 Section의 활성 FormSchema와 입력 내용을 참조합니다.');
        block.querySelector('#v4Refresh').onclick = event => {
          event.currentTarget.closest('.v4-ai').querySelector('p').textContent = '추가 확인이 필요한 최근 내원 변화 내용을 입력해 주세요.';
        };
      } else block.querySelector('#v4Sign').onclick = sign;
    } finally {
      rendering = false;
      observeChartRoot();
    }
  }
  function studentUi(request, evaluation) {
    return `${evaluation?.signedAt && evaluation.publicComment ? `<div class="v4-comment"><b>교수 공개 코멘트</b><div>${escapeHtml(evaluation.publicComment)}</div></div>` : ''}<div class="v4-actions"><button class="v4-btn v4-primary" id="v4Save">차트 저장</button><button class="v4-btn v4-ghost" id="v4Request">${request ? '서명 요청 철회' : '서명 요청'}</button></div><div class="v4-ai"><b>✨ AI 추천</b><p>현재 입력한 차트 내용을 바탕으로 생성된 비진단적 작성 지원입니다.</p><div class="v4-actions"><button class="v4-btn v4-primary" id="v4Apply">적용</button><button class="v4-btn v4-ghost" id="v4Evidence">근거 보기</button><button class="v4-btn v4-ghost" id="v4Refresh">새 추천</button></div></div>`;
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
