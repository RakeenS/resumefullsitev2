create type application_status as enum ('Applied', 'Interview', 'Offer', 'Rejected');

create table job_applications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    company text not null,
    position text not null,
    status application_status not null default 'Applied',
    date_applied timestamp with time zone not null default now(),
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create RLS policies
alter table job_applications enable row level security;

create policy "Users can view their own job applications"
    on job_applications for select
    using (auth.uid() = user_id);

create policy "Users can insert their own job applications"
    on job_applications for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own job applications"
    on job_applications for update
    using (auth.uid() = user_id);

create policy "Users can delete their own job applications"
    on job_applications for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_job_applications_updated_at
    before update on job_applications
    for each row
    execute function update_updated_at_column();
