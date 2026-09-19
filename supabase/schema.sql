-- Run this in the Supabase SQL editor after creating your project.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  skills text[] default '{}',
  rating_avg numeric default 0,
  completed_count int default 0,
  created_at timestamptz default now()
);

create type request_status as enum ('open', 'accepted', 'submitted', 'completed');
create type urgency_level as enum ('asap', 'today', 'this_week');

create table requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  subject text,
  ai_category text,
  ai_difficulty text,
  ai_estimated_minutes int,
  urgency urgency_level not null default 'today',
  budget_naira int not null default 0,
  status request_status not null default 'open',
  helper_id uuid references profiles(id),
  solution_text text,
  ai_quality_notes text,
  ai_quality_confidence numeric,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz default now()
);

create table ratings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  rater_id uuid not null references profiles(id),
  ratee_id uuid not null references profiles(id),
  stars int not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- Row Level Security -------------------------------------------------------
alter table profiles enable row level security;
alter table requests enable row level security;
alter table messages enable row level security;
alter table ratings enable row level security;

create policy "profiles are readable by anyone" on profiles
  for select using (true);
create policy "users can update their own profile" on profiles
  for update using (auth.uid() = id);
create policy "users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "requests are readable by anyone" on requests
  for select using (true);
create policy "authenticated users can create requests" on requests
  for insert with check (auth.uid() = requester_id);
create policy "requester or helper can update a request" on requests
  for update using (auth.uid() = requester_id or auth.uid() = helper_id);

create policy "messages readable by request participants" on messages
  for select using (
    exists (
      select 1 from requests r
      where r.id = request_id
        and (r.requester_id = auth.uid() or r.helper_id = auth.uid())
    )
  );
create policy "participants can send messages" on messages
  for insert with check (
    exists (
      select 1 from requests r
      where r.id = request_id
        and (r.requester_id = auth.uid() or r.helper_id = auth.uid())
    )
  );

create policy "ratings are readable by anyone" on ratings
  for select using (true);
create policy "raters can insert their own rating" on ratings
  for insert with check (auth.uid() = rater_id);

-- Enable realtime on messages for the chat page
alter publication supabase_realtime add table messages;
