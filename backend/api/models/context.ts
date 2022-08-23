import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";

export interface ctxModel extends Context {
    params: any
}
