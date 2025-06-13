# Hướng dẫn sử dụng script `SpamTag`

## Mục đích
- **SpamTag:** Tự động tag một người dùng liên tục trong một kênh Discord.

> **Cảnh báo:** Việc spam tag có thể vi phạm Điều khoản sử dụng của Discord. Hãy sử dụng với trách nhiệm của bạn!

---

## 1. Cài đặt Console Vencord

### 1.1. Đối với Discord Desktop
- Truy cập: [https://vencord.dev/](https://vencord.dev/)
- Chọn **Download** và làm theo hướng dẫn để cài đặt Vencord vào Discord Desktop.
- Khởi động lại Discord sau khi cài đặt.

### 1.2. Đối với Discord Web (Chrome)
- Cài extension Vencord Web tại:  
  [https://chromewebstore.google.com/detail/vencord-web/cbghhgpcnddeihccjmnadmkaejncjndb](https://chromewebstore.google.com/detail/vencord-web/cbghhgpcnddeihccjmnadmkaejncjndb)
- Sau khi cài đặt, tải lại trang Discord Web.

---

## 2. Sử dụng script

### 2.1. Mở Console
- Nhấn `Ctrl + Shift + I` để mở DevTools (Console) trong Discord.
- Chuyển sang tab **Console**.

### 2.2. Dán và chạy script
- Dán toàn bộ nội dung file script vào Console.

---

## 3. Hướng dẫn sử dụng SpamTag

### 3.1. Cấu hình
- Sửa các dòng sau trong script hoặc dùng lệnh:
  ```js
  SpamTag.setChannelId("ID_KENH_DISCORD");
  SpamTag.setTagUserId("ID_NGUOI_DUNG");
  ```
  Thay `"ID_KENH_DISCORD"` bằng ID kênh và `"ID_NGUOI_DUNG"` bằng ID người bạn muốn tag.

### 3.2. Bắt đầu spam tag
```js
SpamTag.start();
```

### 3.3. Dừng spam tag
```js
SpamTag.stop();
```

---

## 4. Lưu ý

- Đảm bảo bạn đã cấu hình đúng các ID trước khi chạy.
- Không lạm dụng để tránh bị khóa tài khoản hoặc rate-limit bởi Discord.
- Sử dụng script với trách nhiệm và tuân thủ quy định của Discord.

---
**Chúc bạn sử dụng script thành công!**