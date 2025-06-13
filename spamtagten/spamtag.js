/**
 * @file spamtag.js
 * @description Spam tag một user liên tục trong một kênh Discord.
 * @author Bạn
 *
 * @warning Script này có thể vi phạm Điều khoản sử dụng của Discord nếu lạm dụng.
 * Sử dụng với trách nhiệm của bạn!
 *
 * @dependency Cần có hàm `sendMessage` và ID kênh hợp lệ.
 */

const SpamTag = (() => {
    'use strict';

    // === Cấu hình ===
    const CONFIG = {
        CHANNEL_ID: "YOUR_CHANNEL_ID_HERE", // <-- Thay bằng ID kênh bạn muốn spam
        TAG_USER_ID: "1215259229569417278",  // <-- Thay bằng ID người bạn muốn tag
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

    // === Hàm spam tag liên tục ===
    async function _spamTagLoop() {
        while (state.isRunning) {
            try {
                await state.sendMessage(CONFIG.CHANNEL_ID, { content: `<@${CONFIG.TAG_USER_ID}>` });
                state.sentCount++;
                Logger.success(`Đã gửi tag #${state.sentCount}`);
            } catch (err) {
                Logger.error("Lỗi khi gửi tag:", err.message);
                break;
            }
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
        if (!CONFIG.TAG_USER_ID || CONFIG.TAG_USER_ID === "123456789012345678") {
            Logger.error("Bạn chưa cấu hình TAG_USER_ID.");
            return;
        }
        state.isRunning = true;
        Logger.info("Bắt đầu spam tag liên tục. Để dừng, gọi SpamTag.stop()");
        _spamTagLoop();
    }

    // === Dừng spam ===
    function stop() {
        if (!state.isRunning) {
            Logger.warn("Chưa chạy hoặc đã dừng.");
            return;
        }
        state.isRunning = false;
        Logger.info(`Đã dừng. Tổng số tag đã gửi: ${state.sentCount}`);
    }

    Logger.info("Script spam tag đã sẵn sàng.");
    Logger.info("Cấu hình CHANNEL_ID và TAG_USER_ID trước khi chạy.");
    Logger.info("Chạy SpamTag.start() để bắt đầu, SpamTag.stop() để dừng.");

    return {
        start,
        stop,
        setChannelId: (id) => { CONFIG.CHANNEL_ID = id; Logger.info("Đã cập nhật CHANNEL_ID:", id); },
        setTagUserId: (id) => { CONFIG.TAG_USER_ID = id; Logger.info("Đã cập nhật TAG_USER_ID:", id); }
    };
})();