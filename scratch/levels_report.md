# Analysis of AICA Levels in Codebase

## 1. Occurrences of 'level' in App.tsx
- Line 227: `const [newCandLevel, setNewCandLevel] = useState<3 | 4>(3);`
- Line 293: `level: newCandLevel,`
- Line 416: `const [adminLevelFilter, setAdminLevelFilter] = useState<string>('all');`
- Line 518: `// Level 3 weights: Complexity 30%, Implementation 40%, Assetization 30%`
- Line 519: `// Level 4 weights: Engineering 40%, Security 30%, Impact 30%`
- Line 521: `if (selectedCandidate.level === 3) {`
- Line 942: `<h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Level 3 (AI Champion) Rubric 가중치</h4>`
- Line 946: `<h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Level 4 (AI Specialist) Rubric 가중치</h4>`
- Line 971: `value={adminLevelFilter}`
- Line 972: `onChange={(e) => setAdminLevelFilter(e.target.value)}`
- Line 976: `<option value="3">Level 3</option>`
- Line 977: `<option value="4">Level 4</option>`
- Line 1009: `.filter(c => adminLevelFilter === 'all' || c.level === parseInt(adminLevelFilter))`
- Line 1026: `Level {cand.level}`
- Line 1146: `Level {cand.level}`
- Line 1257: `value={newCandLevel}`
- Line 1258: `onChange={(e) => setNewCandLevel(parseInt(e.target.value) as 3 | 4)}`
- Line 1260: `<option value={3}>Level 3 (AI Champion)</option>`
- Line 1261: `<option value={4}>Level 4 (AI Specialist)</option>`
- Line 1465: `심사위원 <strong>{currentUser.name}</strong> 님에게 배정된 AICA Level 3 & 4 자격검정 리스트입니다.`
- Line 1504: `Level {cand.level}`
- Line 1556: `[{AFFILIATES.find(a => a.code === selectedCandidate.affiliate)?.name || selectedCandidate.affiliate}] {selectedCandidate.name} 지원자 (Level {selectedCandidate.level})`
- Line 1639: `<span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>[AICA_Level{selectedCandidate.level}_Demo_Play.mp4]</span>`
- Line 1760: `{/* Rubric criteria depending on Level */}`
- Line 1761: `{selectedCandidate.level === 3 ? (`
- Line 1762: `// Level 3 Rubrics`
- Line 1873: `// Level 4 Rubrics`
- Line 2034: `.filter(q => q.level === selectedCandidate.level)`
- Line 2117: `<p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>AI Certification for ATEC - Level {selectedCandidate.level} 자격 검정</p>`
- Line 2135: `<td style={{ border: '1px solid #cbd5e1' }}>AICA Level {selectedCandidate.level}</td>`
- Line 2184: `{selectedCandidate.level === 3 ? (`
- Line 2242: `<p>• {selectedCandidate.level === 3 ? '문제해결 난이도' : '기술적 구현력'}: {score.comments1 || '의견 없음'}</p>`
- Line 2243: `<p>• {selectedCandidate.level === 3 ? '구현 완성도' : '데이터 활용 및 보안'}: {score.comments2 || '의견 없음'}</p>`
- Line 2244: `<p>• {selectedCandidate.level === 3 ? '확산 및 자산화' : '비즈니스 기여도'}: {score.comments3 || '의견 없음'}</p>`
- Line 2255: `위 자격심사 결과와 같이 AICA Level {selectedCandidate.level} 자격 검증 평가가 공정하게 완료되었음을 증빙합니다.`

## 2. Rubric and Evaluation Logic for Levels
Level checks found in code: ['selectedCandidate.level === 3', 'selectedCandidate.level === 3', 'selectedCandidate.level === 3', 'selectedCandidate.level === 3', 'selectedCandidate.level === 3', 'selectedCandidate.level === 3']

## 3. References to L2 / L3 / L4
### Term: Level 2 (count: 0)

### Term: L2 (count: 0)

### Term: Level 3 (count: 6)
- `// Level 3 weights: Complexity 30%, Implementation 40%, Assetization 30%`
- `<h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Level 3 (AI Champion) Rubric 가중치</h4>`
- `<option value="3">Level 3</option>`
- `<option value={3}>Level 3 (AI Champion)</option>`
- `심사위원 <strong>{currentUser.name}</strong> 님에게 배정된 AICA Level 3 & 4 자격검정 리스트입니다.`
- `// Level 3 Rubrics`

### Term: L3 (count: 0)

### Term: Level 4 (count: 5)
- `// Level 4 weights: Engineering 40%, Security 30%, Impact 30%`
- `<h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Level 4 (AI Specialist) Rubric 가중치</h4>`
- `<option value="4">Level 4</option>`
- `<option value={4}>Level 4 (AI Specialist)</option>`
- `// Level 4 Rubrics`

### Term: L4 (count: 0)

