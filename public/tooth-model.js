(function (global) {
  'use strict';

  const entries = [
    ['caries-check','우식 확인·의심 병소','Caries Ck','C.ck','caries','lesion',[],false,true,['C ck']],
    ['caries-1','법랑질 우식(초기 충치)','Enamel caries','C1','caries','caries_stage',['caries-2','caries-3'],false,true,['C']],
    ['caries-2','상아질 우식(중기 충치)','Dentin caries','C2','caries','caries_stage',['caries-1','caries-3'],false,true,[]],
    ['caries-3','치수염 또는 치수까지 진행된 충치','Pulpitis / Pulpal caries','C3','caries','caries_stage',['caries-1','caries-2'],false,true,[]],
    ['secondary-caries','이차 우식','Secondary caries',"2'C",'caries','lesion',[],false,true,[]],
    ['supernumerary','과잉치','Supernumerary tooth','ST','presence','tooth_status',[],true,true,[]],
    ['retained-primary','만기잔존 유치','Retained primary tooth','RPT','presence','tooth_status',[],true,true,[]],
    ['extracted','발거치아','Extracted tooth','Ext','presence','tooth_status',[],true,true,['Ex']],
    ['unerupted','미맹출치아','Unerupted tooth','UE','presence','tooth_status',[],true,true,[]],
    ['partially-erupted','부분 맹출치아','Partially erupted tooth','PE','presence','tooth_status',[],true,true,[]],
    ['implant','임플란트','Implant','IMPL','presence','tooth_status',[],true,true,['Im']],
    ['full-denture','총의치','Full denture','FD','prosthesis','notation',[],false,true,['Fu']],
    ['partial-denture','국소의치','Partial denture','PD','prosthesis','notation',[],false,true,['Pd']],
    ['bridge','가공의치·브리지','Bridge','Br','prosthesis','bridge_action',[],true,true,[]],
    ['appliance','교정장치·구강장치','Appliance','App','special','notation',[],false,true,['Ap']],
    ['root-canal','근관치료','Root canal treatment','RCT','restoration','notation',[],false,true,[]],
    ['resin-inlay','레진 인레이','Resin inlay','R.I','restoration','notation',[],false,true,[]],
    ['gold-inlay','금 인레이','Gold inlay','G.In','restoration','notation',[],false,true,['G.I']],
    ['zirconia-inlay','지르코니아 인레이','Zirconia inlay','Zir.In','restoration','notation',[],false,true,['P.I']],
    ['gold-onlay','골드 온레이','Gold onlay','G.On','restoration','notation',[],false,true,[]],
    ['zirconia-onlay','지르코니아 온레이','Zirconia onlay','Zir.On','restoration','notation',[],false,true,[]],
    ['temporary-filling','임시 충전','Temporary filling','T.F','restoration','notation',[],false,true,[]],
    ['resin-filling','레진 충전','Resin filling','R.F','restoration','notation',[],false,true,[]],
    ['amalgam-filling','아말감 충전','Amalgam filling','A.F','restoration','notation',[],false,true,[]],
    ['sealant','치면열구전색','Sealant','S','restoration','notation',[],false,true,['Sl']],
    ['temporary-crown','임시 치관','Temporary crown','T.Cr','restoration','notation',[],false,true,[]],
    ['zirconia-crown','지르코니아 크라운','Zirconia crown','Zir.Cr','restoration','notation',[],false,true,[]],
    ['pfm-crown','PFM 크라운','PFM crown','PFM','restoration','notation',[],false,true,[]],
    ['gold-crown','금관','Gold crown','G.Cr','restoration','notation',[],false,true,[]],
    ['temporary-setting','임시 접착','Crown Temp. Set','Cr.T/S','restoration','notation',[],false,true,['T/S']],
    ['final-setting','최종 접착','Crown Final Set','Cr.F/S','restoration','notation',[],false,true,['F/S']],
    ['fracture','치아 파절','Fracture','Fx','lesion','notation',[],false,true,[]],
    ['root-rest','잔존치근','Root rest','R.R','presence','tooth_status',[],true,true,['Rr']],
    ['cervical-abrasion','치경부 마모증 병소','Cervical abrasion','CA','lesion','notation',[],false,true,['C.A']],
    ['cervical-resin','치경부 레진 수복','Cervical abrasion resin filling','CA.RF','restoration','notation',[],false,true,[]],
    ['cervical-gi','치경부 GI 수복','Cervical abrasion glass ionomer filling','CA.GI','restoration','notation',[],false,true,[]],
    ['attrition','교모','Attrition','Att','lesion','notation',[],false,true,['At']],
    ['abscess','농양','Abscess','Abs','lesion','notation',[],false,true,['Ab']],
    ['fistula','누공','Fistula','Fi','lesion','notation',[],false,true,[]],
    ['food-impaction','음식물 압입','Food impaction','F.Im','lesion','notation',[],false,true,[]],
    ['gingival-recession-upper','치은퇴축(상악)','Gingival recession','︵','special','notation',[],false,true,['G.Rc']],
    ['gingival-recession-lower','치은퇴축(하악)','Gingival recession','︶','special','notation',[],false,true,[]],
    ['crowding','치아 총생','Crowding','Cd','lesion','notation',[],false,true,[]],
    ['stain','착색','Stain','Stain','lesion','notation',[],false,true,['St']]
  ].map(([id,korean,english,symbol,category,type,conflicts,affectsToothStatus,selectable,legacyAliases]) =>
    ({ id, korean, english, symbol, category, type, conflicts, affectsToothStatus, selectable, legacyAliases }));

  const legacyReadOnly = [
    { symbol: 'P.R', english: 'Percussion response', selectable: false },
    { symbol: 'Is', english: 'Legacy interdental space', selectable: false },
    { symbol: 'P.Cr', english: 'Legacy ambiguous porcelain crown', selectable: false }
  ];
  const byId = Object.fromEntries(entries.map(entry => [entry.id, entry]));
  const bySymbol = Object.fromEntries(entries.map(entry => [entry.symbol, entry]));
  const aliasMap = {};
  entries.forEach(entry => entry.legacyAliases.forEach(alias => { aliasMap[alias] = entry.symbol; }));
  const statusById = {
    extracted: 'extracted', unerupted: 'unerupted',
    'partially-erupted': 'partially_erupted', implant: 'implant',
    'root-rest': 'root_rest', supernumerary: 'supernumerary',
    'retained-primary': 'retained_primary', bridge: 'bridge_abutment'
  };
  const statusIds = new Set(Object.keys(statusById));
  entries.forEach(entry => {
    if (statusIds.has(entry.id)) entry.conflicts = [...statusIds].filter(id => id !== entry.id);
  });
  const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  const lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

  const emptyState = () => ({
    version: 1, toothNotations: {}, toothStatus: {}, bridgeGroups: [],
    interdentalSpaces: {}, legacyNotations: {}
  });
  const clone = value => JSON.parse(JSON.stringify(value));
  const normalizeTooth = tooth => String(Number(tooth));
  const archFor = tooth => upper.includes(Number(tooth)) ? 'upper' : lower.includes(Number(tooth)) ? 'lower' : null;
  const adjacent = (a, b) => {
    const arch = archFor(a);
    if (!arch || arch !== archFor(b)) return false;
    const list = arch === 'upper' ? upper : lower;
    return Math.abs(list.indexOf(Number(a)) - list.indexOf(Number(b))) === 1;
  };
  const relationKey = (a, b) => [Number(a), Number(b)].sort((x, y) => x - y).join('-');
  const migrateSymbol = (symbol, tooth) => {
    if (symbol === 'G.Rc') return archFor(tooth) === 'lower' ? '︶' : '︵';
    if (legacyReadOnly.some(item => item.symbol === symbol)) return null;
    return aliasMap[symbol] || symbol;
  };
  function migrate(input) {
    const state = { ...emptyState(), ...clone(input || {}) };
    state.toothNotations ||= {};
    state.toothStatus ||= {};
    state.bridgeGroups ||= [];
    state.interdentalSpaces ||= {};
    state.legacyNotations ||= {};
    Object.entries(state.toothNotations).forEach(([tooth, symbols]) => {
      const next = [];
      (Array.isArray(symbols) ? symbols : [symbols]).forEach(symbol => {
        const migrated = migrateSymbol(symbol, tooth);
        if (!migrated) {
          (state.legacyNotations[tooth] ||= []).push(symbol);
        } else if (!next.includes(migrated)) next.push(migrated);
      });
      state.toothNotations[tooth] = next;
      next.forEach(symbol => {
        const entry = bySymbol[symbol];
        if (entry && statusIds.has(entry.id) && entry.id !== 'bridge') {
          state.toothStatus[tooth] = statusById[entry.id];
        }
      });
    });
    state.version = 1;
    return state;
  }
  function applyNotation(input, tooth, notationId) {
    const state = migrate(input);
    const key = normalizeTooth(tooth);
    let entry = byId[notationId];
    if (!entry || !entry.selectable || entry.type === 'bridge_action') return state;
    if (entry.id === 'gingival-recession-upper' || entry.id === 'gingival-recession-lower') {
      entry = byId[archFor(tooth) === 'lower' ? 'gingival-recession-lower' : 'gingival-recession-upper'];
    }
    let symbols = [...(state.toothNotations[key] || [])];
    if (entry.type === 'caries_stage') {
      symbols = symbols.filter(symbol => !['C1','C2','C3','C.ck'].includes(symbol));
    }
    if (entry.symbol === 'C.ck' && symbols.some(symbol => ['C1','C2','C3'].includes(symbol))) return state;
    if (statusIds.has(entry.id)) {
      const removedGroups = state.bridgeGroups.filter(group => group.abutments.concat(group.pontics).includes(Number(tooth)));
      removedGroups.forEach(group => group.abutments.concat(group.pontics).forEach(member => {
        state.toothNotations[member] = (state.toothNotations[member] || []).filter(symbol => symbol !== 'Br');
        if (state.toothStatus[member] === 'bridge_abutment' || state.toothStatus[member] === 'pontic') {
          delete state.toothStatus[member];
        }
      }));
      state.bridgeGroups = state.bridgeGroups.filter(group => !removedGroups.includes(group));
      symbols = symbols.filter(symbol => {
        const existing = bySymbol[symbol];
        return !existing || !statusIds.has(existing.id);
      });
      state.toothStatus[key] = statusById[entry.id];
    }
    if (!symbols.includes(entry.symbol)) symbols.push(entry.symbol);
    state.toothNotations[key] = symbols;
    return state;
  }
  function removeNotation(input, tooth, notationId) {
    const state = migrate(input), key = normalizeTooth(tooth), entry = byId[notationId];
    if (!entry) return state;
    if (entry.type === 'bridge_action') {
      const group = state.bridgeGroups.find(item => item.abutments.concat(item.pontics).includes(Number(tooth)));
      if (!group) return state;
      group.abutments.concat(group.pontics).forEach(member => {
        state.toothNotations[member] = (state.toothNotations[member] || []).filter(symbol => symbol !== 'Br');
        if (['bridge_abutment','pontic'].includes(state.toothStatus[member])) delete state.toothStatus[member];
      });
      state.bridgeGroups = state.bridgeGroups.filter(item => item.id !== group.id);
      return state;
    }
    state.toothNotations[key] = (state.toothNotations[key] || []).filter(symbol => symbol !== entry.symbol);
    if (statusIds.has(entry.id) && state.toothStatus[key] === statusById[entry.id]) delete state.toothStatus[key];
    return state;
  }
  function clearTooth(input, tooth) {
    let state = migrate(input);
    const group = state.bridgeGroups.find(item => item.abutments.concat(item.pontics).includes(Number(tooth)));
    if (group) state = removeNotation(state, tooth, 'bridge');
    const key = normalizeTooth(tooth);
    state.toothNotations[key] = [];
    delete state.toothStatus[key];
    Object.keys(state.interdentalSpaces).forEach(relation => {
      if (relation.split('-').map(Number).includes(Number(tooth))) delete state.interdentalSpaces[relation];
    });
    return state;
  }
  function createBridge(input, selectedTeeth) {
    const state = migrate(input);
    const teeth = [...new Set(selectedTeeth.map(Number))];
    if (teeth.length < 3) return { ok: false, error: '브리지는 같은 악궁의 연속된 치아 3개 이상을 선택해야 합니다.', state };
    const arch = archFor(teeth[0]);
    const list = arch === 'upper' ? upper : lower;
    if (!arch || teeth.some(tooth => archFor(tooth) !== arch)) return { ok: false, error: '같은 악궁의 치아를 선택해야 합니다.', state };
    const ordered = teeth.sort((a, b) => list.indexOf(a) - list.indexOf(b));
    if (ordered.some((tooth, index) => index && list.indexOf(tooth) !== list.indexOf(ordered[index - 1]) + 1))
      return { ok: false, error: '연속된 치아 구간만 브리지로 지정할 수 있습니다.', state };
    if (state.bridgeGroups.some(group => group.abutments.concat(group.pontics).some(tooth => teeth.includes(tooth))))
      return { ok: false, error: '이미 다른 브리지에 포함된 치아가 있습니다.', state };
    const abutments = [ordered[0], ordered[ordered.length - 1]];
    const pontics = ordered.slice(1, -1);
    const group = { id: `bridge-${Date.now()}`, abutments, pontics };
    state.bridgeGroups.push(group);
    abutments.forEach(tooth => {
      state.toothStatus[tooth] = 'bridge_abutment';
      state.toothNotations[tooth] = [...new Set([
        ...(state.toothNotations[tooth] || []).filter(symbol => !statusIds.has(bySymbol[symbol]?.id)),
        'Br'
      ])];
    });
    pontics.forEach(tooth => {
      state.toothStatus[tooth] = 'pontic';
      state.toothNotations[tooth] = (state.toothNotations[tooth] || []).filter(symbol => !bySymbol[symbol]?.affectsToothStatus);
    });
    return { ok: true, state, group };
  }
  function toggleInterdentalSpace(input, selectedTeeth) {
    const state = migrate(input);
    const teeth = [...new Set(selectedTeeth.map(Number))];
    if (teeth.length !== 2) return { ok: false, error: '인접한 치아 2개를 선택해 주세요.', state };
    const [a, b] = teeth;
    if (!adjacent(a, b)) return { ok: false, error: '같은 악궁의 서로 인접한 치아만 선택할 수 있습니다.', state };
    if ([a, b].some(tooth => ['extracted','unerupted','pontic'].includes(state.toothStatus[tooth])))
      return { ok: false, error: 'Ext, UE 또는 pontic이 포함된 관계에는 치간 이개를 지정할 수 없습니다.', state };
    const key = relationKey(a, b);
    if (state.interdentalSpaces[key]) delete state.interdentalSpaces[key];
    else state.interdentalSpaces[key] = true;
    return { ok: true, state, key, enabled: Boolean(state.interdentalSpaces[key]) };
  }
  const missingToothCount = state => Object.values(migrate(state).toothStatus)
    .filter(status => status === 'extracted' || status === 'unerupted').length;
  const isPiEligible = (state, tooth) =>
    !['extracted','unerupted','root_rest'].includes(migrate(state).toothStatus[normalizeTooth(tooth)]);
  const isPeriodontalEligible = (state, tooth) =>
    !['extracted','unerupted','pontic'].includes(migrate(state).toothStatus[normalizeTooth(tooth)]);
  const isCalculusEligible = (state, tooth) =>
    !['extracted','unerupted','pontic'].includes(migrate(state).toothStatus[normalizeTooth(tooth)]);
  const isPdBopMobEligible = (state, tooth) =>
    !['extracted','unerupted','pontic'].includes(migrate(state).toothStatus[normalizeTooth(tooth)]);
  const isSwEligible = (state, tooth) =>
    !['extracted','unerupted'].includes(migrate(state).toothStatus[normalizeTooth(tooth)]);
  const displaySymbols = (state, tooth) => {
    const model = migrate(state);
    const key = normalizeTooth(tooth);
    const bridge = model.bridgeGroups.find(group => group.pontics.includes(Number(tooth)));
    return bridge ? ['='] : [...(model.toothNotations[key] || []), ...(model.legacyNotations[key] || [])];
  };

  global.HyStepToothModel = Object.freeze({
    registry: entries, legacyReadOnly, byId, bySymbol, upper, lower,
    emptyState, migrate, migrateSymbol, applyNotation, removeNotation, clearTooth, createBridge,
    toggleInterdentalSpace, missingToothCount, isPiEligible,
    isPeriodontalEligible, isCalculusEligible, isPdBopMobEligible, isSwEligible,
    displaySymbols, archFor, adjacent, relationKey
  });
})(window);
