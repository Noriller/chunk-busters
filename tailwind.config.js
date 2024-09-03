const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "green-pulse": {
          "0%": {
            boxShadow: "0 0 1em .3em rgba(0, 255, 0, 0.3), 0 0 2em .7em rgba(0, 255, 0, 0.2), 0 0 3em 1em rgba(0, 255, 0, 0.1)",
          },
          "100%": {
            boxShadow: "box-shadow: 0 0 4em .7em rgba(0, 255, 0, 0.3), 0 0 7em 2em rgba(0, 255, 0, 0.2), 0 0 10em 4em rgba(0, 255, 0, 0.1)",
          },
        },
        "red-pulse": {
          "0%": {
            boxShadow: "0 0 1em .3em rgba(255, 0, 0, 0.3), 0 0 2em .7em rgba(255, 0, 0, 0.2), 0 0 3em 1em rgba(255, 0, 0, 0.1)",
          },
          "100%": {
            boxShadow: "0 0 4em .7em rgba(255, 0, 0, 0.3), 0 0 7em 2em rgba(255, 0, 0, 0.2), 0 0 10em 4em rgba(255, 0, 0, 0.1)",
          },
        },
        flicker: {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.97,
          },
          "100%": {
            opacity: 1,
          },
        },
        shadow: {
          "0%": {
            backgroundPosition: "0 0",
          },
          "50%": {
            backgroundPosition: "200% 0",
          },
          "100%": {
            backgroundPosition: "0 0",
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "green-pulse": "flicker 0.1s infinite, green-pulse ease-in-out 1s infinite alternate",
        "red-pulse": "flicker 0.1s infinite, red-pulse ease-in-out 1s infinite alternate-reverse",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addVariant }) {
      // @ts-ignore
      addVariant('em', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.em\\:${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            decl.value = decl.value.replace('rem', 'em');
          });
        });
      });
    }),
    plugin(function ({ addComponents, config }) {
      addComponents({
        '.led-green': {
          background: 'radial-gradient(circle at 50% 50%, #00ff00, #006600)',
        },
        '.led-red': {
          background: 'radial-gradient(circle at 50% 50%, #ff0000, #660000)',
        },
        '.led-light': {
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          position: 'relative',
          border: 'red',
          zIndex: '1',
          transition: 'all 0.3s ease',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            borderRadius: '50%',
            opacity: '0.8',
            transition: 'all 0.3s ease',
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '30%',
            height: '30%',
            borderRadius: '50%',
            background: `radial-gradient(
              circle at 50% 50%,
              rgba(255, 255, 255, 0.8),
              rgba(255, 255, 255, 0.2)
            )`,
            filter: 'blur(2px)',
            transition: 'all 0.3s ease',
          },
        },
        /** https://codepen.io/fronthendrik/pen/RYOVzP */
        '.rainbow-shadow': {
          background: 'linear-gradient(0deg, #000, #262626)',
          '&::before,&::after': {
            content: "''",
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            width: 'calc(100% + 4px)',
            height: 'calc(100% + 4px)',
            background: `linear-gradient(
              45deg,
              #fb0094,
              #0000ff,
              #00ff00,
              #ffff00,
              #ff0000,
              #fb0094,
              #0000ff,
              #00ff00,
              #ffff00,
              #ff0000
            )`,
            backgroundSize: '400%',
            zIndex: '-1',
            borderRadius: 'var(--radius)',
            animation: 'shadow 20s linear infinite',
          },
          '&::after': {
            top: '-8px',
            left: '-8px',
            width: 'calc(100% + 16px)',
            height: 'calc(100% + 16px)',
            filter: 'blur(24px)',
            opacity: '0.9',
          },
        }
      });
    }),
  ],
};