import { Bookmark, Compass, Map, Radio, User } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { LangToggle, Logo, ThemeToggle, Toast } from './ui.jsx';

function useNav() {
  const { t } = useStore();
  return [
    { to: '/explore', label: t('카페 탐색', 'Explore'), icon: Compass, match: (p) => p.startsWith('/explore') || p.startsWith('/recommend') || p.startsWith('/cafe') },
    { to: '/live', label: t('카페 LIVE', 'Cafe LIVE'), icon: Radio, match: (p) => p.startsWith('/live') },
    { to: '/saved', label: t('즐겨찾기', 'Saved'), icon: Bookmark, match: (p) => p.startsWith('/saved') },
    { to: '/me', label: t('마이페이지', 'My page'), icon: User, match: (p) => p.startsWith('/me') },
  ];
}

export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const { resetDemo, t, user, userName } = useStore();
  const NAV = useNav();

  // Dummy auth: the app sits behind the fake login.
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(pathname)}`} replace />;

  return (
    <>
      <ScrollTop />
      <header className="header">
        <div className="container header-inner">
          <Link to="/explore" aria-label={t('Cafeit 홈', 'Cafeit home')}>
            <Logo />
          </Link>
          <nav className="nav" aria-label={t('주요 메뉴', 'Main menu')}>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={n.match(pathname) ? 'active' : ''} aria-current={n.match(pathname) ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="header-right">
            <span className="chip chip-location hide-sm">
              <Map size={15} aria-hidden="true" /> {t('한양대학교 · 안산', 'Hanyang ERICA')}
            </span>
            <ThemeToggle />
            <LangToggle />
            <Link to="/me" className="user">
              <span className="avatar">{userName[0]}</span>
              <span>{userName}</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <Logo />
            <p style={{ marginTop: 8 }}>{t('오늘의 목적에 맞는, 나만의 카페.', 'The right café for today’s purpose.')}</p>
            <p style={{ marginTop: 4 }}>
              {t('SWag · 한양대학교 ERICA SW 캡스톤디자인 · 데모 데이터는 가상의 카페입니다.', 'SWag · Hanyang University ERICA SW Capstone · Demo data uses fictional cafés.')}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <div className="footer-links">
              <Link to="/">{t('서비스 소개', 'About')}</Link>
              <span>{t('카페 제안', 'Suggest a café')}</span>
              <span>{t('이용약관', 'Terms')}</span>
              <span>{t('개인정보 처리방침', 'Privacy')}</span>
            </div>
            <span>
              {t('사진', 'Photos')}: Unsplash · © 2026 Cafeit ·{' '}
              <button className="linklike" onClick={resetDemo} title="Alt+Shift+R">
                {t('데모 초기화', 'Reset demo')}
              </button>
            </span>
          </div>
        </div>
      </footer>

      <nav className="tabbar" aria-label={t('하단 메뉴', 'Bottom menu')}>
        {NAV.map(({ to, label, icon: Icon, match }) => (
          <Link key={to} to={to} className={match(pathname) ? 'active' : ''}>
            <Icon size={20} aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
      <Toast />
    </>
  );
}
