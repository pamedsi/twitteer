import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts"

export const jwtKey = await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  )

export const env = config()
