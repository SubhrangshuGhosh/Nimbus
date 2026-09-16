// ============================================================
// weatherCodes.js — Map Tomorrow.io codes to labels + icon keys
// ============================================================

export const WEATHER_CODES = {
  1000: { label: 'Clear', icon: 'clear' },
  1001: { label: 'Cloudy', icon: 'cloudy' },
  1100: { label: 'Mostly Clear', icon: 'mostly-clear' },
  1101: { label: 'Partly Cloudy', icon: 'partly-cloudy' },
  1102: { label: 'Mostly Cloudy', icon: 'mostly-cloudy' },
  2000: { label: 'Fog', icon: 'fog' },
  2100: { label: 'Light Fog', icon: 'light-fog' },
  4000: { label: 'Drizzle', icon: 'drizzle' },
  4001: { label: 'Rain', icon: 'rain' },
  4200: { label: 'Light Rain', icon: 'light-rain' },
  4201: { label: 'Heavy Rain', icon: 'heavy-rain' },
  5000: { label: 'Snow', icon: 'snow' },
  5001: { label: 'Flurries', icon: 'flurries' },
  5100: { label: 'Light Snow', icon: 'light-snow' },
  5101: { label: 'Heavy Snow', icon: 'heavy-snow' },
  6000: { label: 'Freezing Drizzle', icon: 'freezing-drizzle' },
  6001: { label: 'Freezing Rain', icon: 'freezing-rain' },
  6200: { label: 'Light Freezing Rain', icon: 'light-freezing-rain' },
  6201: { label: 'Heavy Freezing Rain', icon: 'heavy-freezing-rain' },
  7000: { label: 'Ice Pellets', icon: 'ice-pellets' },
  7101: { label: 'Heavy Ice Pellets', icon: 'heavy-ice-pellets' },
  7102: { label: 'Light Ice Pellets', icon: 'light-ice-pellets' },
  8000: { label: 'Thunderstorm', icon: 'thunderstorm' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', icon: 'clear' };
}