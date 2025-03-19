// concat time to start and end date strings
export const addTimeZone = (startStr, endStr) => {
  if (startStr == endStr) {
    return([startStr, endStr]);
  }
  const startDT = `${startStr}T00:00:00`;
  const endDT = `${endStr}T23:59:59`;
  return([startDT, endDT]);
};

// truncate time from datetime str
export const truncateDateTime = (dateTimeStr) => {
  try {
    return dateTimeStr.split("T")[0];
  } catch (err) {
    console.error(err);
    return dateTimeStr;
  }
};

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday (0) or Saturday (6)
};

export const filterWeekdays = (startStr, endStr) => {
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);
  const weekdays = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    if (!isWeekend(d)) {
      weekdays.push(new Date(d));
    }
  }

  if (weekdays.length === 0) {
    return null;
  }

  const newStart = weekdays[0].toISOString().split('T')[0];
  const newEnd = weekdays[weekdays.length - 1].toISOString().split('T')[0];
  return [newStart, newEnd];
};
