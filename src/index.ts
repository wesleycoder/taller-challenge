import express from 'express'
import env from './lib/env.js'
import { tasksRouter } from './tasks/route.js'

export const app = express()

app.get('/', (_, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Taller Challenge</title>
    </head>
    <body>
      <h1>Taller Challenge</h1>
      See more about this API on the <a href="https://github.com/wesleycoder/taller-challenge/README.md">GitHub</a> repository.
    </body>
  `)
})

app.use(express.json())
app.use(tasksRouter)

if (import.meta.env.PROD) {
  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`)
  })
}
