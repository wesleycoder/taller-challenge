import { config } from '@dotenvx/dotenvx'
import { z } from 'zod'

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
    DATABASE_AUTH_TOKEN: z.string().min(1).default('-'),
    isProduction: z.boolean().default(false),
    isDevelopment: z.boolean().default(true),
  })
  .transform((data) => ({
    ...data,
    isProduction: data.NODE_ENV === 'production',
    isDevelopment: data.NODE_ENV === 'development',
  }))

const { parsed } = config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
})

if (!parsed) {
  throw new Error('No environment variables found')
}

export default envSchema.parse({ ...parsed, ...process.env })
