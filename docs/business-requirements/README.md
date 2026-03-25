# 📋 BUSINESS REQUIREMENTS - WEDDING ALBUM WEB

## 🎯 MỤC ĐÍCH
Thư mục này lưu trữ toàn bộ nghiệp vụ (business logic) của dự án Wedding Album Web.

## 📁 CẤU TRÚC

```
business-requirements/
├── README.md                 # File này
├── BR-001-UserRegistration.md  # Đăng ký người dùng
├── BR-002-AlbumManagement.md   # Quản lý album
├── BR-003-GuestBook.md         # Sổ chúc mừng
├── BR-004-LoveStory.md         # Timeline tình yêu
├── BR-005-TemplateSystem.md    # Hệ thống template
├── BR-006-QRCode.md            # QR Code chia sẻ
└── BR-007-LiveWall.md          # Live Wall (future)
```

## 📝 QUY TRÌNH BA

### 1. Khi nhận task từ PM:
- Đọc yêu cầu từ PM/DEV
- Phân tích nghiệp vụ chi tiết
- Viết tài liệu BR (Business Requirements)

### 2. Format tài liệu BR:
```markdown
# BR-XXX: [TÊN NGHIỆP VỤ]

## 1. Mô tả
[Nghiệp vụ làm gì]

## 2. Actors
- Ai tham gia (User, Admin, Guest...)

## 3. Flow chính
1. Bước 1
2. Bước 2
3. Bước 3

## 4. Rules & Validations
- Rule 1
- Rule 2

## 5. Edge Cases
- Trường hợp đặc biệt 1
- Trường hợp đặc biệt 2

## 6. Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### 3. Sau khi viết xong:
1. Commit lên Git: `git add docs/business-requirements/BR-XXX.md`
2. Push lên GitHub
3. Thông báo cho PM review

### 4. Sau khi PM approve:
- DEV sẽ dựa vào BR để code
- QA sẽ dựa vào BR để viết test case

## ⚠️ QUAN TRỌNG

**TẤT CẢ NGHIỆP VỤ PHẢI ĐƯỢC ĐẨY LÊN GIT SAU KHI REVIEW**
- Không lưu local
- Không gửi qua chat/email
- Luôn commit & push để team cùng truy cập

## 📊 TRẠNG THÁI

| BR ID | Tên | Status | Reviewed By |
|-------|-----|--------|-------------|
| BR-001 | User Registration | ✅ Done | PM |
| BR-002 | Album Management | ✅ Done | PM |
| BR-003 | Guest Book | ✅ Done | PM |
| BR-004 | Love Story | ✅ Done | PM |
| BR-005 | Template System | 📝 TODO | - |
| BR-006 | QR Code | 📝 TODO | - |
| BR-007 | Live Wall | 📝 TODO | - |
