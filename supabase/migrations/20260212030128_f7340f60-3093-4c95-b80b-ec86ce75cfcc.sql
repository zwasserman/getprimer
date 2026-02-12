-- Add mission column to task_templates
ALTER TABLE public.task_templates 
ADD COLUMN IF NOT EXISTS mission text;

-- Update existing rows with a default mission (will be replaced by seed data)
UPDATE public.task_templates SET mission = 'know_your_home' WHERE mission IS NULL;