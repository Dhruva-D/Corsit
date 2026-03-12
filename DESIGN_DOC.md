# Corsit Design System Documentation

This document outlines the design standards, color palettes, and UI patterns used in the Corsit project. It is intended for developers creating new pages or related websites to ensure visual consistency with the existing theme.

## 1. Overview

The Corsit design is a **Dark Mode** first interface, featuring a high-contrast aesthetic with deep blacks/greys and a vibrant orange/red accent color. The design emphasizes modern transitions, 3D elements (Spline), and clean, responsive layouts.

## 2. Technology Stack

*   **Framework:** React 18+
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite` plugin)
*   **Icons:** Lucide React, React Icons, FontAwesome
*   **Animations:** Framer Motion, CSS Keyframes
*   **3D Elements:** Spline Viewer

## 3. Color Palette

### Brand Colors
The primary accent color is used for call-to-action buttons, active states, and highlights.

| Color Name | Hex Code | Utility Class | Usage |
|:--- |:--- |:--- |:--- |
| **Corsit Orange** | `#ed5a2d` | `bg-[#ed5a2d]` / `text-[#ed5a2d]` | Primary buttons, active links, borders |
| **Orange Hover** | `#ff6b3d` | `hover:bg-[#ff6b3d]` | Button hover states |

### Background Colors
The application uses a suite of dark shades to create depth.

| Color Name | Hex Code | Utility Class | Usage |
|:--- |:--- |:--- |:--- |
| **Pure Black** | `#000000` | `bg-black` | Main page background (Home) |
| **Dark Grey** | `#272928` | `bg-[#272928]` | Navbar/Header background, Cards |
| **Deep Blue/Black** | `#080514` | `bg-[#080514]` | Error pages, specific sections |
| **Form/Modal Bg** | `#0d0f10` | `bg-[#0d0f10]` | Login/Signup forms |

### Text Colors

| Color Name | Hex Code | Utility Class | Usage |
|:--- |:--- |:--- |:--- |
| **White** | `#ffffff` | `text-white` | Primary heading text |
| **Off-White** | `#f7ffff` | `text-[#f7ffff]` | Navigation links (inactive) |
| **Light Grey** | `#d1d5db` | `text-gray-300` | Secondary text, descriptions |

## 4. Typography

*   **Font Family:** Sans-serif (System Default or Inter/Roboto recommended).
*   **Base Size:** 16px
*   **Navigation Text:** `1.2rem` (approx 19.2px)

## 5. UI Layout & Components

### Navigation Bar
*   **Position:** Fixed top (`fixed top-0 left-0 w-full z-50`).
*   **Background:** 
    *   Transparent when at top (on Home).
    *   `#272928` with 95% opacity on scroll (`bg-[#272928] bg-opacity-95`).
*   **Transitions:** Smooth background transition (`transition-all duration-500`).

### Buttons
**Primary Button:**
*   Background: `#ed5a2d`
*   Text: White
*   Border Radius: Rounded (`rounded-lg` or `rounded-full`)
*   Hover: Lighten background to `#ff6b3d` (`hover:bg-[#ff6b3d]`)
*   Transition: `transition-colors`

**Outline/Ghost Button:**
*   Background: Transparent
*   Border: 2px solid `#ed5a2d`
*   Text: `#ed5a2d`
*   Hover: Fill with `#ed5a2d` and turn text White.

### Cards & Sections
*   Sections often use full-screen height or min-height.
*   Content is centered typically within a `w-[92%]` container `mx-auto`.

## 6. Animations & Effects

### Custom Animations (CSS)
Defined in `index.css`:
*   **Shimmer:** `.animate-shimmer` - Loading skeleton effect.
*   **Pulse:** `.animate-loading-pulse` - Opacity pulse (0.5 to 1).
*   **Bounce Dots:** `.animate-bounce-dots` - Scaling loader.
*   **Input Focus:** `.input-focus-animation` - Translates up (-2px) and adds an orange shadow (`rgba(237, 90, 45, 0.15)`).

### 3D Backgrounds
*   Spline Viewer is used for 3D interactive backgrounds.
*   CSS styling for viewer:
    ```css
    spline-viewer {
      width: 170%;
      height: 160%;
      display: block;
      margin-top: -250px;
      margin-left: -790px;
      position: relative;
    }
    ```

## 7. Setup for New Developers

To match this theme in a new page/site:

1.  **Install Tailwind CSS v4:**
    ```bash
    npm install -D tailwindcss @tailwindcss/vite
    ```
2.  **Configure Vite (`vite.config.js`):**
    ```javascript
    import tailwindcss from '@tailwindcss/vite'
    export default defineConfig({
      plugins: [tailwindcss()],
    })
    ```
3.  **Import Tailwind in CSS:**
    ```css
    @import "tailwindcss";
    ```
4.  **Use the Color Variables:**
    Manually apply the hex codes or extend your Tailwind theme configuration to include them:
    ```javascript
    // Optional: Add to theme config if needed
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: '#ed5a2d',
            hover: '#ff6b3d',
            dark: '#272928',
            darker: '#080514'
          }
        }
      }
    }
    ```
