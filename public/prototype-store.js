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
      ['s1-history','문진·병력',['s1-sub-1','s1-sub-2','s1-sub-6']],['s1-medication','복용 약물·주의사항',['s1-sub-7','s1-sub-8']],
      ['s1-habits','구강관리 습관',['s1-sub-3']],['s1-symptoms','불편감·증상·불안도',['s1-sub-4','s1-sub-5']] ]},
    {sectionId:'s2',name:'임상 검사',forms:[
      ['s2-vitals','전신 상태 측정',['s2-sub-1']],['s2-general','구내 검사',['s2-sub-2']],
      ['s2-dentition','치식·치아 상태',['s2-sub-3']],['s2-note','검사 메모',['s2-sub-4']] ]},
    {sectionId:'s3',name:'구강위생 지수 검사',forms:[
      ['s3-plaque','치면세균막·O’Leary Index',['s3-sub-1']],['s3-focus','집중관리 치아',['s3-sub-3']] ]},
    {sectionId:'s4',name:'치위생 진단',forms:[
      ['s4-diagnosis','위험도·건강행태 종합 판단',['s4-sub-1']],['s4-psychology','성격 특성·협조도',['s4-sub-2']] ]},
    {sectionId:'s5',name:'치위생 계획',forms:[
      ['s5-care-plan','치위생 관리 계획표',['s5-sub-1']] ]},
    {sectionId:'s6',name:'수행 기록',forms:[
      ['s6-record','처치·교육·회차별 수행 기록',['s6-sub-1']] ]},
    {sectionId:'s7',name:'치위생 평가',forms:[
      ['s7-visit-evaluation','내원별 평가 항목',['s7-sub-1']] ]},
    {sectionId:'s8',name:'추적 관리',forms:[
      ['s8-goal','목표별 달성 평가',['s8-sub-1']],['s8-self','치위생관리과정 자가평가',['s8-sub-2']] ]}
  ].map(s=>({...s,enabled:true,items:s.forms.map(([formSchemaId,name,runtimeTargets])=>({itemId:formSchemaId,formSchemaId,name,runtimeTargets,enabled:true}))}));
  function seed(){
    const quote={quoteId:'quote-demo',schoolName:'EZ-STEP 데모대학교',applicationYear:2026,grades:['3학년'],studentCount:80,participantCount:160,sections:clone(sections),features:{photo:true,professor:true,inlineAi:true},contact:{name:'김담당',email:'contact@example.ac.kr',phone:'010-0000-0000'},status:'new',memo:'',createdAt:now()};
    const school={schoolId:DEFAULT_SCHOOL_ID,sourceQuoteId:quote.quoteId,name:quote.schoolName,status:'active',contractStatus:'prototype',applicationYear:2026,studentCount:80,participantCount:160,sections:clone(sections),features:clone(quote.features),permissions:{student:true,professor:true},notes:'',updatedAt:now()};
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
    return {version:3,quotes:[quote],schools:[school],students,groups:[{groupId:'group-a',schoolId:school.schoolId,name:'A조',primaryProfessorId:'prof-01',additionalProfessorIds:[]},{groupId:'group-b',schoolId:school.schoolId,name:'B조',primaryProfessorId:'prof-01',additionalProfessorIds:['prof-02']}],professors:[{professorId:'prof-01',schoolId:school.schoolId,name:'김교수'},{professorId:'prof-02',schoolId:school.schoolId,name:'이교수'}],assignments:[],participants,charts:[],signatureRequests:[],evaluations:[],activities:[]};
  }
  function read(){try{const parsed=JSON.parse(localStorage.getItem(KEY));return parsed&&parsed.version===3?parsed:seed()}catch(_){return seed()}}
  function write(state,event){localStorage.setItem(KEY,JSON.stringify(state));const message={...event,at:now()};channel?.postMessage(message);listeners.forEach(fn=>fn(message));return clone(state)}
  function mutate(type,fn){const state=read();const result=fn(state);state.activities.unshift({activityId:id('activity'),type,createdAt:now()});write(state,{type});return clone(result)}
  const Store={
    DEFAULT_SCHOOL_ID,modelNames:['Quote','SchoolConfig','Student','StudentGroup','Professor','ProfessorAssignment','Participant','ChartData','SignatureRequest','ProfessorEvaluation'],
    getState:()=>clone(read()),reset:()=>write(seed(),{type:'reset'}),getDefaultSections:()=>clone(sections),
    subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)},
    getQuotes:()=>clone(read().quotes),getQuote:quoteId=>clone(read().quotes.find(x=>x.quoteId===quoteId)||null),
    saveQuote(input){return mutate('quote.saved',s=>{const item={quoteId:input.quoteId||id('quote'),status:'new',memo:'',createdAt:now(),...clone(input)};const i=s.quotes.findIndex(x=>x.quoteId===item.quoteId);i<0?s.quotes.unshift(item):s.quotes.splice(i,1,item);return item})},
    updateQuote(quoteId,patch){return mutate('quote.updated',s=>{const item=s.quotes.find(x=>x.quoteId===quoteId);if(!item)throw Error('Quote not found');Object.assign(item,clone(patch));return item})},
    getSchools:()=>clone(read().schools),getSchool:schoolId=>clone(read().schools.find(x=>x.schoolId===schoolId)||null),
    getSchoolForParticipant(participantId){const s=read(),participant=s.participants.find(x=>x.participantId===participantId);if(!participant)return null;const schoolId=participant.schoolId||DEFAULT_SCHOOL_ID;return clone(s.schools.find(x=>x.schoolId===schoolId)||null)},
    saveSchool(input){return mutate('school.saved',s=>{const item={schoolId:input.schoolId||id('school'),status:'draft',contractStatus:'draft',updatedAt:now(),...clone(input)};const i=s.schools.findIndex(x=>x.schoolId===item.schoolId);i<0?s.schools.unshift(item):s.schools.splice(i,1,item);return item})},
    createSchoolFromQuote(quoteId){const q=this.getQuote(quoteId);if(!q)throw Error('Quote not found');const school=this.saveSchool({sourceQuoteId:q.quoteId,name:q.schoolName,applicationYear:q.applicationYear,studentCount:q.studentCount,participantCount:q.participantCount,sections:q.sections,features:q.features,permissions:{student:true,professor:Boolean(q.features.professor)}});this.updateQuote(quoteId,{status:'done'});return school},
    getStudents:schoolId=>clone(read().students.filter(x=>!schoolId||x.schoolId===schoolId)),
    saveStudent(input){return mutate('student.saved',s=>{const item={studentId:input.studentId||id('student'),...clone(input)};const i=s.students.findIndex(x=>x.studentId===item.studentId);i<0?s.students.push(item):s.students.splice(i,1,item);return item})},
    getGroups:schoolId=>clone(read().groups.filter(x=>!schoolId||x.schoolId===schoolId)),
    getProfessors:schoolId=>clone(read().professors.filter(x=>!schoolId||x.schoolId===schoolId)),
    getParticipants:studentId=>clone(read().participants.filter(x=>!studentId||x.studentId===studentId)),
    getParticipant:participantId=>clone(read().participants.find(x=>x.participantId===participantId)||null),
    saveParticipant(input){return mutate('participant.saved',s=>{const item={participantId:input.participantId||id('participant'),visitDates:[],aiKeywords:[],hasPhoto:false,...clone(input)};const i=s.participants.findIndex(x=>x.participantId===item.participantId);i<0?s.participants.push(item):s.participants.splice(i,1,item);return item})},
    getChart(participantId){const state=read();return clone(state.charts.find(x=>x.participantId===participantId)||{chartId:id('chart'),participantId,sectionData:{},sectionRevisions:{},updatedAt:null})},
    saveChart(input,changedSectionId){return mutate('chart.saved',s=>{const old=s.charts.find(x=>x.participantId===input.participantId);const item={...(old||{}),...clone(input),chartId:old?.chartId||input.chartId||id('chart'),sectionRevisions:{...(old?.sectionRevisions||{}),...(input.sectionRevisions||{})},updatedAt:now()};if(changedSectionId)item.sectionRevisions[changedSectionId]=(old?.sectionRevisions?.[changedSectionId]||0)+1;const i=s.charts.findIndex(x=>x.participantId===item.participantId);i<0?s.charts.push(item):s.charts.splice(i,1,item);return item})},
    getSignatureRequests:()=>clone(read().signatureRequests),
    requestSignature(participantId,sectionId){return mutate('signature.requested',s=>{let item=s.signatureRequests.find(x=>x.participantId===participantId&&x.sectionId===sectionId);if(!item){item={signatureRequestId:id('request'),participantId,sectionId,requestedAt:now()};s.signatureRequests.push(item)}return item})},
    withdrawSignature(participantId,sectionId){return mutate('signature.withdrawn',s=>{s.signatureRequests=s.signatureRequests.filter(x=>!(x.participantId===participantId&&x.sectionId===sectionId));return true})},
    getEvaluations(participantId){const s=read();return clone(s.evaluations.filter(x=>!participantId||x.participantId===participantId).map(e=>{const chart=s.charts.find(c=>c.participantId===e.participantId);return{...e,modifiedAfterSign:(chart?.sectionRevisions?.[e.sectionId]||0)>e.signedRevision}}))},
    signSection({participantId,sectionId,publicComment='',privateComment=''}){return mutate('section.signed',s=>{const chart=s.charts.find(c=>c.participantId===participantId);const item={evaluationId:id('evaluation'),participantId,sectionId,publicComment,privateComment,signedAt:now(),signedRevision:chart?.sectionRevisions?.[sectionId]||0};const i=s.evaluations.findIndex(x=>x.participantId===participantId&&x.sectionId===sectionId);i<0?s.evaluations.push(item):s.evaluations.splice(i,1,item);s.signatureRequests=s.signatureRequests.filter(x=>!(x.participantId===participantId&&x.sectionId===sectionId));return item})}
  };
  channel?.addEventListener('message',e=>listeners.forEach(fn=>fn(e.data)));
  global.PrototypeStore=Store;
})(window);
