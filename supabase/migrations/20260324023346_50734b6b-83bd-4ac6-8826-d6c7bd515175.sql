
CREATE POLICY "Anon manage conversations"
ON public.conversations
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anon manage messages"
ON public.messages
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
