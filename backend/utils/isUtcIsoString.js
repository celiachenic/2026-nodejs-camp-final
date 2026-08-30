// UTC 的 ISO 8601 時間字串
// 例如 2026-08-30T12:34:56Z 或帶毫秒的 2026-08-30T12:34:56.789Z


const isUtcIsoString = (timeString) => {
  //此 regex 能擋下月份 13、小時 24、分鐘 60，但仍需額外處理二月天數、大小月與閏年。
  const regex =
    /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?Z$/;


  if (typeof timeString !== "string") {
    return false;
  }

  if (!regex.test(timeString)) {
    return false;
  }

  const year = Number(timeString.slice(0, 4));
  const month = Number(timeString.slice(5, 7));
  const day = Number(timeString.slice(8, 10));

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  //.getUTCDate() 取得 UTC 日期中的幾號 (1 ~ 31)
  return day <= daysInMonth;
};

module.exports = isUtcIsoString;
