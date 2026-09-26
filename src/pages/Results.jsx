import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, X, RotateCcw, LayoutDashboard, LibraryBig, CodeXml } from 'lucide-react';
import './Results.css';

// Hardcoded fallback data — same values as Dashboard / Library / Learn (like Learn.jsx does)
const topic = { name: 'Java', color: '#4a9eff', icon: <CodeXml size={14} /> };
const lessonMeta = {
  lessonId: 'java-oop',
  lessonTitle: 'OOP Basics',
  difficulty: 'beginner',
};

const mockAnswers = [
  {
    question: 'What does OOP stand for?',
    options: ['Object Oriented Programming', 'Object Only Programming', 'Optimal Object Protocol', 'Ordered Operation Process'],
    selected: 'Object Oriented Programming',
    correct: 'Object Oriented Programming',
    isCorrect: true,
    explanation: 'OOP stands for Object Oriented Programming.',
  },
  {
    question: 'What is a class in Java?',
    options: ['An instance of an object', 'A blueprint for creating objects', 'A static method', 'A primitive data type'],
    selected: 'A blueprint for creating objects',
    correct: 'A blueprint for creating objects',
    isCorrect: true,
    explanation: 'A class acts as a template or blueprint from which objects are created.',
  },
  {
    question: 'Which keyword is used to create an object?',
    options: ['class', 'object', 'new', 'create'],
    selected: 'new',
    correct: 'new',
    isCorrect: true,
    explanation: 'The "new" keyword is used to instantiate (create) an object from a class.',
  },
  {
    question: 'What is encapsulation?',
    options: ['Hiding data and restricting access', 'Creating multiple objects', 'Inheriting from a parent', 'Overriding methods'],
    selected: 'Hiding data and restricting access',
    correct: 'Hiding data and restricting access',
    isCorrect: true,
    explanation: 'Encapsulation bundles data and methods, restricting direct access to internal state.',
  },
  {
    question: 'Which access modifier is the most restrictive?',
    options: ['public', 'protected', 'private', 'default'],
    selected: 'protected',
    correct: 'private',
    isCorrect: false,
    explanation: '"private" restricts access to only within the declaring class.',
  },
  {
    question: 'What is a constructor?',
    options: ['A method that destroys objects', 'A special method called when an object is created', 'A static method', 'An interface method'],
    selected: 'A special method called when an object is created',
    correct: 'A special method called when an object is created',
    isCorrect: true,
    explanation: 'Constructors initialize objects when they are instantiated.',
  },
  {
    question: 'Can a class have multiple constructors?',
    options: ['No', 'Yes, through overloading', 'Only if they are private', 'Only one default constructor'],
    selected: 'Yes, through overloading',
    correct: 'Yes, through overloading',
    isCorrect: true,
    explanation: 'Java supports constructor overloading (same name, different parameters).',
  },
  {
    question: 'What does the "this" keyword refer to?',
    options: ['The parent class', 'The current object instance', 'A static reference', 'The main method'],
    selected: 'The current object instance',
    correct: 'The current object instance',
    isCorrect: true,
    explanation: '"this" refers to the current instance of the class.',
  },
  {
    question: 'What is method overloading?',
    options: ['Same name, different parameters', 'Same name, same parameters', 'Overriding a parent method', 'Calling a method recursively'],
    selected: 'Overriding a parent method',
    correct: 'Same name, different parameters',
    isCorrect: false,
    explanation: 'Overloading means multiple methods with the same name but different parameter lists.',
  },
  {
    question: 'Which of these is NOT a pillar of OOP?',
    options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Abstraction'],
    selected: 'Compilation',
    correct: 'Compilation',
    isCorrect: true,
    explanation: 'The four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.',
  },
];

const mockResult = {
  id: 'attempt-demo',
  lessonId: lessonMeta.lessonId,
  lessonTitle: lessonMeta.lessonTitle,
  topicName: topic.name,
  topicColor: topic.color,
  difficulty: lessonMeta.difficulty,
  answers: mockAnswers,
  timestamp: new Date().toISOString(),
};

function normalizeAttempt(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.answers)) return null;
  const answers = raw.answers
    .filter(Boolean)
    .map((a) => ({
      question: String(a.question ?? 'Untitled question'),
      selected: a.selected ?? '—',
      correct: a.correct ?? '—',
      isCorrect: Boolean(a.isCorrect),
      explanation: String(a.explanation ?? ''),
    }));
  if (answers.length === 0) return null;
  return {
    id: String(raw.id ?? 'attempt-unknown'),
    lessonId: String(raw.lessonId ?? lessonMeta.lessonId),
    lessonTitle: String(raw.lessonTitle ?? lessonMeta.lessonTitle),
    topicName: String(raw.topicName ?? topic.name).trim() || topic.name,
    topicColor: String(raw.topicColor ?? topic.color),
    difficulty: String(raw.difficulty ?? lessonMeta.difficulty),
    answers,
    timestamp: String(raw.timestamp ?? new Date().toISOString()),
  };
}

function loadAttempt(attemptId, stateAttempt) {
  const fromState = normalizeAttempt(stateAttempt);
  if (fromState) return { data: fromState, status: 'real' };
  if (!attemptId) return { data: { ...mockResult }, status: 'demo' };
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
              style={{ background: topic.color }}
              onClick={() => navigate(`/learn/${lessonMeta.lessonId}`)}
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
  const accent = data.topicColor || topic.color;

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
              <CodeXml size={14} />
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
          {data.answers.map((a, i) => (
            <div key={i} className={`review-item ${a.isCorrect ? 'good' : 'bad'}`}>
              <div className="review-header">
                <span className="review-num">Q{i + 1}</span>
                <span className={`review-verdict ${a.isCorrect ? 'good' : 'bad'}`}>
                  {a.isCorrect ? <Check size={14} /> : <X size={14} />}
                  {a.isCorrect ? 'Correct' : 'Wrong'}
                </span>
              </div>
              <p className="review-question">{a.question}</p>
              <div className="review-answers">
                <div className="review-row">
                  <span className="review-label">Your answer</span>
                  <span className={`review-value ${a.isCorrect ? 'good' : 'bad'}`}>{a.selected}</span>
                </div>
                {!a.isCorrect && (
                  <div className="review-row">
                    <span className="review-label">Correct answer</span>
                    <span className="review-value good">{a.correct}</span>
                  </div>
                )}
              </div>
              <div className={`explanation ${a.isCorrect ? 'correct' : 'wrong'}`}>
                <p>{a.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="back-btn res-back" onClick={() => navigate('/library')}>
        <ArrowLeft size={18} /> Back to Library
      </button>
    </div>
  );
}
