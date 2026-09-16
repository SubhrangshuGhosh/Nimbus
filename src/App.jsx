import { useState, useEffect } from 'react';
import Logo from './components/Logo/Logo';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import SearchBar from './components/SearchBar/SearchBar';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import AdviceLine from './components/AdviceLine/AdviceLine';
import DetailsRow from './components/DetailsRow/DetailsRow';
import HourlyStrip from './components/HourlyStrip/HourlyStrip';
import CompareView from './components/CompareView/CompareView';
import { useWeather } from './hooks/useWeather';
import { getWeatherInfo } from './utils/weatherCodes';
import { getAdviceLine } from './utils/clothingAdvice';
import { FiGitBranch } from 'react-icons/fi';
import './App.css';

// 👇 Change this to your actual GitHub repo URL
const GITHUB_REPO_URL = 'https://github.com/SubhrangshuGhosh/nimbus';

function App() {
  const [locationA, setLocationA] = useState(null);
  const [locationB, setLocationB] = useState(null);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const { weather: weatherA, isLoading: loadingA, error: errorA } = useWeather(locationA);
  const { weather: weatherB, isLoading: loadingB, error: errorB } = useWeather(locationB);

  useEffect(() => {
    const saved = localStorage.getItem('nimbus-theme');
    const theme =
      saved ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const conditionA = weatherA ? getWeatherInfo(weatherA.current.weatherCode) : null;
  const conditionB = weatherB ? getWeatherInfo(weatherB.current.weatherCode) : null;

  const adviceA = weatherA
    ? getAdviceLine({
        temperature: weatherA.current.temperature,
        temperatureApparent: weatherA.current.temperatureApparent,
        windSpeed: weatherA.current.windSpeed,
        precipitationProbability: weatherA.current.precipitationProbability,
        weatherCode: weatherA.current.weatherCode,
      })
    : '';

  const adviceB = weatherB
    ? getAdviceLine({
        temperature: weatherB.current.temperature,
        temperatureApparent: weatherB.current.temperatureApparent,
        windSpeed: weatherB.current.windSpeed,
        precipitationProbability: weatherB.current.precipitationProbability,
        weatherCode: weatherB.current.weatherCode,
      })
    : '';

  const toggleCompare = () => {
    setIsCompareMode((prev) => {
      const next = !prev;
      if (!next) setLocationB(null);
      return next;
    });
  };

  return (
    <div id="app-root" className="app-root">
      <div className="container">
        <header id="app-header" className="app-header">
          <div id="app-header-top">
            <Logo size={28} />
            <div id="app-header-actions">
              <button
                id="app-compare-toggle"
                className={`app-compare-toggle ${isCompareMode ? 'active' : ''}`}
                onClick={toggleCompare}
                aria-label="Toggle compare mode"
                type="button"
              >
                <FiGitBranch size={14} />
                <span>Compare</span>
              </button>
              <ThemeToggle />
            </div>
          </div>

          {!isCompareMode && <SearchBar onLocationSelect={setLocationA} />}
        </header>

        <main id="app-main" className="app-main">
          {!isCompareMode && (
            <>
              {!locationA && !loadingA && (
                <div id="app-empty" className="app-empty">
                  <p>Search for a city to see the weather.</p>
                </div>
              )}

              {loadingA && (
                <div id="app-loading" className="app-loading">
                  <p>Loading weather…</p>
                </div>
              )}

              {errorA && !loadingA && (
                <div id="app-error" className="app-error">
                  <p>⚠️ {errorA}</p>
                </div>
              )}

              {weatherA && !loadingA && !errorA && (
                <div id="app-weather" className="app-weather">
                  <p id="app-location-name" className="app-location-name">
                    {weatherA.location.name}
                  </p>
                  <CurrentWeather
                    temperature={weatherA.current.temperature}
                    condition={conditionA}
                    weatherCode={weatherA.current.weatherCode}
                  />
                  <AdviceLine advice={adviceA} />
                  <DetailsRow
                    feelsLike={weatherA.current.temperatureApparent}
                    humidity={weatherA.current.humidity}
                    windSpeed={weatherA.current.windSpeed}
                    rainChance={weatherA.current.precipitationProbability}
                  />
                  <HourlyStrip hourly={weatherA.hourly} />
                </div>
              )}
            </>
          )}

          {isCompareMode && (
            <CompareView
              locationA={locationA}
              locationB={locationB}
              onLocationASelect={setLocationA}
              onLocationBSelect={setLocationB}
              weatherA={weatherA}
              weatherB={weatherB}
              conditionA={conditionA}
              conditionB={conditionB}
              adviceA={adviceA}
              adviceB={adviceB}
              loadingA={loadingA}
              loadingB={loadingB}
              errorA={errorA}
              errorB={errorB}
            />
          )}
        </main>

        <footer id="app-footer" className="app-footer">
          <a
            id="app-footer-github"
            className="app-footer-github"
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub"
          >
            <svg
              id="app-footer-github-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.67.8.56A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;