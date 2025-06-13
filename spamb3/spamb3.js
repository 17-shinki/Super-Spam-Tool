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

const SpamB3 = (() => {
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

    // === Hàm spam tin nhắn tùy chỉnh ===
    async function _spamMessageCustom(message) {
        if (!state.isRunning) return;
        try {
            await state.sendMessage(CONFIG.CHANNEL_ID, { content: message });
            state.sentCount++;
            Logger.success(`Đã gửi tin nhắn #${state.sentCount}: "${message}"`);
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
        Logger.info("Bắt đầu spam tin nhắn. Để dừng, gọi SpamB3.stop()");

        // Spam bfish mỗi 3 phút
        _spamMessageCustom("bfish");
        state.bfishIntervalId = setInterval(() => _spamMessageCustom("bfish"), 3 * 60 * 1000);

        // Spam blove mỗi 7 phút
        _spamMessageCustom("blove");
        state.bloveIntervalId = setInterval(() => _spamMessageCustom("blove"), 7 * 60 * 1000);

        // Spam bpray mỗi 7 phút
        _spamMessageCustom("bpray");
        state.bprayIntervalId = setInterval(() => _spamMessageCustom("bpray"), 7 * 60 * 1000);
    }

    // === Dừng spam ===
    function stop() {
        if (!state.isRunning) {
            Logger.warn("Chưa chạy hoặc đã dừng.");
            return;
        }
        clearInterval(state.bfishIntervalId);
        clearInterval(state.bloveIntervalId);
        clearInterval(state.bprayIntervalId);
        state.bfishIntervalId = null;
        state.bloveIntervalId = null;
        state.bprayIntervalId = null;
        state.isRunning = false;
        Logger.info(`Đã dừng. Tổng số tin nhắn đã gửi: ${state.sentCount}`);
    }

    Logger.info("Script spam bfish đã sẵn sàng.");
    Logger.info("Cấu hình CHANNEL_ID trước khi chạy.");
    Logger.info("Chạy SpamB3.start() để bắt đầu, SpamB3.stop() để dừng.");

    return {
        start,
        stop,
        setChannelId: (id) => { CONFIG.CHANNEL_ID = id; Logger.info("Đã cập nhật CHANNEL_ID:", id); }
    };
})();