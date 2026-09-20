import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeXml, SquareFunction } from 'lucide-react';
import './Library.css';

const topics = [
  { id: 'java', name: 'Java', color: '#f89820', icon: <CodeXml /> },
  { id: 'cpp', name: 'C++', color: '#00599C', icon: <CodeXml /> },
  { id: 'calculus', name: 'Calculus', color: '#e74c3c', icon: <SquareFunction /> },
];


const lessons = [
  { id: 'java-oop', topicId: 'java', title: 'OOP Basics', difficulty: 'beginner', progress: 8, total: 10 },
  { id: 'java-inheritance', topicId: 'java', title: 'Inheritance', difficulty: 'intermediate', progress: 9, total: 10 },
  { id: 'java-interfaces', topicId: 'java', title: 'Interfaces', difficulty: 'intermediate', progress: 7, total: 10 },
  { id: 'cpp-pointers', topicId: 'cpp', title: 'Pointers', difficulty: 'advanced', progress: 6, total: 10 },
  { id: 'cpp-linked-lists', topicId: 'cpp', title: 'Linked Lists', difficulty: 'intermediate', progress: 9, total: 10 },
  { id: 'calc-limits', topicId: 'calculus', title: 'Limits & Continuity', difficulty: 'beginner', progress: 5, total: 10 },
];


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
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search lessons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="lib-topics">
        {filteredTopics.map((t) => (
          <div key={t.id} className="lib-topic-group">
            <div className="lib-topic-header">
              <span className="lib-topic-icon">{t.icon}</span>
              <h2 className="lib-topic-name">{t.name}</h2>
              <span className="lib-topic-count">{t.lessons.length} lessons</span>
            </div>
            <div className="lib-lesson-list">
              {t.lessons.map((l, i) => {
                const pct = Math.round((l.progress / l.total) * 100);
                return (
                  <Link key={l.id} to={`/learn/${l.id}`} className="lib-lesson-row">
                    <span className="lib-tree">{i === t.lessons.length - 1 ? '└──' : '├──'}</span>
                    <span className="lib-lesson-title">{l.title}</span>
                    <span className="lib-difficulty" style={{ color: t.color }}>{l.difficulty}</span>
                    <div className="lib-lesson-progress">
                      <div className="lib-mini-bar">
                        <div className="lib-mini-fill" style={{ width: `${pct}%`, background: t.color }} />
                      </div>
                      <span className="lib-lesson-score">{l.progress}/{l.total}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="generate-btn">+ Generate Lesson</button>
    </div>
  );
}