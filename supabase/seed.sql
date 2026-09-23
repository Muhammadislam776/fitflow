-- ==============================================================================
-- FITFLOW - Initial Development Seed Data
-- ==============================================================================

-- 1. GYM
insert into public.gyms (id, name, logo_url, email, phone, address, city, country)
values (
  'a0000000-0000-0000-0000-000000000001',
  'FitFlow Elite Performance Club',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80',
  'support@fitflowgym.com',
  '+44 20 7946 0912',
  '120 Bishopsgate, Level 3',
  'London',
  'United Kingdom'
) on conflict (id) do nothing;

-- 2. MEMBERSHIP PLANS
insert into public.membership_plans (id, gym_id, name, description, price, duration_days, class_limit, features, is_active)
values 
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Basic',
  'Perfect for beginners and casual gym enthusiasts.',
  30.00,
  30,
  8,
  '["8 Classes per month", "Standard gym floor access", "Member dashboard & booking", "Locker room access"]'::jsonb,
  true
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Premium',
  'Our most popular plan for regular gym-goers and fitness lovers.',
  50.00,
  30,
  20,
  '["20 Classes per month", "Full gym & functional zone access", "Priority class booking (7 days advance)", "Complimentary sauna & steam room", "1 Free guest pass/month"]'::jsonb,
  true
),
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Unlimited',
  'Complete, unrestricted access for athletes and high performers.',
  70.00,
  30,
  null,
  '["Unlimited Classes every month", "24/7 VIP Gym access", "Instant priority booking & waitlist skip", "Personal trainer assessment (1/quarter)", "Recovery lounge access"]'::jsonb,
  true
) on conflict (id) do nothing;
