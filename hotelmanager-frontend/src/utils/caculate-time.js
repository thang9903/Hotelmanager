function calculateTime(checkInStr, checkOutStr) {
  console.log("input", checkInStr, checkOutStr);
  try {
    const checkIn = new Date(checkInStr);
    const checkOut = new Date(checkOutStr);
    // console.log("sd", checkIn, checkOut);
    if (isNaN(checkIn) || isNaN(checkOut)) {
      throw new Error("Invalid date input");
    }

    const diffMs = checkOut - checkIn;
    if (diffMs <= 0) return "Thời gian không hợp lệ";

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    let result = "";
    if (days > 0) result += `${days} ngày`;
    if (hours > 0) result += `${days > 0 ? " " : ""}${hours} giờ`;

    return result || "0 giờ";
  } catch {
    return "0 giờ";
  }
}

export { calculateTime };
