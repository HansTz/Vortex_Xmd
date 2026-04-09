const config = require('../config');
const { cmd } = require('../command');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Show all bot configuration status (Owner Only)",
    category: "system",
    react: "🎛️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("🚫 *Owner Only Command!*");

        let envSettings = `
━━━━『 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 CONFIG 』━━━❏
│
━━━━❏ *🤖 BOT INFO*
│ |━━ *Name:* ${config.BOT_NAME}
│ |━━ *Prefix:* ${config.PREFIX}
│ |━━ *Owner:* ${config.OWNER_NAME}
│ |━━ *Number:* ${config.OWNER_NUMBER}
│ ━━ *Mode:* ${config.MODE.toUpperCase()}
│
━━━━❏ *⚙️ CORE SETTINGS*
│ |━━ *Public Mode:* ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
│ |━━ *Always Online:* ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
│ |━━ *Read Msgs:* ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
│ ━━ *Read Cmds:* ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
│
━━━━❏ *🔌 AUTOMATION*
│ |━━ *Auto Reply:* ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
│ |━━ *Auto React:* ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
│ |━━ *Custom React:* ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
│ |━━ *React Emojis:* ${config.CUSTOM_REACT_EMOJIS}
│ |━━ *Auto Sticker:* ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
│
━━━━❏ *📢 STATUS SETTINGS*
│ |━━ *Status Seen:* ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
│ |━━ *Status Reply:* ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}
│ |━━ *Status React:* ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
│ ━━ *Status Msg:* ${config.AUTO_STATUS_MSG}
│
━━━━❏ *🛡️ SECURITY*
│ |━━ *Anti Call:* ${isEnabled(config.ANTI_CALL) ? "✅" : "❌"}
│ |━━ *Call Block Warns:* ${isEnabled(config.ANTI_CALL_BLOCK) ? "✅" : "❌"}
│ |━━ *Anti-Link:* ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
│ |━━ *Kick on Link:* ${isEnabled(config.ANTI_LINK_KICK) ? "✅" : "❌"}
│ |━━ *Anti-Bad:* ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
│ |━━ *Anti-VV:* ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}
│ ━━ *Delete Links:* ${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"}
│
━━━━❏ *🎨 MEDIA*
│ |━━ *Alive Img:* ${config.ALIVE_IMG}
│ |━━ *Menu Img:* ${config.MENU_IMAGE_URL}
│ |━━ *Alive Msg:* ${config.LIVE_MSG}
│ ━━ *Sticker Pack:* ${config.STICKER_NAME}
│
━━━━❏ *⏳ MISC*
│ |━━ *Auto Typing:* ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
│ |━━ *Auto Recording:* ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
│ |━━ *Anti-Del Path:* ${config.ANTI_DEL_PATH}
│ ━━ *Dev Number:* ${config.DEV}
│
━━━━『 𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 CONFIG 』━━━❏
`;

        await conn.sendMessage(
            from,
            { image: { url: config.MENU_IMAGE_URL }, caption: envSettings },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply("❌ Error showing config status.");
    }
});