import { Link } from 'react-router-dom';
import './ContinueCard.css';

export default function ContinueCard({ lesson, topic }) {
  const pct = Math.round((lesson.progress / lesson.total) * 100);
  const Icon = topic.icon;

  return (
    <Link
      to={`/learn/${lesson.id}`}
      className="continue-card continue-hero"
      style={{ borderLeftColor: topic.color }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
      }}
    >
      <div className="continue-card-top">
        <span
          className="topic-badge"
          style={{ background: `color-mix(in srgb, ${topic.color} 14%, transparent)`, color: topic.color }}
        >
          <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
          {topic.name}
        </span>
        <span className="continue-pct">{pct}%</span>
      </div>

      <h3 className="continue-title">{lesson.title}</h3>

      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${lesson.title} progress`}
      >
        <div
          className="progress-bar-fill"
          aria-hidden="true"
          style={{ width: `${pct}%`, background: topic.color }}
        />
      </div>

      <div className="continue-meta">
        <span>{lesson.progress}/{lesson.total} completed</span>
        <span className="continue-btn">Continue →</span>
      </div>
    </Link>
  );
}
