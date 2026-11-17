// Mock café data for the demo. All cafés are fictional, placed around
// Hanyang University ERICA (Ansan). Swap in real data later.

export const PURPOSES = [
  { id: 'study', label: '공부하기', short: '공부', hint: '조용하고 콘센트 많은 곳' },
  { id: 'work', label: '작업하기', short: '작업', hint: '와이파이 빵빵, 오래 앉기 좋은 곳' },
  { id: 'social', label: '친구 만나기', short: '모임', hint: '넓은 테이블, 대화하기 편한 곳' },
  { id: 'rest', label: '쉬어가기', short: '휴식', hint: '편한 좌석, 분위기 좋은 곳' },
];

// Weights per purpose (each row sums to 1). See PRD §9.
export const WEIGHTS = {
  study: { quiet: 0.3, outlets: 0.2, wifi: 0.15, soloSeats: 0.15, groupSeats: 0, comfort: 0.05, space: 0.1, ambience: 0.05 },
  work: { quiet: 0.2, outlets: 0.2, wifi: 0.25, soloSeats: 0.1, groupSeats: 0, comfort: 0.1, space: 0.1, ambience: 0.05 },
  social: { quiet: 0, outlets: 0, wifi: 0.05, soloSeats: 0, groupSeats: 0.3, comfort: 0.2, space: 0.2, ambience: 0.25 },
  rest: { quiet: 0.15, outlets: 0, wifi: 0, soloSeats: 0.05, groupSeats: 0.05, comfort: 0.3, space: 0.15, ambience: 0.3 },
};

// Default preference chips per purpose (맞춤 추천).
export const PURPOSE_PREFS = {
  study: { quiet: true, wifi: true, outlets: true, solo: true },
  work: { wifi: true, outlets: true },
  social: { group: true },
  rest: { comfort: true },
};

export const ATTRIBUTE_LABELS = {
  quiet: '조용함',
  outlets: '콘센트',
  wifi: '와이파이',
  soloSeats: '1인석',
  groupSeats: '단체석',
  comfort: '편안한 좌석',
  space: '여유 공간',
  ambience: '분위기',
};

export function scoreFor(cafe, purpose) {
  const w = WEIGHTS[purpose];
  let s = 0;
  for (const k of Object.keys(w)) s += w[k] * (cafe.attributes[k] ?? 0);
  return Math.round(s * 100);
}

// art: variant for the generated illustration + palette
export const CAFES = [
  {
    id: 'yeobaek',
    name: '카페 여백',
    area: 'ERICA 정문',
    walk: 7,
    address: '안산시 상록구 · ERICA 정문 건너편 골목 2층',
    hours: [9, 22],
    lastOrder: '21:30',
    closed: '정기 휴무 없음',
    price: 4500,
    seats: 42,
    soloSeats: 12,
    summary: '작은 대화도 적은, 차분한 공부 공간',
    keyFact: '벽면 1인석마다 콘센트가 있어요',
    tags: ['잔잔한 음악', '햇살 드는 창가', '혼자 머물기 좋아요', '노트북 이용 가능'],
    amenities: { wifi: '무료 와이파이', outlets: '자리마다 콘센트', solo: '1인석 12석', toilet: '실내 화장실' },
    attributes: { quiet: 1, outlets: 1, wifi: 0.85, soloSeats: 1, groupSeats: 0.3, comfort: 0.85, space: 1, ambience: 0.9 },
    partner: false,
    map: { x: 40, y: 38 },
    art: { variant: 'window', tone: '#E9DCCB', accent: '#6C3100' },
    reviews: [
      { author: '서연', date: '2026년 10월 24일', purpose: 'study', text: '시험 기간에 혼자 공부하러 왔어요. 창가 1인석에 콘센트가 바로 있어서 노트북 충전이 편했고, 책 두 권을 펼쳐도 공간이 충분했어요. 조용히 오래 집중하고 싶은 날 다시 올 것 같아요.' },
      { author: '민준', date: '2026년 11월 2일', purpose: 'work', text: '와이파이가 끊기지 않아서 팀 과제 자료 정리하기 좋았어요. 대신 대화는 작게 해야 하는 분위기예요.' },
    ],
  },
  {
    id: 'ohu',
    name: '오후의 온도',
    area: '사동',
    walk: 9,
    address: '안산시 상록구 사동 · 사동공원 맞은편 1층',
    hours: [10, 23],
    lastOrder: '22:30',
    closed: '매주 월요일 휴무',
    price: 5000,
    seats: 56,
    soloSeats: 6,
    summary: '노트북 작업에 편안한 넓은 테이블',
    keyFact: '안정적인 와이파이와 넓은 원목 테이블',
    tags: ['넓은 원목 테이블', '한옥 창살', '오래 머물러도 괜찮아요'],
    amenities: { wifi: '무료 와이파이', outlets: '일부 좌석 콘센트', solo: '1인석 6석', toilet: '실내 화장실' },
    attributes: { quiet: 0.9, outlets: 0.85, wifi: 0.95, soloSeats: 0.7, groupSeats: 0.75, comfort: 0.85, space: 0.9, ambience: 0.85 },
    partner: true,
    map: { x: 62, y: 30 },
    art: { variant: 'hanok', tone: '#EAD7BF', accent: '#8A4B1C' },
    reviews: [
      { author: '준호', date: '2026년 11월 5일', purpose: 'work', text: '테이블이 넓어서 노트북이랑 태블릿을 같이 펼쳐도 넉넉해요. 오후엔 햇빛이 예쁘게 들어와요.' },
    ],
  },
  {
    id: 'slowpage',
    name: '슬로우 페이지',
    area: '본오동',
    walk: 15,
    address: '안산시 상록구 본오동 · 상가 3층',
    hours: [11, 22],
    lastOrder: '21:00',
    closed: '정기 휴무 없음',
    price: 4800,
    seats: 30,
    soloSeats: 10,
    summary: '책과 커피 사이, 조용한 한 자리',
    keyFact: '대화 금지 존이 따로 있는 북카페',
    tags: ['북카페', '대화 금지 존', '스탠드 조명'],
    amenities: { wifi: '무료 와이파이', outlets: '창가 좌석 콘센트', solo: '1인석 10석', toilet: '건물 내 화장실' },
    attributes: { quiet: 1, outlets: 0.8, wifi: 0.85, soloSeats: 0.95, groupSeats: 0.1, comfort: 0.8, space: 0.8, ambience: 0.9 },
    partner: false,
    map: { x: 22, y: 72 },
    art: { variant: 'shelf', tone: '#E6D8C6', accent: '#5B3A1E' },
    reviews: [
      { author: '하은', date: '2026년 10월 30일', purpose: 'study', text: '대화 금지 존 덕분에 진짜 도서관처럼 조용해요. 책 구경하다 시간 가는 줄 몰랐어요.' },
    ],
  },
  {
    id: 'forest',
    name: '포레스트 테이블',
    area: 'ERICA 후문',
    walk: 12,
    address: '안산시 상록구 · ERICA 후문 언덕길',
    hours: [10, 21],
    lastOrder: '20:30',
    closed: '매주 화요일 휴무',
    price: 5500,
    seats: 48,
    soloSeats: 4,
    summary: '초록이 보이는 편안한 공간',
    keyFact: '통창 너머 숲이 보이는 소파석',
    tags: ['통창 뷰', '소파석', '식물 가득'],
    amenities: { wifi: '무료 와이파이', outlets: '일부 좌석 콘센트', solo: '1인석 4석', toilet: '실내 화장실' },
    attributes: { quiet: 0.85, outlets: 0.5, wifi: 0.8, soloSeats: 0.4, groupSeats: 0.7, comfort: 1, space: 1, ambience: 1 },
    partner: false,
    map: { x: 78, y: 18 },
    art: { variant: 'garden', tone: '#DCE3CF', accent: '#3E4A16' },
    reviews: [
      { author: '지우', date: '2026년 11월 8일', purpose: 'rest', text: '수업 끝나고 멍 때리기 좋은 곳. 소파가 너무 편해서 일어나기 싫었어요.' },
    ],
  },
  {
    id: 'moim',
    name: '모임 로스터리',
    area: '한대앞역',
    walk: 5,
    address: '안산시 상록구 · 한대앞역 2번 출구 앞',
    hours: [8, 23],
    lastOrder: '22:30',
    closed: '정기 휴무 없음',
    price: 4300,
    seats: 80,
    soloSeats: 2,
    summary: '6인 테이블이 많은 팀플 맛집',
    keyFact: '예약 가능한 8인 룸이 있어요',
    tags: ['6인 테이블', '팀플 룸', '로스터리'],
    amenities: { wifi: '무료 와이파이', outlets: '룸·벽면 콘센트', solo: '1인석 2석', toilet: '실내 화장실' },
    attributes: { quiet: 0.3, outlets: 0.6, wifi: 0.85, soloSeats: 0.2, groupSeats: 1, comfort: 0.95, space: 1, ambience: 0.95 },
    partner: true,
    map: { x: 55, y: 82 },
    art: { variant: 'roastery', tone: '#E8D3BA', accent: '#7A3B12' },
    reviews: [
      { author: '민준', date: '2026년 11월 10일', purpose: 'social', text: '6명이서 팀플 회의하기 딱이에요. 8인 룸은 미리 예약하면 좋아요.' },
    ],
  },
  {
    id: 'lounge',
    name: '라운지 1984',
    area: '한대앞역',
    walk: 6,
    address: '안산시 상록구 · 한대앞역 먹자골목 2층',
    hours: [12, 24],
    lastOrder: '23:30',
    closed: '정기 휴무 없음',
    price: 5200,
    seats: 64,
    soloSeats: 0,
    summary: '음악 크고 활기찬 수다 맛집',
    keyFact: '디저트 맛집, 늦게까지 열어요',
    tags: ['밤 12시까지', '디저트 맛집', '활기찬 음악'],
    amenities: { wifi: '무료 와이파이', outlets: '콘센트 거의 없음', solo: '1인석 없음', toilet: '건물 내 화장실' },
    attributes: { quiet: 0.1, outlets: 0.2, wifi: 0.6, soloSeats: 0.1, groupSeats: 0.95, comfort: 0.9, space: 0.8, ambience: 1 },
    partner: false,
    map: { x: 68, y: 74 },
    art: { variant: 'lounge', tone: '#E3CBC0', accent: '#8C0200' },
    reviews: [
      { author: '서윤', date: '2026년 11월 1일', purpose: 'social', text: '친구들이랑 수다 떨기 최고! 공부하러 오면 시끄러워서 비추예요.' },
    ],
  },
  {
    id: 'notebook',
    name: '노트북 하우스',
    area: '사동',
    walk: 11,
    address: '안산시 상록구 사동 · 오피스텔 1층',
    hours: [8, 22],
    lastOrder: '21:30',
    closed: '정기 휴무 없음',
    price: 4000,
    seats: 38,
    soloSeats: 16,
    summary: '모니터 대여까지 되는 작업 특화 카페',
    keyFact: '모니터 대여 · 전 좌석 콘센트',
    tags: ['모니터 대여', '전 좌석 콘센트', '스탠딩 데스크'],
    amenities: { wifi: '기가 와이파이', outlets: '전 좌석 콘센트', solo: '1인석 16석', toilet: '실내 화장실' },
    attributes: { quiet: 0.9, outlets: 1, wifi: 1, soloSeats: 1, groupSeats: 0.2, comfort: 1, space: 0.95, ambience: 0.6 },
    partner: false,
    map: { x: 82, y: 46 },
    art: { variant: 'desk', tone: '#E1E3EC', accent: '#302F03' },
    reviews: [
      { author: '준호', date: '2026년 11월 12일', purpose: 'work', text: '모니터 대여가 신의 한 수. 재택 대신 여기 와서 일해요.' },
    ],
  },
  {
    id: 'moonlight',
    name: '달빛 정원',
    area: '본오동',
    walk: 18,
    address: '안산시 상록구 본오동 · 주택가 정원 카페',
    hours: [13, 23],
    lastOrder: '22:00',
    closed: '매주 수요일 휴무',
    price: 6000,
    seats: 40,
    soloSeats: 3,
    summary: '정원 테라스에서 쉬어가는 저녁',
    keyFact: '야외 정원 테라스 · 담요 대여',
    tags: ['정원 테라스', '담요 대여', '노을 맛집'],
    amenities: { wifi: '무료 와이파이', outlets: '콘센트 거의 없음', solo: '1인석 3석', toilet: '실내 화장실' },
    attributes: { quiet: 0.8, outlets: 0.15, wifi: 0.5, soloSeats: 0.4, groupSeats: 0.6, comfort: 0.95, space: 0.9, ambience: 1 },
    partner: false,
    map: { x: 12, y: 50 },
    art: { variant: 'garden', tone: '#D6DCE8', accent: '#302F03' },
    reviews: [
      { author: '하은', date: '2026년 10월 28일', purpose: 'rest', text: '노을 질 때 테라스에 앉아 있으면 시험 스트레스가 다 날아가요.' },
    ],
  },
  {
    id: 'brewcampus',
    name: '브루 캠퍼스',
    area: 'ERICA 학생회관',
    walk: 3,
    address: 'ERICA 캠퍼스 내 · 학생회관 1층',
    hours: [8, 20],
    lastOrder: '19:30',
    closed: '주말 휴무',
    price: 3200,
    seats: 50,
    soloSeats: 8,
    summary: '수업 사이 가장 가까운 교내 카페',
    keyFact: '캠퍼스 안이라 이동이 제일 빨라요',
    tags: ['교내 카페', '저렴한 가격', '테이크아웃'],
    amenities: { wifi: '교내 와이파이', outlets: '벽면 일부 콘센트', solo: '1인석 8석', toilet: '건물 내 화장실' },
    attributes: { quiet: 0.45, outlets: 0.6, wifi: 0.9, soloSeats: 0.6, groupSeats: 0.6, comfort: 0.5, space: 0.55, ambience: 0.5 },
    partner: false,
    map: { x: 46, y: 12 },
    art: { variant: 'window', tone: '#E4E0D4', accent: '#4F5B12' },
    reviews: [],
  },
];

// Seed LIVE reports, minutes before page load. brewcampus has none on
// purpose (shows the "정보 부족" state).
export const SEED_REPORTS = [
  { cafeId: 'yeobaek', minutesAgo: 12, crowd: 'free', noise: 'quiet', seats: '6+', memo: '창가 1인석이 넉넉해요. 음악도 작아서 공부하기 좋아요.' },
  { cafeId: 'yeobaek', minutesAgo: 41, crowd: 'free', noise: 'quiet', seats: '6+', memo: '' },
  { cafeId: 'yeobaek', minutesAgo: 75, crowd: 'normal', noise: 'quiet', seats: '3-5', memo: '' },
  { cafeId: 'yeobaek', minutesAgo: 98, crowd: 'free', noise: 'quiet', seats: '6+', memo: '' },
  { cafeId: 'ohu', minutesAgo: 24, crowd: 'normal', noise: 'quiet', seats: '3-5', memo: '공용 테이블에 자리가 조금 남아 있어요. 대화 소리는 적어요.' },
  { cafeId: 'ohu', minutesAgo: 66, crowd: 'normal', noise: 'normal', seats: '3-5', memo: '' },
  { cafeId: 'slowpage', minutesAgo: 33, crowd: 'free', noise: 'quiet', seats: '6+', memo: '대화 금지 존 자리 많이 비어 있어요.' },
  { cafeId: 'forest', minutesAgo: 46, crowd: 'free', noise: 'normal', seats: '6+', memo: '소파석 비어 있어요. 햇살 좋아요!' },
  { cafeId: 'moim', minutesAgo: 8, crowd: 'busy', noise: 'loud', seats: '1-2', memo: '수업 끝난 시간이라 사람이 많아요. 둘이 앉을 자리만 조금 남았어요.' },
  { cafeId: 'moim', minutesAgo: 29, crowd: 'busy', noise: 'loud', seats: '1-2', memo: '' },
  { cafeId: 'lounge', minutesAgo: 17, crowd: 'normal', noise: 'loud', seats: '3-5', memo: '음악 소리가 커요. 수다 떨기엔 최고.' },
  { cafeId: 'notebook', minutesAgo: 5, crowd: 'normal', noise: 'quiet', seats: '3-5', memo: '모니터 대여석 2자리 남았어요.' },
  { cafeId: 'notebook', minutesAgo: 52, crowd: 'free', noise: 'quiet', seats: '6+', memo: '' },
  { cafeId: 'notebook', minutesAgo: 88, crowd: 'normal', noise: 'quiet', seats: '3-5', memo: '' },
  { cafeId: 'moonlight', minutesAgo: 150, crowd: 'free', noise: 'quiet', seats: '6+', memo: '테라스 자리 여유로워요.' },
];

// Reports that "arrive" while the LIVE page is open, to make it feel alive.
export const INCOMING_REPORTS = [
  { cafeId: 'slowpage', crowd: 'free', noise: 'quiet', seats: '6+', memo: '방금 단체 손님 나가서 엄청 조용해요.' },
  { cafeId: 'lounge', crowd: 'busy', noise: 'loud', seats: '1-2', memo: '디저트 타임이라 자리가 거의 없어요.' },
  { cafeId: 'ohu', crowd: 'free', noise: 'quiet', seats: '6+', memo: '창가 원목 테이블 비었어요!' },
  { cafeId: 'forest', crowd: 'normal', noise: 'normal', seats: '3-5', memo: '' },
  { cafeId: 'brewcampus', crowd: 'busy', noise: 'normal', seats: '1-2', memo: '점심시간이라 줄이 길어요.' },
];

export const CROWD = {
  free: { label: '여유', desc: '자리가 넉넉해요', tone: 'good' },
  normal: { label: '보통', desc: '적당히 있어요', tone: 'mid' },
  busy: { label: '혼잡', desc: '거의 만석이에요', tone: 'bad' },
};
export const NOISE = {
  quiet: { label: '조용함', desc: '집중하기 좋아요', tone: 'good' },
  normal: { label: '보통', desc: '대화 소리가 적당해요', tone: 'mid' },
  loud: { label: '시끄러움', desc: '많이 시끄러워요', tone: 'bad' },
};
export const SEATS = {
  '6+': { label: '6석 이상', tone: 'good' },
  '3-5': { label: '3–5석', tone: 'mid' },
  '1-2': { label: '1–2석', tone: 'bad' },
  none: { label: '없음', tone: 'bad' },
};

export const SURVEY = { total: 91, struggle: 70, pct: 76.9 };
