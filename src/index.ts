import express from 'express'
import env from './lib/env.js'
import { tasksRouter } from './tasks/route.js'

export const app = express()

app.use(express.json())

app.use(tasksRouter)

app.get('/', (_, res) => {
  res.send('ok')
})

if (import.meta.env.PROD) {
  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`)
  })
}
