import { Link } from 'react-router-dom';
import { topics, topicById, continueLearning, upNextLessons } from '../data/Data';
import './Dashboard.css';

export default function Dashboard() {
  const topicColor = topicById(continueLearning.topicId).color;
  const upNext = upNextLessons(3);

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1>What should I do now?</h1>
        <p className="dash-subtitle">Pick up where you left off, or tackle what's next.</p>
      </header>

      <div className="dash-grid">
        <div className="dash-col dash-col-main">
          <section className="dash-section">
            <h2 className="section-title">Continue Learning</h2>

            <Link
              to={`/learn/${continueLearning.lessonId}`}
              className="continue-card continue-hero"
              style={{ borderLeftColor: topicColor }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
            >
              <div className="continue-card-top">
                <span
                  className="topic-badge"
                  style={{ background: `color-mix(in srgb, ${topicColor} 14%, transparent)`, color: topicColor }}
                >
                  <continueLearning.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  {continueLearning.badge}
                </span>
                <span className="continue-pct">{continueLearning.pct}%</span>
              </div>

              <h3 className="continue-title">{continueLearning.title}</h3>

              <div
                className="progress-bar-track"
                role="progressbar"
                aria-valuenow={continueLearning.pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${continueLearning.title} progress`}
              >
                <div
                  className="progress-bar-fill"
                  aria-hidden="true"
                  style={{ width: `${continueLearning.pct}%`, background: topicColor }}
                />
              </div>

              <div className="continue-meta">
                <span>{continueLearning.completed}/{continueLearning.total} completed</span>
                <span className="continue-btn">Continue →</span>
              </div>
            </Link>
          </section>

          <section className="dash-section">
            <h2 className="section-title">Up Next</h2>
            <div className="dash-upnext-list">
              {upNext.map((l) => {
                const t = topicById(l.topicId);
                return (
                  <Link key={l.id} to={`/learn/${l.id}`} className="dash-upnext-row">
                    <span className="dash-upnext-icon" style={{ color: t.color }}>
                      <t.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="dash-upnext-title">{l.title}</span>
                    <div className="dash-upnext-progress">
                      <div
                        className="dash-upnext-bar"
                        role="progressbar"
                        aria-valuenow={l.pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${l.title} progress`}
                      >
                        <div
                          className="dash-upnext-fill"
                          aria-hidden="true"
                          style={{ width: `${l.pct}%`, background: t.color }}
                        />
                      </div>
                      <span className="dash-upnext-score">
                        {l.progress}/{l.total}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="dash-col dash-col-side">
          <section className="dash-section">
            <h2 className="section-title">Your Topics</h2>
            <div className="topics-list">
              {topics.map((t) => (
                <Link
                  key={t.id}
                  to="/library"
                  className="topic-chip"
                  style={{ borderColor: `color-mix(in srgb, ${t.color} 30%, transparent)` }}
                >
                  <span className="topic-chip-icon" style={{ color: t.color }}>
                    <t.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="topic-chip-name">{t.name}</span>
                </Link>
              ))}
              <button
                type="button"
                className="topic-chip add-topic"
                disabled
                title="Custom topics are coming soon"
              >
                + Add Topic
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
