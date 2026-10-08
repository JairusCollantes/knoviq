import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { topics, lessons } from '../data/Data';
import './Library.css';

export default function Library() {
  const [search, setSearch] = useState('');

  const filteredTopics = topics
    .map((t) => ({
      ...t,
      lessons: lessons.filter(
        (l) => l.topicId === t.id && l.title.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((t) => t.lessons.length > 0 || search === '');

  return (
    <div className="library">
      <header className="lib-header">
        <h1>My Lessons</h1>
        <p className="lib-subtitle">Browse, search, and generate new lessons.</p>
      </header>

      <div className="search-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="lib-topics">
        {filteredTopics.map((t) => (
          <div
            key={t.id}
            className="lib-topic-group"
            style={{ '--topic-color': t.color }}
          >
            <div className="lib-topic-header">
              <span className="lib-topic-icon" style={{ color: t.color }}>
                <t.icon />
              </span>
              <h2 className="lib-topic-name">{t.name}</h2>
              <span className="lib-topic-count">
                {t.lessons.length} {t.lessons.length === 1 ? 'lesson' : 'lessons'}
              </span>
            </div>

            <div className="lib-lesson-list">
              {t.lessons.map((l) => {
                const pct = Math.round((l.progress / l.total) * 100);
                return (
                  <Link key={l.id} to={`/learn/${l.id}`} className="lib-lesson-row">
                    <span className="lib-lesson-title">{l.title}</span>
                    <span
                      className="lib-difficulty"
                      style={{ background: `color-mix(in srgb, ${t.color} 14%, transparent)`, color: t.color }}
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
          </div>
        ))}

        {filteredTopics.length === 0 && (
          <div className="lib-empty">
            No lessons match "{search}"
          </div>
        )}
      </div>

      <button className="generate-btn">
        <Plus size={16} />
        Generate Lesson
      </button>
    </div>
  );
}