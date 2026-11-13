"""Real browser checks and screenshots. Run from any working directory."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / 'prototype' / 'index.html').as_uri()

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1100}, device_scale_factor=1)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(URL)
    page.locator('#conversation').get_by_text('Phát hiện mâu thuẫn trong tài liệu').wait_for()
    assert '0,25' in page.locator('#conversation').inner_text()
    page.screenshot(path=str(ROOT / 'prototype' / 'screen-student.png'), full_page=True)
    page.click('#request-transfer')
    assert 'sau hạn' in page.locator('#availability').inner_text()
    page.fill('#transfer-text', 'Nhờ TA kiểm tra câu trong §3.3: độ lệch chuẩn luôn nhỏ hơn phương sai.')
    page.click('#cancel-transfer')
    assert page.locator('#queue-count').inner_text() == '0'
    page.locator('.demo-settings').evaluate('(element) => element.open = true')
    page.check('#simulate-failure')
    page.click('#request-transfer')
    assert page.locator('#transfer-text').input_value().startswith('Nhờ TA kiểm tra')
    page.check('#consent')
    page.locator('#transfer-form button[type=submit]').click()
    assert 'Chưa vào hàng đợi' in page.locator('#transfer-error').inner_text()
    assert page.locator('#queue-count').inner_text() == '0'
    page.click('#cancel-transfer')
    page.uncheck('#simulate-failure')
    page.click('#request-transfer')
    # Browser validation prevents submit with unchecked consent.
    page.locator('#transfer-form button[type=submit]').click()
    assert page.locator('#queue-count').inner_text() == '0'
    page.check('#consent')
    page.locator('#transfer-form button[type=submit]').click()
    assert page.locator('#queue-count').inner_text() == '1'
    page.click('#ta-tab')
    page.click('#publish-faq')
    assert page.locator('#faq-error').is_visible()
    assert not page.locator('#publish-faq').is_disabled()
    page.check('#verify-source')
    page.check('#approve-faq')
    page.locator('.demo-settings').evaluate('(element) => element.open = false')
    page.locator('#toast').evaluate('(element) => element.hidden = true')
    page.screenshot(path=str(ROOT / 'prototype' / 'screen-ta.png'), full_page=True)
    page.click('#publish-faq')
    assert page.locator('#publish-faq').is_disabled()
    page.click('#retract-faq')
    assert 'Đã thu hồi hiển thị FAQ' in page.locator('#ticket-detail').inner_text()
    page.locator('.demo-settings').evaluate('(element) => element.open = true')
    page.click('[data-example="1"]')
    assert 'không giải hộ' in page.locator('#conversation').inner_text()
    page.click('#request-transfer')
    page.check('#consent')
    page.locator('#transfer-form button[type=submit]').click()
    page.click('#ta-tab')
    assert page.locator('#publish-faq').count() == 0
    assert 'Không cho đăng FAQ' in page.locator('#ticket-detail').inner_text()
    page.click('#student-tab')
    page.fill('#question', '<img src=x onerror="window.injected=true">')
    page.locator('#question-form button[type=submit]').click()
    assert page.locator('#conversation img').count() == 0
    assert page.evaluate('window.injected !== true')
    page.set_viewport_size({'width': 390, 'height': 844})
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.click('#request-transfer')
    assert page.locator('#transfer-dialog').is_visible()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.keyboard.press('Escape')
    assert not page.locator('#transfer-dialog').is_visible()
    assert not errors, errors
    browser.close()
print('PASS: source warning, cancel, consent, failed transfer, successful queue, FAQ approval, retract, homework block, escaped input, mobile width, keyboard dialog; no browser errors. Two screenshots saved.')
