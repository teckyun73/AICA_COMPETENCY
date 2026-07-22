
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'reviewer' | 'candidate';
  affiliate: string;
  dept: string;
  specialty?: 'business' | 'tech' | 'security';
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  affiliate: string;
  dept: string;
  level: 3 | 4;
  status: '대기' | '평가중' | '완료' | '재심사';
  evalDate?: string;
}

export interface Submission {
  id: string;
  candidateId: string;
  title: string;
  category: '웹/앱' | 'RAG/챗봇' | '데이터분석' | '업무자동화';
  painPoint: string;
  solution: string;
  reportSummary: string;
  codeStructure: string;
  demoUrl: string;
  reportUrl: string;
  codeUrl: string;
  submittedAt: string;
}

export interface Committee {
  id: string;
  candidateId: string;
  reviewer1Id: string; // business
  reviewer2Id: string; // tech
  reviewer3Id: string; // security
  status: '대기' | '평가중' | '완료';
}

export interface SecurityCheck {
  id: string;
  submissionId: string;
  reviewerId: string;
  check1: boolean; // 개인정보 마스킹 여부
  check2: boolean; // 기업 비밀/계약정보 익명화
  check3: boolean; // 기술 자산 및 API Key 제거
  check4: boolean; // 사내 점검표 및 가이드 준수
  check5: boolean; // 부서 간 재사용성 및 망 분리 적절성
  notes: string;
}

export interface Score {
  id: string;
  committeeId: string;
  reviewerId: string;
  // Level 3: score1(Complexity), score2(Implementation), score3(Assetization)
  // Level 4: score1(Engineering), score2(Security), score3(Impact)
  score1: number; // 0-100 (or 1-5 maps to rubric)
  score2: number;
  score3: number;
  comments1: string;
  comments2: string;
  comments3: string;
  totalScore: number;
  isDisqualified: boolean;
  disqualificationReason?: string;
  submittedAt: string;
}

export interface EvaluationResult {
  candidateId: string;
  committeeId: string;
  averageScore: number;
  passStatus: '합격' | '보완후합격' | '불합격' | '재심사';
  finalDecisionComment: string;
  reviewerScores: {
    reviewerId: string;
    reviewerName: string;
    specialty: string;
    score: number;
    score1: number;
    score2: number;
    score3: number;
  }[];
}

// 6 Affiliates (A to F)
export const AFFILIATES = [
  { code: 'A', name: '에이텍', sector: '금융자동화기기/제조/연구/서비스/영업' },
  { code: 'B', name: '에이텍모빌리티', sector: '교통요금결제단말기/제조/연구/서비스/영업' },
  { code: 'C', name: '에이텍씨앤', sector: 'B2B 유통/영업/서비스' },
  { code: 'D', name: '에이텍시스템', sector: '유지보수/영업/서비스' },
  { code: 'E', name: '에이텍오토', sector: '물류자동화기기/제조/연구/서비스/영업' },
  { code: 'F', name: '에이텍컴퓨터', sector: '컴퓨터/OA 기기/제조/연구' }
];

// Decryption utility for encrypted credential fields
export const decrypt = (cipherText: string): string => {
  const shifted = cipherText.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
  return decodeURIComponent(escape(atob(shifted)));
};

const rawEncryptedUsers: User[] = [
  // Admins (간사/운영)
  {
    id: "admin1",
    name: ":M5397.]:Mt3",
    email: "]Kgv]ZYD\\[Uo\\5QxOpw|",
    role: "admin",
    affiliate: "A",
    dept: "경영혁신실"
  },
  {
    id: "admin2",
    name: ":Mtz:OF<:]5X",
    email: "\\5k6gXEkgJYm\\57xd6L@",
    role: "admin",
    affiliate: "A",
    dept: "경영혁신실"
  },
  
  // Reviewers (심사위원 풀)
  // 1. Business / 현업 (위원장급)
  {
    id: "rev1",
    name: ":M53:M9v:M|n",
    email: "dqov]ZXzQHEkgJYmOpw|",
    role: "reviewer",
    affiliate: "A",
    dept: "마케팅실",
    specialty: "business"
  },
  {
    id: "rev2",
    name: ":Lxj:NNI:OFv",
    email: "dpQ}dJoxTJI3]ZQwe5MseJo3hV8me53@",
    role: "reviewer",
    affiliate: "B",
    dept: "고객지원사업부",
    specialty: "business"
  },
  {
    id: "rev3",
    name: ":M53:LRE:MlE",
    email: "f6ov]ZXzPXEkgJYmf6o}gJYwOpw|",
    role: "reviewer",
    affiliate: "D",
    dept: "경영지원실",
    specialty: "business"
  },
  {
    id: "rev10",
    name: "9upD9:R3989P",
    email: "\\qMudZ4D\\[Uo\\5Qye[E4gJY|Opw|",
    role: "reviewer",
    affiliate: "F",
    dept: "경영지원실",
    specialty: "business"
  },
  
  // 2. AI Technology / 기술
  {
    id: "rev4",
    name: ":Mln:M57:]p\\",
    email: "dZ8rg5IxQWYDepI5][Lx\\5<w",
    role: "reviewer",
    affiliate: "A",
    dept: "연구소",
    specialty: "tech"
  },
  {
    id: "rev5",
    name: "9:F{:M9v:Lt8",
    email: "dqQz\\ZYuTJI3]ZQwe5MseJo3hV8me53@",
    role: "reviewer",
    affiliate: "B",
    dept: "연구소",
    specialty: "tech"
  },
  {
    id: "rev6",
    name: "9upD:MlE",
    email: "hZ<4epgD\\[Uo\\6Q8f6UoeV8ufj@@",
    role: "reviewer",
    affiliate: "D",
    dept: "서비스사업부",
    specialty: "tech"
  },
  {
    id: "rev11",
    name: ":OZf9:VM:M9v",
    email: "\\psmdJ<sTJI3]ZQme54zg[Uofl8ufj@@",
    role: "reviewer",
    affiliate: "F",
    dept: "연구실",
    specialty: "tech"
  },
  
  // 3. Security / Governance
  {
    id: "rev7",
    name: ":M53:\\Rf:]xL",
    email: "eJYogJIodJ<yenEkgJYmOpw|",
    role: "reviewer",
    affiliate: "A",
    dept: "경영지원실",
    specialty: "security"
  },
  {
    id: "rev8",
    name: ":M53:OFv:MlE",
    email: "\\6oieJYoTJI3]ZQwe5MseJo3hV8me53@",
    role: "reviewer",
    affiliate: "B",
    dept: "경영지원팀",
    specialty: "security"
  },
  {
    id: "rev9",
    name: ":LVf99.;9uhf",
    email: "eZw}]Z<D\\[Uo\\6Q8f6UoeV8ufj@@",
    role: "reviewer",
    affiliate: "D",
    dept: "서비스사업부",
    specialty: "security"
  },
  {
    id: "rev12",
    name: ":M9o:LV{:]xL",
    email: "f5kt\\Z8qPGID\\[Uo\\5Qye[E4gJY|Opw|",
    role: "reviewer",
    affiliate: "F",
    dept: "경영지원실",
    specialty: "security"
  }
];

export const users: User[] = rawEncryptedUsers.map(u => ({
  ...u,
  name: decrypt(u.name),
  email: decrypt(u.email)
}));

export const candidates: Candidate[] = [
  // Level 3 Candidates
  { id: 'cand1', name: '김민지', email: 'mj.kim@atec.kr', affiliate: 'A', dept: '생산관리부', level: 3, status: '평가중', evalDate: '2026-07-15' },
  { id: 'cand2', name: '이지훈', email: 'jh.lee@atecmobility.kr', affiliate: 'B', dept: '서비스운영팀', level: 3, status: '평가중', evalDate: '2026-07-18' },
  { id: 'cand3', name: '박서준', email: 'sj.park@ateccn.kr', affiliate: 'C', dept: '영업기획부', level: 3, status: '완료', evalDate: '2026-07-20' },
  { id: 'cand4', name: '최예진', email: 'yj.choi@atecsystem.kr', affiliate: 'D', dept: '엔지니어링팀', level: 3, status: '대기', evalDate: '2026-07-22' },
  { id: 'cand5', name: '정우성', email: 'ws.jung@atecauto.kr', affiliate: 'E', dept: '물류개발실', level: 3, status: '대기', evalDate: '2026-07-25' },

  // Level 4 Candidates
  { id: 'cand6', name: '한지민', email: 'jm.han@atec.kr', affiliate: 'A', dept: '기술연구소', level: 4, status: '평가중', evalDate: '2026-07-16' },
  { id: 'cand7', name: '윤도현', email: 'dh.yoon@atecmobility.kr', affiliate: 'B', dept: 'R&D연구실', level: 4, status: '대기', evalDate: '2026-07-21' },
  { id: 'cand8', name: '강동원', email: 'dw.kang@atecsystem.kr', affiliate: 'D', dept: '클라우드개발실', level: 4, status: '완료', evalDate: '2026-07-22' },
  { id: 'cand9', name: '송혜교', email: 'hk.song@ateccomputer.kr', affiliate: 'F', dept: 'S/W개발팀', level: 4, status: '대기', evalDate: '2026-07-28' }
];

export const submissions: Submission[] = [
  {
    id: 'sub1',
    candidateId: 'cand1',
    title: '생성형 AI 기반의 스마트 팩토리 공정 불량 원인 분석 챗봇',
    category: 'RAG/챗봇',
    painPoint: '생산 공정 중 불량 발생 시, 기계 매뉴얼과 과거 장애 일지를 일일이 수동 검색하여 원인을 분석하는 데 평균 4시간 이상 소요됨.',
    solution: '과거 공정 불량 로그 및 500페이지 분량의 설비 점검 매뉴얼을 벡터 DB화하고 RAG(검색 증강 생성) 아키텍처를 연동하여, 불량 코드 입력 시 원인 후보 3가지와 조치법을 즉시 제안하는 챗봇 구축.',
    reportSummary: '- 과제명: 공정 불량 분석 지원 봇 PoC\n- 적용 모델: GPT-4o-mini (사내 API Gateway 연동)\n- 데이터셋: 설비 로그 데이터 약 2.5만 건, 매뉴얼 PDF 3종\n- 성과: 평균 원인 분석 리드타임 4시간 -> 30분으로 87.5% 단축 완료\n- 안전장치: PII 마스킹 정규식 적용 및 최종 조치 전 현업 팀장 수동 검수 승인 프로세스 수립.',
    codeStructure: '|- app.py (Streamlit Web UI)\n|- rag_engine.py (LangChain RAG Chain)\n|- vector_store.py (ChromaDB Vector Store & Embedding)\n|- utils.py (PII Masking & Log Audit)\n|- requirements.txt (Dependency Lock)\n|- README.md (Setup Guide)',
    demoUrl: 'https://demo.atec.kr/smart-factory-rag',
    reportUrl: 'https://gw.atec.kr/share/AICA_L3_Factory_Report.pdf',
    codeUrl: 'https://gitlab.atec.kr/mj.kim/factory-rag-agent',
    submittedAt: '2026-07-10 14:00'
  },
  {
    id: 'sub2',
    candidateId: 'cand2',
    title: '고객 센터 장애 접수 티켓 분류 및 자동 FAQ 추천 봇',
    category: '업무자동화',
    painPoint: '매일 접수되는 200건 이상의 서비스 장애 로그를 상담원이 수동 분류하고 대안 답변을 찾는 과정에서 병목 현상이 발생하여 고객 대응 속도가 저하됨.',
    solution: '고객 문의가 들어오는 순간 LLM 기반 텍스트 분류를 수행하여 카테고리를 자동 배정하고, 유사한 장애 해결 이력(FAQ) 5개를 실시간으로 상담원 화면에 팝업 제안하는 오토 에이전트 시스템 구현.',
    reportSummary: '- 과제명: CS 자동 분류 및 FAQ 제안 시스템\n- 적용 모델: GPT-4o-mini & Claude 3.5 Sonnet (이중화 설계)\n- 데이터셋: 과거 CS 상담 이력 10만 건\n- 성과: 장애 1차 분류 대기시간 1.5시간 -> 3초로 단축, 상담원 답변 준비시간 10분 단축\n- 보안책: 상담 일지 내 고객 전화번호 및 주소 정규식 기반 마스킹 필터 구축.',
    codeStructure: '|- backend/\n  |- main.py (FastAPI APP)\n  |- classifier.py (Category classification model)\n  |- search.py (BM25 + Semantic Hybrid Search)\n|- frontend/\n  |- dashboard.html (Bootstrap-based layout)',
    demoUrl: 'https://demo.atec.kr/cs-faq-automation',
    reportUrl: 'https://gw.atec.kr/share/AICA_L3_CS_FAQ_Report.pdf',
    codeUrl: 'https://gitlab.atec.kr/jh.lee/cs-faq-agent',
    submittedAt: '2026-07-12 09:30'
  },
  {
    id: 'sub3',
    candidateId: 'cand3',
    title: '제안서 작성을 위한 뉴스 기사 기반 B2B 영업 제안 포인트 자동 추출기',
    category: '웹/앱',
    painPoint: '신규 입찰 제안서 작성 시 고객사 정보 및 시장 경쟁 분석 조사를 위해 검색과 요약 정리에 과도한 시간이 소요되어 본질적인 제안 품질 극대화에 차질을 빚음.',
    solution: '고객사 뉴스 기사 URL만 입력하면 주요 사업 영역, 최신 현안, 예상 Pain Point를 3페이지 분량의 영업용 제안 포인트 템플릿(Markdown)으로 요약하여 이메일 전송해주는 웹 앱.',
    reportSummary: '- 과제명: B2B 제안서 도우미 웹 앱\n- 적용 모델: GPT-4o-mini\n- 성과: 제안서 기본 장표 구성시간 5M/H -> 2M/H로 단축 완료\n- 확산: 영업 기획팀원 15명 대상 전파 교육(7/5) 및 매뉴얼 그룹웨어 등재 완료.',
    codeStructure: '|- app.py (Streamlit UI)\n|- news_scraper.py (BeautifulSoup & Request Scraper)\n|- llm_extractor.py (Structured Extraction Prompt)\n|- mail_sender.py (SMTP Mail integration)',
    demoUrl: 'https://demo.atec.kr/proposal-helper',
    reportUrl: 'https://gw.atec.kr/share/AICA_L3_Proposal_Helper.pdf',
    codeUrl: 'https://gitlab.atec.kr/sj.park/proposal-helper',
    submittedAt: '2026-07-02 11:15'
  },
  {
    id: 'sub6',
    candidateId: 'cand6',
    title: '보안 가이드 통제형 전사 RAG 시스템용 고성능 임베딩 파이프라인 개발',
    category: '데이터분석',
    painPoint: '사내 RAG 도입 시 기밀 정보 유출 위험과 부정확한 법무/기술 매뉴얼 검색 정확도로 인해 실효성 있는 대규모 확대 도입이 미루어지고 있었음.',
    solution: '그룹사 내부 데이터 전처리(Chunking, Overlap) 최적화와 결격 사유 탐지(Gitleaks API 연동) 필터, 그리고 사용자 권한 등급별(RBAC) 실시간 보안 검증을 수행하는 프라이빗 임베딩 아키텍처 개발.',
    reportSummary: '- 과제명: ATEC Private RAG Pipeline\n- 적용 기술: Llama-3-8B 온프레미스 파인튜닝 + PGVector\n- 성과: 기밀문서 노출율 0%, 법무 검정 검색 재현율 94% 달성\n- 보안책: 소스코드 보안 검토 완료(정보보안팀 승인 7/8), API Key 90일 주기 로테이션 반영.',
    codeStructure: '|- src/\n  |- embedding/\n    |- chunker.py (Semantic document splitter)\n    |- embedding_model.py (Custom embedding model runner)\n  |- security/\n    |- pii_detector.py (Named Entity Recognition PII filter)\n    |- rbac.py (Role-based access token verification)\n  |- db/\n    |- pg_vector_helper.py (Postgres DB connector)\n|- tests/\n  |- test_security.py (Security unit tests)\n|- Dockerfile\n|- docker-compose.yml',
    demoUrl: 'https://demo.atec.kr/private-rag-pipeline',
    reportUrl: 'https://gw.atec.kr/share/AICA_L4_Private_RAG_Report.pdf',
    codeUrl: 'https://gitlab.atec.kr/jm.han/private-rag-pipeline',
    submittedAt: '2026-07-08 17:45'
  },
  {
    id: 'sub8',
    candidateId: 'cand8',
    title: '교통요금 로그 기반 고장 진단 및 부품 수명 예측 AI 에이전트',
    category: '데이터분석',
    painPoint: '교통단말기 고장 예방 정비의 정확도가 떨어져 현장 수리 비용이 연간 1.2억 원 규모로 발생하고 있었음.',
    solution: '단말 로그 및 고장 이력 데이터를 연계 분석하여 장비 고장을 사전에 감지하고 최적의 부품 교체 시점을 메신저(Teams)로 현장 기사에게 자동 알림해주는 예측 에이전트 구축.',
    reportSummary: '- 과제명: 단말기 고장 예측 에이전트\n- 적용 모델: LightGBM + GPT-4o\n- 성과: 고장 예측 정확도 91% 달성, 연간 예방 정비 비용 5,500만 원 절감 검증 완료.\n- 확산: D사 엔지니어 전원 대상 SDK 배포 및 사용 튜토리얼 릴리즈.',
    codeStructure: '|- models/\n  |- train.py (LightGBM Model trainer)\n  |- predict.py (Inference API)\n|- agent/\n  |- diagnostics.py (LLM Diagnostics reasoning chain)\n  |- teams_sender.py (Teams Webhook interface)\n|- config/\n  |- settings.yaml (Config store without credentials)',
    demoUrl: 'https://demo.atec.kr/log-diagnostics-agent',
    reportUrl: 'https://gw.atec.kr/share/AICA_L4_Diagnostics_Report.pdf',
    codeUrl: 'https://gitlab.atec.kr/dw.kang/log-diagnostics-agent',
    submittedAt: '2026-06-25 10:00'
  }
];

export const committees: Committee[] = [
  { id: 'com1', candidateId: 'cand1', reviewer1Id: 'rev1', reviewer2Id: 'rev4', reviewer3Id: 'rev7', status: '평가중' }, // 김민지
  { id: 'com2', candidateId: 'cand2', reviewer1Id: 'rev2', reviewer2Id: 'rev5', reviewer3Id: 'rev8', status: '평가중' }, // 이지훈
  { id: 'com3', candidateId: 'cand3', reviewer1Id: 'rev3', reviewer2Id: 'rev6', reviewer3Id: 'rev9', status: '완료' },   // 박서준 (완료됨)
  { id: 'com6', candidateId: 'cand6', reviewer1Id: 'rev1', reviewer2Id: 'rev5', reviewer3Id: 'rev7', status: '평가중' }, // 한지민
  { id: 'com8', candidateId: 'cand8', reviewer1Id: 'rev3', reviewer2Id: 'rev4', reviewer3Id: 'rev8', status: '완료' }    // 강동원 (완료됨)
];

export const mockSecurityChecks: SecurityCheck[] = [
  // 박서준(완료) 과제에 대한 rev3(비즈니스), rev6(기술), rev9(보안)의 보안체크 완료 상태
  { id: 'sc1', submissionId: 'sub3', reviewerId: 'rev3', check1: true, check2: true, check3: true, check4: true, check5: true, notes: '모두 양호함.' },
  { id: 'sc2', submissionId: 'sub3', reviewerId: 'rev6', check1: true, check2: true, check3: true, check4: true, check5: true, notes: '마스킹 정상 작동 확인' },
  { id: 'sc3', submissionId: 'sub3', reviewerId: 'rev9', check1: true, check2: true, check3: true, check4: true, check5: true, notes: '보안 규정 철저 준수' },

  // 강동원(완료) 과제에 대한 rev3(비즈니스), rev4(기술), rev8(보안)의 보안체크
  { id: 'sc4', submissionId: 'sub8', reviewerId: 'rev3', check1: true, check2: true, check3: true, check4: true, check5: true, notes: '비밀 데이터 마스킹 완료' },
  { id: 'sc5', submissionId: 'sub8', reviewerId: 'rev4', check1: true, check2: true, check3: true, check4: true, check5: true, notes: '소스코드 상 API Key 없음 확인' },
  { id: 'sc6', submissionId: 'sub8', reviewerId: 'rev8', check1: true, check2: true, check3: true, check4: true, check5: true, notes: '이상 무' }
];

export const mockScores: Score[] = [
  // 박서준(cand3, com3) - Level 3
  // 1. rev3 (Business Reviewer)
  {
    id: 's1',
    committeeId: 'com3',
    reviewerId: 'rev3',
    score1: 85, // Complexity
    score2: 85, // Implementation
    score3: 85, // Assetization
    comments1: '현업 Pain Point의 실재성과 비즈니스 시나리오가 대단히 훌륭하게 설계됨.',
    comments2: '오류 처리 로직이 깔끔하게 정의되었고 시연 안정성도 높음.',
    comments3: '사내 가이드 및 매뉴얼 품질이 우수하여 다른 영업소로 즉각 확산이 가능함.',
    totalScore: 85,
    isDisqualified: false,
    submittedAt: '2026-07-06 15:00'
  },
  // 2. rev6 (Tech Reviewer)
  {
    id: 's2',
    committeeId: 'com3',
    reviewerId: 'rev6',
    score1: 70, // 보통
    score2: 85, // 양호
    score3: 70, // 보통
    comments1: '기술 난이도 측면에서 RAG 등 심화 기능 없이 단순 요약 API 연동에 머물러 복잡도는 아쉬움.',
    comments2: 'UI 편의성이 좋아 사용자들이 쉽게 적응 가능함.',
    comments3: '재사용을 위한 소스코드 패키징은 평이한 수준임.',
    totalScore: 76,
    isDisqualified: false,
    submittedAt: '2026-07-06 16:30'
  },
  // 3. rev9 (Security Reviewer)
  {
    id: 's3',
    committeeId: 'com3',
    reviewerId: 'rev9',
    score1: 85,
    score2: 70,
    score3: 85,
    comments1: '영업 비밀 데이터를 프롬프트로 다룰 때의 한계를 인식하고 예외 조건을 기재함.',
    comments2: '망 분리 관점의 연동 안정성은 보조가 조금 더 필요함.',
    comments3: '보안 매뉴얼 가이드라인을 아주 꼼꼼히 체크해 둠.',
    totalScore: 79,
    isDisqualified: false,
    submittedAt: '2026-07-06 17:00'
  },

  // 강동원(cand8, com8) - Level 4
  // 1. rev3 (Business Reviewer)
  {
    id: 's4',
    committeeId: 'com8',
    reviewerId: 'rev3',
    score1: 85, // Engineering
    score2: 85, // Security
    score3: 100, // Impact (비즈니스 기여 탁월)
    comments1: 'LightGBM과 LLM 에이전트의 결합 구조가 매끄러움.',
    comments2: '개인정보 노출 없이 로그 가공을 성공적으로 수행함.',
    comments3: '연간 5,500만 원 상당의 기기 유지비 절감을 현업 부서장이 공식 확인해주어 경제성이 탁월함.',
    totalScore: 89.5,
    isDisqualified: false,
    submittedAt: '2026-07-07 10:00'
  },
  // 2. rev4 (Tech Reviewer)
  {
    id: 's5',
    committeeId: 'com8',
    reviewerId: 'rev4',
    score1: 100, // 탁월
    score2: 85, // 양호
    score3: 85, // 양호
    comments1: '코드 품질이 매우 높고, 모듈화 및 예외 에러 핸들링이 완벽함. Docker 빌드 환경도 제공함.',
    comments2: 'API Key 노출이 없으며, config.yaml 파일 관리가 깔끔함.',
    comments3: '예측 정확도 91%로 실제 기성 솔루션과 견주어도 우수함.',
    totalScore: 91,
    isDisqualified: false,
    submittedAt: '2026-07-07 11:20'
  },
  // 3. rev8 (Security Reviewer)
  {
    id: 's6',
    committeeId: 'com8',
    reviewerId: 'rev8',
    score1: 85,
    score2: 100, // 보안 탁월
    score3: 85,
    comments1: '예외적 장애 상태에 대한 롤백 처리가 정교하게 구현됨.',
    comments2: '소스코드 암호화 및 토큰 갱신, 로그 파일 내 비밀 자격증명 자동 은닉 코드가 모범 사례 수준임.',
    comments3: '유지보수 계획이 꼼꼼하게 짜여 있음.',
    totalScore: 89.5,
    isDisqualified: false,
    submittedAt: '2026-07-07 13:00'
  }
];

const rawMockEvaluationResults: EvaluationResult[] = [
  {
    candidateId: 'cand3',
    committeeId: 'com3',
    averageScore: 80, // (85 + 76 + 79) / 3
    passStatus: '합격',
    finalDecisionComment: '본 과제는 B2B 영업 기획의 생산성 향상을 입증한 성과가 뛰어납니다. 기술적 복잡도는 낮으나 사용성 및 매뉴얼 전파 실적이 매우 모범적이므로 합격을 최종 결정합니다.',
    reviewerScores: [
      { reviewerId: 'rev3', reviewerName: '', specialty: '현업/비즈니스', score: 85, score1: 85, score2: 85, score3: 85 },
      { reviewerId: 'rev6', reviewerName: '', specialty: 'AI기술', score: 76, score1: 70, score2: 85, score3: 70 },
      { reviewerId: 'rev9', reviewerName: '', specialty: '보안/거버넌스', score: 79.5, score1: 85, score2: 70, score3: 85 }
    ]
  },
  {
    candidateId: 'cand8',
    committeeId: 'com8',
    averageScore: 90, // (89.5 + 91 + 89.5) / 3
    passStatus: '합격',
    finalDecisionComment: 'L4 자격 요건에 부합하는 높은 난이도의 고장 예측 분석 모델을 구현하였으며, 현장 실측을 통해 5천만 원 이상의 실질적인 비용 절감을 증빙하였습니다. 만장일치로 합격 판정합니다.',
    reviewerScores: [
      { reviewerId: 'rev3', reviewerName: '', specialty: '현업/비즈니스', score: 89.5, score1: 85, score2: 85, score3: 100 },
      { reviewerId: 'rev4', reviewerName: '', specialty: 'AI기술', score: 91, score1: 100, score2: 85, score3: 85 },
      { reviewerId: 'rev8', reviewerName: '', specialty: '보안/거버넌스', score: 89.5, score1: 85, score2: 100, score3: 85 }
    ]
  }
];

export const mockEvaluationResults: EvaluationResult[] = rawMockEvaluationResults.map(er => ({
  ...er,
  reviewerScores: er.reviewerScores.map(rs => {
    const foundUser = users.find(u => u.id === rs.reviewerId);
    return {
      ...rs,
      reviewerName: foundUser ? foundUser.name : ''
    };
  })
}));
