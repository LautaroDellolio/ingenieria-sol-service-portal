---
name: Ingenieria Sol Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for industrial reliability and high-performance enterprise operations. The brand personality is authoritative, precise, and utilitarian, evoking the feeling of a sophisticated control center. 

The aesthetic follows a **Modern Industrial** approach—a hybrid of Corporate Modern and Functional Minimalism. It prioritizes information density and clarity over decorative flair. The UI should feel "heavy-duty" yet digitally refined, utilizing high-contrast boundaries, structural alignment, and a no-nonsense approach to visual hierarchy. It is designed for engineers and operators who require a tool that responds with predictability and handles complex data without cognitive overload.

## Colors
The color palette is rooted in functional utility. 

- **Primary (Deep Industrial Blue):** Used for structural elements, navigation sidebars, and primary headers to establish a "foundation."
- **Secondary (Action Orange):** Reserved strictly for primary call-to-actions, warnings, or active states that require immediate attention.
- **Tertiary (Operational Green):** Indicates successful status, healthy system metrics, and "go" signals.
- **Neutrals (Slate Greys):** A range of cool-toned greys used for borders, secondary text, and background layering to maintain a professional, tech-heavy atmosphere.
- **Status Accents:** Use a specialized red (#EF4444) for critical errors and a muted blue-grey for disabled states.

## Typography
The system uses **Inter** for all primary communication to ensure maximum legibility at small sizes within data grids. For technical readouts, IDs, and status labels, **JetBrains Mono** is introduced to provide a distinctive "industrial data" feel and ensure character clarity (distinguishing between '0' and 'O', for example).

Scale typography strictly. Use `body-sm` for dense data tables and `label-sm` for metadata or table headers. Headlines should be bold and concise, reflecting the direct nature of engineering documentation.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high density. 
- **Desktop:** 12-column grid with 16px gutters. Margins are fixed at 32px to frame the content professionally.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px margins.

Spacing is based on a 4px baseline shift, but primarily utilizes 8px increments. In data-heavy views (Grids/Tables), padding should be compressed to `sm` (8px) to maximize the "above the fold" information. For dashboard "widgets," use `md` (16px) internal padding.

## Elevation & Depth
This design system avoids heavy shadows, opting for **Tonal Layers** and **Low-Contrast Outlines** to define hierarchy. 

- **Surface Level 0:** Light grey background (#F8FAFC) for the application canvas.
- **Surface Level 1:** Pure white cards/widgets for the primary content area, outlined with a 1px solid border (#E2E8F0).
- **Surface Level 2:** Sidebar navigation and toolbars use the Primary Deep Blue (#0F172A) to create a clear structural anchor.
- **Depth:** Use a very subtle, tight shadow (Y: 2px, Blur: 4px, 5% Opacity) only for floating elements like dropdowns or modals to separate them from the grid.

## Shapes
In line with the industrial theme, shapes are kept **Soft (0.25rem)**. This provides a modern touch without appearing overly "consumer" or "playful." 
- **Buttons & Inputs:** Use the base 4px (0.25rem) radius.
- **Cards & Large Containers:** Use 8px (0.5rem) to slightly soften the structure.
- **Data Tags:** Should remain rectangular with minimal 2px rounding to emphasize a "stamped" or "machined" look.

## Components
- **Buttons:** Primary buttons use a solid Action Orange background with white text. Secondary buttons use a Slate Grey outline. States (Hover/Active) should be represented by a 10% darken/lighten of the base color—never a change in shape.
- **Data Grids:** The centerpiece of the system. Use zebra-striping (alternating row colors) with very light grey. Headers must be "pinned" and use `label-sm` in all caps for a technical feel.
- **Modular Widgets:** Standardized containers for charts and KPIs. Every widget must have a consistent header with a 1px bottom border and an icon slot on the left.
- **Input Fields:** Use a 1px Slate Grey border that thickens to 2px Primary Blue on focus. Labels must always be visible (never use floating labels that disappear).
- **Status Chips:** Small, condensed labels with a subtle background tint and high-contrast text (e.g., Green tint with dark green text for "Active").
- **Lists:** High-density lists with subtle dividers. Every item should have a clear "leading" element (icon or ID) and a "trailing" action element.