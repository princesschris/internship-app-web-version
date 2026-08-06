const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function formatMonthYear(dateString) {
  const date = new Date(dateString);
  return `${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatDateRange(startDate, endDate) {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : 'Present';
  return `${start} – ${end}`;
}

export function formatDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth());
  if (end.getUTCDate() < start.getUTCDate()) months -= 1;
  months = Math.max(months, 0);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remainingMonths > 0 || years === 0) parts.push(`${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`);

  return parts.join(' ');
}