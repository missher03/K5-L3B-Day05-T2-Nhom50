# Kiểm tra bản Track 2

Ngày kiểm tra: 13/11/2026. Phạm vi: prototype offline và tài liệu bài nộp, không phải agent/nhà cung cấp API hoặc đánh giá người dùng thật.

## Kết quả đã chạy

| Kiểm tra | Kết quả |
|---|---|
| `node --test tests/policy.test.cjs` | 8/8 pass, 0 fail |
| `node --check prototype/app.js` và `node --check prototype/policy.js` | Exit 0 |
| `python tests/browser_check.py` | Exit 0; các assertion luồng bên dưới đều qua, không có JavaScript page error |
| Kiểm tra ảnh bằng mắt | Hai ảnh desktop đọc được, nguồn/cảnh báo/nút không chồng nhau; ảnh lấy từ chính prototype |

Browser: Google Chrome headless qua Python Playwright; desktop 1440×1100, mobile 390×844. Thử trực tiếp file HTML local. Browser launch cần chạy ngoài sandbox trong môi trường Codex này; người dùng chỉ mở HTML không cần quyền đó.

Luồng thực sự đã kiểm tra:

- S1 hiện cảnh báo §3.3 và phản ví dụ; nguồn được mở đúng mục.
- Sửa nội dung chuyển, hủy, mở lại vẫn giữ nháp; chưa tạo phiếu.
- Chưa đồng ý thì form không gửi; ngoài giờ hiện ca 14/11 sau hạn.
- Giả lập gửi lỗi giữ hộp thoại, báo chưa vào hàng đợi, số phiếu vẫn 0.
- Đồng ý và gửi thành công mới tăng phiếu; TA thấy câu hỏi đã duyệt.
- FAQ chưa xác minh/duyệt bị chặn; đủ hai điều kiện mới phát hành.
- Thu hồi FAQ có cảnh báo không thu hồi phần đã đọc.
- S2 chuyển TA được nhưng không có nút phát FAQ.
- Chuỗi giống HTML được hiện thành văn bản, không tạo thẻ/chạy mã.
- Mobile không cuộn ngang; mở hộp thoại được và Escape đóng được.

Ảnh: `prototype/screen-student.png`, `prototype/screen-ta.png`. Ảnh TA là trạng thái sau xác minh/đồng ý, trước khi bấm phát hành. Checkbox xác minh trong demo là thao tác mô phỏng, không phải bằng chứng một TA thật đã sửa giáo trình.

## Đối chiếu bài nộp

- Có spec đủ §1–§7, 12 kịch bản đủ bốn lớp và hai ca trọng tâm.
- Bốn tool đều có mức quyền, người duyệt, chi phí sai, chờ đợi và khả năng hoàn tác.
- Có hai màn hình tương tác, hai ảnh có chú thích số, ba tiêu chí pass/fail.
- Đã thay prototype mẫu Track 3 và bỏ ảnh mẫu cũ, dùng bản Track 2 riêng.
- Chưa thực hiện demo trước lớp, chưa có ca bất ngờ thật hoặc nghiên cứu người dùng.
- Hai thành viên, phân công thật và quan điểm từng người còn để nhóm bổ sung/xác nhận. Không tự khai bonus.
- Chưa commit/push. Cần nhóm xem trước và xác nhận bản cuối.

Giới hạn còn lại: chính sách dựa từ khóa, kiểm tra nội dung FAQ hạn chế, vai trò TA giả lập, dữ liệu mất khi tải lại; chưa có xác thực, server, lưu trữ hoặc thông báo thật. Các test không chứng minh prototype xử lý mọi cách diễn đạt hoặc sẵn sàng dùng trong lớp thật.
