'use strict';
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const examples = [
  ['Nguồn có lỗi', 'Tài liệu §3.3 bảo độ lệch chuẩn luôn nhỏ hơn phương sai, đúng không?'],
  ['Bài đang mở', 'Giải hộ bài tập 3 và cho đáp án.'],
  ['Câu hỏi thông thường', 'Trung vị khác trung bình cộng thế nào?'],
  ['Thiếu nguồn', 'Giải thích slide 12'],
  ['Bài đã đóng', 'Giải thích bài tập 2 đã có đáp án'],
  ['Chưa rõ ý', 'Cái độ lệch ấy là gì?']
];
let currentQuestion = examples[0][1];
let current = LabPolicy.assess(currentQuestion);
let tickets = [];
let selected = null;
let transferDraft = null;
let toastTimer;
function toast(text) { $('toast').textContent = text; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 5500); }
function sources() {
  $('source-list').innerHTML = Object.entries(LabPolicy.sources).map(([id, s]) => `<details id="source-${id}" ${current.sourceIds.includes(id) ? 'open' : ''} class="${current.sourceIds.includes(id) ? 'selected' : ''} ${id === '3.3' ? 'disputed' : ''}"><summary>${escapeHtml(s.title)}</summary><p>${escapeHtml(s.text)}</p>${id === '3.3' ? '<small>⚑ Câu nguồn có tranh chấp · chưa được TA đính chính</small>' : ''}</details>`).join('');
}
function renderAnswer(question) {
  transferDraft = null;
  currentQuestion = question;
  current = LabPolicy.assess(question);
  sources();
  $('conversation').className = current.kind;
  $('conversation').innerHTML = `<div class="user-message"><div class="message-meta">BẠN HỎI</div>${escapeHtml(question)}</div><article class="answer"><div class="message-meta">TRỢ LÝ · ${current.kind === 'concept' || current.kind === 'closed-homework' || current.kind === 'deadline' ? 'TỰ TRẢ LỜI TRONG PHẠM VI' : 'GIỚI HẠN & CHỜ BẠN CHỌN'}</div><h3 class="answer-title"><span class="marker">1</span> ${escapeHtml(current.title)}</h3><p>${escapeHtml(current.message)}</p><div class="source-chips">${current.sourceIds.map(id => `<button type="button" data-source="${id}">↗ ${escapeHtml(LabPolicy.sources[id].title.split(' · ')[0])}</button>`).join('')}</div>${current.kind === 'source-error' || current.kind === 'homework' ? '<div class="notice">Không tự sửa nguồn, không tự chuyển TA hoặc đăng nội dung lên FAQ.</div>' : ''}<div class="answer-actions"><button id="edit-question">Sửa câu hỏi</button><button id="request-transfer">Soạn câu hỏi cho TA →</button></div><div class="boundary">Bản demo phản hồi theo tình huống dựng sẵn. Chưa có đánh giá năng lực học viên hay hành động ngoài hệ thống.</div></article>`;
  $('edit-question').onclick = () => { $('question').value = currentQuestion; $('question').focus(); };
  $('request-transfer').onclick = openTransfer;
  document.querySelectorAll('[data-source]').forEach(button => button.onclick = () => { const source = $('source-' + button.dataset.source); source.open = true; source.scrollIntoView({behavior:'auto', block:'nearest'}); source.querySelector('summary').focus(); });
}
function availability() {
  $('availability').textContent = LabPolicy.taAvailability($('ta-open').checked);
  $('ta-status').textContent = $('ta-open').checked ? 'TA đang trong giờ trực' : 'TA đã hết giờ trực';
  $('clock-label').textContent = `13.11.2026 · ${$('ta-open').checked ? '21:30' : '22:30'}`;
}
function openTransfer() {
  $('transfer-text').value = transferDraft ?? currentQuestion;
  $('consent').checked = false;
  $('transfer-error').hidden = true;
  availability();
  $('transfer-dialog').showModal();
}
function showView(ta) {
  $('student-view').hidden = ta; $('ta-view').hidden = !ta;
  $('student-tab').classList.toggle('active', !ta); $('ta-tab').classList.toggle('active', ta);
  $('page-title').textContent = ta ? 'Duyệt kỹ trước khi chia sẻ.' : 'Một chỗ để hỏi cho rõ.';
  $('page-description').textContent = ta ? 'Xác minh nguồn và giữ câu trả lời an toàn cho cả lớp.' : 'Cùng đọc nguồn, tháo gỡ điểm khó và giữ quyền quyết định.';
  if (ta) renderTickets();
}
function renderTickets() {
  $('queue-count').textContent = tickets.length;
  $('ticket-total').textContent = tickets.length;
  $('ticket-list').innerHTML = tickets.length ? tickets.map(t => `<button class="ticket-button ${t.id === selected ? 'active' : ''}" data-ticket="${t.id}">#${t.id} · ${escapeHtml(t.question.slice(0, 85))}<small>${t.published ? 'FAQ đã phát hành (mô phỏng)' : t.retracted ? 'FAQ đã thu hồi' : 'Đã vào hàng đợi · chờ TA'} · ${t.time}</small></button>`).join('') : '<p class="subtle">Chưa có câu hỏi. Trợ lý không tự chuyển cuộc trò chuyện.</p>';
  document.querySelectorAll('[data-ticket]').forEach(b => b.onclick = () => { selected = Number(b.dataset.ticket); renderTickets(); });
  const ticket = tickets.find(t => t.id === selected);
  if (!ticket) { $('ticket-detail').innerHTML = '<h2>Chọn một câu hỏi để xem xét</h2><p class="subtle">Học viên phải duyệt nội dung trước khi TA nhận.</p>'; return; }
  const assessment = LabPolicy.assess(ticket.question);
  const eligible = assessment.allowFaq || assessment.kind === 'source-error';
  $('ticket-detail').innerHTML = `<span class="pill">TA · quyền duyệt mô phỏng</span><h2 style="margin-top:14px">Câu hỏi #${ticket.id}</h2><p class="ticket-text">${escapeHtml(ticket.question)}</p><p class="subtle">Phạm vi nguồn đã gửi: ${ticket.sourceIds.map(escapeHtml).join(', ') || 'Chưa xác định'}. Không kèm lịch sử trò chuyện.</p><div class="notice">${escapeHtml(ticket.availability)}</div><h3><span class="marker">5</span> Đề xuất FAQ — cần TA xác minh</h3>${eligible ? `<label for="faq-draft">Nội dung nháp (TA có thể sửa)</label><textarea id="faq-draft" rows="5">${escapeHtml(ticket.draft || (assessment.kind === 'source-error' ? 'Đính chính §3.3: không thể kết luận độ lệch chuẩn luôn nhỏ hơn phương sai. Ví dụ phương sai 0,25 thì độ lệch chuẩn là 0,5. Đây là phản ví dụ tổng quát, không phải đáp số bài đang mở.' : assessment.message))}</textarea><label class="review-check"><input id="verify-source" type="checkbox"> Tôi đã đối chiếu nguồn và kiểm tra không chứa đáp án bài đang mở.</label><label class="review-check"><input id="approve-faq" type="checkbox"> Với vai trò TA mô phỏng, tôi duyệt phát hành FAQ cho cả lớp.</label><button id="publish-faq" class="primary" ${ticket.published ? 'disabled' : ''}>${ticket.published ? 'FAQ đã phát hành' : 'TA duyệt & phát hành'}</button><p id="faq-error" role="alert" class="error" hidden></p>` : '<div class="error">Không cho đăng FAQ cho tình huống này. Bài đang mở: chỉ hỗ trợ bước đầu, không phát hành lời giải hoặc xác nhận đáp số.</div>'}${ticket.published ? '<div class="notice">FAQ đã phát hành trong bản demo. Có thể thu hồi hiển thị, nhưng không thể xóa thông tin người khác đã đọc.</div><button id="retract-faq">Thu hồi FAQ</button>' : ''}${ticket.retracted ? '<p class="notice">Đã thu hồi hiển thị FAQ; người đã xem có thể vẫn ghi nhớ hoặc sao chép nội dung.</p>' : ''}`;
  if (eligible && !ticket.published) {
    for (const id of ['verify-source', 'approve-faq', 'faq-draft']) $(id).oninput = () => $('faq-error').hidden = true;
    $('publish-faq').onclick = () => {
    const draft = $('faq-draft').value.trim();
    const error = $('faq-error');
    ticket.draft = draft;
    if (!$('verify-source').checked || !$('approve-faq').checked || !draft) { error.textContent = 'Cần nội dung, xác minh nguồn và TA duyệt trước khi phát hành.'; error.hidden = false; return; }
    if (LabPolicy.assess(draft).kind === 'homework' || /15[,.]25|11[,.]5/.test(draft)) { error.textContent = 'Chặn bản nháp có dấu hiệu liên quan đáp án bài 3. Hãy kiểm tra lại phạm vi; prototype không phải bộ lọc ngữ nghĩa đầy đủ.'; error.hidden = false; return; }
    ticket.published = true; ticket.retracted = false; renderTickets(); toast('Đã phát hành FAQ trong bản demo.');
    };
  }
  if (ticket.published) $('retract-faq').onclick = () => { ticket.published = false; ticket.retracted = true; renderTickets(); toast('Đã thu hồi hiển thị; không thể thu hồi phần người khác đã đọc.'); };
}
$('question-form').onsubmit = event => { event.preventDefault(); const q = $('question').value.trim(); if (q) { renderAnswer(q); $('question').value = ''; } };
$('transfer-form').onsubmit = event => {
  event.preventDefault();
  const question = $('transfer-text').value.trim();
  if (!question || !$('consent').checked) return;
  if ($('simulate-failure').checked) { $('transfer-error').textContent = 'Chuyển thất bại. Chưa vào hàng đợi TA. Nội dung vẫn được giữ tại đây; bạn có thể sao chép hoặc thử lại.'; $('transfer-error').hidden = false; return; }
  const assessment = LabPolicy.assess(question);
  const ticket = { id: tickets.length + 1, question, sourceIds: assessment.sourceIds, availability: LabPolicy.taAvailability($('ta-open').checked), time: $('ta-open').checked ? '21:30' : '22:30', published:false };
  tickets.push(ticket); selected = ticket.id; renderTickets(); $('transfer-dialog').close(); toast('Đã vào hàng đợi TA mô phỏng. ' + ($('ta-open').checked ? 'Chưa có phản hồi.' : 'Ca sau bắt đầu 08:00 ngày 14/11, sau hạn nộp.'));
};
$('close-dialog').onclick = $('cancel-transfer').onclick = () => $('transfer-dialog').close();
$('transfer-text').oninput = () => transferDraft = $('transfer-text').value;
$('student-tab').onclick = () => showView(false); $('ta-tab').onclick = () => showView(true);
$('ta-open').onchange = availability;
$('show-markers').onchange = () => document.body.classList.toggle('hide-markers', !$('show-markers').checked);
$('reset').onclick = () => { tickets = []; selected = null; $('ta-open').checked = false; $('simulate-failure').checked = false; $('question').value = ''; availability(); renderTickets(); showView(false); renderAnswer(examples[0][1]); toast('Đã đặt lại dữ liệu demo.'); };
$('scenario-buttons').innerHTML = examples.map(([label], index) => `<button data-example="${index}">${escapeHtml(label)}</button>`).join('');
document.querySelectorAll('[data-example]').forEach(b => b.onclick = () => { showView(false); renderAnswer(examples[Number(b.dataset.example)][1]); });
renderAnswer(currentQuestion); availability(); renderTickets();
