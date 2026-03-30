import { Database } from 'bun:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { config } from '../config.ts'

mkdirSync(dirname(config.dbPath), { recursive: true })

export const db = new Database(config.dbPath)
