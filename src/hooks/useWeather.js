import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TOMORROW_API_KEY;

export function useWeather(location) {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || location.lat == null || location.lon == null) return;

    const controller = new AbortController();

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url =
          `https://api.tomorrow.io/v4/weather/forecast` +
          `?location=${location.lat},${location.lon}` +
          `&apikey=${API_KEY}` +
          `&units=metric` +
          `&timesteps=1h,1d`;

        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();

        const current =
          data.timelines?.minutely?.[0]?.values ||
          data.timelines?.hourly?.[0]?.values ||
          {};

        const hourly = (data.timelines?.hourly || []).slice(0, 12);
        const daily = (data.timelines?.daily || []).slice(0, 7);

        setWeather({
          current,
          hourly,
          daily,
          location: {
            ...location,
            name: data.location?.name || location.name,
          },
        });
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Weather fetch failed:', err);
        setError(err.message || 'Failed to load weather');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchWeather();

    return () => controller.abort();
  }, [location]);

  return { weather, isLoading, error };
}