# Hướng dẫn sử dụng script spam tag @everyone trên Discord

> ⚠️ **Cảnh báo:** Việc spam @everyone có thể vi phạm Điều khoản sử dụng của Discord. Hãy sử dụng script này một cách có trách nhiệm!

## 1. Yêu cầu

- Đã đăng nhập Discord trên trình duyệt hoặc client.
- Có quyền gửi tin nhắn và tag @everyone trong kênh bạn muốn spam.
- Đã có script `spamtageveryone.js`.
- **Khuyến nghị:** Sử dụng [Vencord Console](https://github.com/Vendicated/Vencord) để chạy script dễ dàng hơn.

---

## 2. Cách cài đặt Vencord Console

### Cách 1: Cài đặt trên trình duyệt (Chrome/Edge/Brave...)

1. Cài tiện ích [Vencord Console](https://chrome.google.com/webstore/detail/vencord-console/ifhieedhpmjjkhnklbnefhkfcfnbocfa) từ Chrome Web Store.
2. Sau khi cài xong, mở Discord web, bạn sẽ thấy tab **Vencord Console** bên cạnh tab Console thông thường trong DevTools.

### Cách 2: Cài đặt trên Firefox

1. Cài tiện ích [Vencord Console cho Firefox](https://addons.mozilla.org/en-US/firefox/addon/vencord-console/).
2. Mở Discord web, vào DevTools sẽ có tab **Vencord Console**.

---

## 3. Cách sử dụng script

### Bước 1: Cấu hình script

Mở file `spamtageveryone.js` và chỉnh sửa các dòng sau:

```javascript
const CONFIG = {
    CHANNEL_ID: "YOUR_CHANNEL_ID_HERE", // <-- Thay bằng ID kênh bạn muốn spam
    // TAG_USER_ID không cần thiết khi tag everyone
};
```

- Để lấy Channel ID: Chuột phải vào kênh Discord → Copy ID (bật Developer Mode trong Settings nếu chưa có).

### Bước 2: Chạy script

1. Mở **Vencord Console** (hoặc Console thường nếu không dùng Vencord).
2. Dán toàn bộ nội dung file `spamtageveryone.js` vào console và Enter.
3. Gõ lệnh sau để bắt đầu spam:

```javascript
SpamTag.start();
```

- Để dừng spam, gõ:

```javascript
SpamTag.stop();
```

### Bước 3: Tuỳ chỉnh

- Để đổi kênh spam, dùng:
    ```javascript
    SpamTag.setChannelId("ID_KENH_MOI");
    ```

---

## 4. Lưu ý

- Không nên lạm dụng, tránh bị khóa tài khoản hoặc ban khỏi server.
- Script chỉ hoạt động khi bạn có quyền gửi tin nhắn và tag everyone trong kênh đó.

---

**Chúc bạn sử dụng an toàn