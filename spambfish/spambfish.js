/**
 * @file spam.js
 * @description Spam tin nhắn "bfish" vào một kênh Discord theo phút.
 * @author Bạn
 *
 * @warning Script này có thể vi phạm Điều khoản sử dụng của Discord nếu lạm dụng.
 * Sử dụng với trách nhiệm của bạn!
 *
 * @dependency Cần có hàm `sendMessage` và ID kênh hợp lệ.
 */

const SpamBfish = (() => {
    'use strict';

    // === Cấu hình ===
    const CONFIG = {
        CHANNEL_ID: "YOUR_CHANNEL_ID_HERE", // <-- Thay bằng ID kênh bạn muốn spam
        MESSAGE: "bfish",
        INTERVAL_MS: 3 * 60 * 1000, // 3 phút
        LOGGER_OPTIONS: {
            USE_TIMESTAMPS: false,
        }
    };

    // === Logger đơn giản ===
    const Logger = {
        _log: (level, color, ...messages) => {
            const prefix = CONFIG.LOGGER_OPTIONS.USE_TIMESTAMPS ?
                `[${new Date().toISOString()}] [${level}]` :
                `[${level}]`;
            console.log(`%c${prefix}`, `color: ${color}; font-weight: bold;`, ...messages);
        },
        info: (...messages) => Logger._log('INFO', 'dodgerblue', ...messages),
        success: (...messages) => Logger._log('SUCCESS', 'green', ...messages),
        warn: (...messages) => Logger._log('WARN', 'orange', ...messages),
        error: (...messages) => Logger._log('ERROR', 'red', ...messages),
    };

    let state = {
        isRunning: false,
        intervalId: null,
        sentCount: 0,
        sendMessage: null,
    };

    // === Khởi tạo hàm gửi tin nhắn ===
    function _initializeSendMessage() {
        if (typeof findByProps !== 'function') {
            Logger.error("Không tìm thấy hàm findByProps. Hãy chạy script ở môi trường hỗ trợ.");
            return false;
        }
        try {
            const msgModule = findByProps("sendMessage");
            if (!msgModule || typeof msgModule.sendMessage !== 'function') {
                Logger.error("Không tìm thấy hàm sendMessage.");
                return false;
            }
            state.sendMessage = msgModule.sendMessage;
            Logger.success("Khởi tạo thành công hàm gửi tin nhắn.");
            return true;
        } catch (err) {
            Logger.error("Lỗi khi khởi tạo sendMessage:", err.message);
            return false;
        }
    }

    // === Hàm spam tin nhắn ===
    async function _spamMessage() {
        if (!state.isRunning) return;
        try {
            await state.sendMessage(CONFIG.CHANNEL_ID, { content: CONFIG.MESSAGE });
            state.sentCount++;
            Logger.success(`Đã gửi tin nhắn #${state.sentCount}: "${CONFIG.MESSAGE}"`);
        } catch (err) {
            Logger.error("Lỗi khi gửi tin nhắn:", err.message);
        }
    }

    // === Bắt đầu spam ===
    function start() {
        if (state.isRunning) {
            Logger.warn("Đang chạy rồi.");
            return;
        }
        if (!state.sendMessage && !_initializeSendMessage()) {
            Logger.error("Không thể khởi tạo hàm gửi tin nhắn.");
            return;
        }
        if (!CONFIG.CHANNEL_ID || CONFIG.CHANNEL_ID === "YOUR_CHANNEL_ID_HERE") {
            Logger.error("Bạn chưa cấu hình CHANNEL_ID.");
            return;
        }
        state.isRunning = true;
        Logger.info("Bắt đầu spam tin nhắn mỗi phút. Để dừng, gọi SpamBfish.stop()");
        _spamMessage();
        state.intervalId = setInterval(_spamMessage, CONFIG.INTERVAL_MS);
    }

    // === Dừng spam ===
    function stop() {
        if (!state.isRunning) {
            Logger.warn("Chưa chạy hoặc đã dừng.");
            return;
        }
        clearInterval(state.intervalId);
        state.intervalId = null;
        state.isRunning = false;
        Logger.info(`Đã dừng. Tổng số tin nhắn đã gửi: ${state.sentCount}`);
    }

    Logger.info("Script spam bfish đã sẵn sàng.");
    Logger.info("Cấu hình CHANNEL_ID trước khi chạy.");
    Logger.info("Chạy SpamBfish.start() để bắt đầu, SpamBfish.stop() để dừng.");

    return {
        start,
        stop,
        setChannelId: (id) => { CONFIG.CHANNEL_ID = id; Logger.info("Đã cập nhật CHANNEL_ID:", id); }
    };
})();