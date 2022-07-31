CREATE TABLE public.followers (
	user_followed uuid NOT NULL,
	user_following uuid NOT NULL,
	CONSTRAINT followers_fk FOREIGN KEY (user_followed) REFERENCES public.users(user_id),
	CONSTRAINT followers_fk_1 FOREIGN KEY (user_following) REFERENCES public.users(user_id)
);
