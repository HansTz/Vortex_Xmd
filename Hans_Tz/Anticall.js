const { cmd } = require('../command');
const config = require("../config");

let called = false;
const callWarnings = {}; // Track warning count per user

cmd({ on: "body" }, async (conn, m, msg, { from }) => {
  try {
    if (!called) {
      conn.ev.on('call', async (calls) => {

        if (config.ANTI_CALL !== "true" && config.ANTI_CALL_BLOCK !== "true") return; // Anti-Call OFF

        for (const call of calls) {
          if (call.status !== "offer") continue;

          // Reject the call
          await conn.rejectCall(call.id, call.from);

          // Increment warning count per user
          if (!callWarnings[call.from]) callWarnings[call.from] = 1;
          else callWarnings[call.from] += 1;

          const warnings = callWarnings[call.from];
          let warningMessage = "";

          // If ANTI_CALL_BLOCK is true → Warn 5 times then block
          if (config.ANTI_CALL_BLOCK === "true") {

            if (warnings === 1) {
              warningMessage = "*⚠️ Warning 1/5:* Don't Cally owner is busy.";
            } else if (warnings === 2) {
              warningMessage = "*⚠️ Warning 2/5:* Repeated calls will lead to a block.";
            } else if (warnings === 3) {
              warningMessage = "*🚫 Warning 3/5:* Stop calling. You risk being blocked.";
            } else if (warnings === 4) {
              warningMessage = "*🚫 Warning 4/5:* Final warning! Next call = block.";
            } else if (warnings >= 5) {
              warningMessage = "*⛔ You have been blocked for ignoring warnings ⚠️.*";
              await conn.sendMessage(call.from, {
                text: warningMessage,
                mentions: [call.from]
              });
              await conn.updateBlockStatus(call.from, "block");
              continue;
            }

            // Send the warning message
            await conn.sendMessage(call.from, {
              text: warningMessage,
              mentions: [call.from]
            });
            continue;
          }

          // If ANTI_CALL is true → Warn unlimited, no block
          if (config.ANTI_CALL === "true") {
            await conn.sendMessage(call.from, {
              text: "*📵 Call rejected automatically. Please don't call my owner Drop you massage Text only.*",
              mentions: [call.from]
            });
          }

        }
      });
      called = true;
    }
  } catch (err) {
    console.error(err);
    m.reply(err.toString());
  }
});