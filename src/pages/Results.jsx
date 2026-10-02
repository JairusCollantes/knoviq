import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, X, RotateCcw, LayoutDashboard, LibraryBig } from 'lucide-react';
import { demoTopic, demoLessonMeta, demoResult } from '../data/Data';
import './Results.css';

function normalizedCredit(raw, isCorrect){
  const n = Number(raw);
  if (Number.isFinite(n))
    return Math.min(1, Math.max(0, n));
  return isCorrect ? 1 : 0;
}

function verdictOf(answer) {
  const credit = answer.credit ?? (answer.isCorrect ? 1 : 0);
  if (credit === 1) return 'good';
  if (credit > 0) return 'partial'; 
  return 'bad';
}

function normalizeAttempt(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.answers)) return null;
  const answers = raw.answers
    .filter(Boolean)
    .map((a) => {
      const isCorrect = Boolean(a.isCorrect);
      return {
          question: String(a.question ?? 'Untitled question'),
          type: String(a.type ?? 'multiple_choice'),
          selected: String(a.selected ?? '—'),
          correct: String(a.correct ?? '—'),
          credit : normalizedCredit(a.credit, isCorrect),
          isCorrect,
          explanation: String(a.explanation ?? ''),
      }
      // question: String(a.question ?? 'Untitled question'),
      // selected: a.selected ?? '—',
      // correct: a.correct ?? '—',
      // isCorrect: Boolean(a.isCorrect),
      // explanation: String(a.explanation ?? ''),
    }
  );
  if (answers.length === 0) return null;
  return {
    id: String(raw.id ?? 'attempt-unknown'),
    lessonId: String(raw.lessonId ?? demoLessonMeta.lessonId),
    lessonTitle: String(raw.lessonTitle ?? demoLessonMeta.lessonTitle),
    topicName: String(raw.topicName ?? demoTopic.name).trim() || demoTopic.name,
    topicColor: String(raw.topicColor ?? demoTopic.color),
    difficulty: String(raw.difficulty ?? demoLessonMeta.difficulty),
    answers,
    timestamp: String(raw.timestamp ?? new Date().toISOString()),
  };
}

function loadAttempt(attemptId, stateAttempt) {
  const fromState = normalizeAttempt(stateAttempt);
  if (fromState) return { data: fromState, status: 'real' };
  if (!attemptId) return { data: { ...demoResult }, status: 'demo' };
  try {
    const raw = localStorage.getItem(attemptId);
    if (!raw) return { data: null, status: 'not-found' };
    const parsed = JSON.parse(raw);
    const normalized = normalizeAttempt(parsed);
    if (!normalized) return { data: null, status: 'not-found' };
    return { data: normalized, status: 'real' };
  } catch {
    return { data: null, status: 'not-found' };
  }
}

export default function Results() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, status } = loadAttempt(attemptId, location.state?.attempt);

  if (status === 'not-found' || !data) {
    return (
      <div className="results">
        <header className="res-header">
          <h1>Results</h1>
          <p className="res-subtitle">Review your answers and keep the streak going.</p>
        </header>

        <section className="not-found-card">
          <h2 className="not-found-title">Attempt not found</h2>
          <p className="not-found-text">
            This attempt{attemptId ? ` (${attemptId})` : ''} isn&apos;t in this browser.
            It may have been opened in another browser, in private mode, or after storage was cleared.
          </p>
          <div className="score-actions">
            <button
              className="check-btn"
              style={{ background: demoTopic.color }}
              onClick={() => navigate(`/learn/${demoLessonMeta.lessonId}`)}
            >
              <RotateCcw size={16} /> Retake Quiz
            </button>
            <Link to="/library" className="ghost-btn">
              <LibraryBig size={16} /> Library
            </Link>
            <Link to="/dashboard" className="ghost-btn">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          </div>
        </section>

        <button className="back-btn res-back" onClick={() => navigate('/library')}>
          <ArrowLeft size={18} /> Back to Library
        </button>
      </div>
    );
  }

  const total = data.answers.length;
  const correctCount = data.answers.filter((a) => a.isCorrect).length;
  const pct = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  const accent = data.topicColor || demoTopic.color;

  return (
    <div className="results">
      <header className="res-header">
        <h1>Results</h1>
        <p className="res-subtitle">Review your answers and keep the streak going.</p>
      </header>

      {status === 'demo' && (
        <div className="demo-banner">
          Demo data — finish a quiz to see your own attempt here.
        </div>
      )}

      <section className="score-card">
        <div className="score-top">
          <span className="learn-topic-badge" style={{ background: accent + '22', color: accent }}>
            <span className="badge-icon" style={{ color: accent }}>
              <demoTopic.icon size={14} />
            </span>
            {data.topicName}
          </span>
          <span className="difficulty-badge" style={{ background: accent + '22', color: accent }}>
            {data.difficulty}
          </span>
        </div>

        <h2 className="score-title">{data.lessonTitle}</h2>

        <div className="score-main">
          <div className="score-number" style={{ borderColor: accent + '55' }}>
            <span className="score-pct">{pct}%</span>
            <span className="score-fraction">
              {correctCount}/{total} correct
            </span>
          </div>
          <div className="score-bars">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: accent }} />
            </div>
            <div className="score-stats">
              <span className="stat-pill good">
                <Check size={14} /> {correctCount} correct
              </span>
              <span className="stat-pill bad">
                <X size={14} /> {total - correctCount} wrong
              </span>
            </div>
          </div>
        </div>

        <div className="score-actions">
          <button
            className="check-btn"
            style={{ background: accent }}
            onClick={() => navigate(`/learn/${data.lessonId}`)}
          >
            <RotateCcw size={16} /> Retake Quiz
          </button>
          <Link to="/library" className="ghost-btn">
            <LibraryBig size={16} /> Library
          </Link>
          <Link to="/dashboard" className="ghost-btn">
            <LayoutDashboard size={16} /> Dashboard
          </Link>
        </div>
      </section>

      <section className="review-section">
        <h2 className="section-title">Answer Review</h2>
        <div className="review-list">
          {data.answers.map((a, i) => {
              const verdict = verdictOf(a);
          return (
            <div key={i} className={`review-item ${verdict}`}>
              <div className="review-header">
                <span className="review-num">Q{i + 1}</span>
                <span className={`review-verdict ${verdict}`}>
                  {verdict === 'good' ? <Check size={14} /> : verdict === 'partial' ? null : <X size={14} />}
                  {verdict.toUpperCase()}
                </span>
              </div>
              <p className="review-question">{a.question}</p>
              {a.type === 'matching' && a.rows ? (
                <div className="review-answers">
                  {a.rows.map((r , j) =>(
                  <div key={j} className = "review-row">
                    <span className="review-label">{r.left}</span> 
                    <span className={`review-value ${r.ok ? 'good': 'bad'}`}>
                      {r.picked || '-'}
                      {!r.ok && (
                        <span className= "review-expected"> → {r.expected}</span>
                      )}
                    </span>
                  </div>
                    ))}
                </div>
              ) : (
                <div className="review-answers">
                  <div className="review-row">
                    <span className="review-label">Your answer</span>
                    <span className={`review-value ${verdict === 'good' ? 'good' : verdict === 'partial' ? 'partial' : 'bad'}`}>{a.selected}</span>
                  </div>
                  {verdict !== 'good' && (
                    <div className="review-row">
                      <span className="review-label">Correct answer</span>
                      <span className="review-value good">{a.correct}</span>
                    </div>
                  )}
                </div>
              )}
              <div className={`explanation ${a.isCorrect ? 'correct' : 'wrong'}`}>
                <p>{a.explanation}</p>
              </div>
            </div>
          )})}
        </div>
      </section>

      <button className="back-btn res-back" onClick={() => navigate('/library')}>
        <ArrowLeft size={18} /> Back to Library
      </button>
    </div>
  );
}
