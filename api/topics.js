import { serviceDb, requireMethod, ok, fail } from './_supabase.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, ['GET'])) return;

  const { data, error } = await serviceDb()
    .from('topics')
    .select('id, name, color, icon')
    .order('name');

  if (error) return fail(res, 500, error.message);

  return ok(res, { topics: data });
}
