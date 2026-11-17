import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CafeArt from '../components/CafeArt.jsx';
import { LangToggle, Logo } from '../components/ui.jsx';
import { useStore } from '../store.jsx';

// Dummy login: any ID + password gets you in. Nothing is sent or stored
// except the display name.
export default function Login() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, login } = useStore();
  const signup = params.get('mode') === 'signup';
  const next = params.get('next') || '/explore';
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const ready = id.trim() && pw && (!signup || name.trim());

  const submit = (e) => {
    e.preventDefault();
    if (!ready || loading) return;
    setLoading(true);
    setTimeout(() => {
      login(signup ? name.trim() : '서연');
      navigate(next.startsWith('/') && !next.startsWith('/login') ? next : '/explore', { replace: true });
    }, 700);
  };

  const switchMode = () => {
    const p = new URLSearchParams(params);
    if (signup) p.delete('mode');
    else p.set('mode', 'signup');
    setParams(p, { replace: true });
  };

  return (
    <div className="auth">
      <div className="auth-form-side">
        <div className="auth-top">
          <Link to="/" className="link-arrow">
            <ArrowLeft size={15} /> {t('홈으로', 'Back')}
          </Link>
          <LangToggle />
        </div>

        <form className="auth-card" onSubmit={submit}>
          <Logo />
          <h1 className="h2" style={{ marginTop: 24 }}>
            {signup ? t('Cafeit 시작하기', 'Create your account') : t('다시 오셨네요', 'Welcome back')}
          </h1>
          <p className="lead">
            {signup ? t('목적에 맞는 카페를 저장하고, LIVE 소식을 남겨 보세요.', 'Save cafés for every purpose and share LIVE reports.') : t('오늘은 어떤 목적으로 카페에 가세요?', 'Where are you heading today?')}
          </p>

          {signup && (
            <div className="field">
              <label className="field-label" htmlFor="name">
                {t('이름', 'Name')}
              </label>
              <input id="name" className="select" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('예) 서연', 'e.g. Seoyeon')} autoComplete="off" />
            </div>
          )}
          <div className="field">
            <label className="field-label" htmlFor="id">
              {t('학교 이메일 또는 아이디', 'School email or ID')}
            </label>
            <input id="id" className="select" value={id} onChange={(e) => setId(e.target.value)} placeholder="student@hanyang.ac.kr" autoComplete="off" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="pw">
              {t('비밀번호', 'Password')}
            </label>
            <div className="pw-wrap">
              <input id="pw" className="select" type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" autoComplete="off" />
              <button type="button" className="pw-eye" onClick={() => setShow(!show)} aria-label={show ? t('비밀번호 숨기기', 'Hide password') : t('비밀번호 보기', 'Show password')}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }} disabled={!ready || loading}>
            {loading ? <Loader2 size={18} className="spin" /> : null}
            {loading ? t('들어가는 중…', 'Signing in…') : signup ? t('가입하고 시작하기', 'Sign up and start') : t('로그인', 'Log in')}
            {!loading && <ArrowRight size={16} />}
          </button>

          <p className="auth-switch">
            {signup ? t('이미 계정이 있나요?', 'Already have an account?') : t('처음이신가요?', 'New here?')}{' '}
            <button type="button" onClick={switchMode}>
              {signup ? t('로그인', 'Log in') : t('회원가입', 'Sign up')}
            </button>
          </p>
          <p className="auth-note">{t('데모 버전이에요. 아무 값이나 입력하면 들어갈 수 있어요.', 'Demo version: type anything to get in.')}</p>
        </form>
      </div>

      <div className="auth-art" aria-hidden="true">
        <CafeArt art={{ variant: 'hanok', tone: '#E8D2B8', accent: '#6C3100' }} />
        <div className="auth-quote">
          <p>{t('“시험 기간에 조용한 1인석을 5분 만에 찾았어요.”', '“Found a quiet solo seat in 5 minutes during exam week.”')}</p>
          <span>{t('서연 · ERICA 3학년', 'Seoyeon · ERICA, 3rd year')}</span>
        </div>
      </div>
    </div>
  );
}
