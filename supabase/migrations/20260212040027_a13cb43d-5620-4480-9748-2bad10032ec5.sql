
-- =============================================
-- 1. Create profiles table
-- =============================================
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. Add user_id columns to existing tables
-- =============================================

-- conversations
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- home_profiles
ALTER TABLE public.home_profiles
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- home_tasks
ALTER TABLE public.home_tasks
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- home_documents
ALTER TABLE public.home_documents
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- =============================================
-- 3. Replace permissive RLS policies with user-scoped
-- =============================================

-- conversations
DROP POLICY IF EXISTS "Allow all access to conversations" ON public.conversations;
CREATE POLICY "Users manage own conversations"
  ON public.conversations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- messages (through conversation ownership)
DROP POLICY IF EXISTS "Allow all access to messages" ON public.messages;
CREATE POLICY "Users manage own messages"
  ON public.messages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid())
  );

-- home_profiles
DROP POLICY IF EXISTS "Full access home_profiles" ON public.home_profiles;
CREATE POLICY "Users manage own home profile"
  ON public.home_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- home_tasks
DROP POLICY IF EXISTS "Full access home_tasks" ON public.home_tasks;
CREATE POLICY "Users manage own home tasks"
  ON public.home_tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- home_documents
DROP POLICY IF EXISTS "Full access home_documents" ON public.home_documents;
CREATE POLICY "Users manage own home documents"
  ON public.home_documents FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 4. Fix storage policies (user-scoped)
-- =============================================
DROP POLICY IF EXISTS "Anyone can upload home documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view home documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete home documents" ON storage.objects;

CREATE POLICY "Users upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'home-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users view own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'home-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'home-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
