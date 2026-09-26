import { Link } from 'react-router-dom';
import { topics, topicById, recentActivity, continueLearning } from '../data/Data';
import './Dashboard.css';

export default function Dashboard() {
  const topicColor = topicById(continueLearning.topicId).color;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <h1>Welcome back!</h1>
        <p className="dash-subtitle">Here's where you left off.</p>
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

          <section className="dash-section dash-section-fill">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((a) => (
                <div key={a.id} className="activity-item">
                  <div className="activity-dot-wrap">
                    <span className={`activity-dot ${a.type}`} />
                  </div>
                  <div className="activity-content">
                    <span className="activity-text">{a.text}</span>
                    <span className="activity-score">{a.score}</span>
                  </div>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
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
                  style={{ borderColor: t.color + '44' }}
                >
                  <span className="topic-chip-icon" style={{ color: t.color }}>
                    <t.icon />
                  </span>
                  <span className="topic-chip-name">{t.name}</span>
                </Link>
              ))}
              <button className="topic-chip add-topic">+ Add Topic</button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
