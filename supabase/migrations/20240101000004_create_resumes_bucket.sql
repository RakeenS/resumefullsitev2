-- Create the resumes storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

-- Enable RLS (Row Level Security) for the storage bucket
alter table storage.objects enable row level security;

-- Create policy to allow authenticated users to view their own resume files
create policy "Users can view their own resume files"
on storage.objects for select
using (
    bucket_id = 'resumes' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to upload their own resume files
create policy "Users can upload their own resume files"
on storage.objects for insert
with check (
    bucket_id = 'resumes' 
    and auth.uid()::text = (storage.foldername(name))[1]
    and (storage.extension(name) = 'pdf')
);

-- Create policy to allow authenticated users to update their own resume files
create policy "Users can update their own resume files"
on storage.objects for update
using (
    bucket_id = 'resumes' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow authenticated users to delete their own resume files
create policy "Users can delete their own resume files"
on storage.objects for delete
using (
    bucket_id = 'resumes' 
    and auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up bucket configuration
update storage.buckets
set public = false,
    file_size_limit = 10485760, -- 10MB
    allowed_mime_types = array['application/pdf']
where id = 'resumes';
