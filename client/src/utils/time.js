export const formatSeconds = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((u) => String(u).padStart(2, "0"))
    .join(":");
};

export const formatTime = (time) => (time < 10 ? `0${time}` : time);
