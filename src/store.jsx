import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CAFES, PURPOSE_PREFS, SEED_REPORTS, scoreFor } from './data/cafes.js';
import { liveStatus } from './lib/live.js';

const StoreContext = createContext(null);
const KEY = 'cafeit-demo-v1';
const LOAD_TIME = Date.now();

const DEFAULTS = {
  purpose: 'study',
  saved: ['yeobaek', 'ohu'],
  userReports: [],
  prefs: { quiet: true, wifi: true, outlets: true, solo: true },
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
      localStorage.setItem(KEY, JSON.stringify({ purpose, saved, userReports, prefs }));
    } catch {
      /* storage unavailable: demo still works in memory */
    }
  }, [purpose, saved, userReports, prefs]);

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
      showToast(on ? '저장을 취소했어요' : '즐겨찾기에 저장했어요');
    },
    [saved, showToast],
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
    showToast('데모를 초기화했어요');
  }, [showToast]);

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
      CAFES.map((c) => {
        const reports = allReports.filter((r) => r.cafeId === c.id);
        return {
          ...c,
          reports,
          live: liveStatus(reports, now),
          scores: {
            study: scoreFor(c, 'study'),
            work: scoreFor(c, 'work'),
            social: scoreFor(c, 'social'),
            rest: scoreFor(c, 'rest'),
          },
        };
      }),
    [allReports, now],
  );

  const value = {
    purpose,
    setPurpose,
    saved,
    toggleSave,
    isSaved: (id) => saved.includes(id),
    prefs,
    setPrefs,
    cafes,
    getCafe: (id) => cafes.find((c) => c.id === id),
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
