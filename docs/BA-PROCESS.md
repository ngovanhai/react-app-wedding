# 📢 QUY TRÌNH BA - WEDDING ALBUM WEB

## ⚠️ BẮT BUỘC: ĐẨY TẤT CẢ NGHIỆP VỤ LÊN GIT

Sau khi BA hoàn thành tài liệu nghiệp vụ (BR) và được PM review approve:

### 1. Commit & Push NGAY LẬP TỨC
```bash
git add docs/business-requirements/
git commit -m "docs: Add BR-XXX - [Tên nghiệp vụ]"
git push origin master
```

### 2. Không được:
- ❌ Lưu file local trên máy
- ❌ Gửi qua email/Zalo/Telegram
- ❌ Chờ tích lũy nhiều file mới push
- ❌ Để PM phải nhắc mới push

### 3. Lý do:
- ✅ DEV cần đọc BR để code đúng
- ✅ QA cần đọc BR để viết test case
- ✅ PM cần track tiến độ
- ✅ Backup tránh mất dữ liệu

---

## 📋 CHECKLIST KHI HOÀN THÀNH BR

- [ ] File đặt tên đúng: `BR-XXX-TenNghiepVu.md`
- [ ] Đủ 6 sections (Mô tả, Actors, Flow, Rules, Edge Cases, AC)
- [ ] Đã push lên GitHub
- [ ] Thông báo cho PM trong chat: "BR-XXX đã sẵn sàng review"

---

## 📁 CẤU TRÚC THƯ MỤC

```
docs/
├── business-requirements/   ← BA lưu BR files ở đây
│   ├── README.md
│   ├── BR-001-UserRegistration.md
│   ├── BR-002-AlbumManagement.md
│   ├── BR-003-GuestBook.md
│   └── BR-004-LoveStory.md
├── database/                ← ERD, schema (DEV/BA cùng làm)
└── api-specs/               ← API docs (DEV làm)
```

---

## 🔄 WORKFLOW

```
PM giao task → BA phân tích → Viết BR → Push Git → PM Review → DEV Code → QA Test
```

**BA chịu trách nhiệm:**
- Tài liệu BR rõ ràng, đầy đủ
- Push lên git ngay sau khi viết xong
- Update BR khi có thay đổi requirement
