export enum TimePeriod {
  LAST_7_DAYS = '7d',
  LAST_30_DAYS = '30d',
  LAST_90_DAYS = '90d',
  LAST_YEAR = '1y',
}

export const timePeriodLabels: Record<TimePeriod, string> = {
  [TimePeriod.LAST_7_DAYS]: 'Last 7 days',
  [TimePeriod.LAST_30_DAYS]: 'Last 30 days',
  [TimePeriod.LAST_90_DAYS]: 'Last 90 days',
  [TimePeriod.LAST_YEAR]: 'Last year',
};