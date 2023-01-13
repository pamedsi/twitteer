ALTER TABLE public.tweets ADD FOREIGN KEY (tweet_owner_id) REFERENCES public.users(user_id);
ALTER TABLE public.comments ADD FOREIGN KEY (comment_owner_id) REFERENCES public.users(user_id);
ALTER TABLE public.comments ADD FOREIGN KEY (commented_tweet_id) REFERENCES public.tweets(tweet_id);
ALTER TABLE public.followers ADD FOREIGN KEY (followed_id) REFERENCES public.users(user_id);
ALTER TABLE public.followers ADD FOREIGN KEY (following_id) REFERENCES public.users(user_id);
