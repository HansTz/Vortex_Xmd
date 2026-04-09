const { cmd } = require('../command');

cmd({
    pattern: "alive",
    alias: ["up", "status"],
    use: ".alive",
    desc: "Check if the bot is alive.",
    category: "main",
    react: "🟢",
    filename: __filename
}, async (conn, mek, m, { from, reply, sender }) => {
    try {
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

        const aliveMessage = `
🟢 *𝐕𝐎𝐑𝐓𝐄𝐗-𝐗𝐌𝐃 STATUS* 🟢

🤖 Bot is *Online* and *Active*.
⚡ Ready to assist you anytime.
📡 Connection: *Stable*

Thanks for using the bot! 🚀
`;

        await conn.sendMessage(from, { text: aliveMessage }, { quoted: fakeQuoted });

    } catch (error) {
        console.error("Error in alive command:", error);
        reply("An error occurred while checking the bot status.");
    }
});