export type TripStatus = 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';

export const MONTH_NAMES_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

/**
 * Parses a date string (YYYY-MM-DD or ISO) into a local Date object.
 */
export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);
  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }
  return new Date(dateStr);
}

/**
 * Determines whether a trip is UPCOMING, IN_PROGRESS, or COMPLETED.
 */
export function getTripStatus(fechaInicio: string, fechaFin: string): TripStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseLocalDate(fechaInicio);
  start.setHours(0, 0, 0, 0);

  const end = parseLocalDate(fechaFin);
  end.setHours(23, 59, 59, 999);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'UPCOMING';
  }

  if (today.getTime() > end.getTime()) {
    return 'COMPLETED';
  }
  if (today.getTime() >= start.getTime() && today.getTime() <= end.getTime()) {
    return 'IN_PROGRESS';
  }
  return 'UPCOMING';
}

/**
 * Formats a start and end date range into a readable string (e.g. '15 Nov - 28 Nov, 2024').
 */
export function formatDateRange(fechaInicio: string, fechaFin: string): string {
  const start = parseLocalDate(fechaInicio);
  const end = parseLocalDate(fechaFin);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return `${fechaInicio} - ${fechaFin}`;
  }

  const startDay = start.getDate();
  const startMonth = MONTH_NAMES_ES[start.getMonth()];
  const startYear = start.getFullYear();

  const endDay = end.getDate();
  const endMonth = MONTH_NAMES_ES[end.getMonth()];
  const endYear = end.getFullYear();

  if (startYear === endYear) {
    if (startMonth === endMonth && startDay === endDay) {
      return `${startDay} ${startMonth}, ${startYear}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`;
  }

  return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
}

const CURATED_TRIP_IMAGES: string[] = [
  // European city / Paris
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
  // Tropical beach / Coast
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  // Alpine mountains / Patagonia
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  // Italy / Mediterranean Amalfi
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
  // Japan / Kyoto / Torii
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
  // Scenic Lake / Forest
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  // Desert sunset
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  // Urban skyline / Modern
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
];

/**
 * Returns a high quality travel cover image URL for a given trip based on keywords and ID.
 */
export function getTripCoverImage(title: string, id: number): string {
  const normalized = (title || '').toLowerCase();

  if (/(playa|beach|mar|costa|isla|caribe|cancun|tropical|bahia)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[1];
  }
  if (/(montaña|mountain|alpes|andes|patagonia|glaciar|trekking|hike|bariloche|nieve)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[2];
  }
  if (/(italia|roma|rome|amalfi|florencia|venecia|mediterraneo)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[3];
  }
  if (/(japon|japan|tokyo|kyoto|asia|china|corea)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[4];
  }
  if (/(lago|lake|bosque|forest|naturaleza|camping|parque)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[5];
  }
  if (/(desierto|desert|sunset|atardecer|oasis)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[6];
  }
  if (/(ny|new york|skyline|ciudad|london|madrid|berlin|tokio)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[7];
  }
  if (/(paris|francia|europa|europe|viaje)/i.test(normalized)) {
    return CURATED_TRIP_IMAGES[0];
  }

  const index = Math.abs(id || 0) % CURATED_TRIP_IMAGES.length;
  return CURATED_TRIP_IMAGES[index];
}
