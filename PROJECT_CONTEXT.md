# Tron Glamping - Project Context

Tài liệu này là entrypoint cho bất kỳ AI/dev nào tiếp quản dự án.
Mục tiêu: đọc 1 file là hiểu bối cảnh, trạng thái hiện tại, kiến trúc, backlog và cách tiếp tục.

## 1) Mục tiêu dự án
Xây dựng website + admin cho Trốn Glamping với các phần chính:
- Landing / website public
- Form gửi yêu cầu đặt chỗ
- Tra cứu mã khách / mã đặt chỗ
- Admin quản lý:
  - content
  - room types
  - menu
  - leads
  - upload ảnh
- Sắp bổ sung:
  - giá trong ngày / qua đêm / thêm giờ
  - voucher / mã khuyến mãi
  - tài liệu AI-handoff đầy đủ

## 2) Trạng thái hiện tại
Repo: `tron-glamping`
Framework: Next.js App Router
DB: Supabase
Deploy: Vercel

### Đã có
- Home page public: `src/app/page.tsx`
- Menu page: `src/app/menu/page.tsx`
- Lookup page: `src/app/tra-cuu/page.tsx`
- Admin login: `src/app/admin/login/page.tsx`
- Admin protected pages:
  - `/admin/content`
  - `/admin/room-types`
  - `/admin/menu`
  - `/admin/leads`
- Public APIs:
  - `/api/public/home-data`
  - `/api/public/menu`
  - `/api/public/lookup`
- Admin APIs:
  - `/api/admin/content`
  - `/api/admin/room-types`
  - `/api/admin/menu`
  - `/api/admin/leads`
  - `/api/admin/upload`
- Lead submit API: `/api/leads`
- Upload ảnh room/menu qua Supabase Storage
- Customer code theo phone để tái sử dụng mã KH

### Đã deploy
- Production site hiện dùng: `https://tron-glamping.vercel.app`
- Admin login: `https://tron-glamping.vercel.app/admin/login`

## 3) Biến môi trường
Dự án phụ thuộc các env sau:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`

Lưu ý:
- `ADMIN_PASSWORD` dùng cho auth admin dạng password đơn giản + cookie HMAC.
- Không hardcode secrets vào code.

## 4) Logic business hiện tại
### Leads
Form public hiện gửi yêu cầu đặt chỗ vào bảng `lead_requests`.
Trường chính đang dùng:
- full_name
- phone
- email
- requested_room_type
- check_in_date
- check_out_date
- guest_count_adults
- guest_count_children
- selected_menu_items
- message
- customer_code
- customer_status
- source

### Customer code
- Tạo mã KH theo format `KHyymmdd####`
- Nếu khách đã từng để lại lead cùng số điện thoại, hệ thống tái sử dụng `customer_code`

### Lookup
- Lookup public theo `customer_code`
- Trả lại thông tin lead gần nhất theo mã

## 5) Room types / pricing - định hướng mới
Hiện tại `room_types` mới có `base_price`.
Cần nâng cấp để hỗ trợ dữ liệu giá linh hoạt.

### Rule đã chốt với chủ dự án
- Giá phải chỉnh được hoàn toàn trong admin
- Có 3 loại giá:
  - `price_day`
  - `price_overnight`
  - `price_extra_hour`
- Khung giờ trong ngày: `14:00 -> 22:00`
- Khung giờ qua đêm: `14:00 hôm trước -> 12:00 hôm sau`
- Giá thêm giờ mặc định business hiện tại: `150.000đ/giờ`
- Ghi chú: nếu lều trống ngày hôm trước, khách có thể đến sớm từ `09:00` để sử dụng tiện ích chung miễn phí

### File SQL đã chuẩn bị
- `supabase/room-pricing-v2.sql`

File này thêm các cột:
- `price_day`
- `price_overnight`
- `price_extra_hour`
- `checkin_day_time`
- `checkout_day_time`
- `checkin_overnight_time`
- `checkout_overnight_time`

## 6) Voucher / mã khuyến mãi - yêu cầu đã chốt
Owner muốn có:
- Mã giới hạn lượt sử dụng
- Mã dùng chung không giới hạn lượt
- Chọn được loại dịch vụ áp dụng
- Có giao diện admin quản lý voucher
- Giá và voucher đều phải linh hoạt, không hardcode

### Định hướng implementation đề xuất
Tạo các bảng:
1. `vouchers`
   - code
   - name
   - description
   - is_active
   - discount_type (`percent` | `fixed_amount`)
   - discount_value
   - max_total_uses nullable
   - max_uses_per_customer nullable (optional phase 2)
   - starts_at nullable
   - ends_at nullable
   - applies_to_room_day boolean
   - applies_to_room_overnight boolean
   - applies_to_extra_hour boolean
   - applies_to_menu boolean
   - applies_to_combo boolean
   - allowed_room_type_codes jsonb nullable
   - min_order_amount nullable
   - stackable boolean default false
   - created_at / updated_at

2. `voucher_redemptions`
   - voucher_id
   - code_snapshot
   - customer_phone nullable
   - lead_request_id nullable
   - booking_id nullable (phase 2)
   - discount_amount
   - metadata jsonb
   - created_at

### Giai đoạn áp dụng voucher
Ưu tiên phase 1:
- nhập mã voucher ngay ở form lead
- validate cơ bản + lưu lại mã
- chưa cần engine billing hoàn chỉnh

Phase 2:
- áp dụng khi tạo booking / tính tiền thật trong admin

## 7) Kiến trúc code hiện tại
### Frontend public
- `src/app/page.tsx`: landing + booking form + room cards
- `src/app/menu/page.tsx`: menu public
- `src/app/tra-cuu/page.tsx`: tra cứu mã

### Admin
- `src/app/admin/login/page.tsx`
- `src/app/admin/(protected)/page.tsx`
- `src/app/admin/(protected)/content/page.tsx`
- `src/app/admin/(protected)/room-types/page.tsx`
- `src/app/admin/(protected)/menu/page.tsx`
- `src/app/admin/(protected)/leads/page.tsx`

### APIs
- Public:
  - `src/app/api/public/home-data/route.ts`
  - `src/app/api/public/menu/route.ts`
  - `src/app/api/public/lookup/route.ts`
- Admin:
  - `src/app/api/admin/content/route.ts`
  - `src/app/api/admin/room-types/route.ts`
  - `src/app/api/admin/menu/route.ts`
  - `src/app/api/admin/leads/route.ts`
  - `src/app/api/admin/upload/route.ts`
- Lead intake:
  - `src/app/api/leads/route.ts`

### Lib
- `src/lib/admin-auth.ts`: auth admin bằng password + signed cookie
- `src/lib/supabase.ts`: public/server client
- `src/lib/supabase-admin.ts`: admin client
- `src/lib/site-content.ts`: kiểu dữ liệu + default content
- `src/lib/admin-data.ts`: helper load dữ liệu admin

## 8) Vấn đề / ghi chú quan trọng
1. `www.tronglamping.com` hiện không phải app Next này; domain đó đang là landing khác.
2. App thật hiện deploy riêng ở Vercel.
3. Ảnh loại lều cần đồng bộ theo nguồn KiotViet booking:
   - `https://bookhotel.kiotviet.vn/tron.glamping`
4. Cần hoàn thiện luồng lấy ảnh chuẩn từ KiotViet rồi map vào `room_types.hero_image_url` + `gallery_images`.
5. Giá hiện UI public vẫn đang hiển thị theo `base_price`; cần refactor sang `price_day / price_overnight / price_extra_hour`.

## 9) Quy ước khi AI tiếp tục code
Bắt buộc:
- Mọi thay đổi lớn phải update lại tài liệu này hoặc file liên quan trong `/docs`
- Không chỉ code, phải ghi note để AI khác tiếp quản được
- Với thay đổi DB: luôn tạo file SQL riêng trong `supabase/`
- Với feature mới: cập nhật roadmap + quyết định kiến trúc
- Tránh hardcode rule business vào component nếu có thể đưa vào DB/admin

## 10) Backlog ưu tiên hiện tại
### P1 - rất gần
- [ ] Chạy migration `room-pricing-v2.sql`
- [ ] Update admin room types để chỉnh được 3 giá + khung giờ
- [ ] Update public room cards hiển thị day / overnight / extra hour
- [ ] Thêm ghi chú nhận sớm từ 9h

### P2 - quan trọng
- [ ] Thiết kế schema vouchers
- [ ] Tạo admin vouchers CRUD
- [ ] Thêm input mã voucher ở form lead
- [ ] Validate voucher cơ bản ở API lead
- [ ] Lưu usage / redemption log

### P3 - tiếp theo
- [ ] Chuẩn hóa ảnh lều từ KiotViet
- [ ] Đồng bộ tên loại lều + giá + ảnh chuẩn
- [ ] Nếu cần, thêm booking engine nội bộ thay vì chỉ leads

## 11) Tài liệu liên quan
- `README.md`: nên cập nhật lại cho sát dự án thực tế
- `supabase/schema.sql`: schema gốc
- `supabase/room-gallery.sql`: bổ sung gallery_images
- `supabase/customer-code.sql`: bổ sung customer code
- `supabase/room-pricing-v2.sql`: bổ sung pricing v2

## 12) Owner preferences / communication
- Muốn AI làm tiếp được không đứt đoạn
- Muốn có note đầy đủ trong quá trình code
- Muốn admin linh hoạt, business rules thay đổi được
- Ưu tiên tốc độ nhưng phải dễ bàn giao
