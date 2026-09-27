import { Link } from 'react-router-dom';
import { user, topics, lessons, recentActivity, stats, topicById } from '../data/Data';
import './Profile.css';

export default function Profile() {
  return (
    <div className="profile">
      <header className="prof-header">
        <h1>Profile</h1>
        <p className="prof-subtitle">Your progress at a glance.</p>
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

      <div className="prof-grid">
        <div className="prof-col-main">
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

        <aside className="prof-col-side">
          <section className="prof-section">
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
                    <t.icon/>
                  </span>
                  <span className="topic-chip-name">{t.name}</span>
                </Link>
              ))}
              <button className="topic-chip add-topic" type="button">+ Add Topic</button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
