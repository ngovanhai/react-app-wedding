# BR-002: ALBUM MANAGEMENT

## 1. Mô tả
User tạo và quản lý wedding album (thông tin lễ cưới + upload ảnh).

## 2. Actors
- **User**: Chủ album (cặp đôi)
- **Guest**: Khách xem album (public)
- **System**: Backend API

## 3. Flow chính

### Tạo album:
1. User đăng nhập
2. User nhập thông tin: tên sự kiện, ngày giờ, địa điểm, template
3. System tạo Album record + sinh QR code & share link

### Upload ảnh:
1. User chọn album, upload ảnh (multiple)
2. System lưu ảnh + tạo AlbumPhoto records
3. Hiển thị trong gallery

### Xem album (public):
1. Guest mở share link
2. Hiển thị thông tin cưới + gallery
3. Guest có thể để lại lời chúc

## 4. Rules & Validations
- Tên sự kiện: 2-200 ký tự
- Ảnh: JPG/PNG/WEBP, max 10MB, max 50 files/lần
- Auto resize: max 1920px width

## 5. Edge Cases
- Upload failed → Báo lỗi cụ thể
- Link share không tồn tại → 404 page

## 6. Acceptance Criteria
- [ ] Tạo album thành công lưu DB
- [ ] Upload ảnh hiển thị trong gallery
- [ ] Share link hoạt động public
- [ ] QR code trỏ đúng share link
