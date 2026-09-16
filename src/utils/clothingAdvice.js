// ============================================================
// clothingAdvice.js — Human-friendly one-line advice
// ============================================================

export function getAdviceLine({
  temperature,
  temperatureApparent,
  windSpeed,
  precipitationProbability,
  weatherCode,
  isNight = false,
}) {
  const temp = temperature ?? 20;
  const feels = temperatureApparent ?? temp;
  const rain = precipitationProbability ?? 0;
  const wind = windSpeed ?? 0;

  if (rain > 60) return 'Bring an umbrella — rain is very likely.';
  if (rain > 30) return 'Keep an umbrella handy — showers possible.';

  if ([5000, 5001, 5100, 5101, 6000, 6001].includes(weatherCode)) {
    return 'Bundle up — it is cold and snowy out.';
  }

  if (wind >= 30) return 'Very windy — hold onto your hat.';
  if (wind >= 20 && feels < 20) return 'Windy and cool — a windbreaker would help.';

  if (feels >= 38) return 'Extremely hot — stay hydrated and seek shade.';
  if (feels >= 32) return 'Hot and humid — light clothes and water.';
  if (feels >= 26) return 'Warm — a t-shirt and shorts kind of day.';

  if (feels >= 20) {
    return isNight
      ? 'Mild evening — a light layer is enough.'
      : 'Mild and pleasant — a light jacket kind of day.';
  }
  if (feels >= 14) return 'Cool — a light jacket will keep you comfortable.';
  if (feels >= 6) return 'Chilly — grab a warm jacket before heading out.';
  return 'Freezing — heavy coat, gloves, and a scarf.';
}

export function isNightTime(date = new Date()) {
  const hour = date.getHours();
  return hour < 6 || hour >= 19;
}