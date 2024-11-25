-- Create a function to create the resumes table if it doesn't exist
create or replace function create_resumes_table()
returns void
language plpgsql
as $$
begin
  -- Check if the table exists
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'resumes') then
    -- Create the resumes table
    create table public.resumes (
      id uuid default gen_random_uuid() primary key,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      user_id uuid references auth.users(id) on delete cascade not null,
      file_name text not null,
      file_path text not null,
      file_url text not null,
      file_type text not null,
      parsed_data jsonb,
      raw_text text,
      status text default 'pending'::text
    );

    -- Set up RLS (Row Level Security)
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

    -- Create indexes
    create index resumes_user_id_idx on public.resumes(user_id);
    create index resumes_created_at_idx on public.resumes(created_at);
  end if;
end;
$$;
