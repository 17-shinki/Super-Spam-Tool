# Hướng dẫn sử dụng script `spamb3.js`

## Mục đích
Script này tự động gửi các tin nhắn `"bfish"`, `"bpray"`, `"blove"` vào một kênh Discord theo chu kỳ định sẵn:  
- `"bfish"` mỗi 3 phút  
- `"blove"` mỗi 7 phút  
- `"bpray"` mỗi 7 phút  
Các tin nhắn này sẽ được gửi song song, không chờ nhau.

> **Cảnh báo:** Việc spam tin nhắn có thể vi phạm Điều khoản sử dụng của Discord. Hãy sử dụng với trách nhiệm của bạn!

---

## Cách sử dụng

### 1. Cấu hình CHANNEL_ID
Mở file `spamb3.js` và tìm dòng:
```js
CHANNEL_ID: "YOUR_CHANNEL_ID_HERE"
```
Thay thế `YOUR_CHANNEL_ID_HERE` bằng ID của kênh mà bạn muốn gửi tin nhắn tới.

Hoặc, sau khi nạp script vào Console, bạn có thể cập nhật CHANNEL_ID bằng lệnh:
```js
SpamB3.setChannelId("ID_KENH_DISCORD");
```

---

### 2. Cài đặt và sử dụng Console Vencord

#### 2.1. Cài đặt Vencord
- **Đối với Discord Desktop:**
  - Truy cập trang chủ: [https://vencord.dev/](https://vencord.dev/)
  - Chọn **Download** và làm theo hướng dẫn để cài đặt Vencord vào Discord Desktop.
  - Sau khi cài đặt, khởi động lại Discord.
- **Đối với Discord Web (trình duyệt Chrome):**
  - Cài đặt extension Vencord Web tại: [https://chromewebstore.google.com/detail/vencord-web/cbghhgpcnddeihccjmnadmkaejncjndb](https://chromewebstore.google.com/detail/vencord-web/cbghhgpcnddeihccjmnadmkaejncjndb)
  - Sau khi cài đặt, tải lại trang Discord Web.

#### 2.2. Mở Console Vencord
- Nhấn `Ctrl + Shift + I` để mở DevTools (Console) trong Discord.
- Chuyển sang tab **Console**.

#### 2.3. Dán và chạy script
- Dán toàn bộ nội dung file `spamb3.js` vào Console.
- Để bắt đầu spam, nhập:
  ```js
  SpamB3.setChannelId("123456789012345678"); // Thay bằng ID kênh của bạn
  SpamB3.start();
  ```
- Để dừng spam, nhập:
  ```js
  SpamB3.stop();
  ```

---

## Lưu ý
- Đảm bảo rằng bạn đã cài đặt đầy đủ các phụ thuộc cần thiết trước khi chạy script.
- Đảm bảo bạn có quyền gửi tin nhắn trong kênh mục tiêu.
- Kiểm tra kỹ ID kênh và các cấu hình khác trước khi chạy script để tránh gửi tin nhắn đến nhầm kênh.
- Sử dụng script này với trách nhiệm và tuân thủ các quy định của Discord.

---

## Các hàm hỗ trợ

- `SpamB3.start()` — Bắt đầu spam tin nhắn.
- `SpamB3.stop()` — Dừng spam tin nhắn.
- `SpamB3.setChannelId("ID")` — Đổi kênh gửi tin nhắn.

---

## Phiên bản
- **Phiên bản hiện tại:** 1.0.0
- **Ngày phát hành:** 14/06/2025

---

Cảm ơn bạn đã sử dụng script `spamb3.js`! Chúc bạn có những trải nghiệm tuyệt vời trên Discord!