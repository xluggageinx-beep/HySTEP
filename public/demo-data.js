(function(global){
'use strict';
const sections=[
{id:'s1',name:'초진 및 대상자 사정'},{id:'s2',name:'임상 검사'},
{id:'s3',name:'구강위생 지수 검사'},{id:'s4',name:'치위생 진단'},
{id:'s5',name:'치위생 계획'},{id:'s6',name:'수행 기록'},
{id:'s7',name:'치위생 평가'},{id:'s8',name:'추적 관리'}];
const students=[
{id:'stu-01',name:'김하늘',studentNo:'20261001',grade:'3학년',group:'A조'},
{id:'stu-02',name:'박서준',studentNo:'20261002',grade:'3학년',group:'A조'},
{id:'stu-03',name:'이수빈',studentNo:'20261003',grade:'3학년',group:'B조'}];
const participants=[
{id:'pt-01',studentId:'stu-01',name:'정민수',visitDates:['2026-07-15','2026-07-29'],hasPhoto:true,aiKeywords:['치면세균막','칫솔질','재내원'],sectionDrafts:{s1:'전신 병력과 복용 약물을 확인했습니다.',s2:'구내·구외 검사 내용을 기록했습니다.',s3:"O'Leary Index 42%로 측정했습니다.",s4:'자가관리 실천도 개선이 필요합니다.',s5:'회전법 교육과 치간칫솔 사용을 계획했습니다.',s6:'칫솔질 교육을 수행했습니다.'},signatureRequests:{s4:'2026-07-28T01:30:00.000Z',s5:'2026-07-28T03:10:00.000Z'},professorEvaluations:{}},
{id:'pt-02',studentId:'stu-01',name:'윤지아',visitDates:['2026-07-22','2026-08-05'],hasPhoto:false,aiKeywords:['치은출혈','치실','동기강화'],sectionDrafts:{s1:'주호소와 생활 습관을 확인했습니다.',s2:'BOP 관찰 내용을 입력했습니다.',s3:'초기 지수 검사를 완료했습니다.'},signatureRequests:{s2:'2026-07-29T00:20:00.000Z'},professorEvaluations:{}},
{id:'pt-03',studentId:'stu-02',name:'최도윤',visitDates:['2026-07-29'],hasPhoto:true,aiKeywords:['구취','설태','수분섭취'],sectionDrafts:{s1:'구취 관련 습관을 확인했습니다.',s2:'구강 검사를 완료했습니다.'},signatureRequests:{},professorEvaluations:{s1:{publicComment:'문진 내용이 잘 정리되었습니다.',privateComment:'다음 회차에는 생활습관 질문을 더 구체화할 것.',signedAt:'2026-07-29T02:15:00.000Z'}}},
{id:'pt-04',studentId:'stu-03',name:'한예린',visitDates:[],hasPhoto:false,aiKeywords:['초진','병력확인','예약필요'],sectionDrafts:{},signatureRequests:{},professorEvaluations:{}}];
global.HYSTEP_DEMO_DATA={demoToday:'2026-07-29',school:{id:'school-demo',name:'EZ-STEP 데모대학교',applicationYear:2026},course:{name:'임상치위생학 실습',term:'2026학년도 2학기'},sections,students,participants};
})(window);
