# AI Handoff Checklist (Tron Glamping)

Checklist bắt buộc trước khi kết thúc một task lớn.

## 1) Code & Data
- [ ] Code chạy được local (ít nhất smoke test)
- [ ] Nếu đổi DB: có file SQL migration trong `supabase/`
- [ ] API contract mới đã phản ánh ở frontend liên quan

## 2) Documentation
- [ ] Cập nhật `PROJECT_CONTEXT.md` (trạng thái + quyết định mới)
- [ ] Nếu thêm module lớn: tạo file docs riêng trong `docs/`
- [ ] Ghi rõ trade-off / lý do chọn giải pháp

## 3) Deploy
- [ ] Deploy preview hoặc production thành công
- [ ] Ghi lại URL test
- [ ] Ghi rõ env nào cần cập nhật

## 4) Testing Notes
- [ ] Happy path
- [ ] Edge case chính
- [ ] Nếu chưa test phần nào, ghi rõ chưa test

## 5) Security / Safety
- [ ] Không commit secrets
- [ ] Không hardcode password/token
- [ ] Validate input phía API

## 6) Open items
- [ ] Liệt kê TODO còn lại (ưu tiên P1/P2/P3)
- [ ] Liệt kê rủi ro kỹ thuật nếu có
