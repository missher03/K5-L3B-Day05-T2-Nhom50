# LAB 05 · Track 2 · Nhóm 50

Thiết kế UX và mức tự chủ cho trợ lý học tập buổi 3 — Thống kê mô tả. Bản chuẩn bị để nhóm kiểm tra trước khi nộp.

- [Đặc tả bảy mục](spec.md): phạm vi, 12 kịch bản, hai ca trọng tâm, ranh giới bốn tool, demo và tiêu chí pass/fail.
- [Mở prototype](prototype/index.html): hai màn hình học viên/TA; chạy offline trong Chrome/Edge.
- [Hướng dẫn thao tác](prototype/README.md) và [kết quả kiểm thử](docs/verification.md).

## Thành viên

| Họ tên | Mã học viên | Đóng góp thực tế |
|---|---|---|
| Phạm Hoàng Huy | 2A202603836 | Cần nhóm xác nhận trước khi nộp |
| | | |
| | | |

Hai thành viên còn lại tạm để trống theo yêu cầu. Bản nháp có hỗ trợ Codex; nhóm cần kiểm tra và hiểu các quyết định, không ghi nhận thảo luận/demo chưa thực hiện.

## Chạy và kiểm tra

Mở `prototype/index.html` trực tiếp. Hoặc từ thư mục repo:

```powershell
python -m http.server 8000
```

Truy cập `http://localhost:8000/prototype/`. Không cần `.env`, API key hoặc cài npm.

```powershell
node --test tests/policy.test.cjs
python tests/browser_check.py
```

Browser test cần Python Playwright và Chrome cài sẵn; không cần cho người chỉ xem prototype.

## Trước khi nộp

- [ ] Điền đủ ba thành viên và đóng góp thực tế trong README/spec.
- [ ] Thảo luận và ghi quan điểm ban đầu của từng thành viên về tool khó nhất (§4).
- [ ] Mỗi người thử luồng demo, xác nhận phần trình bày (§7).
- [ ] Sau demo, ghi ca bất ngờ thật và cách xử lý; không nhận bonus chưa làm.
- [ ] Kiểm tra repo public, commit/push bản nhóm đã duyệt và nộp URL đúng hạn theo lớp.

Đây là prototype theo fixture, không phải agent hoặc LMS thật. Không có thông tin cá nhân thật, tích hợp gửi TA hay phát FAQ ra ngoài.
