(function (root) {
  'use strict';
  const sources = {
    '3.1': { title: '§3.1 · Trung bình cộng', text: 'Tổng các giá trị chia cho số lượng. Nhạy với giá trị ngoại lai.' },
    '3.2': { title: '§3.2 · Trung vị', text: 'Sắp xếp dữ liệu rồi lấy giá trị giữa; nếu số lượng chẵn, lấy trung bình hai giá trị giữa. Ít bị ảnh hưởng bởi ngoại lai, phù hợp mô tả thu nhập lệch.' },
    '3.3': { title: '§3.3 · Phương sai và độ lệch chuẩn', text: 'Phương sai đo mức phân tán quanh trung bình. Độ lệch chuẩn là căn bậc hai của phương sai, có cùng đơn vị với dữ liệu. Câu cần kiểm chứng trong tài liệu: “Vì là căn bậc hai, độ lệch chuẩn luôn nhỏ hơn phương sai.”' },
    '3.4': { title: '§3.4 · Ngoại lai', text: 'Kiểm tra giá trị bất thường là lỗi nhập liệu hay dữ liệu thật trước khi quyết định loại bỏ.' },
    '3.5': { title: '§3.5 · Bài tập 3 — đang mở', text: 'Lương giả lập (triệu): 9, 10, 10, 11, 12, 12, 13, 45. Tính trung bình, trung vị và chọn đại lượng mô tả mức lương điển hình. Hạn 13/11/2026, 23:59. Chỉ gợi ý bước đầu, không cung cấp hoặc xác nhận đáp số.' },
    course: { title: 'Trang khóa học · lịch và quy định', text: 'Buổi 1–3 đã mở. Buổi 4: trực quan hóa; 5: xác suất; 6: phân phối chuẩn; 7: kiểm định và p-value; 8: hồi quy tuyến tính; 9: làm sạch; 10: dự án. Bài 2 đóng 06/11, công bố đáp án 07/11: trung bình 4, 8, 6, 5, 7 là 6. TA trực 08:00–22:00. Chưa có tài liệu hàm Excel hoặc số slide.' }
  };
  function assess(input) {
    const t = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
    const result = (kind, title, message, sourceIds = [], allowFaq = false) => ({kind, title, message, sourceIds, allowFaq});
    if (/bai\s*(tap\s*)?3\b/.test(t)) return result('homework', 'Mình giúp bạn hiểu, không xác nhận đáp số', 'Bài 3 đang mở đến 23:59 ngày 13/11/2026. Mình không giải hộ, viết nhận xét hay xác nhận con số bạn đưa ra. Gợi ý bước đầu: sắp xếp dãy lương, đếm số phần tử và xác định vị trí hai giá trị giữa. Bạn muốn hỏi về cách xác định vị trí đó không?', ['3.5', '3.2']);
    if (/3[.,]3|luon nho hon|tai lieu.*sai|do lech chuan/.test(t) && !/excel|ham tinh/.test(t)) return result('source-error', 'Phát hiện mâu thuẫn trong tài liệu', 'Câu “độ lệch chuẩn luôn nhỏ hơn phương sai” ở §3.3 không đúng trong mọi trường hợp. Ví dụ kiểm chứng độc lập: phương sai 0,25 thì độ lệch chuẩn là 0,5, lớn hơn 0,25. Đây không phải đáp số bài 3. Mình đánh dấu câu nguồn cần TA kiểm tra, không tự sửa tài liệu chính thức. Bạn có thể sửa và duyệt câu hỏi trước khi chuyển TA.', ['3.3']);
    if (/slide|excel|tableau|python|ham tinh/.test(t)) return result('missing-source', 'Chưa có nguồn để trả lời chính xác', 'Bộ tài liệu được cung cấp chỉ có §3.1–§3.5 và trang khóa học, không có số slide hay hướng dẫn hàm Excel. Hãy bổ sung đoạn tài liệu bạn muốn hỏi hoặc chuyển câu hỏi cho TA; mình chưa khẳng định tên hàm hay số slide.', ['course']);
    if (/buoi\s*([4-9]|10)|p-value|p value|kiem dinh/.test(t)) {
      const lesson = t.match(/buoi\s*(10|[4-9])/);
      const number = lesson ? Number(lesson[1]) : 7;
      const topics = {4:'trực quan hóa',5:'xác suất',6:'phân phối chuẩn',7:'kiểm định giả thuyết và p-value',8:'hồi quy tuyến tính',9:'làm sạch dữ liệu',10:'dự án cuối khóa'};
      return result('future', 'Nội dung này chưa mở', `Theo đề cương, buổi ${number} học ${topics[number]}; các buổi sau buổi 3 chưa có tài liệu để giải thích chi tiết. Bạn có thể hỏi lại nội dung buổi 3 hoặc nhờ TA hướng dẫn thời điểm học.`, ['course']);
    }
    if (/bai\s*(tap\s*)?2\b/.test(t)) return result('closed-homework', 'Bài 2 đã đóng và công bố đáp án', 'Theo trang khóa học, bài 2 đã đóng ngày 06/11 và có đáp án từ 07/11. Với dãy 4, 8, 6, 5, 7: tổng là 30, có 5 giá trị, nên trung bình bằng 30 / 5 = 6.', ['course', '3.1'], true);
    if (/ngu|kem|dot|khong co nang luc/.test(t)) return result('support', 'Mình cùng tháo gỡ từng bước nhé', 'Một chỗ chưa hiểu không nói lên năng lực của bạn. Bạn đang vướng ở khái niệm trung vị, trung bình hay cách đọc đề? Mình có thể giải thích một ý trước; nếu muốn trao đổi với TA, bạn tự chọn nội dung gửi.');
    if (/han nop|deadline/.test(t)) return result('deadline', 'Hạn nộp theo trang khóa học', 'Bài 3 có hạn 23:59 ngày 13/11/2026. Việc chuyển câu hỏi cho TA không tự động gia hạn bài.', ['course'], true);
    if (/trung vi|trung binh|ngoai lai/.test(t)) return result('concept', 'Chọn đại lượng theo đặc điểm dữ liệu', 'Trung bình dùng toàn bộ giá trị nên nhạy với ngoại lai. Trung vị là giá trị giữa sau khi sắp xếp (hoặc trung bình hai giá trị giữa), ít bị ảnh hưởng bởi ngoại lai. Với thu nhập lệch, trung vị thường hữu ích. Trước khi bỏ một ngoại lai, cần kiểm tra đó là lỗi nhập liệu hay dữ liệu thật.', ['3.1', '3.2', '3.4'], true);
    return result('clarify', 'Mình cần hiểu rõ hơn một chút', 'Bạn đang hỏi khái niệm hoặc đoạn nào của buổi 3? Hãy nêu tên mục hay chép đoạn bạn chưa hiểu. Mình chưa đủ căn cứ để đoán ý hoặc gửi câu hỏi cho TA thay bạn.');
  }
  function taAvailability(open) { return open ? 'Đang trong giờ TA (08:00–22:00). Bản demo đặt mục tiêu phản hồi trong 30 phút; đây không phải cam kết dịch vụ thực tế.' : 'Ngoài giờ TA. Ca tiếp theo bắt đầu 08:00 ngày 14/11/2026, sau hạn nộp bài 3 (23:59 ngày 13/11). Không bảo đảm phản hồi kịp hạn và không tự gia hạn.'; }
  const api = { sources, assess, taAvailability };
  if (typeof module !== 'undefined') module.exports = api;
  root.LabPolicy = api;
})(typeof window !== 'undefined' ? window : globalThis);
