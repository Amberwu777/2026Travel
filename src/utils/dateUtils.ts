import { ITINERARY_DAYS } from '../data/itineraryData';

/**
 * Calculates the current itinerary day number based on the current date.
 * Prioritizes European/Vienna time (as the trip takes place in Austria & Czech Republic),
 * then falls back to device local time.
 */
export function getTodayDayNumber(): number {
  const now = new Date();

  // 1. Check Europe/Vienna date (UTC+2)
  try {
    const viennaParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Vienna',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).formatToParts(now);

    const month = viennaParts.find((p) => p.type === 'month')?.value;
    const day = viennaParts.find((p) => p.type === 'day')?.value;
    if (month && day) {
      const viennaDateStr = `${month}/${day}`;
      const match = ITINERARY_DAYS.find((d) => d.date === viennaDateStr);
      if (match) {
        return match.dayNumber;
      }
    }
  } catch {
    // Ignore timezone resolution error and proceed to local time
  }

  // 2. Check local device date
  const localMonth = String(now.getMonth() + 1).padStart(2, '0');
  const localDay = String(now.getDate()).padStart(2, '0');
  const localDateStr = `${localMonth}/${localDay}`;

  const localMatch = ITINERARY_DAYS.find((d) => d.date === localDateStr);
  if (localMatch) {
    return localMatch.dayNumber;
  }

  // 3. If date is outside the 09/19 - 09/30 trip window:
  // If after the trip, default to the last day (Day 12)
  // If before or default, start with Day 1
  const endOfTrip = new Date(2026, 8, 30, 23, 59, 59);
  if (now > endOfTrip) {
    return 12;
  }

  return 1;
}

/**
 * Checks if a given day number corresponds to today's date
 */
export function isTodayDay(dayNumber: number): boolean {
  return dayNumber === getTodayDayNumber();
}
