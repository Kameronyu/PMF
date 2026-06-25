'use strict';
// trends-parse.js — parse the Google Trends interest-over-time series from the deferred
// `/trends/api/widgetdata/multiline` XHR response body (NOT the page HTML — the series is never
// in the initial HTML; #trends-0pct-fill).
//
// Every /trends/api/* body is prefixed with the XSSI guard `)]}',\n` which must be stripped before
// JSON.parse. The series lives at obj.default.timelineData[], each point { formattedTime, value:[n] }.
// Pure: takes the raw body string (or an already-parsed object), returns [{date, value}] or null.
// Calibrated against runs/_fixture/trends/focus-timer-xhr.json (Phase 21).

function parseTrendSeriesFromXhr(bodyOrObj) {
  try {
    const obj = typeof bodyOrObj === 'string'
      ? JSON.parse(bodyOrObj.replace(/^\)\]\}',?\s*/, ''))
      : bodyOrObj;
    const td = obj && obj.default && Array.isArray(obj.default.timelineData)
      ? obj.default.timelineData
      : null;
    if (!td || td.length === 0) return null;
    // value is always coerced to a number above (0 on missing/unparseable), so no post-filter
    // is needed; an all-zero series is handled downstream by classifyTrendShape's windowMax===0 guard.
    const series = td.map(pt => ({
      date: pt.formattedTime || pt.formattedAxisTime || pt.time || '',
      value: Array.isArray(pt.value) ? (pt.value[0] ?? 0) : (Number(pt.value) || 0),
    }));
    return series.length > 0 ? series : null;
  } catch (_) {
    return null;
  }
}

module.exports = { parseTrendSeriesFromXhr };
