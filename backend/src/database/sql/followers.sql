CREATE TABLE public.followers (
	-- follow_id uuid not null default uuid_generate_v4() primary key,
	follow_id uuid not null primary key,
	followed_id uuid NOT NULL,
	follower_id uuid NOT NULL,
	created_at timestamp,
	CONSTRAINT followers_fk FOREIGN KEY (followed_id) REFERENCES public.users(user_id),
	CONSTRAINT followers_fk_1 FOREIGN KEY (following_id) REFERENCES public.users(user_id)
);