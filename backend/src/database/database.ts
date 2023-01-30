import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import { env } from '../env.ts';

export const client = new Client(env)
await client.connect()