import {
  CodeXml,
  SquareFunction
} from 'lucide-react';

export const topics = [
  { id: 'java', name: 'Java', color: '#4a9eff', icon: CodeXml },
  { id: 'cpp', name: 'C++', color: '#eab308', icon: CodeXml },
  { id: 'calculus', name: 'Calculus', color: '#e74c3c', icon: SquareFunction },
];

export function topicById(topicId) {
  return topics.find((t) => t.id === topicId) || topics[0];
}

export const continueLearning = {
  lessonId: 'java-oop',
  badge: 'Intro to JavaScript',
  topicId: 'java',
  title: 'Getting Started with Variables',
  pct: 50,
  completed: 5,
  total: 10,
  icon: CodeXml,
};

export const recentActivity = [
  { id: 1, text: 'Completed Java OOP Basics', score: '8/10', time: '2 hours ago', type: 'complete' },
  { id: 2, text: 'Practiced C++ Linked Lists', score: '9/10', time: '5 hours ago', type: 'practice' },
];

export const lessons = [
  { id: 'java-oop', topicId: 'java', title: 'OOP Basics', difficulty: 'beginner', progress: 8, total: 10 },
  { id: 'java-inheritance', topicId: 'java', title: 'Inheritance', difficulty: 'intermediate', progress: 9, total: 10 },
  { id: 'java-interfaces', topicId: 'java', title: 'Interfaces', difficulty: 'intermediate', progress: 7, total: 10 },
  { id: 'cpp-pointers', topicId: 'cpp', title: 'Pointers', difficulty: 'advanced', progress: 6, total: 10 },
  { id: 'cpp-linked-lists', topicId: 'cpp', title: 'Linked Lists', difficulty: 'intermediate', progress: 9, total: 10 },
  { id: 'calc-limits', topicId: 'calculus', title: 'Limits & Continuity', difficulty: 'beginner', progress: 5, total: 10 },
];
