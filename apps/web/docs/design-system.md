# DevHub Design System

> **Purpose:** This document defines the visual language for DevHub,
> based on the supplied landing-page screenshot. Use it as the default
> source of truth for all future pages and components.
>
> **Source and confidence:** Values are estimated from a screenshot, not
> extracted from source code. Colors and measurements are practical
> starting points and should be verified against the implementation.
> Where exact values cannot be known from the screenshot, they are
> marked as approximate.

## 1. Brand and visual direction

DevHub is a developer collaboration and workspace product. Its visual
style is:

-   Dark, premium, minimal, and technical.
-   Near-black surfaces with subtle purple ambient lighting.
-   Bright violet as the primary action color.
-   Purple-to-pink-to-cyan gradients for high-emphasis brand moments.
-   Restrained cyan and emerald accents for status, collaboration, and
    progress.
-   Fine low-contrast borders, modest corner radii, and soft shadows.
-   Clear hierarchy with bold, compact headings and muted supporting
    copy.
-   Spacious section layouts with centered hero content and a
    constrained content width.

Avoid switching to a light theme for now we will implement it later, introducing unrelated accent colors, using excessive gradients, or adding heavy shadows that conflict with
this visual language.

## 2. Color palette

The following values are **approximate screenshot-derived starting
tokens**. If the project already has implemented values that visually
match the reference, prefer those actual values.

### Core surfaces

  -----------------------------------------------------------------------
  Token                   Suggested value         Usage
  ----------------------- ----------------------- -----------------------
  `background`            `#08090D`               Main page background

  `surface`               `#0D0F14`               Cards, dashboard shell,
                                                  footer surfaces

  `surface-raised`        `#11131A`               Inputs, elevated cards,
                                                  dashboard statistic
                                                  panels

  `surface-hover`         `#171923`               Hovered interactive
                                                  surfaces

  `surface-purple`        `#1B1430`               Subtle purple-tinted
                                                  panels and icon
                                                  backgrounds

  `border`                `#20212B`               Card and panel outlines

  `border-strong`         `#30243F`               Emphasized
                                                  purple-tinted outlines
  -----------------------------------------------------------------------

### Text

  -----------------------------------------------------------------------
  Token                   Suggested value         Usage
  ----------------------- ----------------------- -----------------------
  `text-primary`          `#F7F7FB`               Main headings and
                                                  important labels

  `text-secondary`        `#A5A5B8`               Paragraphs and
                                                  supporting copy

  `text-muted`            `#737487`               Metadata, captions,
                                                  inactive navigation

  `text-subtle`           `#555666`               Very low-priority
                                                  decorative text; do not
                                                  use for essential
                                                  content
  -----------------------------------------------------------------------

Maintain readable contrast. Do not use the subtle text token for normal
body text, important controls, or form labels.

### Brand and semantic accents

  Token             Suggested value   Usage
  ----------------- ----------------- ----------------------------------------------
  `primary`         `#914BFF`         Main CTA, active controls, brand icon
  `primary-hover`   `#A16AFF`         Hover state for primary actions
  `primary-soft`    `#211536`         Active navigation and tinted surfaces
  `purple`          `#A78BFA`         Purple icons, progress indicators
  `pink`            `#E879F9`         Gradient highlight
  `cyan`            `#22C7F2`         Secondary accent and progress indicators
  `emerald`         `#00D6A0`         Positive status and collaboration indicators
  `success`         `#00D6A0`         Successful actions and healthy status
  `warning`         `#FBBF24`         Warnings when needed
  `error`           `#F87171`         Errors and destructive feedback

### Brand gradient

Use a gradient sparingly, mainly for highlighted headline words, brand
details, or decorative glow.

Suggested gradient:

``` css
linear-gradient(100deg, #B59AFF 0%, #E879F9 48%, #69C9FF 100%)
```

Suggested ambient page lighting:

``` css
radial-gradient(ellipse at 50% 0%, rgba(112, 40, 190, 0.20), transparent 42%)
```

The glow should remain subtle behind content. It must not reduce text
contrast or make every card look illuminated.

## 3. Typography

The screenshot uses a modern sans-serif with a compact, heavy display
style. The exact font cannot be reliably identified from the screenshot.

-   Prefer an existing configured font if it matches the reference.
-   If no suitable font exists, use **Inter** or a compatible system
    sans-serif.
-   Use heavier weights for display headings and medium/semi-bold
    weights for buttons and card headings.
-   Body text should be muted and comfortably readable.
-   Keep headings compact but avoid clipping or excessively tight line
    heights.

Suggested type scale:

  ------------------------------------------------------------------------------------
  Style                            Suggested size               Weight Usage
  --------------- ------------------------------- -------------------- ---------------
  Hero heading      `clamp(2.75rem, 6vw, 4.5rem)`             700--800 Main landing
                                                                       headline

  Page heading                     `2.25rem–3rem`                  700 Major page
                                                                       title

  Section heading               `1.875rem–2.5rem`                  700 Section titles

  Card heading                    `1rem–1.125rem`             600--700 Card title

  Body                            `0.875rem–1rem`                  400 Paragraphs and
                                                                       descriptions

  Small body                   `0.75rem–0.875rem`                  400 Supporting copy

  Eyebrow / label              `0.625rem–0.75rem`             600--700 Section labels
                                                                       and metadata

  Tiny metadata              `0.625rem–0.6875rem`             400--500 Dashboard
                                                                       metadata only
  ------------------------------------------------------------------------------------

Suggested line heights:

-   Hero heading: `1.05–1.12`.
-   Section heading: `1.1–1.2`.
-   Body: `1.55–1.75`.
-   UI labels: `1.3–1.5`.

Use letter spacing sparingly. Small uppercase eyebrow labels may use
positive tracking, around `0.12em–0.18em`.

## 4. Layout and spacing

The screenshot uses a centered content column, broad vertical gaps, and
a compact navigation bar.

Suggested conventions:

-   Main content maximum width: approximately `1160px` (`72.5rem`),
    adjusted to the viewport.
-   Hero text width: approximately `680px`.
-   Paragraph width: approximately `600px`.
-   Standard horizontal page padding: `24px` on small screens,
    increasing to `32px–48px` on large screens.
-   Section vertical spacing: approximately `88px–120px` on desktop and
    `56px–80px` on mobile.
-   Card internal padding: `16px–24px`.
-   Common component gap: `8px`, `12px`, `16px`, `24px`, and `32px`.
-   Keep related content grouped and use whitespace to separate major
    sections.
-   Avoid unnecessary full-width text blocks.

Use a consistent centered container rather than inventing different
widths for each section.

## 5. Shape, borders, and elevation

Suggested radius scale:

  Token                Value Usage
  --------------- ---------- ---------------------------------------
  `radius-sm`          `6px` Small labels and compact controls
  `radius-md`         `10px` Inputs, buttons, small panels
  `radius-lg`         `14px` Cards and dashboard panels
  `radius-xl`         `18px` Large feature panels and CTA sections
  `radius-pill`     `9999px` Badges and pill-shaped controls

Borders should be thin and low-contrast, usually `1px solid` the
appropriate border token.

Use shadows with restraint:

-   Cards: primarily defined by surface contrast and borders.
-   Primary CTA: a subtle purple glow is acceptable.
-   Hero background: use a soft radial glow rather than a heavy box
    shadow.
-   Avoid bright outlines around every component.

## 6. Buttons and interactive controls

### Primary button

-   Background: brand purple.
-   Text: white.
-   Font weight: `600`.
-   Radius: around `10px`.
-   Height: typically `40px–48px`.
-   Use balanced horizontal padding and a small optional trailing icon.
-   Hover: slightly brighter purple with a subtle transition.
-   Focus: clearly visible focus ring with sufficient contrast.
-   Disabled: reduce emphasis and prevent misleading interaction.

### Secondary button

-   Near-black or transparent surface.
-   Subtle border.
-   Primary text color.
-   Hover: slightly lighter surface.
-   Use for secondary actions such as exploring a product.

### Light CTA button

Use a white or near-white button with dark text only where the design
calls for a contrasting action, such as the hero's top-right CTA or the
final community CTA.

### Inputs and form controls

-   Dark raised surface.
-   Subtle border.
-   Light text and muted placeholder.
-   Purple focus border/ring.
-   Consistent label spacing and error placement.
-   Clear disabled, invalid, loading, and success states.
-   Use native accessible form semantics.

Do not create different button shapes and focus treatments for every
page.

## 7. Components and patterns

### Navigation

-   Compact horizontal layout on desktop.
-   Brand icon and wordmark on the left.
-   Low-emphasis navigation links centered or grouped nearby.
-   Login link and primary CTA on the right.
-   Use muted inactive links and a brighter hover state.
-   On mobile, use a compact menu or a responsive navigation layout
    without horizontal overflow.

### Hero

-   Centered content.
-   Small pill-shaped eyebrow or announcement above the title.
-   Large bold headline with a gradient on selected words only.
-   Short, muted description with a constrained line length.
-   One primary CTA and one secondary CTA.
-   Optional small trust/status line beneath the buttons.
-   Soft purple ambient glow behind the upper hero area.

### Product preview / dashboard mockup

-   Dark outer frame with a subtle border and rounded corners.
-   A compact top bar with small status indicators.
-   Sidebar separated from the main content by a fine border.
-   Dark statistic cards and project rows.
-   Small typography for metadata, but maintain readability.
-   Use purple, cyan, and emerald for selected icons and progress
    indicators.
-   Treat the preview as a product illustration; don't force this layout
    onto unrelated pages.

### Feature section

-   Left-aligned eyebrow label, heading, and description.
-   Three-column feature cards on wide screens.
-   Each card has a softly tinted icon tile, small index or metadata,
    heading, description, and a low-emphasis link.
-   Use subtle borders and dark surfaces, not bright backgrounds.
-   Collapse to one column on small screens and two columns on suitable
    tablet widths.

### Closing CTA panel

-   Large rounded panel.
-   Very subtle purple-to-dark/cyan background treatment.
-   Centered icon, heading, supporting text, and contrasting button.
-   Use a thin purple-tinted border.
-   Maintain generous internal spacing.

### Footer

-   Dark background matching the page.
-   Thin top border.
-   Compact brand area and low-emphasis supporting text.
-   Avoid unnecessary height or visual clutter.

### Dashboard and application UI

When creating internal application pages, preserve the same tokens and
component language, but prioritize usability over copying the
landing-page layout. Navigation, tables, forms, dialogs, and data-dense
views should remain readable and practical.

## 8. Icons and imagery

Preferred icon library: `lucide-react`, unless the project already uses
`react-icons` consistently.

-   Use simple outline icons.
-   Typical icon sizes: `14px–20px` for controls and `20px–24px` for
    feature tiles.
-   Keep stroke weight and alignment consistent.
-   Use purple, cyan, or emerald icon accents in restrained quantities.
-   Avoid emoji as interface icons.
-   Prefer existing project assets and purposeful product imagery.
-   Do not add random stock imagery if the reference relies on
    typography, UI previews, and subtle gradients.

## 9. Motion and states

-   Use short, subtle transitions, generally `150ms–250ms`.
-   Animate hover color, border, opacity, or small elevation changes.
-   Avoid excessive bounce, parallax, or large movement unless
    requested.
-   Respect `prefers-reduced-motion`.
-   Provide visible hover, focus, active, disabled, loading, error, and
    success states where applicable.
-   Toast notifications should use the shared `react-hot-toast`
    configuration if installed.

## 10. Responsive behavior

The screenshot is a desktop-oriented reference. Mobile behavior must be
designed intentionally rather than inferred as exact from the
screenshot.

Suggested Tailwind breakpoint conventions, if compatible with the
project:

-   Small screens: default styles below `640px`.
-   Medium screens: `sm` / `md` as needed for navigation and layout.
-   Large screens: `lg` for multi-column sections and desktop spacing.
-   Extra-large screens: `xl` for maximum-width content and wider
    layouts.

Responsive rules:

-   Reduce hero heading size and line length on small screens.
-   Stack CTA buttons when necessary.
-   Collapse three-column feature grids to one column on mobile and two
    columns on medium screens.
-   Make dashboard previews scroll safely or adapt their layout; do not
    cause page-wide horizontal overflow.
-   Keep buttons and touch targets comfortably usable.
-   Preserve readable contrast and spacing at every viewport width.
-   Test at narrow mobile, tablet, and desktop sizes.

These are recommended implementation defaults, not measured breakpoint
values from the screenshot.

## 11. Tailwind implementation guidance

Tailwind CSS is the primary styling system.

-   Inspect `package.json` and identify the installed Tailwind major
    version before changing configuration.
-   Tailwind v3 commonly uses `tailwind.config.js` or
    `tailwind.config.ts` and the `@tailwind` directives.
-   Tailwind v4 commonly uses CSS-first configuration with
    `@import "tailwindcss"` and theme variables.
-   Do not mix the configuration styles of v3 and v4.
-   Define reusable semantic tokens using the mechanism appropriate to
    the installed version.
-   Use utilities for layout and component styling, with global CSS
    reserved for resets, font setup, shared tokens, and genuinely global
    effects.
-   Remove Vite or framework starter styles only after verifying they
    are not required by existing features.
-   Do not create a competing theme in CSS modules or inline styles.

Suggested semantic token names:

-   `background`
-   `surface`
-   `surface-raised`
-   `surface-hover`
-   `foreground`
-   `muted`
-   `border`
-   `primary`
-   `primary-hover`
-   `primary-soft`
-   `accent-purple`
-   `accent-pink`
-   `accent-cyan`
-   `accent-emerald`
-   `success`
-   `warning`
-   `error`

The exact mapping depends on the project's Tailwind version and existing
setup.

## 12. Preferred frontend libraries

Use these defaults unless an appropriate library is already installed:

-   **Tailwind CSS:** primary styling system.
-   **React Hook Form:** large, complex, or validation-heavy forms.
-   **Zod + `@hookform/resolvers`:** schema-based validation when
    appropriate.
-   **Lucide React:** preferred icons; use `react-icons` if already
    established or if a specific icon set is needed.
-   **React Hot Toast:** shared toast notifications with one appropriate
    `Toaster` instance.

Before installing packages:

1.  Check `package.json` and the lockfile.
2.  Respect the current package manager.
3.  Verify framework and version compatibility.
4.  Avoid installing duplicate libraries for the same purpose.

## 13. Accessibility and quality

-   Use semantic HTML and accessible names.
-   Ensure keyboard navigation and visible focus.
-   Maintain sufficient color contrast.
-   Do not rely on color alone to communicate status.
-   Associate form labels and validation messages with controls.
-   Use appropriate heading hierarchy.
-   Keep motion accessible.
-   Preserve existing authentication, routing, and API behavior.
-   Do not fabricate successful operations or invent backend endpoints.

## 14. Theme governance

This document is the default design reference for all future UI tasks.

When creating a page:

1.  Read this document.
2.  Inspect existing theme tokens and shared components.
3.  Reuse established patterns.
4.  Validate the result against the design system.
5.  Update this document only when the project theme intentionally
    changes.

When the user supplies a new screenshot, determine whether it is: - A
reference for a single new page, or - An explicit request to change the
project's overall theme.

Do not replace the global theme based on a single-page reference unless
the user requests that change.

## 15. Verification checklist

Before completing a UI task, verify as appropriate:

-   [ ] Theme colors and typography match the design system.
-   [ ] Shared components are reused.
-   [ ] Tailwind version conventions are respected.
-   [ ] Responsive layouts work at mobile, tablet, and desktop widths.
-   [ ] No unexpected horizontal overflow exists.
-   [ ] Forms and interactive controls have accessible states.
-   [ ] Loading, error, and success states are truthful.
-   [ ] No unrelated files or global styles were changed.
-   [ ] Relevant lint, tests, and build checks were run when available.
-   [ ] Any unverified visual assumptions or limitations are reported.
