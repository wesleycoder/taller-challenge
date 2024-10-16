import * as schema from '@/db/schema.js'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import express, { type Express } from 'express'
import request from 'supertest'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { tasksRouter } from './route.js'

let app: Express

beforeAll(() => {
  vi.mock('@/db/index.js', () => {
    const sqlite = new Database(':memory:')
    const db = drizzle(sqlite, { schema })
    db.run(`CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )`)
    db.run(`INSERT INTO tasks (title, description) VALUES ('Task 1', 'Description 1');`)
    db.run(`INSERT INTO tasks (title, description) VALUES ('Task 2', 'Description 2');`)

    return {
      db: drizzle(sqlite, { schema }),
    }
  })

  app = express()
  app.use(express.json())
  app.use(tasksRouter)
})

describe('API Endpoints', () => {
  it('POST /tasks - should create a new task', async () => {
    const res = await request(app).post('/tasks').send({ title: 'New Task' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('New Task')
  })

  it('GET /tasks - should return all tasks', async () => {
    const res = await request(app).get('/tasks')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /tasks/:id - should return a specific task', async () => {
    const createRes = await request(app).post('/tasks').send({ title: 'Task to Retrieve' })

    const taskId = createRes.body.id

    const res = await request(app).get(`/tasks/${taskId}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(taskId)
    expect(res.body.title).toBe('Task to Retrieve')
  })

  it('PUT /tasks/:id - should update a task', async () => {
    // First, create a task
    const createRes = await request(app).post('/tasks').send({ title: 'Task to Update' })

    const taskId = createRes.body.id

    const res = await request(app).put(`/tasks/${taskId}`).send({ title: 'Updated Task' })

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(taskId)
    expect(res.body.title).toBe('Updated Task')
  })

  it('DELETE /tasks/:id - should delete a task', async () => {
    // First, create a task
    const createRes = await request(app).post('/tasks').send({ title: 'Task to Delete' })

    const taskId = createRes.body.id

    const res = await request(app).delete(`/tasks/${taskId}`)

    expect(res.status).toBe(204)

    // Verify the task is deleted
    const getRes = await request(app).get(`/tasks/${taskId}`)
    expect(getRes.status).toBe(404)
  })
})
