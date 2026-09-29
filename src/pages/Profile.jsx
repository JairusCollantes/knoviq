import { Link } from 'react-router-dom';
import { user, lessons, recentActivity, stats, topicById, topicMastery } from '../data/Data';
import './Profile.css';

export default function Profile() {
  const mastery = topicMastery();

  return (
    <div className="profile">
      <header className="prof-header">
        <h1>How am I doing overall?</h1>
        <p className="prof-subtitle">Your progress and account at a glance.</p>
      </header>

      <section className="profile-hero">
        <div className="avatar">{user.initials}</div>
        <div className="profile-info">
          <h2 className="profile-name">{user.name}</h2>
          <span className="profile-handle">{user.handle}</span>
          <p className="profile-bio">{user.bio}</p>
          <span className="profile-joined">Joined {user.joined}</span>
        </div>
        <button className="edit-btn" type="button">
          Edit
        </button>
      </section>

      <section className="prof-section">
        <h2 className="section-title">Stats</h2>
        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.id} className="stat-card">
              <span className="stat-icon"><s.icon size = {16}/></span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="prof-section">
        <h2 className="section-title">Topic Mastery</h2>
        <div className="prof-mastery-list">
          {mastery.map((m) => (
            <div key={m.topic.id} className="prof-mastery-row">
              <span className="prof-mastery-icon" style={{ color: m.topic.color }}>
                <m.topic.icon />
              </span>
              <span className="prof-mastery-name">{m.topic.name}</span>
              <div className="prof-mastery-progress">
                <div className="prof-mastery-bar">
                  <div
                    className="prof-mastery-fill"
                    style={{ width: `${m.avgPct}%`, background: m.topic.color }}
                  />
                </div>
                <span className="prof-mastery-score">{m.avgPct}%</span>
              </div>
              <span className="prof-mastery-count">
                {m.done}/{m.total} lessons
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="prof-section">
        <h2 className="section-title">Lesson Progress</h2>
        <div className="lib-lesson-list">
          {lessons.map((l) => {
            const t = topicById(l.topicId);
            const pct = Math.round((l.progress / l.total) * 100);
            return (
              <Link key={l.id} to={`/learn/${l.id}`} className="lib-lesson-row">
                <span className="lib-lesson-title">{l.title}</span>
                <span
                  className="lib-difficulty"
                  style={{ background: t.color + '22', color: t.color }}
                >
                  {l.difficulty}
                </span>
                <div className="lib-lesson-progress">
                  <div className="lib-mini-bar">
                    <div
                      className="lib-mini-fill"
                      style={{ width: `${pct}%`, background: t.color }}
                    />
                  </div>
                  <span className="lib-lesson-score">
                    {l.progress}/{l.total}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="prof-section">
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
  );
}
