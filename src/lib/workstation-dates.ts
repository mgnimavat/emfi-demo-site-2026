const sampleTradeDay = 15;
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const nextWeekday = (date: Date) => {
  const result = new Date(date);
  while (result.getUTCDay() === 0 || result.getUTCDay() === 6) {
    result.setUTCDate(result.getUTCDate() + 1);
  }
  return result;
};

export const previousMonthTransactionDates = (currentMonth: string) => {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(currentMonth);
  if (!match) return { tradeDate: '', settlementDate: '' };

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const trade = nextWeekday(new Date(Date.UTC(year, month - 1, sampleTradeDay)));
  const followingDay = new Date(trade);
  followingDay.setUTCDate(followingDay.getUTCDate() + 1);
  const settlement = nextWeekday(followingDay);

  return {
    tradeDate: dateFormat.format(trade),
    settlementDate: dateFormat.format(settlement),
  };
};
