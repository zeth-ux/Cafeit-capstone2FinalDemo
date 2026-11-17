import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CAFES, CAFES_EN, PURPOSE_EN, PURPOSES, PURPOSE_PREFS, SEED_REPORTS, scoreFor } from './data/cafes.js';
import { liveStatus } from './lib/live.js';

const StoreContext = createContext(null);
const KEY = 'cafeit-demo-v1';
const LOAD_TIME = Date.now();

const DEFAULTS = {
  purpose: 'study',
  saved: ['yeobaek', 'ohu'],
  userReports: [],
  prefs: { quiet: true, wifi: true, outlets: true, solo: true },
  lang: 'ko',
  user: null,
  theme: 'light',
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

const seeded = SEED_REPORTS.map((r, i) => ({
  id: `seed-${i}`,
  ...r,
  ts: LOAD_TIME - r.minutesAgo * 60 * 1000,
}));

export function StoreProvider({ children }) {
  const initial = useRef(load()).current;
  const [purpose, setPurposeRaw] = useState(initial.purpose);
  const [saved, setSaved] = useState(initial.saved);
  const [userReports, setUserReports] = useState(initial.userReports);
  const [prefs, setPrefs] = useState(initial.prefs);
  const [incoming, setIncoming] = useState([]);
  const [lang, setLang] = useState(initial.lang);
  const [user, setUser] = useState(initial.user);
  const [theme, setTheme] = useState(initial.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#15130C' : '#302F03');
  }, [theme]);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(Date.now());
  const toastTimer = useRef();

  // tick relative times
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 20 * 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ purpose, saved, userReports, prefs, lang, user, theme }));
    } catch {
      /* storage unavailable: demo still works in memory */
    }
  }, [purpose, saved, userReports, prefs, lang, user, theme]);

  // t('한국어', 'English')
  const t = useCallback((ko, en) => (lang === 'en' ? en : ko), [lang]);
  const login = useCallback((name) => setUser({ name: name || null }), []);
  const logout = useCallback(() => setUser(null), []);

  const setPurpose = useCallback((id) => {
    setPurposeRaw(id);
    setPrefs(PURPOSE_PREFS[id]);
  }, []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const toggleSave = useCallback(
    (id) => {
      const on = saved.includes(id);
      setSaved(on ? saved.filter((x) => x !== id) : [...saved, id]);
      showToast(on ? (lang === 'en' ? 'Removed from saved' : '저장을 취소했어요') : lang === 'en' ? 'Saved to favorites' : '즐겨찾기에 저장했어요');
    },
    [saved, showToast, lang],
  );

  const addReport = useCallback((report) => {
    const r = { ...report, id: `user-${Date.now()}`, ts: Date.now(), mine: true };
    setUserReports((list) => [r, ...list]);
    setNow(Date.now());
    return r;
  }, []);

  const pushIncoming = useCallback((report) => {
    setIncoming((list) => [{ ...report, id: `in-${Date.now()}`, ts: Date.now() }, ...list]);
    setNow(Date.now());
  }, []);

  const resetDemo = useCallback(() => {
    setPurposeRaw(DEFAULTS.purpose);
    setSaved(DEFAULTS.saved);
    setUserReports([]);
    setIncoming([]);
    setPrefs(DEFAULTS.prefs);
    setUser(null);
    showToast(lang === 'en' ? 'Demo reset' : '데모를 초기화했어요');
  }, [showToast, lang]);

  // Alt+Shift+R resets the demo (handy before presenting)
  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) resetDemo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resetDemo]);

  const allReports = useMemo(() => [...userReports, ...incoming, ...seeded], [userReports, incoming]);

  const cafes = useMemo(
    () =>
      CAFES.map((base) => {
        const en = lang === 'en' ? CAFES_EN[base.id] : null;
        const c = en ? { ...base, ...en, reviews: base.reviews.map((r, i) => ({ ...r, ...(en.reviews[i] || {}) })) } : base;
        const reports = allReports.filter((r) => r.cafeId === c.id);
        return {
          ...c,
          reports,
          live: liveStatus(reports, now, lang),
          scores: {
            study: scoreFor(c, 'study'),
            work: scoreFor(c, 'work'),
            social: scoreFor(c, 'social'),
            rest: scoreFor(c, 'rest'),
          },
        };
      }),
    [allReports, now, lang],
  );

  const purposes = useMemo(() => PURPOSES.map((p) => (lang === 'en' ? { ...p, ...PURPOSE_EN[p.id] } : p)), [lang]);

  const value = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((x) => (x === 'dark' ? 'light' : 'dark')),
    lang,
    setLang,
    t,
    user,
    userName: user?.name && user.name !== '서연' ? user.name : lang === 'en' ? 'Seoyeon' : '서연',
    login,
    logout,
    purpose,
    setPurpose,
    saved,
    toggleSave,
    isSaved: (id) => saved.includes(id),
    prefs,
    setPrefs,
    cafes,
    getCafe: (id) => cafes.find((c) => c.id === id),
    purposes,
    P: (id) => purposes.find((p) => p.id === id),
    allReports,
    userReports,
    addReport,
    pushIncoming,
    now,
    toast,
    showToast,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

// Rank cafés for a purpose, optionally filtered.
export function rankCafes(cafes, purpose) {
  return [...cafes].sort((a, b) => b.scores[purpose] - a.scores[purpose]);
}
