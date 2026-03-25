# 📢 QUY TRÌNH DEV & QA - WEDDING ALBUM WEB

## ⚠️ QUY TRÌNH BẮT BUỘC

### 1. DEV Nhận Task Từ PM
- Đọc BR trong `docs/business-requirements/`
- Đọc API specs (nếu có) trong `docs/api-specs/`
- Ước lượng thời gian hoàn thành

### 2. DEV Tạo Branch Mới
```bash
git checkout main
git pull origin main
git checkout -b feature/TEN_FEATURE
# Ví dụ: feature/user-registration, feature/album-upload
```

### 3. DEV Code Trên Branch
- Code tính năng theo BR
- Commit thường xuyên với message rõ ràng
- Test local trước khi push

### 4. DEV Push Branch Lên Git
```bash
git push -u origin feature/TEN_FEATURE
```

### 5. DEV Báo QA
Thông báo cho QA (qua chat):
```
✅ Code xong: [Tên feature]
🔗 Branch: feature/ten-feature
📝 BR: BR-XXX
🧪 Nhờ QA test
```

### 6. QA Test Trên Branch
```bash
git fetch origin
git checkout feature/ten-feature
npm install
npm run dev
```

**QA kiểm tra:**
- [ ] Đúng theo BR (Acceptance Criteria)
- [ ] Không có bug nghiêm trọng
- [ ] UI/UX ổn
- [ ] API hoạt động đúng

### 7. QA Báo Kết Quả

#### Nếu PASS ✅:
```
✅ QA PASS: [Tên feature]
🔗 Branch: feature/ten-feature
✅ Sẵn sàng merge vào main
```

#### Nếu FAIL ❌:
```
❌ QA FAIL: [Tên feature]
🐛 Bugs tìm thấy:
1. [Mô tả bug 1]
2. [Mô tả bug 2]
📸 Screenshot/Video: (đính kèm)
🔙 Gửi lại DEV fix
```

### 8. DEV Merge Vào Main (Sau Khi QA PASS)
```bash
git checkout main
git pull origin main
git merge feature/ten-feature
git push origin main
```

### 9. DEV/QA Báo PM Hoàn Thành
```
✅ HOÀN THÀNH: [Tên feature]
👨‍💻 DEV: [Tên DEV]
🧪 QA: [Tên QA]
🔗 Branch: Đã merge vào main
📦 Sẵn sàng cho feature tiếp theo
```

### 10. PM Giao Task Tiếp Theo
- PM review task hoàn thành
- PM giao task mới cho DEV/QA

---

## 📋 GIT WORKFLOW

```
main (production)
  ↑
  │ merge (sau khi QA PASS)
  │
feature/user-registration  ← DEV code & QA test ở đây
```

---

## ❌ KHÔNG ĐƯỢC

- DEV code trực tiếp trên main
- DEV merge vào main khi chưa có QA PASS
- QA test trên main (phải test trên branch)
- Merge khi còn bug nghiêm trọng
- DEV tự merge không cần QA approve

---

## ✅ CHECKLIST

### DEV:
- [ ] Tạo branch từ main mới nhất
- [ ] Code theo đúng BR
- [ ] Test local trước khi push
- [ ] Push branch và báo QA
- [ ] Fix bug (nếu QA báo)
- [ ] Merge vào main sau khi QA PASS
- [ ] Báo PM hoàn thành

### QA:
- [ ] Checkout branch DEV cung cấp
- [ ] Test theo Acceptance Criteria trong BR
- [ ] Báo kết quả rõ ràng (PASS/FAIL + chi tiết)
- [ ] Verify lại sau khi DEV fix bug
- [ ] Confirm trước khi DEV merge

---

## 🏷️ BRANCH NAMING CONVENTION

| Loại | Format | Ví dụ |
|------|--------|-------|
| Feature | `feature/ten-tinh-nang` | `feature/user-registration` |
| Bugfix | `fix/ten-loi` | `fix/login-error` |
| Hotfix | `hotfix/ten-loi-nghiem-trong` | `hotfix/security-patch` |
| Release | `release/version` | `release/v1.0.0` |

---

## 📊 TRẠNG THÁI TASK

| Status | Ý nghĩa |
|--------|---------|
| TODO | Chưa bắt đầu |
| IN_PROGRESS | DEV đang code |
| READY_FOR_QA | DEV xong, chờ QA test |
| QA_TESTING | QA đang test |
| QA_FAILED | QA phát hiện bug, cần fix |
| QA_PASSED | QA OK, chờ merge |
| DONE | Đã merge vào main |
