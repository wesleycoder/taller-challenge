import { db } from '@/db/index.js'
import { insertTaskSchema, tasks, updateTaskSchema } from '@/db/schema.js'
import { eq } from 'drizzle-orm'
import { Router } from 'express'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'

export const tasksRouter = Router()

tasksRouter.get('/tasks', async (_req, res) => {
  const allTasks = await db.select().from(tasks)
  res.json(allTasks)
})

tasksRouter.post('/tasks', validateRequest({ body: insertTaskSchema }), async (req, res) => {
  const newTask = insertTaskSchema.parse(req.body)

  const [task] = await db.insert(tasks).values(newTask).returning()

  res.status(201).json(task)
  return
})

tasksRouter.get<{ id: string }>('/tasks/:id', async (req, res) => {
  const id = z.coerce.number().parse(req.params.id)

  const [task] = await db.select().from(tasks).where(eq(tasks.id, id))

  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.json(task)
})

tasksRouter.put<{ id: string }>(
  '/tasks/:id',
  validateRequest({ body: updateTaskSchema }),
  async (req, res) => {
    const id = z.coerce.number().parse(req.params.id)
    const newTask = updateTaskSchema.parse(req.body)

    const [updatedTask] = await db.update(tasks).set(newTask).where(eq(tasks.id, id)).returning()

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.json(updatedTask)
  },
)

tasksRouter.delete<{ id: string }>('/tasks/:id', async (req, res) => {
  const id = z.coerce.number().parse(req.params.id)

  const deletedTask = await db.delete(tasks).where(eq(tasks.id, id)).returning()

  if (deletedTask.length === 0) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  res.status(204).send()
})
