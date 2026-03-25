# BR-003: GUEST BOOK (SỔ CHÚC MỪNG)

## 1. Mô tả
Guest để lại lời chúc mừng cho cặp đôi thông qua guest book.

## 2. Actors
- **Guest**: Khách mời (không cần login)
- **User**: Chủ album (xem và quản lý lời chúc)

## 3. Flow chính
1. Guest mở album share link
2. Guest scroll xuống phần Guest Book
3. Guest nhập: tên + lời chúc
4. Guest submit
5. System lưu GuestBook record
6. Lời chúc hiển thị ngay (có thể cần approve)

## 4. Rules & Validations
- Tên: 2-100 ký tự
- Lời chúc: 10-1000 ký tự
- Chống spam: max 3 messages/IP/giờ

## 5. Edge Cases
- Nội dung không phù hợp → Admin có thể xóa
- Spam → Block IP tạm thời

## 6. Acceptance Criteria
- [ ] Guest submit thành công lưu DB
- [ ] Lời chúc hiển thị trong album
- [ ] User (chủ album) xem được tất cả lời chúc
