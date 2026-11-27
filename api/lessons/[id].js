import { serviceDb, getUser, requireMethod, ok, fail } from '../_supabase.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, ['GET'])) return;

  const id = req.query?.id;
  if (!id) return fail(res, 400, 'Missing lesson id');

  const db = serviceDb();
  const user = await getUser(req);

  const { data: lesson, error } = await db
    .from('lessons')
    .select('id, topic_id, title, difficulty, introduction, concepts, created_by, topics (id, name, color, icon)')
    .eq('id', id)
    .maybeSingle();

  if (error) return fail(res, 500, error.message);
  if (!lesson || (lesson.created_by && lesson.created_by !== user?.id)) {
    return fail(res, 404, 'Lesson not found');
  }

  // Answer columns (answer, accepted_answers, explanation) are deliberately not selected.
  const { data: questions, error: questionError } = await db
    .from('questions')
    .select('id, type, question, options, pairs, metadata')
    .eq('lesson_id', id);

  if (questionError) return fail(res, 500, questionError.message);

  return ok(res, {
    lesson: {
      id: lesson.id,
      topicId: lesson.topic_id,
      title: lesson.title,
      difficulty: lesson.difficulty,
      introduction: lesson.introduction,
      concepts: lesson.concepts,
    },
    topic: lesson.topics,
    questions: questions || [],
  });
}
