-- Add customer code to link all services to one customer identity
alter table if exists lead_requests
  add column if not exists customer_code text;

-- Backfill existing records by phone (same phone => same code)
with phone_codes as (
  select
    phone,
    ('KH' || to_char(min(created_at), 'YYMMDD') || lpad((abs(mod(hashtext(phone), 10000)))::text, 4, '0')) as code
  from lead_requests
  where phone is not null and trim(phone) <> ''
  group by phone
)
update lead_requests l
set customer_code = p.code
from phone_codes p
where l.phone = p.phone
  and (l.customer_code is null or trim(l.customer_code) = '');

create index if not exists idx_lead_requests_customer_code on lead_requests(customer_code);
create index if not exists idx_lead_requests_phone on lead_requests(phone);
