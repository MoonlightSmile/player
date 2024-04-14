export function findMatchingItem(currentTime: number, data: any[]) {
  const _currentTime = currentTime * 1000;
  const index = data.findIndex(
    (item) =>
      _currentTime >= item.offsets.from && _currentTime <= item.offsets.to
  );
  return index === -1 ? 0 : index;
}

export function secondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600); // 计算小时数
  const minutes = Math.floor((seconds % 3600) / 60); // 计算分钟数
  const secs = Math.floor(seconds % 60); // 计算秒数

  // 将小时、分钟和秒数转换为两位数格式
  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(secs).padStart(2, "0");

  // 如果小时为0，则不显示小时
  return hours === 0
    ? `${paddedMinutes}:${paddedSeconds}`
    : `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

// 示例使用
const timeInSeconds = 1456.901125;
const formattedTime = secondsToHMS(timeInSeconds);
console.log(formattedTime); // 输出 "24:16"
