import { db } from '@/db/drizlle';
import { accounts, insertAccountSchema } from '@/db/schema';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { createId } from '@paralleldrive/cuid2';
import z from 'zod';
const app = new Hono()
  .get('/', clerkMiddleware(), async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
      })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return c.json({ data });
  })
  .get(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('param');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      if (!values.id) {
        return c.json({ error: 'Account ID is required' }, 400);
      }

      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(
          and(eq(accounts.userId, auth.userId), eq(accounts.id, values.id))
        );

      if (data.length === 0) {
        return c.json({ error: 'Account not found' }, 404);
      }

      return c.json({ data: data[0] });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .insert(accounts)
        .values({
          id: createId(),
          userId: auth.userId,
          name: values.name,
        })
        .returning();
      return c.json({ data });
    }
  )
  .post(
    '/bulk-delete',
    clerkMiddleware(),
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({ id: accounts.id });

      return c.json({ data });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'Account ID is required' }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: 'Account not found' }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
