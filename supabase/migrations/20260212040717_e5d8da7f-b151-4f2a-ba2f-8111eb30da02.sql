
-- Fix home_profiles RLS policy to be permissive
DROP POLICY IF EXISTS "Users manage own home profile" ON public.home_profiles;
CREATE POLICY "Users manage own home profile"
ON public.home_profiles FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix home_tasks RLS policy to be permissive
DROP POLICY IF EXISTS "Users manage own home tasks" ON public.home_tasks;
CREATE POLICY "Users manage own home tasks"
ON public.home_tasks FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Fix task_templates - keep public read but make it permissive
DROP POLICY IF EXISTS "Public read task_templates" ON public.task_templates;
CREATE POLICY "Public read task_templates"
ON public.task_templates FOR SELECT
USING (true);
