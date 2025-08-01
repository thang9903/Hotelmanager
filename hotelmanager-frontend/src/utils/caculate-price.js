function calculatePrice({ checkInStr, checkOutStr, type, price }) {
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  const diffMs = checkOut - checkIn;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  console.log("---", checkInStr, checkOutStr, type, price);

  let total = 0;

  if (type === "Ngày") {
    const checkInHour = checkIn.getHours();
    const checkOutHour = checkOut.getHours();

    const fullNights = Math.floor(diffDays) || 1;
    total += fullNights * price;
    console.log("day*price", total);
    // Check-in sớm
    if (checkInHour >= 5 && checkInHour < 9) {
      total += price * 0.5;
    } else if (checkInHour >= 9 && checkInHour < 14) {
      total += price * 0.3;
    }

    console.log("checkin early", total);

    if (checkOutHour > 11 && checkOutHour <= 15) {
      total += price * 0.3;
    } else if (checkOutHour > 15 && checkOutHour <= 18) {
      total += price * 0.5;
    } else if (checkOutHour > 18) {
      total += price;
    }
    console.log("checkout last", total);
  } else if (type === "Giờ") {
    total = Math.floor(diffHours) * price;
  } else if (type === "Đêm") {
    total = price;
  }

  return total > 0 ? Math.round(total) : 0;
}

export { calculatePrice };
