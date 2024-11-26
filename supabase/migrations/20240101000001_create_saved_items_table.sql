create type item_type as enum ('cover_letter', 'email');

create table saved_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type item_type not null,
  content text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table saved_items enable row level security;

create policy "Users can view their own saved items"
  on saved_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved items"
  on saved_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own saved items"
  on saved_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own saved items"
  on saved_items for delete
  using (auth.uid() = user_id);

-- Create indexes
create index saved_items_user_id_idx on saved_items(user_id);
create index saved_items_type_idx on saved_items(type);
