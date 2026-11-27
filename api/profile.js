import { serviceDb, getUser, requireMethod, ok, fail, parseBody } from './_supabase.js';

const TEXT_FIELDS = { name: 80, handle: 40, initials: 4, bio: 280 };

export default async function handler(req, res) {
  if (!requireMethod(req, res, ['GET', 'PATCH'])) return;

  const user = await getUser(req);
  if (!user) return fail(res, 401, 'Sign in required');

  const db = serviceDb();

  if (req.method === 'GET') {
    const { data: found } = await db.from('profiles').select('*').eq('id', user.id).maybeSingle();
    let profile = found;

    // Users created before the signup trigger ran won't have a row yet.
    if (!profile) {
      const { data, error } = await db.from('profiles').insert({ id: user.id }).select().single();
      if (error) return fail(res, 500, error.message);
      profile = data;
    }

    return ok(res, { user: { id: user.id, email: user.email }, profile });
  }

  const body = parseBody(req);
  const patch = {};
  for (const [field, max] of Object.entries(TEXT_FIELDS)) {
    if (typeof body[field] === 'string') patch[field] = body[field].trim().slice(0, max);
  }
  if (!Object.keys(patch).length) return fail(res, 400, 'Nothing to update');

  const { data, error } = await db.from('profiles').update(patch).eq('id', user.id).select().single();
  if (error) return fail(res, 500, error.message);

  return ok(res, { profile: data });
}
