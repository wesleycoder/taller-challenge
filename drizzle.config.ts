import { defineConfig } from 'drizzle-kit'
import env from './src/lib/env'

export default defineConfig({
  dialect: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  schema: './src/db/schema.ts',
  out: './drizzle',
})
