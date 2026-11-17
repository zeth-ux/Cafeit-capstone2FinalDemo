import { Armchair, Check, Users, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CAFES, CROWD, NOISE, SEATS } from '../data/cafes.js';
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

export default function Report() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addReport, getCafe } = useStore();
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
      <div className="success">
        <div className="check">
          <Check size={34} strokeWidth={3} />
        </div>
        <h1 className="h2">제보가 등록됐어요. 고마워요!</h1>
        <p className="lead">
          {cafe.name}의 현황이 <b>방금 전</b>으로 업데이트됐어요. 다른 학생들이 바로 확인할 수 있어요.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/live', { state: { highlight: done.cafeId } })}>
            LIVE 피드 보기
          </button>
          <Link to={`/cafe/${done.cafeId}`} className="btn btn-secondary">
            카페 페이지로
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
      <div className="eyebrow">Cafe live</div>
      <h1 className="h1">Cafe LIVE 현황 제보</h1>
      <p className="lead">지금 방문한 카페의 현황을 간단히 공유해 주세요. 3번만 누르면 끝나요.</p>

      <div className="field">
        <label className="field-label" htmlFor="cafe">
          카페 선택 <small>(필수)</small>
        </label>
        <select id="cafe" className="select" value={cafeId} onChange={(e) => setCafeId(e.target.value)} required>
          <option value="">카페를 선택해 주세요</option>
          {CAFES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.area}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '28px 0 0' }}>
        <legend className="field-label">
          혼잡도 <small>(필수)</small>
        </legend>
        <RadioCards name="crowd" options={CROWD} value={crowd} onChange={setCrowd} icon={Users} />
      </fieldset>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '28px 0 0' }}>
        <legend className="field-label">
          소음 수준 <small>(필수)</small>
        </legend>
        <RadioCards name="noise" options={NOISE} value={noise} onChange={setNoise} icon={Volume2} />
      </fieldset>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '28px 0 0' }}>
        <legend className="field-label">
          빈자리 <small>(선택)</small>
        </legend>
        <RadioCards name="seats" options={SEATS} value={seats} onChange={setSeats} icon={Armchair} four />
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor="memo">
          추가 메모 <small>(선택)</small>
        </label>
        <textarea id="memo" className="textarea" maxLength={100} value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예) 창가 자리가 좋아요. 지금은 집중하기 좋아요." />
        <div className="counter num">{memo.length}/100</div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          취소
        </button>
        <button type="submit" className="btn btn-primary" disabled={!ready}>
          제보 등록하기
        </button>
      </div>
      {!ready && (
        <p className="muted" style={{ textAlign: 'right', fontSize: 13, marginTop: 8 }}>
          카페, 혼잡도, 소음을 선택하면 등록할 수 있어요.
        </p>
      )}
    </form>
  );
}
