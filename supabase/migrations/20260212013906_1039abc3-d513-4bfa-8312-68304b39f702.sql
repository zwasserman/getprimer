
-- Task templates table (the 64 master tasks)
CREATE TABLE public.task_templates (
  id TEXT NOT NULL PRIMARY KEY,
  tier TEXT NOT NULL CHECK (tier IN ('T1', 'T2', 'T3', 'T4')),
  task_type TEXT NOT NULL CHECK (task_type IN ('one_time', 'recurring', 'seasonal', 'info')),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('security', 'plumbing', 'electrical', 'safety', 'hvac', 'exterior', 'interior', 'appliances', 'structure', 'general', 'financial', 'legal')),
  difficulty TEXT DEFAULT 'easy',
  diy_or_pro TEXT DEFAULT 'diy',
  est_time TEXT,
  est_cost_low INTEGER DEFAULT 0,
  est_cost_high INTEGER DEFAULT 0,
  frequency TEXT,
  frequency_days INTEGER,
  why_it_matters TEXT NOT NULL,
  timing_trigger TEXT,
  season TEXT,
  trigger_type TEXT CHECK (trigger_type IN ('CALENDAR', 'WEATHER', 'CALENDAR_WEATHER', 'CONDITION', NULL)),
  trigger_rule TEXT,
  urgency_escalation JSONB,
  skip_conditions TEXT[],
  is_prototype_task BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Home profile table
CREATE TABLE public.home_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  has_basement BOOLEAN NOT NULL DEFAULT true,
  has_garage BOOLEAN NOT NULL DEFAULT true,
  has_fireplace BOOLEAN NOT NULL DEFAULT true,
  has_sprinkler_system BOOLEAN NOT NULL DEFAULT true,
  has_lawn BOOLEAN NOT NULL DEFAULT true,
  has_deck BOOLEAN NOT NULL DEFAULT true,
  has_hoa BOOLEAN NOT NULL DEFAULT true,
  has_septic BOOLEAN NOT NULL DEFAULT true,
  has_ceiling_fans BOOLEAN NOT NULL DEFAULT true,
  has_furnace_humidifier BOOLEAN NOT NULL DEFAULT true,
  has_central_ac BOOLEAN NOT NULL DEFAULT true,
  has_gas BOOLEAN NOT NULL DEFAULT true,
  stories INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Home tasks (user task instances)
CREATE TABLE public.home_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT NOT NULL REFERENCES public.task_templates(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'not_triggered', 'upcoming', 'due', 'overdue', 'urgent', 'in_progress', 'completed', 'skipped', 'not_reviewed', 'reviewed')),
  urgency TEXT CHECK (urgency IN ('green', 'yellow', 'orange', 'red', NULL)),
  completed_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ,
  skipped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_tasks ENABLE ROW LEVEL SECURITY;

-- Public read for templates, full access for profiles and tasks (no auth yet)
CREATE POLICY "Public read task_templates" ON public.task_templates FOR SELECT USING (true);
CREATE POLICY "Full access home_profiles" ON public.home_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access home_tasks" ON public.home_tasks FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_task_templates_tier ON public.task_templates(tier);
CREATE INDEX idx_task_templates_category ON public.task_templates(category);
CREATE INDEX idx_home_tasks_template_id ON public.home_tasks(template_id);
CREATE INDEX idx_home_tasks_status ON public.home_tasks(status);

-- Trigger for updated_at
CREATE TRIGGER update_home_profiles_updated_at
  BEFORE UPDATE ON public.home_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_home_tasks_updated_at
  BEFORE UPDATE ON public.home_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
