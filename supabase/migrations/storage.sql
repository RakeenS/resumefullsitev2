-- Create a storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'resumes' AND
  auth.role() = 'authenticated'
);

-- Allow users to read their own resumes
CREATE POLICY "Users can read own resumes"
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
