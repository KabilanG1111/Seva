/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    void: 'var(--bg-void)',
                    deep: 'var(--bg-deep)',
                    surface: 'var(--bg-surface)',
                    elevated: 'var(--bg-elevated)',
                },
                praan: {
                    primary: 'var(--praan-primary)',
                    glow: 'var(--praan-glow)',
                    border: 'var(--praan-border)',
                },
                kisan: {
                    primary: 'var(--kisan-primary)',
                    glow: 'var(--kisan-glow)',
                    border: 'var(--kisan-border)',
                },
                nyay: {
                    primary: 'var(--nyay-primary)',
                    glow: 'var(--nyay-glow)',
                    border: 'var(--nyay-border)',
                },
                sun: {
                    primary: 'var(--sun-primary)',
                    dim: 'var(--sun-dim)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                    ghost: 'var(--text-ghost)',
                },
                border: {
                    DEFAULT: 'var(--border-default)',
                    soft: 'var(--border-soft)',
                    medium: 'var(--border-medium)',
                }
            },
            fontFamily: {
                mono: ['"Space Mono"', 'monospace'],
                sans: ['"Inter"', 'sans-serif'],
            },
            borderRadius: {
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '20px',
                full: '9999px',
            },
            borderWidth: {
                DEFAULT: '0.5px',
                '1': '1px',
            },
            spacing: {
                '1': '4px',
                '2': '8px',
                '3': '12px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '8': '32px',
                '10': '40px',
                '12': '48px',
                '16': '64px',
            }
        },
    },
    plugins: [],
}
