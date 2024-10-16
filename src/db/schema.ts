import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
})

export type Task = typeof tasks.$inferSelect
export type InsertTask = typeof tasks.$inferInsert

// Create Zod schemas
export const insertTaskSchema = createInsertSchema(tasks)
export const selectTaskSchema = createSelectSchema(tasks)

// Create a partial schema for updates
export const updateTaskSchema = insertTaskSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true })
