# Hướng dẫn sử dụng script `discord-guild-tag-finder.js`

## Mục đích
Script này tự động tạo và kiểm tra các máy chủ (guild) Discord để tìm những guild có hash ID thỏa mãn điều kiện đặc biệt, phục vụ mục đích nghiên cứu hoặc sưu tầm.

> **Cảnh báo:** Việc sử dụng script này có thể vi phạm Điều khoản sử dụng của Discord nếu lạm dụng. Hãy sử dụng với trách nhiệm của bạn!

---

## Cách sử dụng

### 1. Chuẩn bị môi trường

- Script yêu cầu hàm `findByProps` có sẵn trong môi trường thực thi (ví dụ: console Discord với Vencord, BetterDiscord, hoặc các client mod tương tự).
- **Khuyến nghị:** Sử dụng Discord Desktop hoặc Discord Web với extension Vencord để đảm bảo đầy đủ các hàm nội bộ.

---

### 2. Cài đặt Console Vencord

#### 2.1. Đối với Discord Desktop
- Truy cập: [https://vencord.dev/](https://vencord.dev/)
- Chọn **Download** và làm theo hướng dẫn để cài đặt Vencord vào Discord Desktop.
- Khởi động lại Discord sau khi cài đặt.

#### 2.2. Đối với Discord Web (Chrome)
- Cài extension Vencord Web tại:  
  [https://chromewebstore.google.com/detail/vencord-web/cbghhgpcnddeihccjmnadmkaejncjndb](https://chromewebstore.google.com/detail/vencord-web/cbghhgpcnddeihccjmnadmkaejncjndb)
- Sau khi cài đặt, tải lại trang Discord Web.

---

### 3. Chạy script

#### 3.1. Mở Console
- Nhấn `Ctrl + Shift + I` để mở DevTools (Console) trong Discord.
- Chuyển sang tab **Console**.

#### 3.2. Dán và chạy script
- Dán toàn bộ nội dung file `discord-guild-tag-finder.js` vào Console.

#### 3.3. Khởi tạo và bắt đầu tìm kiếm
- Đầu tiên, khởi tạo script:
  ```js
  GuildTagFinder.initialize();
  ```
- Sau đó, bắt đầu quá trình tìm kiếm:
  ```js
  GuildTagFinder.start();
  ```
- Để dừng lại bất cứ lúc nào:
  ```js
  GuildTagFinder.stop();
  ```

---

## Lưu ý

- Script sẽ tự động tạo và xóa các guild không thỏa mãn điều kiện hash, chỉ giữ lại những guild phù hợp.
- Không nên lạm dụng để tránh bị rate-limit hoặc khóa tài khoản bởi Discord.
- Bạn có thể bật chế độ debug để xem thêm thông tin log:
  ```js
  GuildTagFinder.setDebugMode(true);
  ```
- Để xem lại cấu hình script:
  ```js
  GuildTagFinder.getConfig();
  ```

---

**Chúc bạn sử dụng an toàn và có hiệu quả!**