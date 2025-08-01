import { db } from '@/db/drizlle';
import { categories, insertCategorySchema } from '@/db/schema';
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
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, auth.userId));

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
          id: categories.id,
          name: categories.name,
        })
        .from(categories)
        .where(
          and(eq(categories.userId, auth.userId), eq(categories.id, values.id))
        );

      if (data.length === 0) {
        return c.json({ error: 'Category not found' }, 404);
      }

      return c.json({ data: data[0] });
    }
  )
  .post(
    '/',
    clerkMiddleware(),
    zValidator('json', insertCategorySchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid('json');

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .insert(categories)
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
        .delete(categories)
        .where(
          and(
            eq(categories.userId, auth.userId),
            inArray(categories.id, values.ids)
          )
        )
        .returning({ id: categories.id });

      return c.json({ data });
    }
  )
  .patch(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    zValidator('json', insertCategorySchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');
      const values = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'Category ID is required' }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .update(categories)
        .set(values)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: 'Category not found' }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    '/:id',
    clerkMiddleware(),
    zValidator('param', z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'Category ID is required' }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const [data] = await db
        .delete(categories)
        .where(and(eq(categories.userId, auth.userId), eq(categories.id, id)))
        .returning({
          id: categories.id,
        });

      if (!data) {
        return c.json({ error: 'Category not found' }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
