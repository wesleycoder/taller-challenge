import env from '@/lib/env.js'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.js'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  schema,
})
