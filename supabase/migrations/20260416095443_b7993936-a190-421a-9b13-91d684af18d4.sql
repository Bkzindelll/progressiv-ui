
-- Client dashboard data (one row per client)
CREATE TABLE public.client_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  project_name TEXT,
  status TEXT DEFAULT 'Não iniciado',
  progress INTEGER DEFAULT 0,
  next_delivery TEXT,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.client_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on client_data" ON public.client_data FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own data" ON public.client_data FOR SELECT USING (auth.uid() = user_id);

CREATE TRIGGER update_client_data_updated_at BEFORE UPDATE ON public.client_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Timeline steps per client
CREATE TABLE public.timeline_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client_data(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  step_date TEXT,
  responsible TEXT,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on timeline_steps" ON public.timeline_steps FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own steps" ON public.timeline_steps FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.client_data cd WHERE cd.id = client_id AND cd.user_id = auth.uid())
);

CREATE TRIGGER update_timeline_steps_updated_at BEFORE UPDATE ON public.timeline_steps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Timeline updates (history per step)
CREATE TABLE public.timeline_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID NOT NULL REFERENCES public.timeline_steps(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on timeline_updates" ON public.timeline_updates FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own updates" ON public.timeline_updates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.timeline_steps ts
    JOIN public.client_data cd ON cd.id = ts.client_id
    WHERE ts.id = step_id AND cd.user_id = auth.uid()
  )
);

-- Client files
CREATE TABLE public.client_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client_data(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything on client_files" ON public.client_files FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients can view own files" ON public.client_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.client_data cd WHERE cd.id = client_id AND cd.user_id = auth.uid())
);

-- Storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('client-files', 'client-files', true);

CREATE POLICY "Admins can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete files" ON storage.objects FOR DELETE USING (bucket_id = 'client-files' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone authenticated can view files" ON storage.objects FOR SELECT USING (bucket_id = 'client-files');

-- Also create client_data row automatically when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');

  INSERT INTO public.client_data (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;
