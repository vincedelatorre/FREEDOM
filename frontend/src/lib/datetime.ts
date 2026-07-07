/**
 * Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
 * SPDX-License-Identifier: Apache-2.0
 */

/** いろいろな関数で共通して受け取る日付型 */
export type DateInput = string | Date | null | undefined;

/** 日本のタイムゾーン */
const TZ_JAPAN = 'Asia/Tokyo';

/* ============================================================================
 * 基本ユーティリティ
 * ==========================================================================*/

/** ISO正規化 */
export function normalizeIso(iso: string | null | undefined): string {
  let s = String(iso ?? '').trim();
  if (!s) return '';

  // 空白を "T" に
  s = s.replace(' ', 'T');
  // +0900 -> +09:00 / -0900 -> -09:00
  s = s.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  // ミリ秒を3桁に丸める（.123456 -> .123）
  s = s.replace(/(\.\d{3})\d+/, '$1');

  return s;
}

/**
 * Dateオブジェクト作成
 * - value: string | Date | null | undefined
 * - パース失敗時は null
 */
export function toDate(value: DateInput): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  const iso = normalizeIso(value);
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * 日付文字列生成フォーマッタ（汎用）
 * - value は Date / ISO文字列 / null を受け付ける
 * - パースできない場合は空文字列を返す
 */
export function formatDateTime(
  value: DateInput,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = toDate(value);
  if (!date) return '';
  const fmt = new Intl.DateTimeFormat(locale, options);
  return fmt.format(date);
}

/* ============================================================================
 * 日本向け：よく使うフォーマット（西暦）
 * ==========================================================================*/

/** "YYYY/MM/DD"（日本・JST固定） */
export function formatJaYmd(value: DateInput): string {
  return formatDateTime(value, 'ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TZ_JAPAN,
  });
}

/** "YYYY年MM月DD日"（日本・JST固定） */
export function formatJaYmdKanji(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  return `${get('year')}年${get('month')}月${get('day')}日`;
}

/** "YYYY/MM/DD HH:mm"（日本・JST固定） */
export function formatJaYmdHm(value: DateInput): string {
  return formatDateTime(value, 'ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ_JAPAN,
  });
}

/** "YYYY/MM/DD HH:mm:ss"（日本・JST固定） */
export function formatJaYmdHms(value: DateInput): string {
  return formatDateTime(value, 'ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: TZ_JAPAN,
  });
}

/** "MM月DD日 HH時mm分SS秒"（日本・JST固定） */
export function formatJaKanjiMdHms(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  return (
    `${get('month')}月${get('day')}日 ` +
    `${get('hour')}時${get('minute')}分${get('second')}秒`
  );
}

/** "YYYY年MM月DD日 HH時mm分SS秒"（日本・JST固定） */
export function formatJaKanjiYmdHms(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  return (
    `${get('year')}年${get('month')}月${get('day')}日 ` +
    `${get('hour')}時${get('minute')}分${get('second')}秒`
  );
}

/** "YYYY年MM月DD日 HH時mm分SS.mmm秒"（ミリ秒付き、JST固定） */
export function formatJstDateTime(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const ms = String(date.getMilliseconds()).padStart(3, '0');

  return (
    `${get('year')}年${get('month')}月${get('day')}日 ` +
    `${get('hour')}時${get('minute')}分${get('second')}.${ms}秒`
  );
}

/* ============================================================================
 * 日本向け：元号（和暦）フォーマット
 * ==========================================================================*/

/** "令和06年02月10日" のような和暦表記（JST固定） */
export function formatJaEraYmd(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const era = get('era');        // 例: "令和"
  const year = get('year');      // 例: "6"
  const yearPadded = year.padStart(2, '0');
  const month = get('month');
  const day = get('day');

  return `${era}${yearPadded}年${month}月${day}日`;
}

/** "R06/02/10" のような略式和暦表記（JST固定） */
export function formatJaEraShortYmd(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const era = get('era');        // 例: "R"
  const year = get('year');      // 例: "6"
  const yearPadded = year.padStart(2, '0');
  const month = get('month');
  const day = get('day');

  return `${era}${yearPadded}/${month}/${day}`;
}

/** "令和06年02月10日 12時34分" のような和暦＋時刻（分まで、JST固定） */
export function formatJaEraYmdHm(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';

  const fmt = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    era: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ_JAPAN,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const era = get('era');
  const year = get('year').padStart(2, '0');
  const month = get('month');
  const day = get('day');
  const hour = get('hour');
  const minute = get('minute');

  return `${era}${year}年${month}月${day}日 ${hour}時${minute}分`;
}

/* ============================================================================
 * ISO 風
 * ==========================================================================*/

/** "YYYY-MM-DD"（ゼロ埋め／タイムゾーンはそのまま） */
export function formatIsoDate(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD HH:mm:ss"（24時間表記） */
export function formatIsoDateTime(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

/** "YYYY-MM-DDTHH:mm:ss.sssZ" 形式（UTCベース） */
export function formatIsoUtc(value: DateInput): string {
  const date = toDate(value);
  if (!date) return '';
  return date.toISOString();
}

/* ============================================================================
 * 国際フォーマット
 * ==========================================================================*/

/** US式 "MM/DD/YYYY" */
export function formatUsDate(value: DateInput): string {
  return formatDateTime(value, 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/** US式 "MM/DD/YYYY HH:mm"（24時間表記） */
export function formatUsDateTime24(value: DateInput): string {
  return formatDateTime(value, 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** US式 "MM/DD/YYYY hh:mm AM/PM"（12時間表記） */
export function formatUsDateTime12(value: DateInput): string {
  return formatDateTime(value, 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/** UK式 "DD/MM/YYYY" */
export function formatUkDate(value: DateInput): string {
  return formatDateTime(value, 'en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/** UK式 "DD/MM/YYYY HH:mm"（24時間表記） */
export function formatUkDateTime(value: DateInput): string {
  return formatDateTime(value, 'en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** 英語 "Feb 10, 2026" のような形式 */
export function formatEnLongDate(value: DateInput): string {
  return formatDateTime(value, 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/** 英語 "Feb 10, 2026, 12:34" のような形式（24時間表記） */
export function formatEnLongDateTime(value: DateInput): string {
  return formatDateTime(value, 'en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/* ============================================================================
 * 汎用フォーマット指定用：サポートされるフォーマット一覧
 * ==========================================================================*/
export const SUPPORTED_DATE_FORMATS = [
  // 日本向け（西暦）
  'YYYY/MM/DD',
  'YYYY-MM-DD',
  'YYYY年MM月DD日',
  'YYYY年M月D日',
  'YYYY年M月D日(曜)',
  'M/D',
  'M/D(曜)',
  'YYYY/MM/DD HH:mm',
  'YYYY/MM/DD HH:mm:ss',
  'MM/DD HH:mm:ss',
  'HH:mm',
  'HH:mm:ss',
  // ISO 風
  'YYYY-MM-DD HH:mm:ss',
  // 英語圏
  'MM/DD/YYYY',     // US
  'DD/MM/YYYY',     // UK
] as const;

export type SupportedDateFormat = typeof SUPPORTED_DATE_FORMATS[number];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export type FormatByPatternOptions = {
  /** 曜日の言語 */
  weekdayLocale?: 'ja' | 'en';
};

/**
 * SupportedDateFormat で指定されたパターンに従って日付文字列を生成する。
 */
export function formatByPattern(
  value: DateInput,
  pattern: SupportedDateFormat,
  options?: FormatByPatternOptions,
): string {
  const date = toDate(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const weekdayIndex = date.getDay();
  const jaWeekdays = ['日', '月', '火', '水', '木', '金', '土'] as const;
  const enWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

  const isJapanesePattern = /[年月日曜]/.test(pattern);
  const weekdayLocale: 'ja' | 'en' =
    options?.weekdayLocale ?? (isJapanesePattern ? 'ja' : 'en');

  const weekday = weekdayLocale === 'ja'
    ? jaWeekdays[weekdayIndex]
    : enWeekdays[weekdayIndex];

  let out: string = pattern;

  out = out.replace('YYYY', String(year));
  out = out.replace('MM', pad2(month));
  out = out.replace('DD', pad2(day));
  out = out.replace('HH', pad2(hour));
  out = out.replace('mm', pad2(minute));
  out = out.replace('ss', pad2(second));
  out = out.replace('M', String(month));
  out = out.replace('D', String(day));

  // 日本語の "(曜)" を置換
  if (out.includes('(曜)')) {
    out = out.replace(
      '(曜)',
      weekdayLocale === 'ja' ? `${weekday}曜` : weekday,
    );
  }

  return out;
}
