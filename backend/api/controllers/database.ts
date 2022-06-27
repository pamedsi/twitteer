import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts'

export const client = new Client({
    user: "postgres",
    database: "postgres",
    hostname: "localhost",
    port: 5432,
    password: '4002',
  });

await client.connect()