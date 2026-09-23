-- ==============================================================================
-- FITFLOW - Production PostgreSQL Schema with Row Level Security & Atomic RPCs
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. GYMS TABLE
create table if not exists public.gyms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  email text,
  phone text,
  address text,
  city text,
  country text default 'United Kingdom',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PROFILES TABLE (Linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  gym_id uuid references public.gyms(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  role text not null check (role in ('admin', 'trainer', 'member')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. MEMBERSHIP PLANS TABLE
create table if not exists public.membership_plans (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0.00,
  duration_days integer not null default 30,
  class_limit integer default null, -- NULL or -1 means unlimited
  features jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 4. MEMBERSHIPS TABLE
create table if not exists public.memberships (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id) on delete restrict,
  start_date date not null default current_date,
  end_date date not null,
  status text not null check (status in ('active', 'expired', 'cancelled', 'pending')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. CLASSES TABLE
create table if not exists public.classes (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  trainer_id uuid references public.profiles(id) on delete set null,
  name text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time not null,
  capacity integer not null check (capacity > 0),
  location text not null default 'Studio A',
  status text not null default 'scheduled' check (status in ('scheduled', 'in-progress', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. CLASS BOOKINGS TABLE
create table if not exists public.class_bookings (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('confirmed', 'cancelled', 'waitlisted', 'attended')),
  booked_at timestamptz default now(),
  cancelled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prevent duplicate active bookings by the same member in the same class
create unique index if not exists idx_unique_active_booking 
on public.class_bookings (class_id, member_id) 
where status in ('confirmed', 'waitlisted');

-- 7. WAITLISTS TABLE
create table if not exists public.waitlists (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  position integer not null check (position > 0),
  status text not null default 'active' check (status in ('active', 'promoted', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. ATTENDANCE TABLE
create table if not exists public.attendance (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  class_id uuid references public.classes(id) on delete set null,
  check_in_method text not null check (check_in_method in ('qr', 'manual', 'face')),
  check_in_time timestamptz not null default now(),
  created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.gyms enable row level security;
alter table public.profiles enable row level security;
alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.classes enable row level security;
alter table public.class_bookings enable row level security;
alter table public.waitlists enable row level security;
alter table public.attendance enable row level security;

-- Helper to get current profile
create or replace function public.current_profile()
returns public.profiles
language sql
stable
as $$
  select * from public.profiles where id = auth.uid() limit 1;
$$;

-- PROFILES POLICIES
create policy "Profiles visible to users in same gym"
on public.profiles for select
using (
  auth.uid() = id or gym_id = (select gym_id from public.profiles where id = auth.uid())
);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Admins can manage gym profiles"
on public.profiles for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and gym_id = profiles.gym_id
  )
);

-- CLASSES POLICIES
create policy "Members and staff can view their gym classes"
on public.classes for select
using (
  gym_id = (select gym_id from public.profiles where id = auth.uid())
);

create policy "Admins and Trainers can manage gym classes"
on public.classes for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'trainer') and gym_id = classes.gym_id
  )
);

-- MEMBERSHIP PLANS POLICIES
create policy "Anyone in gym can view plans"
on public.membership_plans for select
using (
  gym_id = (select gym_id from public.profiles where id = auth.uid())
);

create policy "Admins can manage membership plans"
on public.membership_plans for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and gym_id = membership_plans.gym_id
  )
);

-- MEMBERSHIPS POLICIES
create policy "Members can view own membership"
on public.memberships for select
using (
  member_id = auth.uid() or
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'trainer') and gym_id = memberships.gym_id
  )
);

create policy "Admins can manage memberships"
on public.memberships for all
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and gym_id = memberships.gym_id
  )
);

-- BOOKINGS POLICIES
create policy "Members can view own bookings, staff can view gym bookings"
on public.class_bookings for select
using (
  member_id = auth.uid() or
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'trainer') and gym_id = class_bookings.gym_id
  )
);

create policy "Members can book and cancel own bookings"
on public.class_bookings for all
using (
  member_id = auth.uid() or
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and gym_id = class_bookings.gym_id
  )
);

-- ATTENDANCE POLICIES
create policy "Members see own attendance, staff see gym attendance"
on public.attendance for select
using (
  member_id = auth.uid() or
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'trainer') and gym_id = attendance.gym_id
  )
);

create policy "Staff can record attendance"
on public.attendance for insert
with check (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'trainer') and gym_id = attendance.gym_id
  )
);

-- ==============================================================================
-- ATOMIC STORED PROCEDURES (Safe concurrency, no overbooking, auto-promotions)
-- ==============================================================================

-- Atomic Class Booking Function
create or replace function public.book_class_atomic(
  p_class_id uuid,
  p_member_id uuid
)
returns json
language plpgsql
security definer
as $$
declare
  v_class record;
  v_gym_id uuid;
  v_current_count integer;
  v_booking_id uuid;
  v_waitlist_pos integer;
  v_existing_booking record;
begin
  -- 1. Lock the class row to prevent race conditions
  select * into v_class
  from public.classes
  where id = p_class_id
  for update;

  if not found then
    return json_build_object('success', false, 'message', 'Class not found.');
  end if;

  v_gym_id := v_class.gym_id;

  -- 2. Check if member already has an active booking or waitlist
  select * into v_existing_booking
  from public.class_bookings
  where class_id = p_class_id
    and member_id = p_member_id
    and status in ('confirmed', 'waitlisted');

  if found then
    return json_build_object(
      'success', false, 
      'message', 'You are already ' || v_existing_booking.status || ' for this class.'
    );
  end if;

  -- 3. Calculate current confirmed booking count
  select count(*) into v_current_count
  from public.class_bookings
  where class_id = p_class_id
    and status = 'confirmed';

  -- 4. If space is available, confirm booking
  if v_current_count < v_class.capacity then
    insert into public.class_bookings (gym_id, class_id, member_id, status)
    values (v_gym_id, p_class_id, p_member_id, 'confirmed')
    returning id into v_booking_id;

    return json_build_object(
      'success', true,
      'status', 'confirmed',
      'booking_id', v_booking_id,
      'message', 'Booking confirmed successfully!'
    );
  else
    -- Class is full, calculate waitlist position
    select coalesce(max(position), 0) + 1 into v_waitlist_pos
    from public.waitlists
    where class_id = p_class_id
      and status = 'active';

    insert into public.waitlists (gym_id, class_id, member_id, position, status)
    values (v_gym_id, p_class_id, p_member_id, v_waitlist_pos, 'active');

    insert into public.class_bookings (gym_id, class_id, member_id, status)
    values (v_gym_id, p_class_id, p_member_id, 'waitlisted')
    returning id into v_booking_id;

    return json_build_object(
      'success', true,
      'status', 'waitlisted',
      'position', v_waitlist_pos,
      'booking_id', v_booking_id,
      'message', 'Class is full. You have been added to position #' || v_waitlist_pos || ' on the waitlist.'
    );
  end if;
end;
$$;

-- Atomic Booking Cancellation with Automatic Waitlist Promotion
create or replace function public.cancel_booking_atomic(
  p_booking_id uuid
)
returns json
language plpgsql
security definer
as $$
declare
  v_booking record;
  v_class_id uuid;
  v_next_waitlist record;
begin
  -- 1. Fetch and cancel booking
  select * into v_booking
  from public.class_bookings
  where id = p_booking_id;

  if not found then
    return json_build_object('success', false, 'message', 'Booking record not found.');
  end if;

  v_class_id := v_booking.class_id;

  update public.class_bookings
  set status = 'cancelled',
      cancelled_at = now(),
      updated_at = now()
  where id = p_booking_id;

  -- Also update waitlist entry if user was waitlisted
  if v_booking.status = 'waitlisted' then
    update public.waitlists
    set status = 'cancelled',
        updated_at = now()
    where class_id = v_class_id
      and member_id = v_booking.member_id
      and status = 'active';

    return json_build_object(
      'success', true, 
      'message', 'Waitlist entry cancelled.'
    );
  end if;

  -- If cancelled booking was confirmed, promote the next waitlisted user
  if v_booking.status = 'confirmed' then
    select * into v_next_waitlist
    from public.waitlists
    where class_id = v_class_id
      and status = 'active'
    order by position asc
    limit 1
    for update;

    if found then
      -- Promote waitlist entry
      update public.waitlists
      set status = 'promoted',
          updated_at = now()
      where id = v_next_waitlist.id;

      -- Update their booking from waitlisted to confirmed
      update public.class_bookings
      set status = 'confirmed',
          updated_at = now()
      where class_id = v_class_id
        and member_id = v_next_waitlist.member_id
        and status = 'waitlisted';

      return json_build_object(
        'success', true,
        'promoted_member_id', v_next_waitlist.member_id,
        'message', 'Booking cancelled and waitlisted member promoted to confirmed spot.'
      );
    end if;
  end if;

  return json_build_object(
    'success', true,
    'message', 'Booking successfully cancelled.'
  );
end;
$$;
