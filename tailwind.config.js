/**
 * Sistema "Precisión Industrial" — rediseño sobre los tokens originalmente
 * extraídos de Desing/stitch_ingenieria_sol_service_portal. Se mantienen los
 * mismos NOMBRES de token (para que los ~70 archivos que ya los consumen se
 * repinten solos) y se reemplazan los VALORES. Ver el plan de diseño para el
 * detalle de cada familia de color.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f2f2ef',
        surface: '#f2f2ef',
        'surface-bright': '#f2f2ef',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#e9e9e4',
        'surface-container': '#e1e1db',
        'surface-container-high': '#d6d6cf',
        'surface-container-highest': '#cbcbc3',
        'surface-variant': '#cbcbc3',
        'surface-dim': '#c2c2ba',
        'surface-tint': '#63665f',
        'on-surface': '#12181a',
        'on-background': '#12181a',
        'on-surface-variant': '#5c6360',
        outline: '#797d77',
        'outline-variant': '#d8dad5',

        // Grafito/carbón — el "bisel" oscuro (sidebar, chips de avatar).
        primary: '#0d0f0e',
        'on-primary': '#ffffff',
        'primary-container': '#1c1f1d',
        'on-primary-container': '#9a9d99',
        'primary-fixed': '#e4e5e1',
        'primary-fixed-dim': '#c7c9c3',
        'on-primary-fixed': '#1c1f1d',
        'on-primary-fixed-variant': '#45473f',

        // Verde pino — la marca (placeholder hasta recibir el logo real:
        // ajustar sólo estos 8 hex, ningún componente referencia el valor).
        secondary: '#1f4a3d',
        'on-secondary': '#ffffff',
        'secondary-container': '#2c6b57',
        'on-secondary-container': '#eaf3ef',
        'secondary-fixed': '#dcece5',
        'secondary-fixed-dim': '#c3ddd3',
        'on-secondary-fixed': '#14332a',
        'on-secondary-fixed-variant': '#1f4a3d',

        // Verde éxito — hermano del pino, ya no un verde-menta desconectado.
        tertiary: '#000000',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#002113',
        'on-tertiary-container': '#009668',
        'tertiary-fixed': '#6ffbbe',
        'tertiary-fixed-dim': '#4f8f6f',
        'on-tertiary-fixed': '#002113',
        'on-tertiary-fixed-variant': '#1f4a3d',

        // Ocre — "atención" (nuevo: antes reutilizaba `secondary`, lo que
        // ahora chocaría con el verde de marca).
        warning: '#8a5a12',
        'on-warning': '#ffffff',
        'warning-container': '#f3e4c9',
        'on-warning-container': '#5c3b0a',

        // Rojo ladrillo apagado — error/falla.
        error: '#9c2f2b',
        'on-error': '#ffffff',
        'error-container': '#f6dad8',
        'on-error-container': '#6b1512',

        'inverse-surface': '#2a2d29',
        'inverse-on-surface': '#f2f2ef',
        'inverse-primary': '#c7c9c3',
      },
      // Ojo: estos nombres (xs/sm/md/lg/xl) tambien son usados internamente
      // por la escala de max-w-*, y en Tailwind v4 spacing tiene prioridad
      // sobre ese valor por defecto. Por eso max-w-sm/md/lg/xl NO deben
      // usarse en este proyecto: usar max-w-[Nrem] (valor arbitrario) en su lugar.
      spacing: {
        base: '0.4rem',
        xs: '0.4rem',
        sm: '0.8rem',
        md: '1.6rem',
        lg: '2.4rem',
        xl: '3.2rem',
        gutter: '1.6rem',
        'margin-mobile': '1.6rem',
        'margin-desktop': '3.2rem',
      },
      borderRadius: {
        DEFAULT: '0.4rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        // Sombra ajustada y de poco desenfoque — como una sombra proyectada
        // por luz direccional, no el "glow" difuso típico de SaaS. Tintada
        // con `ink` (on-surface) en vez de negro puro.
        'elevation-1': '0 1px 2px 0 rgb(13 15 14 / 0.06), 0 1px 1px 0 rgb(13 15 14 / 0.04)',
        'elevation-2': '0 4px 8px -2px rgb(13 15 14 / 0.10), 0 2px 4px -2px rgb(13 15 14 / 0.06)',
      },
      fontFamily: {
        'display-lg': ['"Big Shoulders"', 'sans-serif'],
        'headline-lg': ['"Big Shoulders"', 'sans-serif'],
        'headline-lg-mobile': ['"Big Shoulders"', 'sans-serif'],
        'headline-md': ['"Big Shoulders"', 'sans-serif'],
        'body-lg': ['"Public Sans"', 'sans-serif'],
        'body-md': ['"Public Sans"', 'sans-serif'],
        'body-sm': ['"Public Sans"', 'sans-serif'],
        'label-md': ['"JetBrains Mono"', 'monospace'],
        'label-sm': ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['4.8rem', { lineHeight: '5.2rem', letterSpacing: '-0.01em', fontWeight: '800' }],
        'headline-lg': ['3.2rem', { lineHeight: '3.6rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg-mobile': ['2.4rem', { lineHeight: '2.8rem', fontWeight: '700' }],
        'headline-md': ['2.4rem', { lineHeight: '2.8rem', fontWeight: '700' }],
        'body-lg': ['1.8rem', { lineHeight: '2.8rem', fontWeight: '400' }],
        'body-md': ['1.6rem', { lineHeight: '2.4rem', fontWeight: '400' }],
        'body-sm': ['1.4rem', { lineHeight: '2.0rem', fontWeight: '400' }],
        'label-md': ['1.4rem', { lineHeight: '1.6rem', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['1.2rem', { lineHeight: '1.6rem', letterSpacing: '0.05em', fontWeight: '500' }],
      },
    },
  },
}
