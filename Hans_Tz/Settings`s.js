const config = require('../config');
const { cmd } = require('../command');

// Enhanced boolean env settings with categories
const booleanEnvSettings = {
  'Call Settings': {
    ANTI_CALL: [
      { val: "true", desc: "Activate call rejection" },
      { val: "false", desc: "Deactivate call rejection" }
    ],
    ANTI_CALL_BLOCK: [
      { val: "true", desc: "Block callers when rejected" },
      { val: "false", desc: "Don't block callers" }
    ]
  },
  'Bot Behavior': {
    PUBLIC_MODE: [
      { val: "true", desc: "Bot responds to everyone" },
      { val: "false", desc: "Bot responds only to contacts" }
    ],
    ALWAYS_ONLINE: [
      { val: "true", desc: "Show bot as always online" },
      { val: "false", desc: "Show real connection status" }
    ],
    READ_MESSAGE: [
      { val: "true", desc: "Mark messages as read" },
      { val: "false", desc: "Don't mark messages as read" }
    ],
    READ_CMD: [
      { val: "true", desc: "Mark commands as read" },
      { val: "false", desc: "Don't mark commands as read" }
    ]
  },
  'Auto Features': {
    AUTO_REPLY: [
      { val: "true", desc: "Enable auto-replies" },
      { val: "false", desc: "Disable auto-replies" }
    ],
    AUTO_REACT: [
      { val: "true", desc: "Enable auto-reactions" },
      { val: "false", desc: "Disable auto-reactions" }
    ],
    CUSTOM_REACT: [
      { val: "true", desc: "Use custom reactions" },
      { val: "false", desc: "Use default reactions" }
    ],
    AUTO_STICKER: [
      { val: "true", desc: "Enable auto-sticker" },
      { val: "false", desc: "Disable auto-sticker" }
    ],
    AUTO_TYPING: [
      { val: "true", desc: "Show typing indicator" },
      { val: "false", desc: "Don't show typing" }
    ],
    AUTO_RECORDING: [
      { val: "true", desc: "Show recording indicator" },
      { val: "false", desc: "Don't show recording" }
    ]
  },
  'Status Settings': {
    AUTO_STATUS_SEEN: [
      { val: "true", desc: "Mark status as seen" },
      { val: "false", desc: "Don't mark status" }
    ],
    AUTO_STATUS_REPLY: [
      { val: "true", desc: "Reply to status updates" },
      { val: "false", desc: "Don't reply to status" }
    ],
    AUTO_STATUS_REACT: [
      { val: "true", desc: "React to status updates" },
      { val: "false", desc: "Don't react to status" }
    ]
  },
  'Security Settings': {
    ANTI_LINK: [
      { val: "true", desc: "Block links in messages" },
      { val: "false", desc: "Allow links in messages" }
    ],
    ANTI_BAD: [
      { val: "true", desc: "Block bad words" },
      { val: "false", desc: "Allow bad words" }
    ],
    ANTI_VV: [
      { val: "true", desc: "Block virus files" },
      { val: "false", desc: "Allow all files" }
    ],
    DELETE_LINKS: [
      { val: "true", desc: "Delete links from messages" },
      { val: "false", desc: "Keep links in messages" }
    ]
  }
};

// Enhanced string env settings with descriptions
const stringEnvSettings = {
  'Basic Configuration': {
    BOT_NAME: "Name of your bot",
    PREFIX: "Command prefix (e.g., '.')",
    OWNER_NAME: "Your name as owner",
    OWNER_NUMBER: "Your phone number (with country code)"
  },
  'Customization': {
    MODE: "Bot mode (work, private, public, etc.)",
    CUSTOM_REACT_EMOJIS: "Custom emojis for reactions (comma separated)",
    AUTO_STATUS_MSG: "Auto-reply message for status updates",
    LIVE_MSG: "Message shown in .alive command",
    STICKER_NAME: "Default sticker pack name"
  },
  'Media Settings': {
    ALIVE_IMG: "URL for .alive command image",
    MENU_IMAGE_URL: "URL for menu command image"
  },
  'Advanced': {
    ANTI_DEL_PATH: "Path for anti-delete feature",
    DEV: "Developer mode settings"
  }
};

// Generate flat lists for processing
const allBooleanSettings = {};
const allSettingsKeys = [];
const categories = {};

// Process boolean settings
Object.entries(booleanEnvSettings).forEach(([category, settings]) => {
  categories[category] = { type: 'boolean', settings: Object.keys(settings) };
  Object.entries(settings).forEach(([key, options]) => {
    allBooleanSettings[key] = options;
    allSettingsKeys.push(key);
  });
});

// Process string settings
Object.entries(stringEnvSettings).forEach(([category, settings]) => {
  categories[category] = { type: 'string', settings: Object.keys(settings) };
  Object.keys(settings).forEach(key => {
    allSettingsKeys.push(key);
  });
});

// Track pending changes
const pendingChanges = {};

// Helper function to generate settings list
function generateSettingsList() {
  let msg = "*⚙️ VORTEX-XMD CONFIGURATION MENU* 📜\n\n";
  let settingNumber = 1;
  const settingMap = {};
  
  // Add boolean settings
  Object.entries(booleanEnvSettings).forEach(([category, settings]) => {
    msg += `*━━━ ${category} ━━━*\n`;
    
    Object.entries(settings).forEach(([key, options]) => {
      settingMap[settingNumber] = { key, type: 'boolean' };
      const currentVal = config[key] || "false";
      
      msg += `*${settingNumber}. ${key}* (Current: ${currentVal})\n`;
      options.forEach((opt, idx) => {
        const isActive = currentVal === opt.val ? " ✅" : "";
        msg += `   ${settingNumber}.${idx + 1} ${opt.val.padEnd(6)} - ${opt.desc}${isActive}\n`;
      });
      msg += "\n";
      settingNumber++;
    });
  });
  
  // Add string settings
  Object.entries(stringEnvSettings).forEach(([category, settings]) => {
    msg += `*━━━ ${category} ━━━*\n`;
    
    Object.entries(settings).forEach(([key, desc]) => {
      settingMap[settingNumber] = { key, type: 'string' };
      const currentVal = config[key] || "Not set";
      
      msg += `*${settingNumber}. ${key}*\n`;
      msg += `   📝 ${desc}\n`;
      msg += `   Current: \`${currentVal}\`\n`;
      msg += `   To change: \`.change ${key}\`\n\n`;
      settingNumber++;
    });
  });
  
  msg += "📌 *How to change settings:*\n";
  msg += "- For toggle options: Reply with `<number>.<option>` (e.g. `1.1`)\n";
  msg += "- For text options: Use `.change <NAME>` then send new value\n";
  msg += "- Changes are temporary (reset after bot restart)\n";
  
  return { msg, settingMap };
}

// Main env command
cmd({
  pattern: "settings",
  alias: ["config1", "settings2", "configuration2"],
  desc: "Configure bot settings (Owner only)",
  category: "system",
  react: "⚙️",
  filename: __filename,
}, async (conn, mek, m, { from, reply, isCreator, args }) => {
  if (!isCreator) return reply("🚫 *Owner Only Command!*");

  // Handle pending string changes
  if (pendingChanges[from]) {
    const { key, desc } = pendingChanges[from];
    const newVal = m.text.trim();
    
    if (!newVal) return reply("❌ No value provided!");
    
    config[key] = newVal;
    delete pendingChanges[from];
    
    return reply(`✅ *${key}* updated successfully!\n` +
                `📝 *Description:* ${desc}\n` +
                `🔄 *New Value:* \`${newVal}\`\n` +
                "⚠️ *Note:* This change is temporary and will reset after bot restart.");
  }

  // Show full settings list if no args
  if (args.length === 0) {
    const { msg } = generateSettingsList();
    return reply(msg);
  }

  // Handle boolean changes (format: "1.2")
  if (args[0].includes('.')) {
    const [settingNum, optionNum] = args[0].split('.').map(Number);
    const { settingMap } = generateSettingsList();
    const settingInfo = settingMap[settingNum];
    
    if (!settingInfo) return reply(`❌ Invalid setting number! Use \`.env\` to see valid numbers.`);
    if (settingInfo.type !== 'boolean') return reply(`❌ ${settingInfo.key} is not a toggle setting!`);
    
    const key = settingInfo.key;
    const options = allBooleanSettings[key];
    
    if (!optionNum || optionNum < 1 || optionNum > options.length) {
      return reply(`❌ Invalid option! For ${key}, choose between 1-${options.length}.`);
    }
    
    const newVal = options[optionNum - 1].val;
    config[key] = newVal;
    
    return reply(`✅ *${key}* set to \`${newVal}\`\n` +
                `📝 *Description:* ${options[optionNum - 1].desc}\n` +
                "⚠️ *Note:* This change is temporary and will reset after bot restart.");
  }

  reply("❌ Invalid command format.\n" +
       "Use `.settings` to view all settings\n" +
       "Use `.settings <number>.<option>` to change toggle settings\n" +
       "Use `.change <SETTING>` to modify text settings");
});

// Change command for string settings
cmd({
  pattern: "change",
  desc: "Modify text configuration settings (Owner only)",
  category: "system",
  react: "🛠️",
  filename: __filename,
}, async (conn, mek, m, { from, reply, isCreator, args }) => {
  if (!isCreator) return reply("🚫 *Owner Only Command!*");

  if (args.length === 0) {
    let msg = "📝 *Available Text Settings:*\n\n";
    Object.entries(stringEnvSettings).forEach(([category, settings]) => {
      msg += `*${category}:*\n`;
      Object.entries(settings).forEach(([key, desc]) => {
        msg += `- ${key}: ${desc}\n`;
      });
      msg += "\n";
    });
    msg += "Usage: `.change <SETTING_NAME>` then reply with new value";
    return reply(msg);
  }

  const key = args[0].toUpperCase();
  let foundDesc = null;

  // Find the key in string settings
  for (const [category, settings] of Object.entries(stringEnvSettings)) {
    if (settings[key]) {
      foundDesc = settings[key];
      break;
    }
  }

  if (!foundDesc) return reply(`❌ "${key}" is not a valid text setting!\nUse \`.change\` to see available options.`);

  pendingChanges[from] = { key, desc: foundDesc };
  const currentVal = config[key] || "Not set";
  
  return reply(`✏️ *Setting Change Requested:*\n` +
              `🔧 *Setting:* ${key}\n` +
              `📝 *Description:* ${foundDesc}\n` +
              `💬 *Current Value:* \`${currentVal}\`\n\n` +
              "Please reply with the new value for this setting...");
});

// Add reset command to clear pending changes
cmd({
  pattern: "clearchange",
  alias: ["cancelchange"],
  desc: "Cancel pending configuration changes",
  category: "system",
  react: "🗑️",
  filename: __filename,
}, async (conn, mek, m, { from, reply, isCreator }) => {
  if (!isCreator) return reply("🚫 *Owner Only Command!*");
  
  if (pendingChanges[from]) {
    const { key } = pendingChanges[from];
    delete pendingChanges[from];
    reply(`✅ Pending change for *${key}* has been canceled.`);
  } else {
    reply("ℹ️ No pending changes to cancel.");
  }
});