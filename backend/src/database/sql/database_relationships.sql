ALTER TABLE public.posts ADD FOREIGN KEY (post_owner_id) REFERENCES public.users(user_id);
ALTER TABLE public.comments ADD FOREIGN KEY (comment_owner_id) REFERENCES public.users(user_id);
ALTER TABLE public.comments ADD FOREIGN KEY (commented_post_id) REFERENCES public.posts(post_id);
ALTER TABLE public.followers ADD FOREIGN KEY (followed_id) REFERENCES public.users(user_id);
ALTER TABLE public.followers ADD FOREIGN KEY (following_id) REFERENCES public.users(user_id);
