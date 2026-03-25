# BR-004: LOVE STORY (TIMELINE TÌNH YÊU)

## 1. Mô tả
Cặp đôi kể câu chuyện tình yêu qua timeline các cột mốc quan trọng.

## 2. Actors
- **User**: Cặp đôi (chỉ chủ album mới edit được)
- **Guest**: Khách xem (chỉ xem, không edit)

## 3. Flow chính
1. User vào trang Love Story
2. User thêm cột mốc: tiêu đề, ngày tháng, mô tả, ảnh (optional)
3. System lưu LoveStory record
4. Timeline hiển thị theo thứ tự thời gian

## 4. Rules & Validations
- Tiêu đề: 2-100 ký tự
- Ngày: ISO 8601
- Mô tả: tối đa 1000 ký tự
- Ảnh: JPG/PNG, max 5MB

## 5. Edge Cases
- Không có cột mốc → Hiển thị message "Chưa có timeline"
- Thứ tự thời gian → Tự động sort

## 6. Acceptance Criteria
- [ ] User thêm/sửa/xóa cột mốc thành công
- [ ] Timeline hiển thị đúng thứ tự thời gian
- [ ] Guest chỉ xem, không edit được
