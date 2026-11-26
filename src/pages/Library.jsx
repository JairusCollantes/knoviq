import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { topics, lessons, topicById } from '../data/Data';
import ContinueCard from '../components/ContinueCard';
import './Library.css';

export default function Library() {
  const [search, setSearch] = useState('');
  const nextLesson = lessons
    .filter((l) => l.progress < l.total)
    .sort((a, b) => b.progress / b.total - a.progress / a.total)[0];
  const nextTopic = nextLesson ? topicById(nextLesson.topicId) : null;

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
        <p className="lib-subtitle">Pick up where you left off, or start something new.</p>
      </header>

      {nextLesson && (
        <section className="lib-continue" aria-label="Continue learning">
          <ContinueCard lesson={nextLesson} topic={nextTopic} />
        </section>
      )}

      <div className="search-wrap" role="search">
        <Search size={16} className="search-icon" aria-hidden="true" />
        <label htmlFor="lesson-search" className="visually-hidden">
          Search lessons
        </label>
        <input
          id="lesson-search"
          type="search"
          placeholder="Search lessons..."
          aria-label="Search lessons"
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
                      <div
                        className="lib-mini-bar"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${l.title} progress`}
                      >
                        <div
                          className="lib-mini-fill"
                          aria-hidden="true"
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

      <button
        type="button"
        className="generate-btn"
        disabled
        title="Lesson generation is coming soon"
      >
        <Plus size={16} aria-hidden="true" />
        Generate Lesson
      </button>
    </div>
  );
}