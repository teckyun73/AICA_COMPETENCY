import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Code, 
  Video, 
  AlertTriangle, 
  TrendingUp, 
  Printer, 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  Award,
  ShieldCheck,
  BookOpen,
  Scale,
  Database,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  users as initialUsers, 
  candidates as initialCandidates, 
  submissions as initialSubmissions, 
  committees as initialCommittees, 
  mockSecurityChecks, 
  mockScores, 
  mockEvaluationResults,
  AFFILIATES
} from './data/mockData';
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import type { 
  User,
  Candidate,
  Submission,
  Committee,
  SecurityCheck,
  Score,
  EvaluationResult
} from './data/mockData';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { questions } from './data/questions';

export default function App() {
  // --- State Variables ---
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); 
  const [view, setView] = useState<'admin' | 'reviewer' | 'evaluate' | 'report'>('admin');
  
  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState(''); // ID = 성명
  const [loginPw, setLoginPw] = useState(''); // Password = 이메일
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!loginId.trim() || !loginPw.trim()) {
      setLoginError('성명(ID)과 이메일(비밀번호)을 모두 입력해 주세요.');
      return;
    }

    const matchedUser = initialUsers.find(
      u => u.name.trim() === loginId.trim() && u.email.trim() === loginPw.trim()
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setIsLoggedIn(true);
      if (matchedUser.role === 'admin') {
        setView('admin');
      } else {
        setView('reviewer');
      }
      setLoginId('');
      setLoginPw('');
    } else {
      setLoginError('아이디(성명) 또는 비밀번호(이메일)가 잘못되었습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCandidate(null);
  };
  
  // Data State (Simulating Local Database)
  const [candidatesList, setCandidatesList] = useState<Candidate[]>(initialCandidates);
  const [submissionsList, setSubmissionsList] = useState<Submission[]>(initialSubmissions);
  const [committeesList, setCommitteesList] = useState<Committee[]>(initialCommittees);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>(mockSecurityChecks);
  const [scoresList, setScoresList] = useState<Score[]>(mockScores);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>(mockEvaluationResults);

  // Load data from Firebase if configured, otherwise fallback to local seed data
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.log('Firebase is not configured. Running in Local Memory Database mode.');
      return;
    }

    console.log('Firebase VITE env config detected. Connecting to Cloud Firestore...');

    // 1. Subscribe to candidates collection
    const unsubscribeCandidates = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      const list: Candidate[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Candidate);
      });
      setCandidatesList(list);
    });

    // 2. Subscribe to submissions collection
    const unsubscribeSubmissions = onSnapshot(collection(db, 'submissions'), (snapshot) => {
      const list: Submission[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Submission);
      });
      setSubmissionsList(list);
    });

    // 3. Subscribe to committees collection
    const unsubscribeCommittees = onSnapshot(collection(db, 'committees'), (snapshot) => {
      const list: Committee[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Committee);
      });
      setCommitteesList(list);
    });

    // 4. Subscribe to securityChecks collection
    const unsubscribeSecurityChecks = onSnapshot(collection(db, 'securityChecks'), (snapshot) => {
      const list: SecurityCheck[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as SecurityCheck);
      });
      setSecurityChecks(list);
    });

    // 5. Subscribe to scores collection
    const unsubscribeScores = onSnapshot(collection(db, 'scores'), (snapshot) => {
      const list: Score[] = [];
      snapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id } as Score);
      });
      setScoresList(list);
    });

    // 6. Subscribe to evaluationResults collection
    const unsubscribeEvaluationResults = onSnapshot(collection(db, 'evaluationResults'), (snapshot) => {
      const list: EvaluationResult[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as EvaluationResult);
      });
      setEvaluationResults(list);
    });

    return () => {
      unsubscribeCandidates();
      unsubscribeSubmissions();
      unsubscribeCommittees();
      unsubscribeSecurityChecks();
      unsubscribeScores();
      unsubscribeEvaluationResults();
    };
  }, []);

  // Load simulation data to Firebase Cloud DB or Local State
  const handleLoadSimulationData = async () => {
    const confirmLoad = window.confirm(
      '⚡ 시뮬레이션 가상 데이터를 불러오시겠습니까?\n\n테스트 및 시연용 후보자(9명)와 패널 배정 및 3인 평가 결과 가상 데이터셋이 데이터베이스에 복원됩니다.'
    );
    if (!confirmLoad) return;

    if (isFirebaseConfigured && db) {
      try {
        console.log('Seeding simulation data to Cloud Firestore...');
        for (const item of initialCandidates) {
          await setDoc(doc(db, 'candidates', item.id), item);
        }
        for (const item of initialSubmissions) {
          await setDoc(doc(db, 'submissions', item.id), item);
        }
        for (const item of initialCommittees) {
          await setDoc(doc(db, 'committees', item.id), item);
        }
        for (const item of mockSecurityChecks) {
          await setDoc(doc(db, 'securityChecks', item.id), item);
        }
        for (const item of mockScores) {
          await setDoc(doc(db, 'scores', item.id), item);
        }
        for (const item of mockEvaluationResults) {
          await setDoc(doc(db, 'evaluationResults', item.candidateId), item);
        }
        console.log('Simulation data successfully loaded into Cloud Firestore.');
      } catch (error) {
        console.error('Error loading simulation data to Cloud Firestore:', error);
        alert('Cloud DB 가상 데이터 불러오기 중 오류가 발생했습니다: ' + (error as Error).message);
      }
    }

    setCandidatesList(initialCandidates);
    setSubmissionsList(initialSubmissions);
    setCommitteesList(initialCommittees);
    setSecurityChecks(mockSecurityChecks);
    setScoresList(mockScores);
    setEvaluationResults(mockEvaluationResults);

    alert('시뮬레이션 가상 데이터(후보자 9명 및 3인 패널 평가 결과)를 성공적으로 불러왔습니다.');
  };

  // Reset / Clear all evaluation data from Firebase Cloud DB or Local State
  const handleResetData = async () => {
    const confirmReset = window.confirm(
      '⚠️ 전체 평가 데이터를 초기화하시겠습니까?\n\n모든 후보자, 제출 과제, 배정 위원회 및 평가 결과가 초기화되며, 실제 신규 평가과제를 등록하여 실무 운영을 시작할 수 있는 깨끗한 상태가 됩니다.'
    );
    if (!confirmReset) return;

    if (isFirebaseConfigured && db) {
      try {
        console.log('Resetting Cloud Firestore collections...');
        const collectionsToReset = ['candidates', 'submissions', 'committees', 'securityChecks', 'scores', 'evaluationResults'];
        for (const colName of collectionsToReset) {
          const querySnapshot = await getDocs(collection(db, colName));
          const deletePromises = querySnapshot.docs.map(docSnapshot => deleteDoc(doc(db, colName, docSnapshot.id)));
          await Promise.all(deletePromises);
        }
        console.log('Cloud Firestore collections successfully reset.');
      } catch (error) {
        console.error('Error resetting Cloud Firestore:', error);
        alert('Cloud DB 데이터 초기화 중 오류가 발생했습니다: ' + (error as Error).message);
      }
    }

    setCandidatesList([]);
    setSubmissionsList([]);
    setCommitteesList([]);
    setSecurityChecks([]);
    setScoresList([]);
    setEvaluationResults([]);

    alert('모든 평가 데이터가 성공적으로 초기화되었습니다.\n우측 상단의 "+ 신규 평가과제 등록 & 패널 배정" 버튼을 눌러 실무 운영을 시작하세요.');
  };

  // Admin Add Candidate Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandEmail, setNewCandEmail] = useState('');
  const [newCandAffiliate, setNewCandAffiliate] = useState('A');
  const [newCandDept, setNewCandDept] = useState('');
  const [newCandLevel, setNewCandLevel] = useState<3 | 4>(3);
  const [newCandEvalDate, setNewCandEvalDate] = useState('2026-07-22');
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubCategory, setNewSubCategory] = useState<'웹/앱' | 'RAG/챗봇' | '데이터분석' | '업무자동화'>('RAG/챗봇');
  const [newSubPainPoint, setNewSubPainPoint] = useState('');
  const [newSubSolution, setNewSubSolution] = useState('');
  const [newSubReportSummary, setNewSubReportSummary] = useState('');
  const [newSubCodeStructure, setNewSubCodeStructure] = useState('');
  const [newSubDemoUrl, setNewSubDemoUrl] = useState('https://demo.atec.kr/mock-app');
  const [newSubReportUrl, setNewSubReportUrl] = useState('https://gw.atec.kr/share/Report.pdf');
  const [newSubCodeUrl, setNewSubCodeUrl] = useState('https://gitlab.atec.kr/mock-repo');
  const [newReviewer1, setNewReviewer1] = useState(''); // business
  const [newReviewer2, setNewReviewer2] = useState(''); // tech
  const [newReviewer3, setNewReviewer3] = useState(''); // security

  // Detail Modal state for dashboard statistics
  const [statsModalType, setStatsModalType] = useState<'total' | 'completed' | 'evaluating' | 'pending' | null>(null);

  // Auto Panel Assign logic (Conflict of Interest Prevention)
  const handleAutoAssignPanel = (affiliate: string) => {
    // 1. Business reviewer
    const bizReviewer = initialUsers.find(
      u => u.role === 'reviewer' && u.specialty === 'business' && u.affiliate !== affiliate
    ) || initialUsers.find(u => u.role === 'reviewer' && u.specialty === 'business');
    
    // 2. Tech reviewer
    const techReviewer = initialUsers.find(
      u => u.role === 'reviewer' && u.specialty === 'tech' && u.affiliate !== affiliate
    ) || initialUsers.find(u => u.role === 'reviewer' && u.specialty === 'tech');

    // 3. Security reviewer
    const secReviewer = initialUsers.find(
      u => u.role === 'reviewer' && u.specialty === 'security' && u.affiliate !== affiliate
    ) || initialUsers.find(u => u.role === 'reviewer' && u.specialty === 'security');

    if (bizReviewer) setNewReviewer1(bizReviewer.id);
    if (techReviewer) setNewReviewer2(techReviewer.id);
    if (secReviewer) setNewReviewer3(secReviewer.id);
  };

  useEffect(() => {
    if (showAddForm) {
      handleAutoAssignPanel(newCandAffiliate);
    }
  }, [newCandAffiliate, showAddForm]);

  const handleRegisterTask = () => {
    if (!newCandName || !newCandEmail || !newCandDept || !newSubTitle || !newSubPainPoint || !newSubSolution || !newSubReportSummary) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (!newReviewer1 || !newReviewer2 || !newReviewer3) {
      alert('심사위원 패널 3인을 모두 지정해야 합니다.');
      return;
    }

    const nextCandId = `cand${candidatesList.length + 1}`;
    const nextSubId = `sub${submissionsList.length + 1}`;
    const nextCommId = `com${committeesList.length + 1}`;

    const newCandidate: Candidate = {
      id: nextCandId,
      name: newCandName,
      email: newCandEmail,
      affiliate: newCandAffiliate,
      dept: newCandDept,
      level: newCandLevel,
      status: '대기',
      evalDate: newCandEvalDate || '2026-07-22'
    };

    const newSubmission: Submission = {
      id: nextSubId,
      candidateId: nextCandId,
      title: newSubTitle,
      category: newSubCategory,
      painPoint: newSubPainPoint,
      solution: newSubSolution,
      reportSummary: newSubReportSummary,
      codeStructure: newSubCodeStructure || `├── src/\n│   ├── components/\n│   ├── main.py\n│   └── config.json\n└── requirements.txt`,
      demoUrl: newSubDemoUrl,
      reportUrl: newSubReportUrl,
      codeUrl: newSubCodeUrl,
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    const newCommittee: Committee = {
      id: nextCommId,
      candidateId: nextCandId,
      reviewer1Id: newReviewer1,
      reviewer2Id: newReviewer2,
      reviewer3Id: newReviewer3,
      status: '대기'
    };

    setCandidatesList([...candidatesList, newCandidate]);
    setSubmissionsList([...submissionsList, newSubmission]);
    setCommitteesList([...committeesList, newCommittee]);

    const newSecurityChecks: SecurityCheck[] = [
      {
        id: `sc_${nextSubId}_1`,
        submissionId: nextSubId,
        reviewerId: newReviewer1,
        check1: true,
        check2: true,
        check3: true,
        check4: true,
        check5: true,
        notes: '과제 등록 시 자동 초기화'
      },
      {
        id: `sc_${nextSubId}_2`,
        submissionId: nextSubId,
        reviewerId: newReviewer2,
        check1: true,
        check2: true,
        check3: true,
        check4: true,
        check5: true,
        notes: '과제 등록 시 자동 초기화'
      },
      {
        id: `sc_${nextSubId}_3`,
        submissionId: nextSubId,
        reviewerId: newReviewer3,
        check1: true,
        check2: true,
        check3: true,
        check4: true,
        check5: true,
        notes: '과제 등록 시 자동 초기화'
      }
    ];
    setSecurityChecks([...securityChecks, ...newSecurityChecks]);

    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'candidates', nextCandId), newCandidate);
        setDoc(doc(db, 'submissions', nextSubId), newSubmission);
        setDoc(doc(db, 'committees', nextCommId), newCommittee);
        newSecurityChecks.forEach(sc => {
          setDoc(doc(db, 'securityChecks', sc.id), sc);
        });
      } catch (e) {
        console.error('Error writing new registration to Firestore:', e);
      }
    }

    setNewCandName('');
    setNewCandEmail('');
    setNewCandDept('');
    setNewSubTitle('');
    setNewSubPainPoint('');
    setNewSubSolution('');
    setNewSubReportSummary('');
    setNewSubCodeStructure('');
    setShowAddForm(false);
    
    alert(`신규 평가과제 [${newSubTitle}] 및 지원자 [${newCandName}] 등록이 완료되었습니다. 배정된 심사위원들의 큐에 과제가 즉시 추가됩니다.`);
  };

  // Workspace Specific State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'code' | 'video'>('report');
  
  // Current Reviewer Evaluation State
  const [currentScore1, setCurrentScore1] = useState<number>(70);
  const [currentScore2, setCurrentScore2] = useState<number>(70);
  const [currentScore3, setCurrentScore3] = useState<number>(70);
  const [comments1, setComments1] = useState<string>('');
  const [comments2, setComments2] = useState<string>('');
  const [comments3, setComments3] = useState<string>('');
  
  // Security Checklist State for current evaluation
  const [secCheck1, setSecCheck1] = useState<boolean>(true);
  const [secCheck2, setSecCheck2] = useState<boolean>(true);
  const [secCheck3, setSecCheck3] = useState<boolean>(true);
  const [secCheck4, setSecCheck4] = useState<boolean>(true);
  const [secCheck5, setSecCheck5] = useState<boolean>(true);
  const [secNotes, setSecNotes] = useState<string>('');
  const [isDisqualified, setIsDisqualified] = useState<boolean>(false);
  const [disqReason, setDisqReason] = useState<string>('');

  // Filter state for Question Bank
  const [qSearchText, setQSearchText] = useState<string>('');
  const [qCategoryFilter, setQCategoryFilter] = useState<string>('all');
  
  // Filter state for Admin Queue
  const [adminAffiliateFilter, setAdminAffiliateFilter] = useState<string>('all');
  const [adminLevelFilter, setAdminLevelFilter] = useState<string>('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');

  // --- Auto Calibrations & Helpers ---
  const currentSubmission = selectedCandidate 
    ? submissionsList.find(s => s.candidateId === selectedCandidate.id) 
    : null;

  const currentCommittee = selectedCandidate
    ? committeesList.find(c => c.candidateId === selectedCandidate.id)
    : null;

  // Sync reviewer scores if they already exist
  useEffect(() => {
    if (selectedCandidate && currentUser.role === 'reviewer' && currentCommittee) {
      const existingScore = scoresList.find(
        s => s.committeeId === currentCommittee.id && s.reviewerId === currentUser.id
      );
      if (existingScore) {
        setCurrentScore1(existingScore.score1);
        setCurrentScore2(existingScore.score2);
        setCurrentScore3(existingScore.score3);
        setComments1(existingScore.comments1);
        setComments2(existingScore.comments2);
        setComments3(existingScore.comments3);
      } else {
        // Reset to default
        setCurrentScore1(70);
        setCurrentScore2(70);
        setCurrentScore3(70);
        setComments1('');
        setComments2('');
        setComments3('');
      }

      const existingSec = securityChecks.find(
        sc => sc.submissionId === currentSubmission?.id && sc.reviewerId === currentUser.id
      );
      if (existingSec) {
        setSecCheck1(existingSec.check1);
        setSecCheck2(existingSec.check2);
        setSecCheck3(existingSec.check3);
        setSecCheck4(existingSec.check4);
        setSecCheck5(existingSec.check5);
        setSecNotes(existingSec.notes);
      } else {
        setSecCheck1(true);
        setSecCheck2(true);
        setSecCheck3(true);
        setSecCheck4(true);
        setSecCheck5(true);
        setSecNotes('');
      }
      setIsDisqualified(false);
      setDisqReason('');
    }
  }, [selectedCandidate, currentUser, scoresList, securityChecks]);


  // Get other reviewers' scores for current candidate
  const getOtherReviewersScores = () => {
    if (!currentCommittee) return [];
    return scoresList
      .filter(s => s.committeeId === currentCommittee.id && s.reviewerId !== currentUser.id)
      .map(s => {
        const rev = initialUsers.find(u => u.id === s.reviewerId);
        return {
          name: rev?.name || '심사위원',
          specialty: rev?.specialty || 'tech',
          score: s.totalScore,
          score1: s.score1,
          score2: s.score2,
          score3: s.score3
        };
      });
  };

  // Calculate score deviation warning
  const checkScoreDeviation = () => {
    if (!currentCommittee) return { warn: false, diff: 0 };
    const myTotal = parseFloat(((currentScore1 * 0.4) + (currentScore2 * 0.3) + (currentScore3 * 0.3)).toFixed(1));
    const others = scoresList.filter(s => s.committeeId === currentCommittee.id && s.reviewerId !== currentUser.id);
    if (others.length === 0) return { warn: false, diff: 0 };
    
    let maxDiff = 0;
    others.forEach(o => {
      const diff = Math.abs(o.totalScore - myTotal);
      if (diff > maxDiff) maxDiff = diff;
    });

    return {
      warn: maxDiff >= 15,
      diff: maxDiff
    };
  };


  // Save current evaluation
  const handleSaveEvaluation = () => {
    if (!selectedCandidate || !currentCommittee || !currentSubmission) return;

    // 1. Calculate weighted score
    // Level 3 weights: Complexity 30%, Implementation 40%, Assetization 30%
    // Level 4 weights: Engineering 40%, Security 30%, Impact 30%
    let total = 0;
    if (selectedCandidate.level === 3) {
      total = parseFloat(((currentScore1 * 0.3) + (currentScore2 * 0.4) + (currentScore3 * 0.3)).toFixed(2));
    } else {
      total = parseFloat(((currentScore1 * 0.4) + (currentScore2 * 0.3) + (currentScore3 * 0.3)).toFixed(2));
    }

    // 2. Update Scores List
    const newScore: Score = {
      id: `score_${currentCommittee.id}_${currentUser.id}`,
      committeeId: currentCommittee.id,
      reviewerId: currentUser.id,
      score1: currentScore1,
      score2: currentScore2,
      score3: currentScore3,
      comments1,
      comments2,
      comments3,
      totalScore: total,
      isDisqualified: isDisqualified,
      disqualificationReason: isDisqualified ? disqReason : undefined,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const scoreIdx = scoresList.findIndex(s => s.committeeId === currentCommittee.id && s.reviewerId === currentUser.id);
    let updatedScores = [...scoresList];
    if (scoreIdx >= 0) {
      updatedScores[scoreIdx] = newScore;
    } else {
      updatedScores.push(newScore);
    }
    setScoresList(updatedScores);

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'scores', newScore.id), newScore).catch(console.error);
    }

    // 3. Update Security Check
    const newSecCheck: SecurityCheck = {
      id: `sec_${currentSubmission.id}_${currentUser.id}`,
      submissionId: currentSubmission.id,
      reviewerId: currentUser.id,
      check1: secCheck1,
      check2: secCheck2,
      check3: secCheck3,
      check4: secCheck4,
      check5: secCheck5,
      notes: secNotes
    };

    const secIdx = securityChecks.findIndex(sc => sc.submissionId === currentSubmission.id && sc.reviewerId === currentUser.id);
    let updatedSec = [...securityChecks];
    if (secIdx >= 0) {
      updatedSec[secIdx] = newSecCheck;
    } else {
      updatedSec.push(newSecCheck);
    }
    setSecurityChecks(updatedSec);

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'securityChecks', newSecCheck.id), newSecCheck).catch(console.error);
    }

    // 4. Check if all 3 panel reviewers have submitted scores
    const allScoresForCom = updatedScores.filter(s => s.committeeId === currentCommittee.id);
    if (allScoresForCom.length === 3) {
      // Auto compile final results
      const average = parseFloat((allScoresForCom.reduce((sum, s) => sum + s.totalScore, 0) / 3).toFixed(2));
      const hasDisq = allScoresForCom.some(s => s.isDisqualified) || 
                      updatedSec.filter(sc => sc.submissionId === currentSubmission.id).some(sc => !sc.check1 || !sc.check2 || !sc.check3);
      
      let passStatus: '합격' | '보완후합격' | '불합격' = '불합격';
      if (!hasDisq) {
        if (average >= 80) passStatus = '합격';
        else if (average >= 70) passStatus = '보완후합격';
      }

      const finalResult: EvaluationResult = {
        candidateId: selectedCandidate.id,
        committeeId: currentCommittee.id,
        averageScore: average,
        passStatus,
        finalDecisionComment: hasDisq 
          ? '보안 가이드라인 미준수 및 중대한 결격사유(지식재산권, 표절 등)에 기인하여 불합격으로 판정함.' 
          : `심사위원 3인의 루브릭 종합 채점 결과, 평균 ${average}점으로 최종 ${passStatus} 판정을 내립니다.`,
        reviewerScores: allScoresForCom.map(s => {
          const u = initialUsers.find(x => x.id === s.reviewerId);
          return {
            reviewerId: s.reviewerId,
            reviewerName: u?.name || '심사위원',
            specialty: u?.specialty || 'tech',
            score: s.totalScore,
            score1: s.score1,
            score2: s.score2,
            score3: s.score3
          };
        })
      };

      const resultIdx = evaluationResults.findIndex(er => er.committeeId === currentCommittee.id);
      let updatedResults = [...evaluationResults];
      if (resultIdx >= 0) {
        updatedResults[resultIdx] = finalResult;
      } else {
        updatedResults.push(finalResult);
      }
      setEvaluationResults(updatedResults);

      // Update Candidate Status to '완료'
      const candIdx = candidatesList.findIndex(c => c.id === selectedCandidate.id);
      if (candIdx >= 0) {
        let updatedCands = [...candidatesList];
        updatedCands[candIdx].status = '완료';
        setCandidatesList(updatedCands);
      }

      // [FIREBASE] Write evaluation result and update candidate/committee status to 완료
      if (isFirebaseConfigured && db) {
        setDoc(doc(db, 'evaluationResults', selectedCandidate.id), finalResult).catch(console.error);
        updateDoc(doc(db, 'candidates', selectedCandidate.id), { status: '완료' }).catch(console.error);
        updateDoc(doc(db, 'committees', currentCommittee.id), { status: '완료' }).catch(console.error);
      }
    } else {
      // Update Candidate Status to '평가중'
      const candIdx = candidatesList.findIndex(c => c.id === selectedCandidate.id);
      if (candIdx >= 0 && candidatesList[candIdx].status === '대기') {
        let updatedCands = [...candidatesList];
        updatedCands[candIdx].status = '평가중';
        setCandidatesList(updatedCands);

        // [FIREBASE] Update status to 평가중
        if (isFirebaseConfigured && db) {
          updateDoc(doc(db, 'candidates', selectedCandidate.id), { status: '평가중' }).catch(console.error);
          updateDoc(doc(db, 'committees', currentCommittee.id), { status: '평가중' }).catch(console.error);
        }
      }
    }

    alert('평가 점수 및 보안 체크리스트가 임시 저장/제출되었습니다.');
    setView('reviewer');
    setSelectedCandidate(null);
  };

  // Calculate stats for admin dashboard
  const getAdminStats = () => {
    const total = candidatesList.length;
    const completed = candidatesList.filter(c => c.status === '완료').length;
    const evaluating = candidatesList.filter(c => c.status === '평가중').length;
    const pending = candidatesList.filter(c => c.status === '대기').length;
    
    // Average scores per affiliate
    const affiliateAverages = AFFILIATES.map(aff => {
      const affCands = candidatesList.filter(c => c.affiliate === aff.code);
      const affCompleted = affCands.filter(c => c.status === '완료');
      if (affCompleted.length === 0) return { affiliate: aff.name, avg: 0, count: 0 };
      
      const sum = affCompleted.reduce((acc, c) => {
        const res = evaluationResults.find(r => r.candidateId === c.id);
        return acc + (res?.averageScore || 0);
      }, 0);

      return {
        affiliate: aff.name,
        avg: parseFloat((sum / affCompleted.length).toFixed(1)),
        count: affCompleted.length
      };
    });

    return {
      total,
      completed,
      evaluating,
      pending,
      affiliateAverages
    };
  };

  const renderReviewerBadge = (
    reviewer: User | undefined,
    roleAbbr: '현' | '기' | '보',
    committeeId: string | undefined,
    badgeClass: string
  ) => {
    if (!reviewer) return <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>미정</span>;

    const hasSubmitted = scoresList.some(
      s => s.committeeId === committeeId && s.reviewerId === reviewer.id
    );

    const statusText = hasSubmitted ? '완료' : '심사중';
    const statusColor = hasSubmitted ? '#4ade80' : '#fb923c'; 
    const bgStyle = hasSubmitted 
      ? 'rgba(74, 222, 128, 0.08)' 
      : 'rgba(251, 146, 60, 0.08)';
    const borderStyle = hasSubmitted
      ? '1px solid rgba(74, 222, 128, 0.3)'
      : '1px solid rgba(251, 146, 60, 0.3)';

    return (
      <span 
        className={`badge ${badgeClass}`} 
        title={`${reviewer.name} (${reviewer.dept} - ${statusText})`}
        style={{ 
          background: bgStyle, 
          border: borderStyle,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.72rem',
          padding: '0.15rem 0.35rem'
        }}
      >
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColor, display: 'inline-block' }}></span>
        {reviewer.name}({roleAbbr}·{statusText})
      </span>
    );
  };

  const adminStats = getAdminStats();

  return (
    <div className="app-container">
      {/* ==================== GLOBAL HEADER ==================== */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">
            <Award size={28} />
            AICA 자격심사 시스템
          </div>
          <div className="brand-subtitle">AI Certification for ATEC</div>
        </div>

        {isLoggedIn && (
          <div className="user-controls">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="role-switcher-badge">
                <Users size={16} />
                {currentUser.role === 'admin' ? '운영간사' : `심사위원 (${currentUser.specialty === 'business' ? '현업' : currentUser.specialty === 'tech' ? '기술' : '보안'})`} : <strong>{currentUser.name}</strong>
              </span>
              <button 
                className="btn-secondary" 
                onClick={handleLogout}
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem', marginLeft: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fda4af' }}
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==================== CORE VIEWS ==================== */}
      <main className="page-wrapper">
        
        {!isLoggedIn ? (
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
                  <Award size={36} />
                </div>
                <h2>AICA 자격심사 시스템</h2>
                <p>AI Certification for ATEC</p>
              </div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {loginError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: '#fda4af', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', textAlign: 'center' }}>
                    {loginError}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>성명 (ID) *</label>
                  <input 
                    type="text" 
                    placeholder="등록된 성명을 입력해 주세요" 
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>이메일 (Password) *</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="사내 이메일 주소를 입력해 주세요" 
                      value={loginPw}
                      onChange={(e) => setLoginPw(e.target.value)}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      title={showPassword ? '이메일 숨기기' : '이메일 표시하기'}
                      aria-label={showPassword ? '이메일 숨기기' : '이메일 표시하기'}
                    >
                      {showPassword ? <EyeOff size={18} color="var(--accent-secondary)" /> : <Eye size={18} color="var(--text-muted)" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                  시스템 로그인
                </button>
              </form>

              {/* Collapsable cheat sheet of mock users (Development Mode Only) */}
              {import.meta.env.DEV && (
                <div className="hint-box">
                  <div className="hint-title" onClick={() => setShowHint(!showHint)}>
                    <span>💡 [심사위원/간사 테스트 계정 정보 보기]</span>
                    <span>{showHint ? '▲' : '▼'}</span>
                  </div>
                  {showHint && (
                    <div className="hint-list">
                      <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '0.25rem', fontSize: '0.75rem' }}>[운영간사 계정]</div>
                      {initialUsers.filter(u => u.role === 'admin').map(u => (
                        <div className="hint-item" key={u.id}><span>{u.name} ({u.dept})</span> <code style={{ color: 'var(--accent-secondary)' }}>{u.email}</code></div>
                      ))}
                      
                      <div style={{ fontWeight: 'bold', color: 'white', marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '0.75rem' }}>[현업·사업성 심사위원]</div>
                      {initialUsers.filter(u => u.role === 'reviewer' && u.specialty === 'business').map(u => (
                        <div className="hint-item" key={u.id}><span>{u.name} ({u.dept})</span> <code style={{ color: 'var(--accent-secondary)' }}>{u.email}</code></div>
                      ))}
                      
                      <div style={{ fontWeight: 'bold', color: 'white', marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '0.75rem' }}>[AI·기술 심사위원]</div>
                      {initialUsers.filter(u => u.role === 'reviewer' && u.specialty === 'tech').map(u => (
                        <div className="hint-item" key={u.id}><span>{u.name} ({u.dept})</span> <code style={{ color: 'var(--accent-secondary)' }}>{u.email}</code></div>
                      ))}
                      
                      <div style={{ fontWeight: 'bold', color: 'white', marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '0.75rem' }}>[보안·거버넌스 심사위원]</div>
                      {initialUsers.filter(u => u.role === 'reviewer' && u.specialty === 'security').map(u => (
                        <div className="hint-item" key={u.id}><span>{u.name} ({u.dept})</span> <code style={{ color: 'var(--accent-secondary)' }}>{u.email}</code></div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* ==================== ADMIN VIEW ==================== */}
            {view === 'admin' && (
              <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2>AICA 자격심사 관리 & 대기 큐</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>6개 관계사 통합 AI 역량 자격 검증 현황을 관리합니다.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button 
                  className="btn-secondary" 
                  onClick={handleLoadSimulationData}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    background: 'rgba(99, 102, 241, 0.15)', 
                    border: '1px solid rgba(99, 102, 241, 0.4)', 
                    color: '#a5b4fc', 
                    padding: '0.5rem 0.85rem', 
                    fontSize: '0.85rem', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  title="가상의 시뮬레이션 데이터셋(후보자 9명 및 3인 패널 평가 결과)을 불러옵니다."
                >
                  <Database size={15} color="#a5b4fc" />
                  <span>시뮬레이션 데이터 불러오기</span>
                </button>

                <button 
                  className="btn-secondary" 
                  onClick={handleResetData}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    background: 'rgba(239, 68, 68, 0.12)', 
                    border: '1px solid rgba(239, 68, 68, 0.35)', 
                    color: '#fca5a5', 
                    padding: '0.5rem 0.85rem', 
                    fontSize: '0.85rem', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                  title="모든 평가 과제 및 결과를 초기화하여 신규 실무 운영 상태로 만듭니다."
                >
                  <RotateCcw size={15} color="#fca5a5" />
                  <span>데이터 초기화</span>
                </button>

                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setShowAddForm(true);
                    handleAutoAssignPanel('A');
                  }}
                >
                  + 신규 평가과제 등록 & 패널 배정
                </button>
              </div>
            </div>

            {/* Monthly Evaluation Schedule Calendar */}
            <MonthlyCalendar 
              currentUser={currentUser}
              candidatesList={candidatesList}
              committeesList={committeesList}
              onSelectSchedule={(cand, targetView) => {
                setSelectedCandidate(cand);
                if (targetView === 'report' && cand.status === '완료') {
                  setView('report');
                } else {
                  setAdminAffiliateFilter('all');
                  setAdminLevelFilter('all');
                  setAdminStatusFilter('all');
                  setView('admin');
                }
              }}
            />

            {/* Stats Dashboard Cards */}
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <div className="card stats-card" onClick={() => setStatsModalType('total')} title="클릭 시 전체 지원자 명단 보기">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>전체 지원자</span>
                  <Users size={20} color="var(--accent-primary)" />
                </div>
                <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{adminStats.total} 명</h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                  명단 보기 ➔
                </div>
              </div>
              <div className="card stats-card" onClick={() => setStatsModalType('completed')} title="클릭 시 평가 완료 명단 보기">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>평가 완료</span>
                  <CheckCircle2 size={20} color="var(--color-success)" />
                </div>
                <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{adminStats.completed} 명</h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                  명단 보기 ➔
                </div>
              </div>
              <div className="card stats-card" onClick={() => setStatsModalType('evaluating')} title="클릭 시 평가 진행 중 명단 보기">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>평가 진행 중</span>
                  <TrendingUp size={20} color="var(--color-info)" />
                </div>
                <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{adminStats.evaluating} 명</h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                  명단 보기 ➔
                </div>
              </div>
              <div className="card stats-card" onClick={() => setStatsModalType('pending')} title="클릭 시 심사 대기 명단 보기">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>심사 대기</span>
                  <HelpCircle size={20} color="var(--color-warning)" />
                </div>
                <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{adminStats.pending} 명</h2>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.25rem' }}>
                  명단 보기 ➔
                </div>
              </div>
            </div>

            {/* Dashboard Analytics & Graph */}
            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              <div className="card">
                <h3>관계사별 평가 완료자 평균 점수</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>완료된 심사 기준으로 실시간 산출됩니다.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {adminStats.affiliateAverages.map((aff, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ width: '120px', fontSize: '0.85rem' }}>{aff.affiliate}</span>
                      <div style={{ flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${aff.avg}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '6px' }}></div>
                      </div>
                      <span style={{ width: '60px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {aff.avg > 0 ? `${aff.avg} 점` : '자료없음'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>AICA 심사 평가 기준 요약</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-primary)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Level 3 (AI Champion) Rubric 가중치</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>문제해결 난이도(30%) + 구현 완성도(40%) + 확산 및 자산화(30%)</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-secondary)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Level 4 (AI Specialist) Rubric 가중치</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>기술적 구현력(40%) + 데이터 활용 및 보안(30%) + 비즈니스 기여도(30%)</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid var(--color-danger)' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>치명적 감점 및 결격 기준</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>개인정보(PII) 유출 노출, 사내 영업 비밀 노출, API Key 하드코딩 등의 항목 미준수 시 즉각 불합격 처리 권고.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Waiting Queue Table */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>자격심사 전체 큐 (Evaluation Queue)</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    value={adminAffiliateFilter} 
                    onChange={(e) => setAdminAffiliateFilter(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="all">모든 관계사</option>
                    {AFFILIATES.map(aff => <option key={aff.code} value={aff.code}>{aff.name}</option>)}
                  </select>
                  <select 
                    value={adminLevelFilter} 
                    onChange={(e) => setAdminLevelFilter(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="all">모든 레벨</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                  </select>
                  <select 
                    value={adminStatusFilter} 
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="all">모든 상태</option>
                    <option value="대기">대기</option>
                    <option value="평가중">평가중</option>
                    <option value="완료">완료</option>
                  </select>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>관계사</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>인증 레벨</th>
                    <th>배정된 심사위원 패널</th>
                    <th>상태</th>
                    <th>종합점수</th>
                    <th>판정</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatesList.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                        <Database size={36} color="var(--accent-primary)" style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>등록된 자격심사 과제가 없습니다 (초기화 상태)</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 1.25rem', lineHeight: '1.5' }}>
                          현재 실무 운영을 위한 깨끗한 초기 상태입니다. 우측 상단의 <strong>'+ 신규 평가과제 등록 & 패널 배정'</strong> 버튼을 클릭해 새 심사건을 추가하거나, <strong>'시뮬레이션 데이터 불러오기'</strong> 버튼을 눌러 가상 시연 데이터를 불러올 수 있습니다.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                            onClick={handleLoadSimulationData}
                          >
                            <Database size={14} /> 시뮬레이션 데이터 불러오기
                          </button>
                          <button 
                            className="btn-primary" 
                            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                            onClick={() => {
                              setShowAddForm(true);
                              handleAutoAssignPanel('A');
                            }}
                          >
                            + 신규 평가과제 등록 & 패널 배정
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    candidatesList
                      .filter(c => adminAffiliateFilter === 'all' || c.affiliate === adminAffiliateFilter)
                      .filter(c => adminLevelFilter === 'all' || c.level === parseInt(adminLevelFilter))
                      .filter(c => adminStatusFilter === 'all' || c.status === adminStatusFilter)
                      .map(cand => {
                      const comm = committeesList.find(co => co.candidateId === cand.id);
                      const res = evaluationResults.find(er => er.candidateId === cand.id);
                      
                      const r1 = initialUsers.find(u => u.id === comm?.reviewer1Id);
                      const r2 = initialUsers.find(u => u.id === comm?.reviewer2Id);
                      const r3 = initialUsers.find(u => u.id === comm?.reviewer3Id);

                      return (
                        <tr key={cand.id}>
                          <td>{AFFILIATES.find(a => a.code === cand.affiliate)?.name || cand.affiliate}</td>
                          <td><strong>{cand.name}</strong></td>
                          <td>{cand.dept}</td>
                          <td>
                            <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                              Level {cand.level}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {comm ? (
                              <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {renderReviewerBadge(r1, '현', comm.id, 'badge-specialty-business')}
                                {renderReviewerBadge(r2, '기', comm.id, 'badge-specialty-tech')}
                                {renderReviewerBadge(r3, '보', comm.id, 'badge-specialty-security')}
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>패널 미배정</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${
                              cand.status === '완료' ? 'badge-completed' : 
                              cand.status === '평가중' ? 'badge-inprogress' : 'badge-pending'
                            }`}>
                              {cand.status}
                            </span>
                          </td>
                          <td><strong>{res ? `${res.averageScore} 점` : '-'}</strong></td>
                          <td>
                            {res ? (
                              <span className={`badge ${res.passStatus === '불합격' ? 'badge-fail' : 'badge-completed'}`}>
                                {res.passStatus}
                              </span>
                            ) : '-'}
                          </td>
                          <td>
                            {cand.status === '완료' ? (
                              <button 
                                className="btn-secondary" 
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                onClick={() => {
                                  setSelectedCandidate(cand);
                                  setView('report');
                                }}
                              >
                                <FileText size={12} />
                                보고서 보기
                              </button>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>평가대기</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {statsModalType !== null && (
              <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: '900px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Users size={20} />
                      {statsModalType === 'total' && '전체 지원자 세부 정보'}
                      {statsModalType === 'completed' && '평가 완료 인원 세부 정보'}
                      {statsModalType === 'evaluating' && '평가 진행 중 인원 세부 정보'}
                      {statsModalType === 'pending' && '심사 대기 인원 세부 정보'}
                      {' '}({
                        candidatesList.filter(c => 
                          statsModalType === 'total' ? true :
                          statsModalType === 'completed' ? c.status === '완료' :
                          statsModalType === 'evaluating' ? c.status === '평가중' :
                          c.status === '대기'
                        ).length
                      }명)
                    </h3>
                    <button 
                      className="btn-secondary" 
                      onClick={() => setStatsModalType(null)}
                      style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>관계사</th>
                          <th>성명</th>
                          <th>부서</th>
                          <th>레벨</th>
                          <th>제출 과제명</th>
                          <th>심사 패널</th>
                          <th>상태</th>
                          <th>종합점수</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatesList
                          .filter(c => 
                            statsModalType === 'total' ? true :
                            statsModalType === 'completed' ? c.status === '완료' :
                            statsModalType === 'evaluating' ? c.status === '평가중' :
                            c.status === '대기'
                          )
                          .map(cand => {
                            const comm = committeesList.find(co => co.candidateId === cand.id);
                            const res = evaluationResults.find(er => er.candidateId === cand.id);
                            const sub = submissionsList.find(s => s.candidateId === cand.id);
                            
                            const r1 = initialUsers.find(u => u.id === comm?.reviewer1Id);
                            const r2 = initialUsers.find(u => u.id === comm?.reviewer2Id);
                            const r3 = initialUsers.find(u => u.id === comm?.reviewer3Id);

                            return (
                              <tr key={cand.id}>
                                <td>{AFFILIATES.find(a => a.code === cand.affiliate)?.name || cand.affiliate}</td>
                                <td><strong>{cand.name}</strong></td>
                                <td>{cand.dept}</td>
                                <td>
                                  <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                                    Level {cand.level}
                                  </span>
                                </td>
                                <td style={{ fontSize: '0.8rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={sub?.title}>
                                  {sub?.title || '-'}
                                </td>
                                <td>
                                  {comm ? (
                                    <div style={{ display: 'flex', gap: '0.25rem', fontSize: '0.75rem' }}>
                                      {renderReviewerBadge(r1, '현', comm.id, 'badge-specialty-business')}
                                      {renderReviewerBadge(r2, '기', comm.id, 'badge-specialty-tech')}
                                      {renderReviewerBadge(r3, '보', comm.id, 'badge-specialty-security')}
                                    </div>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>패널 미배정</span>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${
                                    cand.status === '완료' ? 'badge-completed' : 
                                    cand.status === '평가중' ? 'badge-inprogress' : 'badge-pending'
                                  }`}>
                                    {cand.status}
                                  </span>
                                </td>
                                <td><strong>{res ? `${res.averageScore} 점` : '-'}</strong></td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => setStatsModalType(null)}
                      style={{ padding: '0.5rem 1.5rem' }}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showAddForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Award size={20} />
                      신규 AICA 평가과제 등록 및 심사패널 배정
                    </h3>
                    <button 
                      className="btn-secondary" 
                      onClick={() => setShowAddForm(false)}
                      style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>지원자 성명 *</label>
                      <input 
                        type="text" 
                        placeholder="예: 홍길동"
                        value={newCandName} 
                        onChange={(e) => setNewCandName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label>이메일 *</label>
                      <input 
                        type="text" 
                        placeholder="예: kd.hong@atec.kr"
                        value={newCandEmail} 
                        onChange={(e) => setNewCandEmail(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>소속 관계사 *</label>
                      <select 
                        value={newCandAffiliate} 
                        onChange={(e) => setNewCandAffiliate(e.target.value)}
                      >
                        {AFFILIATES.map(aff => (
                          <option key={aff.code} value={aff.code}>{aff.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>소속 부서 *</label>
                      <input 
                        type="text" 
                        placeholder="예: 경영혁신팀"
                        value={newCandDept} 
                        onChange={(e) => setNewCandDept(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>자격 인증 레벨 *</label>
                      <select 
                        value={newCandLevel} 
                        onChange={(e) => setNewCandLevel(parseInt(e.target.value) as 3 | 4)}
                      >
                        <option value={3}>Level 3 (AI Champion)</option>
                        <option value={4}>Level 4 (AI Specialist)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>과제 유형 *</label>
                      <select 
                        value={newSubCategory} 
                        onChange={(e) => setNewSubCategory(e.target.value as any)}
                      >
                        <option value="RAG/챗봇">RAG/챗봇 (사내 지식 질의 등)</option>
                        <option value="데이터분석">데이터분석 (수요 예측 등)</option>
                        <option value="웹/앱">웹/앱 (AI 인터페이스 구현)</option>
                        <option value="업무자동화">업무자동화 (RPA & LLM 연동)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>심사 예정일자 (evalDate) *</label>
                      <input 
                        type="date" 
                        value={newCandEvalDate} 
                        onChange={(e) => setNewCandEvalDate(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>평가 대상 과제명 *</label>
                    <input 
                      type="text" 
                      placeholder="예: LLM을 활용한 사내 업무 효율화 RAG 챗봇 구축"
                      value={newSubTitle} 
                      onChange={(e) => setNewSubTitle(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Pain Point (현업 애로사항 요약) *</label>
                    <textarea 
                      rows={2}
                      placeholder="기존 업무에서 발생하던 문제점과 수동 공수를 설명해주세요."
                      value={newSubPainPoint}
                      onChange={(e) => setNewSubPainPoint(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>AI 해결 방안 (Solution 핵심 로직) *</label>
                    <textarea 
                      rows={2}
                      placeholder="어떤 AI 모델, 프롬프트, RAG 아키텍처 등을 사용해 해결했는지 기술해주세요."
                      value={newSubSolution}
                      onChange={(e) => setNewSubSolution(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>보고서 요약 (6S 기준 핵심 요약) *</label>
                    <textarea 
                      rows={2}
                      placeholder="과제의 기대효과, 비즈니스 기여도 및 자산화 가능성을 기술해주세요."
                      value={newSubReportSummary}
                      onChange={(e) => setNewSubReportSummary(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>소스코드 디렉토리 구조 (선택)</label>
                    <textarea 
                      rows={2}
                      placeholder="├── src/&#10;├── main.py&#10;└── config.json"
                      value={newSubCodeStructure}
                      onChange={(e) => setNewSubCodeStructure(e.target.value)}
                      style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>보고서 문서 링크 (PDF)</label>
                      <input 
                        type="text" 
                        value={newSubReportUrl} 
                        onChange={(e) => setNewSubReportUrl(e.target.value)} 
                      />
                    </div>
                    <div className="form-group">
                      <label>Git 소스코드 리포지토리 링크</label>
                      <input 
                        type="text" 
                        value={newSubCodeUrl} 
                        onChange={(e) => setNewSubCodeUrl(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>시연 동영상 링크 (URL)</label>
                    <input 
                      type="text" 
                      value={newSubDemoUrl} 
                      onChange={(e) => setNewSubDemoUrl(e.target.value)} 
                    />
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-color)', borderRadius: '4px', padding: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>
                        🛡️ 이해상충 방지 심사패널 배정
                      </h4>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', minWidth: 'auto' }}
                        onClick={() => handleAutoAssignPanel(newCandAffiliate)}
                      >
                        ⚡ 최적 패널 자동 추천
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: 0 }}>
                      * 공정한 자격 검정을 위해 피평가자와 동일한 관계사 소속 위원을 배제하여 패널을 우선 배정합니다.
                    </p>

                    <div className="form-row">
                      <div className="form-group">
                        <label>현업·사업성 심사위원 (1인) *</label>
                        <select 
                          value={newReviewer1} 
                          onChange={(e) => setNewReviewer1(e.target.value)}
                        >
                          <option value="">-- 선택 --</option>
                          {initialUsers.filter(u => u.role === 'reviewer' && u.specialty === 'business').map(u => {
                            const isConflict = u.affiliate === newCandAffiliate;
                            const affName = AFFILIATES.find(a => a.code === u.affiliate)?.name || u.affiliate;
                            return (
                              <option key={u.id} value={u.id} style={{ color: isConflict ? '#ef4444' : 'inherit' }}>
                                {u.name} ({u.dept} - {affName}){isConflict ? ' [이해상충 주의]' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>AI·기술 심사위원 (1인) *</label>
                        <select 
                          value={newReviewer2} 
                          onChange={(e) => setNewReviewer2(e.target.value)}
                        >
                          <option value="">-- 선택 --</option>
                          {initialUsers.filter(u => u.role === 'reviewer' && u.specialty === 'tech').map(u => {
                            const isConflict = u.affiliate === newCandAffiliate;
                            const affName = AFFILIATES.find(a => a.code === u.affiliate)?.name || u.affiliate;
                            return (
                              <option key={u.id} value={u.id} style={{ color: isConflict ? '#ef4444' : 'inherit' }}>
                                {u.name} ({u.dept} - {affName}){isConflict ? ' [이해상충 주의]' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>보안·거버넌스 심사위원 (1인) *</label>
                      <select 
                        value={newReviewer3} 
                        onChange={(e) => setNewReviewer3(e.target.value)}
                      >
                        <option value="">-- 선택 --</option>
                        {initialUsers.filter(u => u.role === 'reviewer' && u.specialty === 'security').map(u => {
                          const isConflict = u.affiliate === newCandAffiliate;
                          const affName = AFFILIATES.find(a => a.code === u.affiliate)?.name || u.affiliate;
                          return (
                            <option key={u.id} value={u.id} style={{ color: isConflict ? '#ef4444' : 'inherit' }}>
                              {u.name} ({u.dept} - {affName}){isConflict ? ' [이해상충 주의]' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ flex: 1 }}
                      onClick={() => setShowAddForm(false)}
                    >
                      취소
                    </button>
                    <button 
                      type="button" 
                      className="btn-primary" 
                      style={{ flex: 2 }}
                      onClick={handleRegisterTask}
                    >
                      과제 등록 및 심사 배정 완료
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== REVIEWER QUEUE VIEW ==================== */}
        {view === 'reviewer' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2>AICA 심사위원 배정 과제 큐 & 월별 일정</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                심사위원 <strong>{currentUser.name}</strong> 님에게 배정된 AICA Level 3 & 4 자격검정 일정 및 리스트입니다.
              </p>
            </div>

            {/* Monthly Evaluation Schedule Calendar */}
            <MonthlyCalendar 
              currentUser={currentUser}
              candidatesList={candidatesList}
              committeesList={committeesList}
              onSelectSchedule={(cand, targetView) => {
                setSelectedCandidate(cand);
                if (targetView === 'evaluate') {
                  setView('evaluate');
                } else if (targetView === 'report' && cand.status === '완료') {
                  setView('report');
                } else {
                  setView('reviewer');
                }
              }}
            />

            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>관계사</th>
                    <th>지원자</th>
                    <th>부서</th>
                    <th>인증 레벨</th>
                    <th>제출 과제명</th>
                    <th>내 심사 상태</th>
                    <th>타 위원 진척도</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatesList.filter(c => {
                    const comm = committeesList.find(co => co.candidateId === c.id);
                    return comm?.reviewer1Id === currentUser.id || comm?.reviewer2Id === currentUser.id || comm?.reviewer3Id === currentUser.id;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                        <Database size={36} color="var(--accent-primary)" style={{ marginBottom: '0.75rem', opacity: 0.6 }} />
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>배정된 자격심사 과제가 없습니다</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                          운영간사가 신규 평가과제를 등록하고 패널을 배정하면 해당 심사건이 여기에 자동으로 정렬됩니다.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    candidatesList
                      .filter(c => {
                        const comm = committeesList.find(co => co.candidateId === c.id);
                        return comm?.reviewer1Id === currentUser.id || comm?.reviewer2Id === currentUser.id || comm?.reviewer3Id === currentUser.id;
                      })
                      .map(cand => {
                      const comm = committeesList.find(co => co.candidateId === cand.id);
                      const sub = submissionsList.find(s => s.candidateId === cand.id);
                      
                      // Check if current reviewer submitted score
                      const myScore = scoresList.find(s => s.committeeId === comm?.id && s.reviewerId === currentUser.id);
                      const allScoresForCom = scoresList.filter(s => s.committeeId === comm?.id);
                      
                      return (
                        <tr key={cand.id}>
                          <td>{AFFILIATES.find(a => a.code === cand.affiliate)?.name || cand.affiliate}</td>
                          <td><strong>{cand.name}</strong></td>
                          <td>{cand.dept}</td>
                          <td>
                            <span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                              Level {cand.level}
                            </span>
                          </td>
                          <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {sub?.title}
                          </td>
                          <td>
                            {myScore ? (
                              <span className="badge badge-completed">심사완료 ({myScore.totalScore}점)</span>
                            ) : (
                              <span className="badge badge-pending">대기</span>
                            )}
                          </td>
                          <td>
                            <span className="badge badge-inprogress">
                              {allScoresForCom.length} / 3 제출
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-primary" 
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                              onClick={() => {
                                setSelectedCandidate(cand);
                                setView('evaluate');
                              }}
                            >
                              <Scale size={14} />
                              {myScore ? '심사 수정' : '심사 시작'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== EVALUATE WORKSPACE VIEW ==================== */}
        {view === 'evaluate' && selectedCandidate && currentSubmission && currentCommittee && (
          <div className="workspace-layout">
            
            {/* LEFT PANEL: Candidate Report & Code Artifacts & Security Check */}
            <div className="workspace-panel card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="btn-secondary" style={{ padding: '0.25rem 0.5rem' }} onClick={() => setView('reviewer')}>
                    <ArrowLeft size={16} />
                  </button>
                  <h3 style={{ fontSize: '1.1rem' }}>
                    [{AFFILIATES.find(a => a.code === selectedCandidate.affiliate)?.name || selectedCandidate.affiliate}] {selectedCandidate.name} 지원자 (Level {selectedCandidate.level})
                  </h3>
                </div>
                <span className="badge badge-inprogress">과제 제출물 검토</span>
              </div>

              {/* Tab Selector */}
              <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <button 
                  className={activeTab === 'report' ? 'btn-primary' : 'btn-secondary'} 
                  style={{ flex: 1, padding: '0.35rem 0', fontSize: '0.8rem' }}
                  onClick={() => setActiveTab('report')}
                >
                  <FileText size={14} /> 보고서 요약
                </button>
                <button 
                  className={activeTab === 'code' ? 'btn-primary' : 'btn-secondary'} 
                  style={{ flex: 1, padding: '0.35rem 0', fontSize: '0.8rem' }}
                  onClick={() => setActiveTab('code')}
                >
                  <Code size={14} /> 소스코드 구조
                </button>
                <button 
                  className={activeTab === 'video' ? 'btn-primary' : 'btn-secondary'} 
                  style={{ flex: 1, padding: '0.35rem 0', fontSize: '0.8rem' }}
                  onClick={() => setActiveTab('video')}
                >
                  <Video size={14} /> 시연 & 링크
                </button>
              </div>

              {/* Tab Content body */}
              <div className="workspace-panel-body" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', paddingBottom: '1rem' }}>
                {activeTab === 'report' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--accent-secondary)' }}>과제 제안명: </strong>
                      {currentSubmission.title}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <span>📅 <strong>과제 제출 일시:</strong> {currentSubmission.submittedAt}</span>
                      <span>⏱️ <strong>심사 시행 일자:</strong> {selectedCandidate.evalDate || '2026-07-22'}</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>1. Pain Point (현업 애로사항):</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{currentSubmission.painPoint}</p>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>2. AI Solution (해결 방안):</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>{currentSubmission.solution}</p>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>3. 보고서 주요 본문 (6S 기준 요약):</strong>
                      <pre style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: 'var(--text-secondary)', fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                        {currentSubmission.reportSummary}
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>제출 소스코드 아키텍처 구조 (Git Repository Cloned)</h4>
                    <pre style={{ 
                      background: '#090d16', 
                      padding: '1rem', 
                      borderRadius: '6px', 
                      fontFamily: 'Courier New, monospace', 
                      fontSize: '0.8rem', 
                      color: '#a7f3d0',
                      border: '1px solid rgba(255,255,255,0.05)',
                      overflowX: 'auto'
                    }}>
                      {currentSubmission.codeStructure}
                    </pre>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <p>💡 <em>심사위원 기술 팁:</em> 소스코드 내 `requirements.txt` 또는 `package-lock.json` 등 패키지 잠금 내역 및 `env.example` 환경변수 구성도를 확인하십시오.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'video' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>시연 동영상 모의 플레이어 (Demo Sandbox)</h4>
                      <div style={{ width: '100%', height: '180px', background: '#020617', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Video size={36} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>[AICA_Level{selectedCandidate.level}_Demo_Play.mp4]</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>크기: 45MB / 재생 시간: 2분 15초</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem' }}>과제 증빙용 하이퍼링크</h4>
                      <div style={{ fontSize: '0.8rem' }}>
                        <div>🔗 <strong>결과 보고서 원본 (GW PDF): </strong> <a href={currentSubmission.reportUrl} target="_blank" rel="noreferrer">{currentSubmission.reportUrl}</a></div>
                        <div style={{ marginTop: '0.25rem' }}>🔗 <strong>코드 저장소 (GitLab): </strong> <a href={currentSubmission.codeUrl} target="_blank" rel="noreferrer">{currentSubmission.codeUrl}</a></div>
                        <div style={{ marginTop: '0.25rem' }}>🔗 <strong>실제 구동 데모 (사내 Sandbox): </strong> <a href={currentSubmission.demoUrl} target="_blank" rel="noreferrer">{currentSubmission.demoUrl}</a></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM SECTION: 5-item Security and Compliance Checklist */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fca5a5' }}>
                  <ShieldCheck size={16} /> 
                  AICA 공통 보안성 & 자격요건 검증 (필수)
                </h4>
                
                <div style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={secCheck1} onChange={(e) => setSecCheck1(e.target.checked)} />
                    <span className="checkbox-custom"></span>
                    <span>1. 고객명, 임직원 실명, 전화번호 등 개인정보(PII)가 마스킹 처리되었는가?</span>
                  </label>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={secCheck2} onChange={(e) => setSecCheck2(e.target.checked)} />
                    <span className="checkbox-custom"></span>
                    <span>2. 구체적인 계약 금액, 단가, 마진율 등 영업비밀 및 미공개 코드명이 익명화되었는가?</span>
                  </label>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={secCheck3} onChange={(e) => setSecCheck3(e.target.checked)} />
                    <span className="checkbox-custom"></span>
                    <span>3. 소스코드 및 프롬프트 내에 API Key, 접속 계정 정보(ID/PW)가 은닉/제거되었는가?</span>
                  </label>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={secCheck4} onChange={(e) => setSecCheck4(e.target.checked)} />
                    <span className="checkbox-custom"></span>
                    <span>4. 사내 보안 가이드를 완벽히 숙지하고 점검표를 성실히 제출하였는가?</span>
                  </label>
                  <label className="checkbox-container">
                    <input type="checkbox" checked={secCheck5} onChange={(e) => setSecCheck5(e.target.checked)} />
                    <span className="checkbox-custom"></span>
                    <span>5. 결과물이 다른 부서에서 사용 시에 정보 유출 및 망 분리 보안 리스크가 없는가?</span>
                  </label>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="보안 검토 관련 특이사항 기록 (선택)" 
                    value={secNotes}
                    onChange={(e) => setSecNotes(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-color)',
                      color: 'white',
                      borderRadius: '4px',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.8rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Interactive Rubric Scoring & Question Bank */}
            <div className="workspace-panel card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem' }}>루브릭 채점 & 질문 가이드</h3>
                <span className="badge badge-specialty-tech">실시간 평가 엔진</span>
              </div>

              {/* Rubric Evaluation Form */}
              <div className="workspace-panel-body">
                
                {/* Score Deviation Warning Alert */}
                {checkScoreDeviation().warn && (
                  <div className="risk-flag-alert" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', color: '#fef08a', animation: 'none' }}>
                    <AlertTriangle size={18} />
                    <div style={{ fontSize: '0.8rem' }}>
                      <strong>패널 점수 편차 경고:</strong> 다른 심사위원의 제출 점수와 <strong>{checkScoreDeviation().diff}점</strong> 차이가 납니다 (임계값 15점). 평가 합의 조율 의견 작성을 권장합니다.
                    </div>
                  </div>
                )}

                {/* Disqualification / Plagiarism Trigger */}
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                  <label className="checkbox-container" style={{ marginBottom: '0px' }}>
                    <input type="checkbox" checked={isDisqualified} onChange={(e) => setIsDisqualified(e.target.checked)} />
                    <span className="checkbox-custom" style={{ borderColor: 'var(--color-danger)' }}></span>
                    <span style={{ color: '#fda4af', fontWeight: 'bold' }}>⚠️ 중대한 결격사유 발견 (표절, 도용, 허위 실적 등)</span>
                  </label>
                  {isDisqualified && (
                    <input 
                      type="text" 
                      placeholder="결격 사유 상세 기록 (불합격 처리됩니다)" 
                      value={disqReason}
                      onChange={(e) => setDisqReason(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--color-danger)',
                        color: '#fca5a5',
                        borderRadius: '4px',
                        padding: '0.35rem 0.5rem',
                        fontSize: '0.8rem',
                        marginTop: '0.5rem',
                        fontFamily: 'inherit'
                      }}
                    />
                  )}
                </div>

                {/* Rubric criteria depending on Level */}
                {selectedCandidate.level === 3 ? (
                  // Level 3 Rubrics
                  <>
                    {/* CRITERION 1: Complexity (30%) */}
                    <div className="rubric-score-container">
                      <div className="rubric-score-header">
                        <strong>1. 문제 해결 난이도 (가중치 30%)</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{currentScore1}점</span>
                      </div>
                      <div className="rubric-radio-group">
                        <div className={`rubric-radio-label ${currentScore1 === 100 ? 'selected' : ''}`} onClick={() => setCurrentScore1(100)}>
                          <span className="rubric-radio-title">탁월 (100점)</span>
                          <span className="rubric-radio-desc">RAG, API 연동 등 2개 이상 심화 기능 유기적 결합, 프로세스 단축/재설계 명확</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 85 ? 'selected' : ''}`} onClick={() => setCurrentScore1(85)}>
                          <span className="rubric-radio-title">양호 (85점)</span>
                          <span className="rubric-radio-desc">심화 기능 1개 이상 활용, 업무 문제 해결과의 인과성이 입증됨</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 70 ? 'selected' : ''}`} onClick={() => setCurrentScore1(70)}>
                          <span className="rubric-radio-title">보통 (70점)</span>
                          <span className="rubric-radio-desc">단순 질의응답 수준 극복 시도, 복합 활용은 제한적</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 50 ? 'selected' : ''}`} onClick={() => setCurrentScore1(50)}>
                          <span className="rubric-radio-title">미흡 (50점)</span>
                          <span className="rubric-radio-desc">단순 API 호출 및 프롬프트 1~2개 구성에 그침, 프로세스 개선 효과 모호</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 30 ? 'selected' : ''}`} onClick={() => setCurrentScore1(30)}>
                          <span className="rubric-radio-title">부족 (30점)</span>
                          <span className="rubric-radio-desc">AI 기술 미적용 또는 단순 복사 수준, 업무 현안과의 인과관계 없음</span>
                        </div>
                      </div>
                      <textarea 
                        placeholder="난이도 평가 의견 작성..." 
                        value={comments1}
                        onChange={(e) => setComments1(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'none', height: '50px' }}
                      />
                    </div>

                    {/* CRITERION 2: Implementation (40%) */}
                    <div className="rubric-score-container">
                      <div className="rubric-score-header">
                        <strong>2. 구현 완성도 (가중치 40%)</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{currentScore2}점</span>
                      </div>
                      <div className="rubric-radio-group">
                        <div className={`rubric-radio-label ${currentScore2 === 100 ? 'selected' : ''}`} onClick={() => setCurrentScore2(100)}>
                          <span className="rubric-radio-title">탁월 (100점)</span>
                          <span className="rubric-radio-desc">에러 없이 구동 및 예외상황 완벽 제어, 비전문가도 즉시 사용 가능한 UX</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 85 ? 'selected' : ''}`} onClick={() => setCurrentScore2(85)}>
                          <span className="rubric-radio-title">양호 (85점)</span>
                          <span className="rubric-radio-desc">주요 시나리오 정상 작동, 일부 UI 복잡함이 존재</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 70 ? 'selected' : ''}`} onClick={() => setCurrentScore2(70)}>
                          <span className="rubric-radio-title">보통 (70점)</span>
                          <span className="rubric-radio-desc">동작 가능하나 에러 및 수동 보정이 잦고 UI 진입장벽 있음</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 50 ? 'selected' : ''}`} onClick={() => setCurrentScore2(50)}>
                          <span className="rubric-radio-title">미흡 (50점)</span>
                          <span className="rubric-radio-desc">핵심 기능 작동하나 수동 조작 및 에러 빈번, 직관성 떨어지는 UI/UX</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 30 ? 'selected' : ''}`} onClick={() => setCurrentScore2(30)}>
                          <span className="rubric-radio-title">부족 (30점)</span>
                          <span className="rubric-radio-desc">실행 불가하거나 주요 기능 오작동, 복합적 가독성 결여</span>
                        </div>
                      </div>
                      <textarea 
                        placeholder="구현 완성도 평가 의견 작성..." 
                        value={comments2}
                        onChange={(e) => setComments2(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'none', height: '50px' }}
                      />
                    </div>

                    {/* CRITERION 3: Assetization (30%) */}
                    <div className="rubric-score-container">
                      <div className="rubric-score-header">
                        <strong>3. 확산 및 자산화 (가중치 30%)</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{currentScore3}점</span>
                      </div>
                      <div className="rubric-radio-group">
                        <div className={`rubric-radio-label ${currentScore3 === 100 ? 'selected' : ''}`} onClick={() => setCurrentScore3(100)}>
                          <span className="rubric-radio-title">탁월 (100점)</span>
                          <span className="rubric-radio-desc">상세 매뉴얼 지식포털 등록 완료, 팀원 대상 전파 교육/코칭 실적 확인</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 85 ? 'selected' : ''}`} onClick={() => setCurrentScore3(85)}>
                          <span className="rubric-radio-title">양호 (85점)</span>
                          <span className="rubric-radio-desc">기본 매뉴얼 존재하나 세부 장애 정보 부족, 교육 1회 이상 진행</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 70 ? 'selected' : ''}`} onClick={() => setCurrentScore3(70)}>
                          <span className="rubric-radio-title">보통 (70점)</span>
                          <span className="rubric-radio-desc">단편적 설명서 존재, 전파 의도는 있으나 교육 실적이 저조함</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 50 ? 'selected' : ''}`} onClick={() => setCurrentScore3(50)}>
                          <span className="rubric-radio-title">미흡 (50점)</span>
                          <span className="rubric-radio-desc">개인용으로만 사용되며 전파 교육 미실시, 단순 메모 수준의 설명서</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 30 ? 'selected' : ''}`} onClick={() => setCurrentScore3(30)}>
                          <span className="rubric-radio-title">부족 (30점)</span>
                          <span className="rubric-radio-desc">매뉴얼 및 산출물 부재, 확산 및 자산화 의지 없음</span>
                        </div>
                      </div>
                      <textarea 
                        placeholder="자산화/확산 평가 의견 작성..." 
                        value={comments3}
                        onChange={(e) => setComments3(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'none', height: '50px' }}
                      />
                    </div>
                  </>
                ) : (
                  // Level 4 Rubrics
                  <>
                    {/* CRITERION 1: Engineering (40%) */}
                    <div className="rubric-score-container">
                      <div className="rubric-score-header">
                        <strong>1. 기술적 구현력 (가중치 40%)</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{currentScore1}점</span>
                      </div>
                      <div className="rubric-radio-group">
                        <div className={`rubric-radio-label ${currentScore1 === 100 ? 'selected' : ''}`} onClick={() => setCurrentScore1(100)}>
                          <span className="rubric-radio-title">탁월 (100점)</span>
                          <span className="rubric-radio-desc">모듈화, 주석, 예외처리 명확, 파인튜닝/하이브리드 RAG 적절 적용</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 85 ? 'selected' : ''}`} onClick={() => setCurrentScore1(85)}>
                          <span className="rubric-radio-title">양호 (85점)</span>
                          <span className="rubric-radio-desc">핵심 로직 명확하나 모듈화 미흡, AI 기법 적용 있으나 근거 부족</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 70 ? 'selected' : ''}`} onClick={() => setCurrentScore1(70)}>
                          <span className="rubric-radio-title">보통 (70점)</span>
                          <span className="rubric-radio-desc">작동 가능하나 복잡도 및 가독성 저조, 단순 챗봇 기능 모방</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 50 ? 'selected' : ''}`} onClick={() => setCurrentScore1(50)}>
                          <span className="rubric-radio-title">미흡 (50점)</span>
                          <span className="rubric-radio-desc">기본 프레임워크 래핑 수준, 모듈화 및 예외처리 부실, 코드 가독성 낮음</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore1 === 30 ? 'selected' : ''}`} onClick={() => setCurrentScore1(30)}>
                          <span className="rubric-radio-title">부족 (30점)</span>
                          <span className="rubric-radio-desc">구조적 결함으로 유지보수 불가, AI 기술 활용 미달</span>
                        </div>
                      </div>
                      <textarea 
                        placeholder="엔지니어링 평가 의견 작성..." 
                        value={comments1}
                        onChange={(e) => setComments1(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'none', height: '50px' }}
                      />
                    </div>

                    {/* CRITERION 2: Security (30%) */}
                    <div className="rubric-score-container">
                      <div className="rubric-score-header">
                        <strong>2. 데이터 활용 및 보안 (가중치 30%)</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{currentScore2}점</span>
                      </div>
                      <div className="rubric-radio-group">
                        <div className={`rubric-radio-label ${currentScore2 === 100 ? 'selected' : ''}`} onClick={() => setCurrentScore2(100)}>
                          <span className="rubric-radio-title">탁월 (100점)</span>
                          <span className="rubric-radio-desc">데이터 정합성 및 최신성 우수, 완벽한 개인정보 마스킹, 권한 및 소스코드 보안 검토 완료</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 85 ? 'selected' : ''}`} onClick={() => setCurrentScore2(85)}>
                          <span className="rubric-radio-title">양호 (85점)</span>
                          <span className="rubric-radio-desc">전처리 양호하나 관리 절차 문서 부족, 핵심 보안 필터 적용</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 70 ? 'selected' : ''}`} onClick={() => setCurrentScore2(70)}>
                          <span className="rubric-radio-title">보통 (70점)</span>
                          <span className="rubric-radio-desc">데이터 전처리 모호, 보안 제어 부실하나 치명적 유출은 없음</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 50 ? 'selected' : ''}`} onClick={() => setCurrentScore2(50)}>
                          <span className="rubric-radio-title">미흡 (50점)</span>
                          <span className="rubric-radio-desc">데이터 전처리 및 정합성 검증 부실, 기본적인 개인정보/비밀 유출 위험 노출</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore2 === 30 ? 'selected' : ''}`} onClick={() => setCurrentScore2(30)}>
                          <span className="rubric-radio-title">부족 (30점)</span>
                          <span className="rubric-radio-desc">소스코드 내 중요 비밀 자격증명(API Key) 방치, 중대한 보안 취약점 존재</span>
                        </div>
                      </div>
                      <textarea 
                        placeholder="데이터/보안 평가 의견 작성..." 
                        value={comments2}
                        onChange={(e) => setComments2(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'none', height: '50px' }}
                      />
                    </div>

                    {/* CRITERION 3: Impact (30%) */}
                    <div className="rubric-score-container">
                      <div className="rubric-score-header">
                        <strong>3. 비즈니스 기여도 (가중치 30%)</strong>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{currentScore3}점</span>
                      </div>
                      <div className="rubric-radio-group">
                        <div className={`rubric-radio-label ${currentScore3 === 100 ? 'selected' : ''}`} onClick={() => setCurrentScore3(100)}>
                          <span className="rubric-radio-title">탁월 (100점)</span>
                          <span className="rubric-radio-desc">현업 도입 비용절감/품질향상 수치 입증(부서장 날인), 타 계열사 즉시 이식 가능</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 85 ? 'selected' : ''}`} onClick={() => setCurrentScore3(85)}>
                          <span className="rubric-radio-title">양호 (85점)</span>
                          <span className="rubric-radio-desc">일부 실적 입증 완료, 재사용성 있으나 일부 모듈 수정 필요</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 70 ? 'selected' : ''}`} onClick={() => setCurrentScore3(70)}>
                          <span className="rubric-radio-title">보통 (70점)</span>
                          <span className="rubric-radio-desc">기술 시연 수준에 가깝고 비즈니스 개선 성과가 불명확함</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 50 ? 'selected' : ''}`} onClick={() => setCurrentScore3(50)}>
                          <span className="rubric-radio-title">미흡 (50점)</span>
                          <span className="rubric-radio-desc">실무 적용 성과가 객관적 수치로 증빙되지 않음, 재사용이 극히 제한됨</span>
                        </div>
                        <div className={`rubric-radio-label ${currentScore3 === 30 ? 'selected' : ''}`} onClick={() => setCurrentScore3(30)}>
                          <span className="rubric-radio-title">부족 (30점)</span>
                          <span className="rubric-radio-desc">비즈니스 기여도 제로, 시연용 장난감(Toy project) 수준에 그침</span>
                        </div>
                      </div>
                      <textarea 
                        placeholder="기여도 및 확장성 평가 의견 작성..." 
                        value={comments3}
                        onChange={(e) => setComments3(e.target.value)}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', fontFamily: 'inherit', resize: 'none', height: '50px' }}
                      />
                    </div>
                  </>
                )}

                {/* Question Bank Assistant (질문은행) */}
                <div style={{ marginTop: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-secondary)' }}>
                    <BookOpen size={16} />
                    심사 면접용 질문은행 도우미 (Question Bank)
                  </h4>
                  
                  {/* Category Filter inside question bank */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input 
                      type="text" 
                      placeholder="질문 검색..." 
                      value={qSearchText}
                      onChange={(e) => setQSearchText(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontFamily: 'inherit'
                      }}
                    />
                    <select
                      value={qCategoryFilter}
                      onChange={(e) => setQCategoryFilter(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem'
                      }}
                    >
                      <option value="all">모든 분류</option>
                      <option value="문제정의">문제정의</option>
                      <option value="기술구현">기술구현</option>
                      <option value="데이터/보안">데이터/보안</option>
                      <option value="사업성/효과">사업성/효과</option>
                      <option value="확산/운영">확산/운영</option>
                    </select>
                  </div>

                  {/* Question Scroll area */}
                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                    {questions
                      .filter(q => q.level === selectedCandidate.level)
                      .filter(q => qCategoryFilter === 'all' || q.category === qCategoryFilter)
                      .filter(q => qSearchText === '' || q.question.includes(qSearchText) || q.rationale.includes(qSearchText))
                      .map((q, idx) => (
                        <div key={q.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '6px', padding: '0.65rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                            <span><strong>Q{idx + 1}. [{q.category}]</strong> {q.id}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginBottom: '0.35rem', fontWeight: '500' }}>
                            {q.question}
                          </p>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '0.25rem' }}>
                            <div>🎯 <strong>질문 의도:</strong> {q.rationale}</div>
                            <div style={{ color: 'var(--color-success)', marginTop: '0.15rem' }}>🟢 <strong>고득점 기준:</strong> {q.highCriteria}</div>
                            <div style={{ color: 'var(--color-danger)', marginTop: '0.15rem' }}>🔴 <strong>저득점 기준:</strong> {q.lowCriteria}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Panel status dashboard */}
                <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>타 심사위원 평가 상태 (패널 합의 지원)</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {getOtherReviewersScores().length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>아직 다른 심사위원이 평가를 제출하지 않았습니다.</p>
                    ) : (
                      getOtherReviewersScores().map((os, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.35rem 0.5rem', borderRadius: '4px' }}>
                          <span>{os.name} ({os.specialty === 'business' ? '현업' : os.specialty === 'tech' ? '기술' : '보안'})</span>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{os.score} 점</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => {
                  setView('reviewer');
                  setSelectedCandidate(null);
                }}>
                  취소
                </button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={handleSaveEvaluation}>
                  평가 완료 및 제출
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================== REPORT PRINT / VIEW ==================== */}
        {view === 'report' && selectedCandidate && (
          <div className="card" style={{ maxWidth: '850px', margin: '0 auto', background: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', padding: '3rem', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            
            {/* Header Back Button (Non-printable) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => setView('admin')}
                style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}
              >
                <ArrowLeft size={16} /> 대시보드로 돌아가기
              </button>
              <button 
                className="btn-primary" 
                onClick={() => window.print()}
                style={{ background: '#3b82f6' }}
              >
                <Printer size={16} /> 결과 보고서 인쇄 (PDF)
              </button>
            </div>

            {/* Print Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '3px double #334155', paddingBottom: '1rem' }}>
              <h1 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: '800' }}>AICA 자격인증 심사결과 종합판정서</h1>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>AI Certification for ATEC - Level {selectedCandidate.level} 자격 검정</p>
            </div>

            {/* Candidate & Project Meta info */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '2px solid #334155', paddingBottom: '0.25rem', fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.75rem' }}>1. 심사 대상자 기본 정보</h3>
              <table style={{ border: '1px solid #cbd5e1', color: '#334155' }}>
                <tbody>
                  <tr>
                    <th style={{ background: '#f8fafc', width: '20%', border: '1px solid #cbd5e1', color: '#475569' }}>소속 법인</th>
                    <td style={{ border: '1px solid #cbd5e1', width: '30%' }}>{AFFILIATES.find(a => a.code === selectedCandidate.affiliate)?.name || selectedCandidate.affiliate}</td>
                    <th style={{ background: '#f8fafc', width: '20%', border: '1px solid #cbd5e1', color: '#475569' }}>부서 / 직위</th>
                    <td style={{ border: '1px solid #cbd5e1', width: '30%' }}>{selectedCandidate.dept}</td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569' }}>성명</th>
                    <td style={{ border: '1px solid #cbd5e1' }}><strong>{selectedCandidate.name}</strong></td>
                    <th style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569' }}>평가 대상 레벨</th>
                    <td style={{ border: '1px solid #cbd5e1' }}>AICA Level {selectedCandidate.level}</td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569' }}>과제 제안명</th>
                    <td style={{ border: '1px solid #cbd5e1' }}><strong>{currentSubmission?.title}</strong></td>
                    <th style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569' }}>과제 제출 일시</th>
                    <td style={{ border: '1px solid #cbd5e1' }}>{currentSubmission?.submittedAt || '2026-07-15 14:00'}</td>
                  </tr>
                  <tr>
                    <th style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569' }}>심사 시행 일자</th>
                    <td style={{ border: '1px solid #cbd5e1' }}><strong>{selectedCandidate.evalDate || '2026-07-22'}</strong></td>
                    <th style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#475569' }}>최종 승인 일시</th>
                    <td style={{ border: '1px solid #cbd5e1' }}>
                      {scoresList.filter(s => {
                        const comm = committeesList.find(co => co.candidateId === selectedCandidate.id);
                        return s.committeeId === comm?.id;
                      }).slice(-1)[0]?.submittedAt || '2026-07-22 14:30'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Score & Verdict summary */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '2px solid #334155', paddingBottom: '0.25rem', fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.75rem' }}>2. 심사 판정 요약</h3>
              {evaluationResults.find(er => er.candidateId === selectedCandidate.id) ? (
                (() => {
                  const res = evaluationResults.find(er => er.candidateId === selectedCandidate.id)!;
                  return (
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
                      <div style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>종합 평균 점수</span>
                        <h1 style={{ fontSize: '3rem', color: '#0f172a', margin: '0.5rem 0' }}>{res.averageScore}</h1>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>100점 만점 기준 (합격 70점 이상)</span>
                      </div>
                      <div style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: '4px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>최종 심사 판정</span>
                        <h1 style={{ 
                          fontSize: '2.5rem', 
                          color: res.passStatus === '불합격' ? '#ef4444' : '#10b981', 
                          margin: '0.5rem 0',
                          fontWeight: '800'
                        }}>{res.passStatus}</h1>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>심사위원회 패널 3인 합의</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p style={{ color: '#ef4444' }}>⚠️ 아직 최종 판정이 완료되지 않았습니다. 패널 3인의 점수가 모두 입력되어야 집계됩니다.</p>
              )}
            </div>

            {/* Individual Reviewer Scores */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ borderBottom: '2px solid #334155', paddingBottom: '0.25rem', fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.75rem' }}>3. 심사위원별 세부 채점표</h3>
              <table style={{ border: '1px solid #cbd5e1', color: '#334155', textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>심사위원</th>
                    <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>전문 분야</th>
                    {selectedCandidate.level === 3 ? (
                      <>
                        <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>난이도(30%)</th>
                        <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>완성도(40%)</th>
                        <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>자산화(30%)</th>
                      </>
                    ) : (
                      <>
                        <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>기술력(40%)</th>
                        <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>보안성(30%)</th>
                        <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>기여도(30%)</th>
                      </>
                    )}
                    <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>종합 점수</th>
                    <th style={{ border: '1px solid #cbd5e1', color: '#475569', textAlign: 'center' }}>채점 제출 일시</th>
                  </tr>
                </thead>
                <tbody>
                  {scoresList
                    .filter(s => {
                      const comm = committeesList.find(co => co.candidateId === selectedCandidate.id);
                      return s.committeeId === comm?.id;
                    })
                    .map(score => {
                      const rev = initialUsers.find(u => u.id === score.reviewerId);
                      return (
                        <tr key={score.id}>
                          <td style={{ border: '1px solid #cbd5e1' }}><strong>{rev?.name}</strong></td>
                          <td style={{ border: '1px solid #cbd5e1' }}>
                            {rev?.specialty === 'business' ? '현업/비즈니스' : rev?.specialty === 'tech' ? 'AI기술' : '보안/거버넌스'}
                          </td>
                          <td style={{ border: '1px solid #cbd5e1' }}>{score.score1}점</td>
                          <td style={{ border: '1px solid #cbd5e1' }}>{score.score2}점</td>
                          <td style={{ border: '1px solid #cbd5e1' }}>{score.score3}점</td>
                          <td style={{ border: '1px solid #cbd5e1', background: '#f8fafc' }}><strong>{score.totalScore}점</strong></td>
                          <td style={{ border: '1px solid #cbd5e1', fontSize: '0.78rem', color: '#64748b' }}>{score.submittedAt || '2026-07-22 14:00'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Reviewer Comments */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ borderBottom: '2px solid #334155', paddingBottom: '0.25rem', fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.75rem' }}>4. 심사위원별 종합 평가 의견</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {scoresList
                  .filter(s => {
                    const comm = committeesList.find(co => co.candidateId === selectedCandidate.id);
                    return s.committeeId === comm?.id;
                  })
                  .map(score => {
                    const rev = initialUsers.find(u => u.id === score.reviewerId);
                    return (
                      <div key={score.id} style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '1rem', background: '#f8fafc' }}>
                        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475569', fontWeight: 'bold' }}>
                          [{rev?.specialty === 'business' ? '현업/비즈니스' : rev?.specialty === 'tech' ? 'AI기술' : '보안/거버넌스'} 위원] {rev?.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <p>• {selectedCandidate.level === 3 ? '문제해결 난이도' : '기술적 구현력'}: {score.comments1 || '의견 없음'}</p>
                          <p>• {selectedCandidate.level === 3 ? '구현 완성도' : '데이터 활용 및 보안'}: {score.comments2 || '의견 없음'}</p>
                          <p>• {selectedCandidate.level === 3 ? '확산 및 자산화' : '비즈니스 기여도'}: {score.comments3 || '의견 없음'}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Signatures */}
            <div style={{ marginTop: '5rem', borderTop: '1px solid #94a3b8', paddingTop: '1.5rem' }}>
              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#475569', marginBottom: '2rem' }}>
                위 자격심사 결과와 같이 AICA Level {selectedCandidate.level} 자격 검증 평가가 공정하게 완료되었음을 증빙합니다.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>심사위원회 현업위원</span>
                  <div style={{ height: '50px' }}></div>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {initialUsers.find(u => u.id === currentCommittee?.reviewer1Id)?.name || '미정'} (인)
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>심사위원회 기술위원</span>
                  <div style={{ height: '50px' }}></div>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {initialUsers.find(u => u.id === currentCommittee?.reviewer2Id)?.name || '미정'} (인)
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>심사위원회 보안위원</span>
                  <div style={{ height: '50px' }}></div>
                  <strong style={{ fontSize: '0.95rem' }}>
                    {initialUsers.find(u => u.id === currentCommittee?.reviewer3Id)?.name || '미정'} (인)
                  </strong>
                </div>
              </div>
            </div>

            {/* Print styling helper */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body {
                  background: #ffffff !important;
                  color: #1e293b !important;
                }
                .no-print {
                  display: none !important;
                }
                .card {
                  border: none !important;
                  box-shadow: none !important;
                  padding: 0 !important;
                  background: transparent !important;
                }
                .app-header {
                  display: none !important;
                }
                .page-wrapper {
                  padding: 0 !important;
                }
              }
            `}} />
            
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
