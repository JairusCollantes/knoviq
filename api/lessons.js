import { serviceDb, getUser, requireMethod, ok, fail } from './_supabase.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, ['GET'])) return;

  const db = serviceDb();
  const user = await getUser(req);
  const { topicId, difficulty } = req.query || {};

  let query = db
    .from('lessons')
    .select('id, topic_id, title, difficulty, created_by, created_at')
    .order('created_at');
  if (topicId) query = query.eq('topic_id', topicId);
  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data: rows, error } = await query;
  if (error) return fail(res, 500, error.message);

  const lessons = (rows || []).filter((l) => l.created_by === null || l.created_by === user?.id);
  if (!lessons.length) return ok(res, { lessons: [] });

  const ids = lessons.map((l) => l.id);
  const attemptQuery = user
    ? db
        .from('attempts')
        .select('lesson_id, correct_count, total, score_pct, created_at')
        .eq('user_id', user.id)
        .in('lesson_id', ids)
        .order('created_at', { ascending: false })
    : null;

  const [questionsResult, attemptsResult] = await Promise.all([
    db.from('questions').select('lesson_id').in('lesson_id', ids),
    attemptQuery || Promise.resolve({ data: [], error: null }),
  ]);

  if (questionsResult.error) return fail(res, 500, questionsResult.error.message);
  if (attemptsResult.error) return fail(res, 500, attemptsResult.error.message);

  const questionCounts = {};
  for (const row of questionsResult.data || []) {
    questionCounts[row.lesson_id] = (questionCounts[row.lesson_id] || 0) + 1;
  }

  const latestAttempt = new Map();
  for (const attempt of attemptsResult.data || []) {
    if (!latestAttempt.has(attempt.lesson_id)) latestAttempt.set(attempt.lesson_id, attempt);
  }

  return ok(res, {
    lessons: lessons.map((lesson) => {
      const attempt = latestAttempt.get(lesson.id);
      return {
        id: lesson.id,
        topicId: lesson.topic_id,
        title: lesson.title,
        difficulty: lesson.difficulty,
        progress: attempt?.correct_count ?? 0,
        total: attempt?.total ?? questionCounts[lesson.id] ?? 0,
        scorePct: attempt?.score_pct ?? null,
        lastAttemptAt: attempt?.created_at ?? null,
      };
    }),
  });
}
