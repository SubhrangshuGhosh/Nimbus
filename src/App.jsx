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
import { FaGithub } from 'react-icons/fa';
import './App.css';

// 👇 Change this to your actual email address
const CONTACT_EMAIL = 'ghoshayab@gmail.com';

// Pre-filled email content
const REQUEST_SUBJECT = 'Requesting code access for Weather-App (Nimbus)';
const REQUEST_BODY = `Hi Subhrangshu,

I came across your Nimbus weather app and would love to see the source code.

Could you please grant me access to the repository?

Thanks,
`;

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

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    CONTACT_EMAIL
  )}&su=${encodeURIComponent(REQUEST_SUBJECT)}&body=${encodeURIComponent(REQUEST_BODY)}`;

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
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Request code access via email"
            title="Request code access"
          >
            <FaGithub
              id="app-footer-github-icon"
              size={22}
              aria-hidden="true"
            />
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;