
-- Update task_type check to include new types
ALTER TABLE public.task_templates DROP CONSTRAINT task_templates_task_type_check;
ALTER TABLE public.task_templates ADD CONSTRAINT task_templates_task_type_check CHECK (task_type = ANY (ARRAY['one_time'::text, 'recurring'::text, 'seasonal'::text, 'info'::text, 'guided_process'::text, 'ongoing'::text]));

-- Update category check to include 'structure'
ALTER TABLE public.task_templates DROP CONSTRAINT task_templates_category_check;
ALTER TABLE public.task_templates ADD CONSTRAINT task_templates_category_check CHECK (category = ANY (ARRAY['security'::text, 'plumbing'::text, 'electrical'::text, 'safety'::text, 'hvac'::text, 'exterior'::text, 'interior'::text, 'appliances'::text, 'structure'::text, 'general'::text, 'financial'::text, 'legal'::text]));
