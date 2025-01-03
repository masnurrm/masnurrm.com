import { useTheme } from 'next-themes';

export default function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <input
      aria-label="themeToggler"
      type="checkbox"
      onChange={() => setTheme(isLight ? 'dark' : 'light')}
      checked={isLight}
      className="toggle"
    />
  );
}
