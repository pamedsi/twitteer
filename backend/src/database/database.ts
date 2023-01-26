import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import { env } from '../env.ts';

const { user, database, hostname, port, password } = env
export const client = new Client({user,database,hostname,port,password})
await client.connect()