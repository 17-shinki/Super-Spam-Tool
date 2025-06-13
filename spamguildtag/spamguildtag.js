/**
 * @file discord-guild-tag-finder.js
 * @version 1.2.5
 * @description Automates the creation and checking of Discord guilds to find ones with specific ID-based hash characteristics.
 * @author Revere Development
 *
 * @warning This script interacts with the Discord API in ways that might be considered
 * abusive if not used responsibly. Excessive use can lead to rate-limiting,
 * account suspension, or other actions by Discord. Use at your own risk and
 * be mindful of the Discord Terms of Service and API usage guidelines.
 * This script is intended for educational and research purposes.
 *
 * @dependency This script relies on a `findByProps` function being available in its
 * execution environment (e.g., Discord client console with developer tools
 * enhanced by a client mod like Vencord, BetterDiscord, etc.).
 * If `findByProps` is not found, the script will not initialize.
 */

const GuildTagFinder = (() => {
    'use strict';

    const CONFIG = {
        SCRIPT_VERSION: "1.2.5",
        ATTEMPT_INTERVAL_MS: 65 * 1000,
        DELETE_DELAY_MS: 3 * 1000,
        SERVER_NAME_PREFIX: "TagFinder Server #",
        HASH_SALT_PREFIX: "2025-02_skill_trees:",
        HASH_MODULO: 10000,
        TARGET_HASH_RANGES: [
            { min: 10, max: 19 },
            { min: 60, max: 99 },
            { min: 150, max: 199 },
            { min: 600, max: 999 },
            { min: 1500, max: 1999 },
            { min: 2250, max: 2499 },
            { min: 2750, max: 2999 },
        ],
        GUILD_TEMPLATE: {
            id: "CREATE",
            label: "Create My Own",
            channels: [],
            system_channel_id: null,
        },
        LOGGER_OPTIONS: {
            USE_TIMESTAMPS: false,
            DEBUG_MODE: false,
        }
    };

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
        debug: (...messages) => {
            if (CONFIG.LOGGER_OPTIONS.DEBUG_MODE) {
                Logger._log('DEBUG', 'purple', ...messages);
            }
        },
    };

    /**
     * Calculates a 32-bit MurmurHash3.
     * This is a common non-cryptographic hashing algorithm.
     * @param {string} key The string to hash.
     * @param {number} [seed=0] An optional seed.
     * @returns {number} The 32-bit hash, unsigned.
     */
    function murmurhash3_32_gc(key, seed = 0) {
        let currentHash = seed;
        const textEncoder = new TextEncoder();
        const keyBytes = textEncoder.encode(key);
        const numBytes = keyBytes.length;
        const numBlocks = Math.floor(numBytes / 4);
        const dataView = new DataView(keyBytes.buffer, keyBytes.byteOffset);

        for (let i = 0; i < numBlocks; i++) {
            const blockOffset = i * 4;
            let k1 = dataView.getUint32(blockOffset, true);

            k1 = Math.imul(k1, 0xcc9e2d51);
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = Math.imul(k1, 0x1b873593);

            currentHash ^= k1;
            currentHash = (currentHash << 13) | (currentHash >>> 19);
            currentHash = Math.imul(currentHash, 5) + 0xe6546b64;
            currentHash >>>= 0;
        }

        let k1 = 0;
        const tailIndex = numBlocks * 4;
        switch (numBytes & 3) {
            case 3:
                k1 ^= keyBytes[tailIndex + 2] << 16;
            // fallthrough
            case 2:
                k1 ^= keyBytes[tailIndex + 1] << 8;
            // fallthrough
            case 1:
                k1 ^= keyBytes[tailIndex];
                k1 = Math.imul(k1, 0xcc9e2d51);
                k1 = (k1 << 15) | (k1 >>> 17);
                k1 = Math.imul(k1, 0x1b873593);
                currentHash ^= k1;
        }

        currentHash ^= numBytes;
        currentHash ^= currentHash >>> 16;
        currentHash = Math.imul(currentHash, 0x85ebca6b);
        currentHash ^= currentHash >>> 13;
        currentHash = Math.imul(currentHash, 0xc2b2ae35);
        currentHash ^= currentHash >>> 16;

        return currentHash >>> 0;
    }

    let state = {
        isInitialized: false,
        isRunning: false,
        intervalId: null,
        attempts: 0,
        foundCount: 0,
        discordModules: {
            deleteGuild: null,
            createGuildFromTemplate: null,
        }
    };

    /**
     * Initializes necessary Discord modules using `findByProps`.
     * This is a critical step and relies on an external `findByProps` function.
     * @returns {boolean} True if initialization was successful, false otherwise.
     */
    function _initializeDiscordModules() {
        if (typeof findByProps !== 'function') {
            Logger.error("FATAL: `findByProps` function is not defined in the current environment.");
            Logger.warn("This script requires `findByProps` to locate Discord's internal modules.");
            Logger.warn("Ensure you are running this in an environment where it's available (e.g., Discord client console with developer tools/mods).");
            return false;
        }

        try {
            const guildManagerModule = findByProps("deleteGuild", "bulkAddMemberRoles");
            if (!guildManagerModule || typeof guildManagerModule.deleteGuild !== 'function') {
                Logger.error("Failed to find 'deleteGuild' function. Discord's internal structure might have changed.");
                return false;
            }
            state.discordModules.deleteGuild = guildManagerModule.deleteGuild;

            const templateManagerModule = findByProps("createGuildFromTemplate");
            if (!templateManagerModule || typeof templateManagerModule.createGuildFromTemplate !== 'function') {
                Logger.error("Failed to find 'createGuildFromTemplate' function. Discord's internal structure might have changed.");
                return false;
            }
            state.discordModules.createGuildFromTemplate = templateManagerModule.createGuildFromTemplate;

            Logger.success("Successfully initialized required Discord functions.");
            return true;
        } catch (err) {
            Logger.error("Fatal Error during Discord module initialization:", err.message);
            Logger.debug("Initialization error object:", err);
            return false;
        }
    }

    /**
     * Checks if the calculated hash falls within any of the defined target ranges.
     * @param {number} hash The hash to check.
     * @returns {boolean} True if the hash is in a target range, false otherwise.
     */
    function _checkHashCondition(hash) {
        return CONFIG.TARGET_HASH_RANGES.some(range => hash >= range.min && hash <= range.max);
    }

    /**
     * Schedules a guild for deletion after a specified delay.
     * @param {object} guild The guild object to delete.
     * @param {string} guild.id The ID of the guild.
     * @param {string} guild.name The name of the guild.
     */
    function _scheduleGuildDeletion(guild) {
        Logger.info(`Scheduling deletion for guild: ${guild.name} (ID: ${guild.id}) in ${CONFIG.DELETE_DELAY_MS / 1000}s.`);
        setTimeout(async () => {
            try {
                Logger.info(`Attempting to delete guild: ${guild.name} (ID: ${guild.id})...`);
                await state.discordModules.deleteGuild(guild.id);
                Logger.success(`Guild (ID: ${guild.id}) deleted successfully.`);
            } catch (deleteError) {
                Logger.error(`Failed to delete guild (ID: ${guild.id}). Error:`, deleteError.message);
                Logger.debug("Delete error details:", deleteError);
            }
        }, CONFIG.DELETE_DELAY_MS);
    }

    /**
     * Core logic for a single attempt: creates a guild, checks its hash, and handles it.
     */
    async function _createAndProcessGuild() {
        if (!state.isRunning) return;

        state.attempts++;
        const currentServerName = `${CONFIG.SERVER_NAME_PREFIX}${state.attempts}`;
        Logger.info(`Attempt #${state.attempts}: Trying to create guild "${currentServerName}"...`);

        try {
            const newGuild = await state.discordModules.createGuildFromTemplate(
                currentServerName,
                null,
                CONFIG.GUILD_TEMPLATE,
                false,
                false
            );

            if (!newGuild || !newGuild.id) {
                Logger.warn(`Attempt #${state.attempts}: Failed to create guild or API response was invalid.`, newGuild || "No response object");
                return;
            }

            Logger.info(`Attempt #${state.attempts}: Guild created: ${newGuild.name} (ID: ${newGuild.id})`);

            const hashInputString = `${CONFIG.HASH_SALT_PREFIX}${newGuild.id}`;
            const calculatedHash = murmurhash3_32_gc(hashInputString) % CONFIG.HASH_MODULO;

            Logger.debug(`Attempt #${state.attempts}: Hash input: "${hashInputString}", Calculated hash (mod ${CONFIG.HASH_MODULO}): ${calculatedHash}`);

            if (_checkHashCondition(calculatedHash)) {
                state.foundCount++;
                Logger.success(`TARGET GUILD FOUND! (Total Found: ${state.foundCount}) 🎉`);
                Logger.success(`  Guild Name: ${newGuild.name}`);
                Logger.success(`  Guild ID: ${newGuild.id}`);
                Logger.success(`  Calculated Hash: ${calculatedHash} (Target Ranges: ${JSON.stringify(CONFIG.TARGET_HASH_RANGES)})`);
                Logger.info("This guild will NOT be deleted. Script continues searching.");
            } else {
                Logger.info(`Attempt #${state.attempts}: Guild (ID: ${newGuild.id}) hash ${calculatedHash} is not in target range.`);
                _scheduleGuildDeletion(newGuild);
            }

        } catch (error) {
            Logger.error(`Attempt #${state.attempts}: An error occurred during guild creation or processing:`, error.message);
            Logger.debug("Creation/Processing error object:", error);

            const errorMessageLower = (error.message || "").toLowerCase();
            const errorBodyMessageLower = (error.body && error.body.message || "").toLowerCase();
            if (errorMessageLower.includes("rate limit") || errorBodyMessageLower.includes("rate limit") || (error.status === 429)) {
                Logger.warn("RATE LIMIT DETECTED. The script may be operating too fast.");
                Logger.warn(`Consider increasing CONFIG.ATTEMPT_INTERVAL_MS (current: ${CONFIG.ATTEMPT_INTERVAL_MS}ms).`);
                Logger.warn("Pausing for a moment before next attempt might be needed if this persists.");
            }
        }
    }

    /**
     * Starts the guild creation and checking process.
     * Will not start if already running or if essential modules are not initialized.
     */
    function start() {
        if (!state.isInitialized) {
            Logger.error("Script not initialized. Call `GuildTagFinder.initialize()` first or ensure `findByProps` is available.");
            return;
        }
        if (state.isRunning) {
            Logger.warn("Script is already running.");
            return;
        }

        state.isRunning = true;
        Logger.info(`Script Version ${CONFIG.SCRIPT_VERSION} starting...`);
        Logger.info(`Guild Creation Interval: ${CONFIG.ATTEMPT_INTERVAL_MS / 1000}s`);
        Logger.info(`Post-creation Delete Delay (for non-target guilds): ${CONFIG.DELETE_DELAY_MS / 1000}s`);
        const hashRangesString = CONFIG.TARGET_HASH_RANGES.map(r => `${r.min}-${r.max}`).join(' & ');
        Logger.info(`Searching for guilds where (hash('${CONFIG.HASH_SALT_PREFIX}' + GuildID) % ${CONFIG.HASH_MODULO}) is in ranges: [${hashRangesString}].`);
        Logger.info(`To stop the script, execute: GuildTagFinder.stop()`);
        Logger.warn("REMINDER: Use this script responsibly. Excessive API calls can lead to rate-limiting or other account actions by Discord.");

        _createAndProcessGuild();
        state.intervalId = setInterval(_createAndProcessGuild, CONFIG.ATTEMPT_INTERVAL_MS);
    }

    /**
     * Stops the guild creation and checking process.
     * Clears the interval and logs a summary.
     */
    function stop() {
        if (!state.isRunning) {
            Logger.warn("Script is not currently running or was already stopped.");
            return;
        }
        if (state.intervalId !== null) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
        state.isRunning = false;
        Logger.info("Script stopped. Guild creation interval cleared.");
        Logger.info(`Summary: Total attempts: ${state.attempts}, Target guilds found: ${state.foundCount}`);
    }

    /**
     * Initializes the script by trying to locate necessary Discord modules.
     * This should be called once before `start()`.
     * @returns {boolean} True if initialization was successful, false otherwise.
     */
    function initialize() {
        if (state.isInitialized) {
            Logger.info("Script already initialized.");
            return true;
        }
        Logger.info("Initializing GuildTagFinder...");
        if (_initializeDiscordModules()) {
            state.isInitialized = true;
            Logger.success("GuildTagFinder initialized successfully. Ready to start.");
            Logger.info("Call GuildTagFinder.start() to begin.");
            return true;
        } else {
            Logger.error("GuildTagFinder initialization failed. Please check console errors for details.");
            Logger.error("The script cannot run without successful initialization.");
            return false;
        }
    }

    Logger.info(`GuildTagFinder Script v${CONFIG.SCRIPT_VERSION} loaded.`);
    Logger.warn("This script interacts with Discord's API. Use responsibly.");
    Logger.info("Run `GuildTagFinder.initialize()` first, then `GuildTagFinder.start()` to begin.");

    // Lấy vanity URL code của server (guild) hiện tại
    const guild = window.location.pathname.split('/')[2]; // Lấy guild ID từ URL
    findByProps("getGuild").getGuild(guild).vanityURLCode

    return {
        initialize,
        start,
        stop,
        getConfig: () => JSON.parse(JSON.stringify(CONFIG)),
        setDebugMode: (enabled) => {
            CONFIG.LOGGER_OPTIONS.DEBUG_MODE = !!enabled;
            Logger.info(`Debug mode ${enabled ? 'enabled' : 'disabled'}.`);
        }
    };
})();