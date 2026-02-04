-- Create a new private bucket for identity assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('identity-assets', 'identity-assets', false);

-- Policy to allow authenticated users to view their own assets
-- Note: This requires enabling RLS on storage.objects, which is on by default usually.
CREATE POLICY "Users can only access their own identity assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'identity-assets' AND auth.uid() = owner);

-- Policy to allow authenticated users to upload assets
CREATE POLICY "Users can upload their own identity assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'identity-assets' AND auth.uid() = owner);
