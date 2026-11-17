import { Armchair, Check, Users, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageHero, Radar } from '../components/Decor.jsx';
import { CROWD, CROWD_EN, NOISE, NOISE_EN, SEATS, SEATS_EN } from '../data/cafes.js';
import { useStore } from '../store.jsx';

function RadioCards({ name, options, value, onChange, icon: Icon, four }) {
  return (
    <div className={`radio-grid ${four ? 'four' : ''}`} role="radiogroup">
      {Object.entries(options).map(([key, o]) => (
        <label key={key} className={`radio-card ${value === key ? 'is-on' : ''}`}>
          <input type="radio" name={name} value={key} checked={value === key} onChange={() => onChange(key)} />
          <span className="t">
            <Icon size={17} className={value === key ? `tone-${o.tone}` : ''} /> {o.label}
          </span>
          {o.desc && <span className="d">{o.desc}</span>}
          <span className="ring" aria-hidden="true" />
        </label>
      ))}
    </div>
  );
}

const merge = (base, en, lang) => (lang === 'en' ? Object.fromEntries(Object.entries(base).map(([k, v]) => [k, { ...v, ...en[k] }])) : base);

export default function Report() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addReport, getCafe, cafes, t, lang } = useStore();
  const [cafeId, setCafeId] = useState(params.get('cafe') || '');
  const [crowd, setCrowd] = useState('');
  const [noise, setNoise] = useState('');
  const [seats, setSeats] = useState('');
  const [memo, setMemo] = useState('');
  const [done, setDone] = useState(null);

  const ready = cafeId && crowd && noise;

  if (done) {
    const cafe = getCafe(done.cafeId);
    return (
      <div className="success decor-wrap" style={{ borderRadius: 32, marginTop: 28 }}>
        <Radar className="success-radar" color="#4F5B12" />
        <div className="check">
          <Check size={34} strokeWidth={3} />
        </div>
        <h1 className="h2">{t('제보가 등록됐어요. 고마워요!', 'Report posted. Thank you!')}</h1>
        <p className="lead">
          {t(`${cafe.name}의 현황이 `, `${cafe.name} is now updated `)}
          <b>{t('방금 전', 'just now')}</b>
          {t('으로 업데이트됐어요. 다른 학생들이 바로 확인할 수 있어요.', '. Other students can see it right away.')}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/live', { state: { highlight: done.cafeId } })}>
            {t('LIVE 피드 보기', 'See the LIVE feed')}
          </button>
          <Link to={`/cafe/${done.cafeId}`} className="btn btn-secondary">
            {t('카페 페이지로', 'Back to café')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      className="form-wrap"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        addReport({ cafeId, crowd, noise, seats: seats || (crowd === 'free' ? '6+' : crowd === 'normal' ? '3-5' : '1-2'), memo: memo.trim() });
        setDone({ cafeId });
      }}
    >
      <PageHero
        pattern="grid"
        eyebrow="Cafe live"
        title={
          <>
            {t('현황 제보,', 'Live report,')} <span className="serif">3 taps</span>
          </>
        }
        lead={t('지금 방문한 카페의 현황을 간단히 공유해 주세요. 3번만 누르면 끝나요.', 'Quickly share what the café is like right now. Three taps and you’re done.')}
      />

      <div className="field">
        <label className="field-label" htmlFor="cafe">
          {t('카페 선택', 'Café')} <small>{t('(필수)', '(required)')}</small>
        </label>
        <select id="cafe" className="select" value={cafeId} onChange={(e) => setCafeId(e.target.value)} required>
          <option value="">{t('카페를 선택해 주세요', 'Choose a café')}</option>
          {cafes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.area}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '28px 0 0' }}>
        <legend className="field-label">
          {t('혼잡도', 'How crowded?')} <small>{t('(필수)', '(required)')}</small>
        </legend>
        <RadioCards name="crowd" options={merge(CROWD, CROWD_EN, lang)} value={crowd} onChange={setCrowd} icon={Users} />
      </fieldset>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '28px 0 0' }}>
        <legend className="field-label">
          {t('소음 수준', 'How noisy?')} <small>{t('(필수)', '(required)')}</small>
        </legend>
        <RadioCards name="noise" options={merge(NOISE, NOISE_EN, lang)} value={noise} onChange={setNoise} icon={Volume2} />
      </fieldset>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '28px 0 0' }}>
        <legend className="field-label">
          {t('빈자리', 'Free seats')} <small>{t('(선택)', '(optional)')}</small>
        </legend>
        <RadioCards name="seats" options={merge(SEATS, SEATS_EN, lang)} value={seats} onChange={setSeats} icon={Armchair} four />
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor="memo">
          {t('추가 메모', 'Note')} <small>{t('(선택)', '(optional)')}</small>
        </label>
        <textarea
          id="memo"
          className="textarea"
          maxLength={100}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder={t('예) 창가 자리가 좋아요. 지금은 집중하기 좋아요.', 'e.g. Window seats are great. Good for focus right now.')}
        />
        <div className="counter num">{memo.length}/100</div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          {t('취소', 'Cancel')}
        </button>
        <button type="submit" className="btn btn-primary" disabled={!ready}>
          {t('제보 등록하기', 'Post report')}
        </button>
      </div>
      {!ready && (
        <p className="muted" style={{ textAlign: 'right', fontSize: 13, marginTop: 8 }}>
          {t('카페, 혼잡도, 소음을 선택하면 등록할 수 있어요.', 'Pick a café, crowd level and noise level to post.')}
        </p>
      )}
    </form>
  );
}
