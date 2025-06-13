# Hướng dẫn sử dụng script `spambfish.js`

## Mục đích
Script này tự động gửi tin nhắn `"bfish"` vào một kênh Discord theo chu kỳ 3 phút.

> **Cảnh báo:** Việc spam tin nhắn có thể vi phạm Điều khoản sử dụng của Discord. Hãy sử dụng với trách nhiệm của bạn!

---

## Cách sử dụng

### 1. Cấu hình CHANNEL_ID
- Mở file `spambfish.js` và tìm dòng:
  ```js
  CHANNEL_ID: "YOUR_CHANNEL_ID_HERE"
  ```
- Thay thế `YOUR_CHANNEL_ID_HERE` bằng ID của kênh Discord mà bạn muốn gửi tin nhắn. Ví dụ:
  ```js
  CHANNEL_ID: "123456789012345678"
  ```
  > **Lưu ý:** Đảm bảo rằng bot của bạn có quyền gửi tin nhắn trong kênh đó.

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
- Dán toàn bộ nội dung file `spambfish.js` vào Console.
- Để bắt đầu spam, nhập:
  ```js
  SpamBfish.setChannelId("123456789012345678"); // Thay bằng ID kênh của bạn
  SpamBfish.start();
  ```
- Để dừng spam, nhập:
  ```js
  SpamBfish.stop();
  ```

---

## Lưu ý
- Hãy chắc chắn rằng bạn đã cài đặt đầy đủ các phụ thuộc cần thiết trước khi chạy script.
- Kiểm tra kỹ các thông số cấu hình để đảm bảo rằng bot hoạt động đúng như mong muốn.
- Sử dụng script này với trách nhiệm và tuân thủ các quy định của Discord.

---

## Các hàm hỗ trợ

- `SpamBfish.start()` — Bắt đầu spam tin nhắn.
- `SpamBfish.stop()` — Dừng spam tin nhắn.
- `SpamBfish.setChannelId("ID")` — Đổi kênh gửi tin nhắn.

**Chúc bạn sử dụng an toàn!**