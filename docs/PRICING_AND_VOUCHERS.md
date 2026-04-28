# Pricing & Vouchers

## Pricing (room_types)
Goal: support 3 prices per room type:
- price_day (14:00 -> 22:00)
- price_overnight (14:00 -> 12:00 next day)
- price_extra_hour (default 150.000đ/hour)

Migration file: `supabase/room-pricing-v2.sql`

## Voucher
Phase 1 (lead-based):
- Customer enters voucher code in booking form
- API validates basic rules + stores the code on lead_requests
- Admin can manage vouchers + view redemptions

Migration file: `supabase/vouchers.sql`

### Voucher rules (initial)
- active + within starts_at/ends_at
- total usage <= max_total_uses (if set)
- per phone usage <= max_uses_per_phone (if set)
- apply scope flags (room day/overnight/extra hour/menu)
- allowed_room_type_codes (empty list => allow all)

### Discount types
- fixed_amount: subtract value
- percent: percent off (0-100)

> Note: Billing engine is not finalized yet. For phase 1 we treat voucher as a lead annotation + basic validation.
