import { Bookmark, Compass, Map, Radio, User } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { Logo, Toast } from './ui.jsx';

const NAV = [
  { to: '/', label: '카페 탐색', icon: Compass, match: (p) => p === '/' || p.startsWith('/recommend') || p.startsWith('/cafe') },
  { to: '/live', label: '카페 LIVE', icon: Radio, match: (p) => p.startsWith('/live') },
  { to: '/saved', label: '즐겨찾기', icon: Bookmark, match: (p) => p.startsWith('/saved') },
  { to: '/me', label: '마이페이지', icon: User, match: (p) => p.startsWith('/me') },
];

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const { resetDemo } = useStore();
  return (
    <>
      <ScrollTop />
      <header className="header">
        <div className="container header-inner">
          <Link to="/" aria-label="Cafeit 홈">
            <Logo />
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={n.match(pathname) ? 'active' : ''} aria-current={n.match(pathname) ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="header-right">
            <span className="chip chip-location">
              <Map size={15} aria-hidden="true" /> 한양대학교 · 안산
            </span>
            <Link to="/me" className="user">
              <span className="avatar">서</span>
              <span>서연</span>
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
            <p style={{ marginTop: 8 }}>오늘의 목적에 맞는, 나만의 카페.</p>
            <p style={{ marginTop: 4 }}>SWag · 한양대학교 ERICA SW 캡스톤디자인 · 데모 데이터는 가상의 카페입니다.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <div className="footer-links">
              <span>서비스 소개</span>
              <span>카페 제안</span>
              <span>이용약관</span>
              <span>개인정보 처리방침</span>
            </div>
            <span>
              © 2026 Cafeit ·{' '}
              <button className="linklike" onClick={resetDemo} title="Alt+Shift+R">
                데모 초기화
              </button>
            </span>
          </div>
        </div>
      </footer>

      <nav className="tabbar" aria-label="하단 메뉴">
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
