function sendLog(level: string, message: string) {
  fetch("/api/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ level, message }),
  }).catch(() => {});
}

export const logger = {
  info: (msg: string) => {
    console.log("[INFO]", msg);
    sendLog("INFO", msg);
  },
  debug: (msg: string) => {
    console.debug("[DEBUG]", msg);
    sendLog("DEBUG", msg);
  },
  error: (msg: string) => {
    console.error("[ERROR]", msg);
    sendLog("ERROR", msg);
  },
};
