import { Link } from 'react-router-dom';
import { topicById, continueLearning, stats, upNextLessons } from '../data/Data';
import './Dashboard.css';

export default function Dashboard() {
  const topicColor = topicById(continueLearning.topicId).color;
  const streak = stats.find((s) => s.id === 'streak');
  const upNext = upNextLessons(3);
  const topPick = upNext[0];

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

            <Link to={`/learn/${continueLearning.lessonId}`} className="continue-card">
              <div className="continue-card-top">
                <span
                  className="topic-badge"
                  style={{ background: topicColor + '22', color: topicColor }}
                >
                  <continueLearning.icon />
                  {continueLearning.badge}
                </span>
                <span className="continue-pct">{continueLearning.pct}%</span>
              </div>

              <h3 className="continue-title">{continueLearning.title}</h3>

              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
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
                      <t.icon />
                    </span>
                    <span className="dash-upnext-title">{l.title}</span>
                    <div className="dash-upnext-progress">
                      <div className="dash-upnext-bar">
                        <div
                          className="dash-upnext-fill"
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
            <h2 className="section-title">Day Streak</h2>
            <div className="dash-streak-card">
              <span className="dash-streak-icon">
                <streak.icon size={22} />
              </span>
              <span className="dash-streak-value">{streak.value}</span>
              <span className="dash-streak-label">days in a row</span>
              <p className="dash-streak-sub">
                {topPick ? (
                  <>Quiz <strong>{topPick.title}</strong> today to keep it burning.</>
                ) : (
                  'Quiz today to keep it burning.'
                )}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
