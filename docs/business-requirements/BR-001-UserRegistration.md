# BR-001: USER REGISTRATION & AUTHENTICATION

## 1. Mô tả
Người dùng (cặp đôi) đăng ký tài khoản để tạo wedding album.

## 2. Actors
- **User**: Cặp đôi sắp cưới
- **System**: Backend API

## 3. Flow chính

### Đăng ký:
1. User nhập: email, password, tên cô dâu, tên chú rể
2. System validate email (trùng? format?)
3. System hash password
4. System tạo User record
5. System trả về JWT token

### Đăng nhập:
1. User nhập email + password
2. System verify credentials
3. System trả về JWT token
4. User lưu token (localStorage)

## 4. Rules & Validations

### Email:
- Format email hợp lệ
- Không trùng trong hệ thống
- Không phân biệt hoa thường

### Password:
- Tối thiểu 6 ký tự
- Lưu dưới dạng bcrypt hash

### Tên cô dâu/chú rể:
- Tối thiểu 2 ký tự
- Tối đa 100 ký tự
- Cho phép ký tự tiếng Việt

## 5. Edge Cases
- Email đã tồn tại → Báo lỗi "Email đã được đăng ký"
- Password quá ngắn → Báo lỗi "Password tối thiểu 6 ký tự"
- Token hết hạn → Yêu cầu đăng nhập lại

## 6. Acceptance Criteria
- [ ] Đăng ký thành công tạo User record trong DB
- [ ] Đăng nhập đúng trả về JWT token
- [ ] Đăng nhập sai trả lỗi 401
- [ ] Password không lưu plain text
