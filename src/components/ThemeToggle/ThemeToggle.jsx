import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import './ThemeToggle.css';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('nimbus-theme');
    if (saved) return saved;
    // Respect system preference on first visit
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nimbus-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      id="themetoggle-button"
      className="themetoggle-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {theme === 'dark' ? (
        <FiSun id="themetoggle-icon-sun" size={18} />
      ) : (
        <FiMoon id="themetoggle-icon-moon" size={18} />
      )}
    </button>
  );
}

export default ThemeToggle;