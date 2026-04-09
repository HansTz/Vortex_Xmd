const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: ".ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, quoted, sender, reply }) => {

    try {
        const start = new Date().getTime();

        // Stylish emoji collections
        const reactionEmojis = ['⚡', '🚀', '💨', '🎯', '🔥', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🌠', '🌀', '🔱', '🛡️', '✨', '🚀', '🎶'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure different emojis
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Fake Quoted System
        const fakeQuoted = {
            key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
            message: {
                contactMessage: {
                    displayName: "𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃;;;\nFN:𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`,
                },
            },
        };

        // Send emoji reaction
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        // Stylish response text
        const pingText = `
💻 *VORTEX-XMD PING REPORT* 💻

⚡ Response Time: *${responseTime.toFixed(2)}ms* ${reactionEmoji}

🚀 Bot Status: *Online*
🔧 Server: *Active*
📡 Connection: *Stable*
`;

        await conn.sendMessage(from, {
            text: pingText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363352087070233@newsletter',
                    newsletterName: "HansTech",
                    serverMessageId: 143
                }
            }
        }, { quoted: fakeQuoted });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});