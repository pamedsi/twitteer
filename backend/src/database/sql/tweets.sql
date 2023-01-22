CREATE TABLE public.tweets (
    -- tweet_id uuid not null default uuid_generate_v4() primary key,
	tweet_id uuid NOT NULL PRIMARY KEY,
	tweet_owner_id uuid NOT NULL,
	"location" varchar,
	"content" varchar NOT NULL,
	created_at timestamp NOT NULL,
	deleted boolean NOT NULL DEFAULT false,
	replies_to uuid,
	CONSTRAINT tweets_fk FOREIGN KEY (tweet_owner_id) REFERENCES public.users(user_id)
);