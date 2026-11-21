function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const number = (value) => new Intl.NumberFormat("ar-EG").format(value);

  return `${number(days)} يوم • ${number(hours)} ساعة • ${number(minutes)} دقيقة • ${number(remainingSeconds)} ثانية`;
}

const os = require("node:os");

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits }).format(value);
}

function formatGigabytes(bytes) {
  return formatNumber(bytes / 1024 ** 3, 2);
}

async function measurePing(api, threadID) {
  if (typeof api.getThreadInfo !== "function") return null;

  const startedAt = Date.now();
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(value);
    };
    const timeout = setTimeout(() => finish(null), 5000);

    try {
      api.getThreadInfo(threadID, (error) => {
        finish(error ? null : Date.now() - startedAt);
      });
    } catch {
      finish(null);
    }
  });
}

module.exports = {
  name: "حالة",

  async execute(api, event) {
    const threadID = String(event.threadID);
    const accountID =
      typeof api.getCurrentUserID === "function"
        ? String(api.getCurrentUserID() || "غير متاح")
        : "غير متاح";
    const ping = await measurePing(api, threadID);
    const requestedAt = new Intl.DateTimeFormat("ar-EG", {
      timeZone: "Africa/Cairo",
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());
    const uptime = formatDuration(process.uptime());
    const memory = process.memoryUsage();
    const ramUsedGb = formatGigabytes(memory.rss);
    const ramTotalGb = formatGigabytes(os.totalmem());
    const pingValue = ping === null ? "غير متاح" : `${formatNumber(ping)}ms`;

    const message = [
      "▂▃▄▅▆▇█▓▒░ ᚜𝐅̶ؗ𝐋̲҇͟𝐀͐𝐒𝐇 ⟢ᚘ⟢ 𝐋̶ؗ𝐎̲҇͟𝐑͐𝐃 𝐆𝐀̶𝐋̶ؗ𝐀̸𐇽⃜𝐗𝐘̅ ⃞⃟ ᚛ ⧺ ░▒▓█▇▆▅▄▃▂",
      "╏ [⚡] 𝑩𝒐𝒕 𝑺𝒕𝒂𝒕𝒖𝒔 : 🟢 𝑨𝑪𝑻𝑰𝑽𝑬 ╏",
      "╏ [🔌] 𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒊𝒐𝒏 : 🟢 𝑶𝑵𝑳𝑰𝑵𝑬 ╏",
      `╏ [⏱️] 𝑼𝒑𝒕𝒊𝒎𝒆 : ${uptime} ╏`,
      "╏ [📡] 𝑺𝒆𝒓𝒗𝒊𝒄𝒆 : 𝑭𝒂𝒄𝒆𝒃𝒐𝒐𝒌 𝑴𝒆𝒔𝒔𝒆𝒏𝒈𝒆𝒓 ╏",
      `╏ [🕒] 𝑹𝒆𝒒𝒖𝒆𝒔𝒕 𝑻𝒊𝒎𝒆 : ${requestedAt} ╏`,
      "╏  [🪯] 𝑮𝒂𝒏𝒈 : 𝑵𝒂𝒙𝒖𝒔 🪯 ╏",
      "╏ [👑] 𝑶𝒘𝒏𝒆𝒓 : 𝗙𝗟𝗔𝗦𝗛 𝗕𝗢𝗧 ╏",
      `╏ [🆔] 𝑨𝒄𝒄𝒐𝒖𝒏𝒕 𝑰𝑫 : ${accountID} ╏`,
      `╏ [📶] 𝑷𝒊𝒏𝒈 : ${pingValue} ╏`,
      `╏ [🧠] 𝑹𝑨𝑴 𝑼𝒔𝒆𝒅 : ${ramUsedGb} GB ╏`,
      `╏ [💾] 𝑺𝒚𝒔𝒕𝒆𝒎 𝑹𝑨𝑴 : ${ramTotalGb} GB ╏`,
      "▰▱▰▱▰▱▰▱▰▱▰▱▰▱",
      "༺⚡ ᚜𝐅̶ؗ𝐋̲҇͟𝐀͐𝐒𝐇 ⟢ᚘ⟢ 𝐋𝐎𝐑𝐃 𝐆𝐀𝐋𝐀𝐗𝐘 ༻",
      "ᨏᨐᨓ 𝑪𝑶𝑺𝑴𝑰𝑪 𝑭𝑳𝑨𝑺𝑯 ᨓᨐᨏ",
      "༺═━━━ 𝑩𝒚 : 𝒁𝒆𝒅𝒉𝒆𝒍𝒍𝒌𝒊𝒏𝒈 ━━━═༻",
    ].join("\n");

    await api.sendMessage(message, threadID);
  },
};