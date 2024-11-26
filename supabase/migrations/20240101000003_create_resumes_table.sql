create table if not exists public.resumes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    file_name text not null,
    file_path text not null,
    file_url text not null,
    file_type text not null,
    parsed_data text,
    status text default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.resumes enable row level security;

-- Create policies
create policy "Users can view their own resumes"
    on public.resumes for select
    using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
    on public.resumes for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
    on public.resumes for update
    using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
    on public.resumes for delete
    using (auth.uid() = user_id);

-- Create storage bucket for resumes if it doesn't exist
insert into storage.buckets (id, name)
values ('resumes', 'resumes')
on conflict do nothing;

-- Enable RLS on the storage bucket
create policy "Users can view their own resume files"
    on storage.objects for select
    using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can upload their own resume files"
    on storage.objects for insert
    with check (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own resume files"
    on storage.objects for update
    using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own resume files"
    on storage.objects for delete
    using (bucket_id = 'resumes' and auth.uid()::text = (storage.foldername(name))[1]);
