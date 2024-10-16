import * as schema from '@/db/schema.js'
import { createClient } from '@libsql/client'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/libsql'
import { unlinkSync } from 'node:fs'
import { afterAll, vi } from 'vitest'

vi.mock('@/db/index.js', async () => {
  const client = createClient({ url: 'file:./test.db' })
  const db = drizzle(client, { schema })

  await db.run(sql`CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT false,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )`)
  await db.run(sql`INSERT INTO tasks (title, description) VALUES ('Task 1', 'Description 1');`)
  await db.run(sql`INSERT INTO tasks (title, description) VALUES ('Task 2', 'Description 2');`)

  return { db }
})

afterAll(() => {
  unlinkSync('./test.db')
})
