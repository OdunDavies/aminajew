CREATE POLICY "Admins can view rate limit events"
ON public.rate_limit_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rate limit events"
ON public.rate_limit_events
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));