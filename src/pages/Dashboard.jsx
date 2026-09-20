import { Link } from 'react-router-dom';
import { CodeXml, SquareFunction } from 'lucide-react';
import './Dashboard.css';

const topics = [
  { id: 'java', name: 'Java', color: '#f89820', icon: <CodeXml /> },
  { id: 'cpp', name: 'C++', color: '#00599C', icon: <CodeXml /> },
  { id: 'calculus', name: 'Calculus', color: '#e74c3c', icon: <SquareFunction /> },
];

export default function Dashboard() {
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

            <Link to="/learn/1" className="continue-card">
              <div className="continue-card-top">
                <span
                  className="topic-badge"
                  style={{ background: '#f8982022', color: '#f89820' }}
                >
                  <CodeXml />
                  Intro to JavaScript
                </span>
                <span className="continue-pct">50%</span>
              </div>

              <h3 className="continue-title">Getting Started with Variables</h3>

              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: '50%', background: '#f89820' }}
                />
              </div>

              <div className="continue-meta">
                <span>5/10 completed</span>
                <span className="continue-btn">Continue →</span>
              </div>
            </Link>
          </section>

          <section className="dash-section dash-section-fill">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              {[
                { id: 1, text: 'Completed Java OOP Basics', score: '8/10', time: '2 hours ago', type: 'complete' },
                { id: 2, text: 'Practiced C++ Linked Lists', score: '9/10', time: '5 hours ago', type: 'practice' },
              ].map((a) => (
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
                    {t.icon}
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