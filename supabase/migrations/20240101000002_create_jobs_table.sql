create table if not exists public.jobs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    company text not null,
    position text not null,
    location text,
    status text not null,
    date_applied date not null,
    salary text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.jobs enable row level security;

-- Create policies
create policy "Users can view their own jobs"
    on public.jobs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own jobs"
    on public.jobs for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own jobs"
    on public.jobs for update
    using (auth.uid() = user_id);

create policy "Users can delete their own jobs"
    on public.jobs for delete
    using (auth.uid() = user_id);

-- Create index for faster queries
create index jobs_user_id_idx on public.jobs(user_id);
