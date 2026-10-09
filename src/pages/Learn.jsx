import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { assignments } from '../data/Data';
import './Learn.css';

function normalizeBlank(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function persistAttempt(attemptId, attemptData) {
  try {
    localStorage.setItem(attemptId, JSON.stringify(attemptData));
    return true;
  } catch {
    return false;
  }
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledPairRights(question) {
  const rights = question.pairs.map((p) => p.right);
  const rand = mulberry32(hashString(question.question));
  for (let i = rights.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [rights[i], rights[j]] = [rights[j], rights[i]];
  }
  return rights;
}

function gradeQuestion(question, selected, matchMap) {
  if (question.type === 'matching') {
    const total = question.pairs.length;
    const rows = question.pairs.map((p) => {
      const picked = matchMap[p.left] ?? '';
      const ok = picked !== '' && picked === p.right;
      return { left: p.left, picked, expected: p.right, ok };
    });
    const correct = rows.filter((r) => r.ok).length;
    return { credit: total === 0 ? 0 : correct / total, rows };
  }
  if (question.type === 'fill_blank') {
    const norm = normalizeBlank(selected);
    const accepted = [question.answer, ...(question.acceptedAnswers || [])].map(normalizeBlank);
    const ok = norm.length > 0 && accepted.includes(norm);
    return { credit: ok ? 1 : 0, rows: null };
  }
  const ok = selected === question.answer;
  return { credit: ok ? 1 : 0, rows: null };
}

function summarizeMatch(grade, total) {
  const correct = grade.rows ? grade.rows.filter((r) => r.ok).length : 0;
  return `${correct}/${total} pairs`;
}

export default function Learn() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const assignment = assignments[lessonId];
  const topic = assignment?.topic;

  const [phase, setPhase] = useState('study');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [matchMap, setMatchMap] = useState({});
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [expandedConcept, setExpandedConcept] = useState(0);

  useEffect(() => {
    if (!assignment) navigate('/dashboard');
  }, [assignment, navigate]);

  const totalQ = assignment ? assignment.questions.length : 0;
  const q = assignment ? assignment.questions[currentQ] : null;

  const shuffledRights = useMemo(() => {
    if (!q || q.type !== 'matching') return [];
    return shuffledPairRights(q);
  }, [q]);

  if (!assignment) return null;

  const grade = gradeQuestion(q, selected, matchMap);
  const isCorrect = grade.credit === 1;
  const isPartial = grade.credit > 0 && grade.credit < 1;
  const canCheck =
    q.type === 'matching'
      ? q.pairs.every((p) => matchMap[p.left])
      : q.type === 'fill_blank'
        ? normalizeBlank(selected).length > 0
        : !!selected;
  const progressPct = phase === 'study' ? 0 : ((currentQ + (checked ? 1 : 0)) / totalQ) * 100;

  function buildAnswerRecord() {
    const g = gradeQuestion(q, selected, matchMap);
    const base = {
      question: q.question,
      type: q.type || 'multiple_choice',
      explanation: q.explanation,
    };
    if (q.type === 'matching') {
      return {
        ...base,
        selected: summarizeMatch(g, q.pairs.length),
        correct: `${q.pairs.length}/${q.pairs.length} pairs`,
        credit: g.credit,
        isCorrect: g.credit === 1,
        options: null,
        rows: g.rows,
      };
    }
    const displaySelected = q.type === 'fill_blank' ? String(selected ?? '').trim() : selected;
    return {
      ...base,
      selected: displaySelected,
      correct: q.answer,
      credit: g.credit,
      isCorrect: g.credit === 1,
      options: q.options ?? null,
      rows: null,
    };
  }

  function handleCheck() {
    if (!canCheck) return;
    setChecked(true);
    setAnswers((prev) => [...prev, buildAnswerRecord()]);
  }

  function handleNext() {
    if (currentQ + 1 >= totalQ) {
      const lastAnswer = buildAnswerRecord();
      const alreadySaved = answers.some((a) => a.question === q.question);
      const finalAnswers = alreadySaved ? answers : [...answers, lastAnswer];
      const attemptId = `attempt-${Date.now()}`;
      const attemptData = {
        id: attemptId,
        lessonId,
        lessonTitle: assignment.title,
        topicName: topic.name,
        topicColor: topic.color,
        difficulty: assignment.difficulty,
        answers: finalAnswers,
        timestamp: new Date().toISOString(),
      };
      persistAttempt(attemptId, attemptData);
      navigate(`/results/${attemptId}`, { state: { attempt: attemptData } });
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setMatchMap({});
      setChecked(false);
    }
  }

  function renderQuestionBody() {
    if (q.type === 'matching') {
      return (
        <div className="match-list">
          {q.pairs.map((p) => {
            const row = checked ? grade.rows.find((r) => r.left === p.left) : null;
            const cls = 'match-row' + (checked ? (row && row.ok ? ' correct' : ' wrong') : '');
            return (
              <div key={p.left} className={cls}>
                <span className="match-left">{p.left}</span>
                <select
                  className="match-select"
                  value={matchMap[p.left] ?? ''}
                  disabled={checked}
                  onChange={(e) => !checked && setMatchMap((m) => ({ ...m, [p.left]: e.target.value }))}
                  aria-label={`Match for ${p.left}`}
                >
                  <option value="" disabled>Pick a match…</option>
                  {shuffledRights.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {checked && row && (row.ok
                  ? <Check size={18} className="option-icon match-icon-correct" />
                  : <X size={18} className="option-icon match-icon-wrong" />)}
              </div>
            );
          })}
        </div>
      );
    }

    if (q.type === 'fill_blank') {
      const cls = 'blank-input' + (checked ? (isCorrect ? ' correct' : ' wrong') : '');
      return (
        <div className="blank-wrap">
          <input
            type="text"
            className={cls}
            value={selected ?? ''}
            disabled={checked}
            placeholder="Type your answer…"
            onChange={(e) => !checked && setSelected(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canCheck && !checked) handleCheck();
            }}
            aria-label="Fill in the blank"
          />
        </div>
      );
    }

    return (
      <div className="options-list">
        {q.options.map((opt, i) => {
          let cls = 'option-btn';
          if (checked) {
            if (opt === q.answer) cls += ' correct';
            else if (opt === selected && !isCorrect) cls += ' wrong';
          } else if (opt === selected) {
            cls += ' selected';
          }

          return (
            <button
              key={i}
              className={cls}
              onClick={() => !checked && setSelected(opt)}
              disabled={checked}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
              {checked && opt === q.answer && <Check size={18} className="option-icon" />}
              {checked && opt === selected && !isCorrect && <X size={18} className="option-icon" />}
            </button>
          );
        })}
      </div>
    );
  }

  const verdictClass = isCorrect ? 'correct' : isPartial ? 'partial' : 'wrong';
  const verdictText = isCorrect
    ? 'Correct'
    : isPartial
      ? `Partially correct (${grade.rows.filter((r) => r.ok).length}/${q.pairs.length} pairs)`
      : 'Not quite';

  return (
    <div className="learn-page">
      <div className="learn-topbar">
        <button className="back-btn" onClick={() => navigate('/library')}>
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="learn-topbar-info">
          <span className="learn-topic-badge" style={{ background: `color-mix(in srgb, ${topic.color} 14%, transparent)`, color: topic.color }}>
            <span className="badge-icon" style={{ color: topic.color }}><topic.icon size={14}/></span>
            {topic.name}
          </span>
          <span className="learn-lesson-title">{assignment.title}</span>
        </div>
        <span className="learn-counter">
          {phase === 'study' ? 'Study Material' : `${currentQ + 1} / ${totalQ}`}
        </span>
      </div>

      <div
        className="learn-progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progressPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Lesson progress"
      >
        <div className="learn-progress-fill" aria-hidden="true" style={{ width: `${progressPct}%`, background: topic.color }} />
      </div>

      {phase === 'study' && (
        <div className="study-card">
          <div className="study-header">
            <h1 className="study-title">{assignment.title}</h1>
            <span className="difficulty-badge" style={{ background: `color-mix(in srgb, ${topic.color} 14%, transparent)`, color: topic.color }}>
              {assignment.difficulty}
            </span>
          </div>
          <p className="study-intro">{assignment.lesson.introduction}</p>

          <h3 className="concepts-heading">Key Concepts</h3>
          <div className="concepts-list">
            {assignment.lesson.concepts.map((concept, i) => (
              <div
                key={i}
                className={`concept-item ${expandedConcept === i ? 'expanded' : ''}`}
                >
                <button
                  type="button"
                  className="concept-header"
                  aria-expanded={expandedConcept === i}
                  aria-controls={`concept-body-${i}`}
                  onClick={() => setExpandedConcept(expandedConcept === i ? -1 : i)}
                >
                    <span className="concept-bullet" style={{ background: topic.color }}></span>
                    <span className="concept-title">{concept.title}</span>
                    {expandedConcept === i ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
                </button>

                <div
                  id={`concept-body-${i}`}
                  className={`concept-body ${expandedConcept === i ? 'open' : ''}`}
                >
                    <div className="concept-body-inner">
                    <p className="concept-explanation">{concept.explanation}</p>
                    </div>
                </div>
                </div>
            ))}
          </div>

          <button
            className="start-quiz-btn"
            onClick={() => setPhase('quiz')}
            style={{ background: topic.color }}
          >
            Start Quiz →
          </button>
        </div>
      )}

      {phase === 'quiz' && (
        <div
            className="question-card"
            key={currentQ}
            style={{ '--accent': topic.color }}
        >
          <div className="question-number">Question {currentQ + 1}</div>
          <h2 className="question-text">{q.question}</h2>

          {renderQuestionBody()}

          {checked && !isCorrect && q.type === 'fill_blank' && (
            <div className="answer-reveal">
              Correct answer: <strong>{q.answer}</strong>
            </div>
          )}

          {checked && (
            <div className={`explanation ${verdictClass}`} role="status">
              <strong>{verdictText}</strong>
              <p>{q.explanation}</p>
            </div>
          )}

          <div className="question-actions">
            {!checked ? (
              <button
                className="check-btn"
                onClick={handleCheck}
                disabled={!canCheck}
                style={{ background: topic.color }}
              >
                Check Answer
              </button>
            ) : (
              <button
                className="next-btn"
                onClick={handleNext}
                style={{ background: topic.color }}
              >
                {currentQ + 1 >= totalQ ? 'See Results →' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
