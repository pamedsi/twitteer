CREATE TABLE public.likes (
	like_id uuid not null primary key,
	tweet_liked_id uuid NOT NULL,
	user_who_liked uuid NOT NULL,
	created_at timestamp,
	CONSTRAINT like_fk FOREIGN KEY (tweet_liked_id) REFERENCES public.tweets(tweet_id),
	CONSTRAINT like_fk2 FOREIGN KEY (user_who_liked) REFERENCES public.users(user_id)
);