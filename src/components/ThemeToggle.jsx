import { FiMoon, FiSun } from 'react-icons/fi';
import useTheme from '../hooks/useTheme';

/** Two-position switch: the knob sits under the active icon. */
function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
      className={`group relative inline-grid h-10 w-[4.5rem] shrink-0 grid-cols-2 items-center rounded-full border border-rule-strong bg-paper-raised p-1
        transition-colors duration-200 hover:border-ink/40 ${className}`}
    >
      <span
        aria-hidden="true"
        data-theme-motion
        className={`absolute left-1 top-1 h-8 w-8 rounded-full bg-ink shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isDark ? 'translate-x-8' : 'translate-x-0'
        }`}
      />
      <span
        aria-hidden="true"
        className={`relative z-10 flex items-center justify-center transition-colors duration-300 ${isDark ? 'text-ink-muted' : 'text-paper'}`}
      >
        <FiSun size={16} />
      </span>
      <span
        aria-hidden="true"
        className={`relative z-10 flex items-center justify-center transition-colors duration-300 ${isDark ? 'text-paper' : 'text-ink-muted'}`}
      >
        <FiMoon size={15} />
      </span>
    </button>
  );
}

export default ThemeToggle;
