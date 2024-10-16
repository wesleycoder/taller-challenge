import { db } from '@/db/index.js'
import { insertTaskSchema, tasks, updateTaskSchema } from '@/db/schema.js'
import { validateRequest } from '@/lib/validateMiddleware.js'
import { eq } from 'drizzle-orm'
import { Router } from 'express'
import { z } from 'zod'

export const tasksRouter = Router()

tasksRouter
  .route('/tasks')
  .get(async (_req, res) => {
    const allTasks = await db.select().from(tasks)
    res.json(allTasks)
  })
  .post(validateRequest(insertTaskSchema), async (req, res) => {
    const { title } = insertTaskSchema.parse(req.body)

    const [newTask] = await db.insert(tasks).values({ title }).returning()

    res.status(201).json(newTask)
  })

tasksRouter
  .route('/tasks/:id')
  .get(async (req, res) => {
    const id = z.coerce.number().parse(req.params.id)

    const [task] = await db.select().from(tasks).where(eq(tasks.id, id))

    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(task)
  })
  .put(validateRequest(updateTaskSchema), async (req, res) => {
    const id = z.coerce.number().parse(req.params.id)
    const newTask = updateTaskSchema.parse(req.body)

    const [updatedTask] = await db.update(tasks).set(newTask).where(eq(tasks.id, id)).returning()

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(updatedTask)
  })
  .delete(async (req, res) => {
    const id = z.coerce.number().parse(req.params.id)

    const deletedTask = await db.delete(tasks).where(eq(tasks.id, id)).returning()

    if (deletedTask.length === 0) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.status(204).send()
  })
