
-- Add new columns to task_templates for new taxonomy
ALTER TABLE public.task_templates
  ADD COLUMN IF NOT EXISTS spawns_reminder boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS spawn_name text,
  ADD COLUMN IF NOT EXISTS spawn_frequency_days integer,
  ADD COLUMN IF NOT EXISTS is_consolidated boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consolidated_from text,
  ADD COLUMN IF NOT EXISTS conditional text,
  ADD COLUMN IF NOT EXISTS priority_level text DEFAULT 'recommended',
  ADD COLUMN IF NOT EXISTS required_systems text,
  ADD COLUMN IF NOT EXISTS notes text;
