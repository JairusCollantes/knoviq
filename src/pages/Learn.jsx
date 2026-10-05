import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { assignments } from '../data/Data';
import './Learn.css';

export default function Learn() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const assignment = assignments[lessonId];
  const topic = assignment?.topic;

  const [phase, setPhase] = useState('study');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [expandedConcept, setExpandedConcept] = useState(0);

  useEffect(() => {
    if (!assignment) navigate('/dashboard');
  }, [assignment, navigate]);

  if (!assignment) return null;

  const totalQ = assignment.questions.length;
  const q = assignment.questions[currentQ];
  const isCorrect = selected === q.answer;
  const progressPct = phase === 'study' ? 0 : ((currentQ + (checked ? 1 : 0)) / totalQ) * 100;

  function handleCheck() {
    if (!selected) return;
    setChecked(true);
    setAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        selected,
        correct: q.answer,
        isCorrect: selected === q.answer,
        explanation: q.explanation,
        options: q.options,
      },
    ]);
  }

  function handleNext() {
    if (currentQ + 1 >= totalQ) {
      const lastAnswer = {
        question: q.question,
        selected,
        correct: q.answer,
        isCorrect: selected === q.answer,
        explanation: q.explanation,
        options: q.options,
      };
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
      try {
        localStorage.setItem(attemptId, JSON.stringify(attemptData));
      } catch {
        // private-mode/quota: still navigate with state backup below
      }
      navigate(`/results/${attemptId}`, { state: { attempt: attemptData } });
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  return (
    <div className="learn-page">
      <div className="learn-topbar">
        <button className="back-btn" onClick={() => navigate('/library')}>
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="learn-topbar-info">
          <span className="learn-topic-badge" style={{ background: topic.color + '22', color: topic.color }}>
            <span className="badge-icon" style={{ color: topic.color }}><topic.icon size={14}/></span>
            {topic.name}
          </span>
          <span className="learn-lesson-title">{assignment.title}</span>
        </div>
        <span className="learn-counter">
          {phase === 'study' ? 'Study Material' : `${currentQ + 1} / ${totalQ}`}
        </span>
      </div>

      <div className="learn-progress-track">
        <div className="learn-progress-fill" style={{ width: `${progressPct}%`, background: topic.color }} />
      </div>

      {phase === 'study' && (
        <div className="study-card">
          <div className="study-header">
            <h1 className="study-title">{assignment.title}</h1>
            <span className="difficulty-badge" style={{ background: topic.color + '22', color: topic.color }}>
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
                onClick={() => setExpandedConcept(expandedConcept === i ? -1 : i)}
                >
                <div className="concept-header">
                    <span className="concept-bullet" style={{ background: topic.color }}></span>
                    <span className="concept-title">{concept.title}</span>
                    {expandedConcept === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                <div className={`concept-body ${expandedConcept === i ? 'open' : ''}`}>
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

          {checked && (
            <div className={`explanation ${isCorrect ? 'correct' : 'wrong'}`}>
              <strong>{isCorrect ? '🎉 Correct!' : '❌ Not quite.'}</strong>
              <p>{q.explanation}</p>
            </div>
          )}

          <div className="question-actions">
            {!checked ? (
              <button
                className="check-btn"
                onClick={handleCheck}
                disabled={!selected}
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