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
  lessonId: '1',
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
