# 📢 QUY TRÌNH BA - WEDDING ALBUM WEB

## ⚠️ QUY TRÌNH BẮT BUỘC

### 1. BA Viết Nghiệp Vụ
- Nhận task từ PM
- Phân tích yêu cầu
- Viết tài liệu BR (Business Requirements)
- Lưu file local trong quá trình viết

### 2. PM Review
- BA gửi file cho PM review (qua chat)
- PM đọc, góp ý, yêu cầu sửa (nếu cần)
- BA chỉnh sửa theo feedback
- PM approve ✅

### 3. Push Lên Git (SAU KHI APPROVE)
```bash
git add docs/business-requirements/
git commit -m "docs: Add BR-XXX - [Tên nghiệp vụ]"
git push origin master
```

### 4. Giao Cho DEV
- Sau khi đã push lên git
- PM giao task cho DEV
- DEV đọc BR trên git để code
- QA đọc BR để viết test case

---

## ❌ KHÔNG ĐƯỢC

- Push lên git khi chưa được PM approve
- Giao cho DEV khi chưa push lên git
- Lưu file local mãi không push (sau khi đã approve)
- Gửi BR qua email/Zalo làm bản chính thức

---

## ✅ WORKFLOW ĐÚNG

```
PM giao task 
  ↓
BA phân tích & viết BR (local)
  ↓
PM Review → (feedback → sửa → review lại)
  ↓
PM Approve ✅
  ↓
BA Push lên Git
  ↓
PM giao task cho DEV
  ↓
DEV đọc BR trên Git → Code
  ↓
QA đọc BR → Viết test case
```

---

## 📋 CHECKLIST KHI HOÀN THÀNH BR

- [ ] File đặt tên đúng: `BR-XXX-TenNghiepVu.md`
- [ ] Đủ 6 sections (Mô tả, Actors, Flow, Rules, Edge Cases, AC)
- [ ] Đã gửi PM review và được approve
- [ ] Đã push lên GitHub
- [ ] Thông báo cho PM: "BR-XXX đã push, sẵn sàng giao DEV"

---

## 📁 CẤU TRÚC THƯ MỤC

```
docs/
├── business-requirements/   ← BA lưu BR files ở đây
│   ├── README.md
│   ├── BR-001-UserRegistration.md
│   └── ...
├── database/                ← ERD, schema
└── api-specs/               ← API docs
```
