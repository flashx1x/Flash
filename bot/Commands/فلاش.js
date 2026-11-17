"use strict";

const path = require("path");
const { createZedAssistant } = require("../zed-assistant");

const COMMAND_PATTERN = /^فلاش\s+(تشغيل|ايقاف|إيقاف)$/u;

function flashWelcomeText(names) {
  return [
    "━━━━━━━ ✦ 𝐅𝐋𝐀𝐒𝐇 ✦ ━━━━━━━",
    "✨ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 𝑭𝑳𝑨𝑺𝑯 𝑮𝒓𝒐𝒖𝒑 ✨",
    `🖤 You light up this place, ${names.join(", ")} — welcome aboard!`,
    "━━━━━━━━━━━━━━━━━━━━━",
  ].join("\n");
}

function createFlashCommand(options = {}) {
  const assistant =
    options.assistant ||
    createZedAssistant({
      statePath: path.join(__dirname, "..", "data", "flash-state.json"),
      welcomeText: flashWelcomeText,
      ...options,
    });

  return {
    name: "فلاش",

    async execute(api, event, isAdmin) {
      const body = String(event.body || "").trim();
      const match = COMMAND_PATTERN.exec(body);
      if (!match) return false;

      const threadID = String(event.threadID || "");
      if (!threadID) return false;

      const senderID = String(event.senderID || "");
      if (typeof isAdmin !== "function" || !isAdmin(senderID)) {
        await api.sendMessage("⚠️ أمر فلاش متاح للأدمن فقط.", threadID);
        return true;
      }

      if (event.isGroup === false) {
        await api.sendMessage(
          "⚠️ أوامر فلاش تعمل داخل المجموعات فقط.",
          threadID,
        );
        return true;
      }

      const enabled = match[1] === "تشغيل";
      const changed = assistant.setEnabled(threadID, enabled);
      const message = enabled
        ? changed
          ? "✅ تم تشغيل فلاش في هذه المجموعة. سيُرحّب بالأعضاء الجدد ويرد عند منشنه."
          : "ℹ️ فلاش يعمل بالفعل في هذه المجموعة."
        : changed
          ? "⏹️ تم إيقاف فلاش في هذه المجموعة؛ لن يرد على المنشن أو يرسل ترحيبًا."
          : "ℹ️ فلاش متوقف بالفعل في هذه المجموعة.";
      await api.sendMessage(message, threadID);
      return true;
    },

    handleMessage(api, event) {
      return assistant.handleMessage(api, event);
    },

    handleJoinEvent(api, event) {
      return assistant.handleJoinEvent(api, event);
    },

    isEnabled(threadID) {
      return assistant.isEnabled(threadID);
    },
  };
}

const command = createFlashCommand();
module.exports = { ...command, createFlashCommand };
