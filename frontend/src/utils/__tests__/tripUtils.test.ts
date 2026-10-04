import { describe, it, expect } from 'vitest';
import { getTripStatus, formatDateRange, getTripCoverImage, parseLocalDate } from '../tripUtils';

describe('tripUtils', () => {
  describe('parseLocalDate', () => {
    it('correctly parses YYYY-MM-DD format into local date', () => {
      const date = parseLocalDate('2024-11-15');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(10); // 0-indexed November
      expect(date.getDate()).toBe(15);
    });
  });

  describe('getTripStatus', () => {
    it('returns UPCOMING for future trip', () => {
      const futureStart = '2099-01-01';
      const futureEnd = '2099-01-10';
      expect(getTripStatus(futureStart, futureEnd)).toBe('UPCOMING');
    });

    it('returns COMPLETED for past trip', () => {
      const pastStart = '2020-01-01';
      const pastEnd = '2020-01-10';
      expect(getTripStatus(pastStart, pastEnd)).toBe('COMPLETED');
    });

    it('returns IN_PROGRESS when today falls within range', () => {
      const today = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 2);
      const yesterdayStr = `${yesterday.getFullYear()}-${pad(yesterday.getMonth() + 1)}-${pad(yesterday.getDate())}`;

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 2);
      const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

      expect(getTripStatus(yesterdayStr, tomorrowStr)).toBe('IN_PROGRESS');
      expect(getTripStatus(todayStr, todayStr)).toBe('IN_PROGRESS');
    });
  });

  describe('formatDateRange', () => {
    it('formats date range in same year correctly', () => {
      expect(formatDateRange('2024-11-15', '2024-11-28')).toBe('15 Nov - 28 Nov, 2024');
    });

    it('formats single day trip in same year correctly', () => {
      expect(formatDateRange('2024-11-15', '2024-11-15')).toBe('15 Nov, 2024');
    });

    it('formats cross-year date range correctly', () => {
      expect(formatDateRange('2024-12-28', '2025-01-05')).toBe('28 Dic, 2024 - 5 Ene, 2025');
    });

    it('handles invalid dates gracefully', () => {
      expect(formatDateRange('invalid', 'dates')).toBe('invalid - dates');
    });
  });

  describe('getTripCoverImage', () => {
    it('returns beach image for beach keywords', () => {
      const img = getTripCoverImage('Vacaciones en la playa', 1);
      expect(img).toContain('photo-1507525428034-b723cf961d3e');
    });

    it('returns mountain image for mountain/patagonia keywords', () => {
      const img = getTripCoverImage('Trekking en Bariloche y Patagonia', 2);
      expect(img).toContain('photo-1464822759023-fed622ff2c3b');
    });

    it('returns default curated image for arbitrary titles based on id', () => {
      const img1 = getTripCoverImage('Random trip', 0);
      const img2 = getTripCoverImage('Random trip', 1);
      expect(typeof img1).toBe('string');
      expect(typeof img2).toBe('string');
      expect(img1).not.toBe('');
    });
  });
});
