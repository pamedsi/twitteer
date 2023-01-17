import {Context} from "https://deno.land/x/oak@v10.6.0/mod.ts";

export interface ctxModel extends Context {
    params: {
        user_id?: string
        tweet_id?: string
        comment_id?: string
        followed_id?: string
        unfollowed_id?: string
        key?: string
        value?: string
    }
}
