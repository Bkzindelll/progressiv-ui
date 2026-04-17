
ALTER TABLE public.timeline_steps ADD COLUMN IF NOT EXISTS client_feedback text;
ALTER TABLE public.client_data ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE public.client_data ADD COLUMN IF NOT EXISTS end_date date;

CREATE POLICY "Clients can approve own steps"
ON public.timeline_steps
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.client_data cd
    WHERE cd.id = timeline_steps.client_id AND cd.user_id = auth.uid()
  )
);
