function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const number = (value) => new Intl.NumberFormat("ar-EG").format(value);

  return `${number(days)} يوم • ${number(hours)} ساعة • ${number(minutes)} دقيقة • ${number(remainingSeconds)} ثانية`;
}

function formatNumber(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("ar-EG", { maximumFractionDigits }).format(value);
}

function getCpuUsagePercent() {
  const usage = process.cpuUsage();
  const cpuTimeSeconds = (usage.user + usage.system) / 1_000_000;
  const uptimeSeconds = Math.max(process.uptime(), 1);
  return (cpuTimeSeconds / uptimeSeconds) * 100;
}

module.exports = {
  name: "حالة",

  async execute(api, event) {
    const threadID = String(event.threadID);
    const requestedAt = new Intl.DateTimeFormat("ar-EG", {
      timeZone: "Africa/Cairo",
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());
    const uptime = formatDuration(process.uptime());
    const memory = process.memoryUsage();
    const ramUsage = formatNumber(memory.rss / 1048576);
    const cpuUsage = formatNumber(getCpuUsagePercent(), 2);

    const message = [
      "━━━━━━━━━━━( 🔴 )━━━━━━━━━━━",
      "᚜𝐅̶ؗ𝐋̲҇͟𝐀͐𝐒𝐇 ⟢ᚘ⟢ 𝐋̶ؗ𝐎̲҇͟𝐑͐𝐃 𝐆𝐀̶𝐋̶ؗ𝐀̸𐇽⃜𝐗𝐘̅ ⃞⃟ ᚛ ⧺",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "🔴 𝗕𝗢𝗧 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦",
      "╭━━━━━━━━━━━━━━━━━━━━╮",
      "🔴 ┊ حالة الاتصال: 🟢 متصل بنجاح",
      "🔴 ┊ حالة البوت: نشط ويعمل الآن",
      "🔴 ┊ حالة الأمر: تم استلام الأمر بنجاح",
      `⏱️ ┊ مدة التشغيل: ${uptime}`,
      `🧠 ┊ استهلاك الرام: ${ramUsage} MB`,
      `🖥️ ┊ استهلاك المعالج: ${cpuUsage}%`,
      "📡 ┊ الخدمة: Facebook Messenger",
      `🕒 ┊ وقت الاستعلام: ${requestedAt}`,
      "╰━━━━━━━━━━━━━━━━━━━━╯",
      "━━━━━━━ 🔴 𝗙𝗟𝗔𝗦𝗛 𝗕𝗢𝗧 🔴 ━━━━━━━",
    ].join("\n");

    await api.sendMessage(message, threadID);
  },
};