-- Create a table for user profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  email text,
  full_name text,
  avatar_url text,
  role text check (role in ('customer', 'employee', 'admin')) default 'customer',
  phone text
);

-- Set up Row Level Security
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Admins can view all profiles"
  on public.profiles for select
  using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id )
  with check (
    -- Prevent users from changing their own role unless they are already admin
    (role = (select role from public.profiles where id = auth.uid()))
    or
    ((select role from public.profiles where id = auth.uid()) = 'admin')
  );

create policy "Only admins can change roles"
  on public.profiles for update
  using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

-- Appointments table
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references public.profiles(id) not null,
  employee_id uuid references public.profiles(id),
  scheduled_at timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')) default 'pending',
  service_type text not null,
  notes text, -- Customer visible notes
  internal_notes text, -- Employee/Admin only notes
  total_price numeric,
  created_by uuid references public.profiles(id)
);

alter table public.appointments enable row level security;

create policy "Customers can view their own appointments"
  on public.appointments for select
  using ( auth.uid() = customer_id );

create policy "Staff can view all appointments"
  on public.appointments for select
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('employee', 'admin')
    )
  );

create policy "Staff can manage appointments"
  on public.appointments for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('employee', 'admin')
    )
  );

-- Invoices table
create table if not exists public.invoices (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  appointment_id uuid references public.appointments(id),
  customer_id uuid references public.profiles(id) not null,
  amount numeric not null,
  status text check (status in ('unpaid', 'paid', 'partially_paid')) default 'unpaid',
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  description text
);

alter table public.invoices enable row level security;

create policy "Customers can view their own invoices"
  on public.invoices for select
  using ( auth.uid() = customer_id );

create policy "Staff can view all invoices"
  on public.invoices for select
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('employee', 'admin')
    )
  );

create policy "Staff can manage invoices"
  on public.invoices for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('employee', 'admin')
    )
  );

-- Job photos
create table if not exists public.job_photos (
  id uuid default gen_random_uuid() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null,
  photo_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  uploaded_by uuid references public.profiles(id)
);

alter table public.job_photos enable row level security;

create policy "Customers can view photos of their jobs"
  on public.job_photos for select
  using (
    exists (
      select 1 from public.appointments
      where public.appointments.id = public.job_photos.appointment_id
      and public.appointments.customer_id = auth.uid()
    )
  );

create policy "Staff can manage job photos"
  on public.job_photos for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role in ('employee', 'admin')
    )
  );

-- Messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  is_read boolean default false,
  related_appointment_id uuid references public.appointments(id)
);

alter table public.messages enable row level security;

create policy "Users can see messages they sent or received"
  on public.messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can send messages"
  on public.messages for insert
  with check ( auth.uid() = sender_id );

-- Services Table
create table if not exists public.services (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  price_range text,
  featured_image text,
  additional_images text[],
  is_published boolean default false,
  sort_order integer default 0
);

alter table public.services enable row level security;

create policy "Anyone can view published services"
  on public.services for select
  using ( is_published = true );

create policy "Admins can manage services"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role = 'admin'
    )
  );

-- Gallery Items Table
create table if not exists public.gallery_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  location text,
  service_category text,
  before_image text,
  after_image text,
  additional_images text[],
  description text,
  completion_date date,
  is_featured boolean default false,
  is_published boolean default false,
  sort_order integer default 0
);

alter table public.gallery_items enable row level security;

create policy "Anyone can view published gallery items"
  on public.gallery_items for select
  using ( is_published = true );

create policy "Admins can manage gallery items"
  on public.gallery_items for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role = 'admin'
    )
  );

-- Site Content
create table if not exists public.site_content (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content jsonb not null default '{}'::jsonb
);

alter table public.site_content enable row level security;

create policy "Anyone can view site content"
  on public.site_content for select
  using ( true );

create policy "Admins can manage site content"
  on public.site_content for all
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = auth.uid()
      and public.profiles.role = 'admin'
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'customer' -- STRICTLY default to customer
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
