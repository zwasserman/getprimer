
-- Allow anon read access to home_profiles (for unauthenticated/prototype usage)
CREATE POLICY "Anon read home profiles"
ON public.home_profiles FOR SELECT
TO anon
USING (true);

-- Allow anon read access to home_tasks
CREATE POLICY "Anon read home tasks"
ON public.home_tasks FOR SELECT
TO anon
USING (true);

-- Allow anon insert/update home_tasks (for completing tasks without auth)
CREATE POLICY "Anon manage home tasks"
ON public.home_tasks FOR ALL
TO anon
USING (true)
WITH CHECK (true);
