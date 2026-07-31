(function (global) {
  'use strict';
  const KEY = 'hystep.prototype.repository.v3';
  const DEFAULT_SCHOOL_ID = 'school-demo';
  const CHANNEL = 'hystep.prototype.repository.events';
  const listeners = new Set();
  const channel = 'BroadcastChannel' in global ? new BroadcastChannel(CHANNEL) : null;
  const clone = value => JSON.parse(JSON.stringify(value));
  const id = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = () => new Date().toISOString();
  const sections = [
    {sectionId:'s1',name:'초진 및 대상자 사정',forms:[
      ['s1-prescan','사전문진 링크',['s1-sub-1']],['s1-visit','치과 방문 경험',['s1-sub-2']],['s1-habits','건강행태 및 칫솔질',['s1-sub-3']],['s1-symptoms','증상 및 불편감',['s1-sub-4']],['s1-anxiety','구강불안도 (DAS)',['s1-sub-5']],['s1-history','전신질환 병력',['s1-sub-6']],['s1-caution','전신질환 치과 주의사항',['s1-sub-7']],['s1-medication','복용 약물 및 부작용',['s1-sub-8']] ]},
    {sectionId:'s2',name:'임상 검사',forms:[
      ['s2-vitals','혈당·혈압 측정',['s2-sub-1']],['s2-extraoral','구외 검사',['s2-sub-2']],['s2-intraoral','구내 검사',['s2-sub-2b']],['s2-dentition','치식 차팅',['s2-sub-3']],['s2-note','교수 요청/질문',['s2-sub-4']] ]},
    {sectionId:'s3',name:'구강위생 지수',forms:[
      ['s3-pi','PI 측정',['s3-sub-1']],['s3-trend','회차별 추이',['s3-sub-2']],['s3-focus','집중 관리 치아',['s3-sub-3']],['s3-phase','임상차트 판독',['s3-sub-4']],['s3-halitosis','구취 측정',['s3-sub-5']],['s3-co','CO 측정',['s3-sub-6']] ]},
    {sectionId:'s4',name:'치위생 진단',forms:[
      ['s4-diagnosis','진단 항목',['s4-sub-1']],['s4-psychology','성격 특성 분석',['s4-sub-2']] ]},
    {sectionId:'s5',name:'치위생 계획',forms:[['s5-care-plan','치위생 관리 계획안',['s5-sub-1']]]},
    {sectionId:'s6',name:'수행 기록',forms:[['s6-record','처치·교육·회차별 수행 기록',['s6-sub-1']]]},
    {sectionId:'s7',name:'치위생 평가',forms:[['s7-visit-evaluation','내원별 평가 항목',['s7-sub-1']]]},
    {sectionId:'s8',name:'추적 관리',forms:[
      ['s8-goal','목표별 달성 평가',['s8-sub-1']],['s8-self','치위생관리과정 자가평가',['s8-sub-2']] ]}
  ].map(s=>({...s,enabled:true,items:s.forms.map(([formSchemaId,name,runtimeTargets])=>({itemId:formSchemaId,formSchemaId,name,runtimeTargets,enabled:true}))}));
  function seed(){
    const quote={quoteId:'quote-demo',schoolName:'EZ-STEP 데모대학교',applicationYear:2026,grades:['3학년'],studentCount:80,participantCount:160,sections:clone(sections),features:{photo:true,professor:true,inlineAi:true},contact:{name:'김담당',email:'contact@example.ac.kr',phone:'010-0000-0000'},status:'new',memo:'',createdAt:now()};
    const school={schoolId:DEFAULT_SCHOOL_ID,sourceQuoteId:quote.quoteId,name:quote.schoolName,status:'active',contractStatus:'prototype',applicationYear:2026,grades:clone(quote.grades),studentCount:80,participantCount:160,sections:clone(sections),features:clone(quote.features),permissions:{student:true,professor:true},notes:'',updatedAt:now()};
    const students=[
      {studentId:'stu-01',schoolId:school.schoolId,name:'김하늘',studentNo:'20261001',grade:'3학년',groupId:'group-a'},
      {studentId:'stu-02',schoolId:school.schoolId,name:'박서준',studentNo:'20261002',grade:'3학년',groupId:'group-a'},
      {studentId:'stu-03',schoolId:school.schoolId,name:'이수빈',studentNo:'20261003',grade:'3학년',groupId:'group-b'}
    ];
    const participants=[
      {participantId:'pt-01',schoolId:school.schoolId,studentId:'stu-01',name:'정민수',visitDates:['2026-07-15','2026-07-29'],aiKeywords:['치면세균막','칫솔질','재내원'],hasPhoto:true},
      {participantId:'pt-02',schoolId:school.schoolId,studentId:'stu-01',name:'윤지아',visitDates:['2026-07-22','2026-08-05'],aiKeywords:['치은출혈','치실','동기강화'],hasPhoto:false},
      {participantId:'pt-03',schoolId:school.schoolId,studentId:'stu-02',name:'최도윤',visitDates:['2026-07-29'],aiKeywords:['구취','설태','수분섭취'],hasPhoto:true}
    ];
    return {version:3,selectedSchoolId:DEFAULT_SCHOOL_ID,quotes:[quote],schools:[school],students,groups:[{groupId:'group-a',schoolId:school.schoolId,name:'A조',primaryProfessorId:'prof-01',additionalProfessorIds:[]},{groupId:'group-b',schoolId:school.schoolId,name:'B조',primaryProfessorId:'prof-01',additionalProfessorIds:['prof-02']}],professors:[{professorId:'prof-01',schoolId:school.schoolId,name:'김교수'},{professorId:'prof-02',schoolId:school.schoolId,name:'이교수'}],assignments:[],participants,charts:[],signatureRequests:[],evaluations:[],activities:[]};
  }
  function upgradeSections(existing=[]){return sections.map(canonical=>{const old=existing.find(item=>item.sectionId===canonical.sectionId);return{...clone(canonical),enabled:old?.enabled!==false,items:canonical.items.map(item=>{const direct=old?.items?.find(candidate=>candidate.itemId===item.itemId);const compatible=old?.items?.find(candidate=>(candidate.runtimeTargets||[]).some(target=>(item.runtimeTargets||[]).includes(target)));return{...item,enabled:(direct||compatible)?.enabled!==false}})}})}
  function read(){try{const parsed=JSON.parse(localStorage.getItem(KEY));if(!parsed||parsed.version!==3)return seed();parsed.quotes.forEach(q=>{q.sections=upgradeSections(q.sections)});parsed.schools.forEach(s=>{s.sections=upgradeSections(s.sections);if(!Array.isArray(s.grades)){const q=parsed.quotes.find(q=>q.quoteId===s.sourceQuoteId);s.grades=clone(q?.grades||[])}});return parsed}catch(_){return seed()}}
  function write(state,event){localStorage.setItem(KEY,JSON.stringify(state));const message={...event,at:now()};channel?.postMessage(message);listeners.forEach(fn=>fn(message));return clone(state)}
  function mutate(type,fn){const state=read();const result=fn(state);state.activities.unshift({activityId:id('activity'),type,createdAt:now()});write(state,{type});return clone(result)}
  function ensureDemoRosterState(state,schoolId){
    const school=state.schools.find(x=>x.schoolId===schoolId);if(!school)throw Error('School not found');
    const existingStudents=state.students.filter(x=>x.schoolId===schoolId);if(existingStudents.length)return{schoolId,students:existingStudents.length,professors:state.professors.filter(x=>x.schoolId===schoolId).length,participants:state.participants.filter(x=>x.schoolId===schoolId).length};
    const key=schoolId.replace(/[^a-zA-Z0-9_-]/g,'-'),grade=(school.grades||[])[0]||'3학년';
    const professorId=`demo-prof-${key}`,groupA=`demo-group-a-${key}`,groupB=`demo-group-b-${key}`;
    const students=[
      {studentId:`demo-stu-1-${key}`,schoolId,name:'김하늘',studentNo:`${school.applicationYear||2026}1001`,grade,groupId:groupA,demo:true},
      {studentId:`demo-stu-2-${key}`,schoolId,name:'박서준',studentNo:`${school.applicationYear||2026}1002`,grade,groupId:groupA,demo:true},
      {studentId:`demo-stu-3-${key}`,schoolId,name:'이수빈',studentNo:`${school.applicationYear||2026}1003`,grade,groupId:groupB,demo:true}
    ];
    const participants=[
      {participantId:`demo-pt-1-${key}`,schoolId,studentId:students[0].studentId,name:'정민수',visitDates:['2026-07-15','2026-07-29'],aiKeywords:['치면세균막','칫솔질','재내원'],hasPhoto:true,demo:true},
      {participantId:`demo-pt-2-${key}`,schoolId,studentId:students[0].studentId,name:'윤지아',visitDates:['2026-07-22','2026-08-05'],aiKeywords:['치은출혈','치실','동기강화'],hasPhoto:false,demo:true},
      {participantId:`demo-pt-3-${key}`,schoolId,studentId:students[1].studentId,name:'최도윤',visitDates:['2026-07-29'],aiKeywords:['구취','설태','수분섭취'],hasPhoto:true,demo:true}
    ];
    if(!state.professors.some(x=>x.professorId===professorId))state.professors.push({professorId,schoolId,name:'김교수',demo:true});
    [{groupId:groupA,schoolId,name:'A조',primaryProfessorId:professorId,additionalProfessorIds:[],demo:true},{groupId:groupB,schoolId,name:'B조',primaryProfessorId:professorId,additionalProfessorIds:[],demo:true}].forEach(item=>{if(!state.groups.some(x=>x.groupId===item.groupId))state.groups.push(item)});
    students.forEach(item=>{if(!state.students.some(x=>x.studentId===item.studentId))state.students.push(item)});
    participants.forEach(item=>{if(!state.participants.some(x=>x.participantId===item.participantId))state.participants.push(item)});
    return{schoolId,students:students.length,professors:1,participants:participants.length};
  }
  function canonicalToothData(chart){
    const raw=chart?.sectionData?.s2?.['tooth-model-state'];
    let model={version:1,toothNotations:clone(chart?.toothNotations||{}),toothStatus:clone(chart?.toothStatus||{}),bridgeGroups:clone(chart?.bridgeGroups||[]),interdentalSpaces:clone(chart?.interdentalSpaces||{}),legacyNotations:clone(chart?.legacyNotations||{})};
    if(raw){try{model=JSON.parse(raw)}catch(_){}}
    if(global.HyStepToothModel)model=global.HyStepToothModel.migrate(model);
    return{
      toothNotations:clone(model.toothNotations||{}),
      toothStatus:clone(model.toothStatus||{}),
      bridgeGroups:clone(model.bridgeGroups||[]),
      interdentalSpaces:clone(model.interdentalSpaces||{}),
      legacyNotations:clone(model.legacyNotations||{})
    };
  }
  const Store={
    DEFAULT_SCHOOL_ID,modelNames:['Quote','SchoolConfig','Student','StudentGroup','Professor','ProfessorAssignment','Participant','ChartData','SignatureRequest','ProfessorEvaluation'],
    getState:()=>clone(read()),reset:()=>write(seed(),{type:'reset'}),getDefaultSections:()=>clone(sections),
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
    getQuotes:()=>clone(read().quotes),getQuote:quoteId=>clone(read().quotes.find(x=>x.quoteId===quoteId)||null),
    saveQuote(input){return mutate('quote.saved',s=>{const item={quoteId:input.quoteId||id('quote'),status:'new',memo:'',createdAt:now(),...clone(input)};const i=s.quotes.findIndex(x=>x.quoteId===item.quoteId);i<0?s.quotes.unshift(item):s.quotes.splice(i,1,item);return item})},
    updateQuote(quoteId,patch){return mutate('quote.updated',s=>{const item=s.quotes.find(x=>x.quoteId===quoteId);if(!item)throw Error('Quote not found');Object.assign(item,clone(patch));return item})},
    getSchools:()=>clone(read().schools),getSchool:schoolId=>clone(read().schools.find(x=>x.schoolId===schoolId)||null),
    getCurrentSchoolId(){const s=read();return s.schools.some(x=>x.schoolId===s.selectedSchoolId)?s.selectedSchoolId:DEFAULT_SCHOOL_ID},
    setCurrentSchool(schoolId){return mutate('school.selected',s=>{if(!s.schools.some(x=>x.schoolId===schoolId))throw Error('School not found');s.selectedSchoolId=schoolId;return schoolId})},
    getSchoolForParticipant(participantId){const s=read(),participant=s.participants.find(x=>x.participantId===participantId);if(!participant)return null;const schoolId=participant.schoolId||DEFAULT_SCHOOL_ID;return clone(s.schools.find(x=>x.schoolId===schoolId)||null)},
    saveSchool(input){return mutate('school.saved',s=>{const item={schoolId:input.schoolId||id('school'),status:'draft',contractStatus:'draft',updatedAt:now(),...clone(input)};const i=s.schools.findIndex(x=>x.schoolId===item.schoolId);i<0?s.schools.unshift(item):s.schools.splice(i,1,item);return item})},
    createSchoolFromQuote(quoteId){const q=this.getQuote(quoteId);if(!q)throw Error('Quote not found');const existing=this.getSchools().find(x=>x.sourceQuoteId===quoteId);if(existing){const current=this.saveSchool({...existing,previewUrl:existing.previewUrl||`/hystep-preview?schoolId=${encodeURIComponent(existing.schoolId)}&mode=preview`,actualUrl:existing.actualUrl||`/hystep-preview?schoolId=${encodeURIComponent(existing.schoolId)}&mode=actual`});this.ensureDemoRoster(current.schoolId);this.updateQuote(quoteId,{status:'done'});return this.getSchool(current.schoolId)}let school=this.saveSchool({sourceQuoteId:q.quoteId,name:q.schoolName,applicationYear:q.applicationYear,grades:clone(q.grades||[]),studentCount:q.studentCount,participantCount:q.participantCount,sections:clone(q.sections||[]),features:clone(q.features||{}),permissions:{student:true,professor:Boolean(q.features?.professor)}});school=this.saveSchool({...school,previewUrl:`/hystep-preview?schoolId=${encodeURIComponent(school.schoolId)}&mode=preview`,actualUrl:`/hystep-preview?schoolId=${encodeURIComponent(school.schoolId)}&mode=actual`});this.ensureDemoRoster(school.schoolId);this.updateQuote(quoteId,{status:'done'});return school},
    ensureDemoRoster(schoolId){return mutate('school.demo-roster.ensured',s=>ensureDemoRosterState(s,schoolId))},
    getStudents:schoolId=>clone(read().students.filter(x=>!schoolId||x.schoolId===schoolId)),
    saveStudent(input){return mutate('student.saved',s=>{const item={studentId:input.studentId||id('student'),...clone(input)};const i=s.students.findIndex(x=>x.studentId===item.studentId);i<0?s.students.push(item):s.students.splice(i,1,item);return item})},
    getGroups:schoolId=>clone(read().groups.filter(x=>!schoolId||x.schoolId===schoolId)),
    getProfessors:schoolId=>clone(read().professors.filter(x=>!schoolId||x.schoolId===schoolId)),
    getParticipants:studentId=>clone(read().participants.filter(x=>!studentId||x.studentId===studentId)),
    getParticipantsForSchool:schoolId=>clone(read().participants.filter(x=>x.schoolId===schoolId)),
    getParticipant:participantId=>clone(read().participants.find(x=>x.participantId===participantId)||null),
    saveParticipant(input){return mutate('participant.saved',s=>{const item={participantId:input.participantId||id('participant'),visitDates:[],aiKeywords:[],hasPhoto:false,...clone(input)};const i=s.participants.findIndex(x=>x.participantId===item.participantId);i<0?s.participants.push(item):s.participants.splice(i,1,item);return item})},
    getChart(participantId){const state=read(),existing=state.charts.find(x=>x.participantId===participantId);const chart=existing||{chartId:id('chart'),participantId,sectionData:{},sectionRevisions:{},updatedAt:null};return clone({...chart,...canonicalToothData(chart)})},
    saveChart(input,changedSectionId){return mutate('chart.saved',s=>{const old=s.charts.find(x=>x.participantId===input.participantId);let item={...(old||{}),...clone(input),chartId:old?.chartId||input.chartId||id('chart'),sectionRevisions:{...(old?.sectionRevisions||{}),...(input.sectionRevisions||{})},updatedAt:now()};item={...item,...canonicalToothData(item)};if(changedSectionId)item.sectionRevisions[changedSectionId]=(old?.sectionRevisions?.[changedSectionId]||0)+1;const i=s.charts.findIndex(x=>x.participantId===item.participantId);i<0?s.charts.push(item):s.charts.splice(i,1,item);return item})},
    getSignatureRequests:()=>clone(read().signatureRequests),
    requestSignature(participantId,sectionId){return mutate('signature.requested',s=>{let item=s.signatureRequests.find(x=>x.participantId===participantId&&x.sectionId===sectionId);if(!item){item={signatureRequestId:id('request'),participantId,sectionId,requestedAt:now()};s.signatureRequests.push(item)}return item})},
    withdrawSignature(participantId,sectionId){return mutate('signature.withdrawn',s=>{s.signatureRequests=s.signatureRequests.filter(x=>!(x.participantId===participantId&&x.sectionId===sectionId));return true})},
    getEvaluations(participantId){const s=read();return clone(s.evaluations.filter(x=>!participantId||x.participantId===participantId).map(e=>{const chart=s.charts.find(c=>c.participantId===e.participantId);return{...e,modifiedAfterSign:(chart?.sectionRevisions?.[e.sectionId]||0)>e.signedRevision}}))},
    signSection({participantId,sectionId,publicComment='',privateComment=''}){return mutate('section.signed',s=>{const chart=s.charts.find(c=>c.participantId===participantId);const item={evaluationId:id('evaluation'),participantId,sectionId,publicComment,privateComment,signedAt:now(),signedRevision:chart?.sectionRevisions?.[sectionId]||0};const i=s.evaluations.findIndex(x=>x.participantId===participantId&&x.sectionId===sectionId);i<0?s.evaluations.push(item):s.evaluations.splice(i,1,item);s.signatureRequests=s.signatureRequests.filter(x=>!(x.participantId===participantId&&x.sectionId===sectionId));return item})}
  };
  channel?.addEventListener('message',e=>listeners.forEach(fn=>fn(e.data)));
  global.PrototypeStore=Store;
})(window);
