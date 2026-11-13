# Prototype Track 2 — Học cùng

Mở `index.html` trực tiếp trong Chrome/Edge. Không cần cài thư viện, API key hoặc mạng. Tất cả thao tác chỉ thay đổi bộ nhớ trang; tải lại sẽ xóa phiếu/FAQ. Đây là mô phỏng UX, không phải dịch vụ học tập thật.

## Kiểm tra nhanh

1. Mặc định là ca tài liệu §3.3 sai. Đọc cảnh báo ①, mở nguồn ②.
2. Chọn Sửa câu hỏi ③ hoặc Soạn câu hỏi cho TA. Hộp thoại ④ cho sửa và duyệt, báo ca sau đã qua hạn; hủy không gửi.
3. Đồng ý rồi xác nhận. Sang Hàng đợi TA, nội dung chỉ là câu hỏi đã duyệt và mã mục nguồn.
4. Thử phát FAQ khi chưa đánh dấu xác minh/duyệt: phải bị chặn. Đánh dấu đủ rồi phát hành, sau đó thu hồi. ⑤ chỉ quyền TA mô phỏng, không phải xác thực thật.
5. Mở Bàn điều khiển demo, chọn Bài đang mở: chỉ nhận gợi ý; nếu chuyển TA, không có nút phát FAQ cho ca đó.
6. Bật Giả lập chuyển TA thất bại: phải giữ nháp và không tăng số phiếu. Bật 21:30 để so sánh trong/ngoài giờ.

Ảnh thật từ phiên kiểm thử: `screen-student.png`, `screen-ta.png`. Các số trên giao diện là chú thích HAX/PAIR; xem `../spec.md` §3–5. Hai màn hình đáp ứng hai cấp quyết định: trợ lý tự hỗ trợ trong phạm vi và cần người duyệt cho việc chuyển/chia sẻ. Không gọi bất kỳ tool thật nào.

`policy.js`: nguồn và quy tắc minh họa; `app.js`: trạng thái UI; `styles.css`: giao diện responsive. Phân loại từ khóa chỉ đủ cho demo, có giới hạn được công bố trong đặc tả.
