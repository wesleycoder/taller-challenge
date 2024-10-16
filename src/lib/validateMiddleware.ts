import type { NextFunction, Request, Response } from 'express'
import { type AnyZodObject, ZodError } from 'zod'

export const validateRequest =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors })
      } else {
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  }
