export const calcMinuteToTime = (minutes: any) => {
  if (!minutes) {
    return "00:00";
  }

  const hour = Math.floor(minutes / 60);
  const residualMinutes = minutes - hour * 60;

  const hourDisplay = `0${hour}`.slice(-2);
  const minutesDisplay = `0${minutes}`.slice(-2);

  // `0${date.getDate()}`.slice(-2);

  if (residualMinutes != 0) {
    return `${hourDisplay}:${minutesDisplay}`;
  } else {
    return `${hour}:00`;
  }
};

export const getDay = (time: string) => {
  const [day, month] = time.split("-");
  return day;
};

export const getMonth = (time: string) => {
  const [day, month] = time.split("-");
  return month;
};
