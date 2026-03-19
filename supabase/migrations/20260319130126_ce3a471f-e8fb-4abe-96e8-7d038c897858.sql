CREATE OR REPLACE FUNCTION public.submit_contact_submission(
  p_name TEXT,
  p_email TEXT,
  p_subject TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_website TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  normalized_name TEXT := btrim(regexp_replace(COALESCE(p_name, ''), '\s+', ' ', 'g'));
  normalized_email TEXT := lower(btrim(COALESCE(p_email, '')));
  normalized_subject TEXT := NULLIF(btrim(regexp_replace(COALESCE(p_subject, ''), '\s+', ' ', 'g')), '');
  normalized_message TEXT := btrim(regexp_replace(COALESCE(p_message, ''), '\s+', ' ', 'g'));
  rl_identifier TEXT := md5(lower(btrim(COALESCE(p_email, ''))) || '|' || COALESCE(current_setting('request.headers', true), ''));
  recent_count INTEGER;
  created_id UUID;
BEGIN
  IF COALESCE(p_website, '') <> '' THEN
    RAISE EXCEPTION 'Spam detected';
  END IF;

  IF normalized_name = '' OR char_length(normalized_name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 1 and 100 characters';
  END IF;

  IF normalized_email = '' OR char_length(normalized_email) > 255 OR normalized_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Please provide a valid email address';
  END IF;

  IF normalized_subject IS NOT NULL AND char_length(normalized_subject) > 120 THEN
    RAISE EXCEPTION 'Subject must be 120 characters or less';
  END IF;

  IF normalized_message = '' OR char_length(normalized_message) < 10 OR char_length(normalized_message) > 2000 THEN
    RAISE EXCEPTION 'Message must be between 10 and 2000 characters';
  END IF;

  SELECT count(*) INTO recent_count
  FROM public.rate_limit_events
  WHERE action = 'contact_submission'
    AND identifier = rl_identifier
    AND created_at > now() - interval '15 minutes';

  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Too many messages sent recently. Please try again later.';
  END IF;

  INSERT INTO public.rate_limit_events (action, identifier)
  VALUES ('contact_submission', rl_identifier);

  INSERT INTO public.contact_submissions (name, email, subject, message)
  VALUES (normalized_name, normalized_email, normalized_subject, normalized_message)
  RETURNING id INTO created_id;

  RETURN created_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;