-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  role text check (role in ('customer', 'employee', 'admin')) default 'customer',
  phone text
);

-- Set up Row Level Security
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );

-- Appointments table
create table appointments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references profiles(id) not null,
  employee_id uuid references profiles(id),
  scheduled_at timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')) default 'pending',
  service_type text not null,
  notes text, -- Customer visible notes
  internal_notes text, -- Employee only notes
  total_price numeric
);

alter table appointments enable row level security;

create policy "Customers can view their own appointments"
  on appointments for select
  using ( (select auth.uid()) = customer_id );

create policy "Employees and admins can view all appointments"
  on appointments for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('employee', 'admin')
    )
  );

create policy "Employees and admins can insert appointments"
  on appointments for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('employee', 'admin')
    )
  );

create policy "Employees and admins can update appointments"
  on appointments for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('employee', 'admin')
    )
  );

-- Invoices table
create table invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  appointment_id uuid references appointments(id),
  customer_id uuid references profiles(id) not null,
  amount numeric not null,
  status text check (status in ('unpaid', 'paid', 'partially_paid')) default 'unpaid',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  description text
);

alter table invoices enable row level security;

create policy "Customers can view their own invoices"
  on invoices for select
  using ( (select auth.uid()) = customer_id );

create policy "Employees and admins can view all invoices"
  on invoices for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('employee', 'admin')
    )
  );

create policy "Employees and admins can manage invoices"
  on invoices for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('employee', 'admin')
    )
  );

-- Job photos
create table job_photos (
  id uuid default gen_random_uuid() primary key,
  appointment_id uuid references appointments(id) on delete cascade not null,
  photo_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  uploaded_by uuid references profiles(id)
);

alter table job_photos enable row level security;

create policy "Customers can view photos of their jobs"
  on job_photos for select
  using (
    exists (
      select 1 from appointments
      where appointments.id = job_photos.appointment_id
      and appointments.customer_id = auth.uid()
    )
  );

create policy "Employees and admins can manage job photos"
  on job_photos for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('employee', 'admin')
    )
  );

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', coalesce(new.raw_user_meta_data->>'role', 'customer'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
