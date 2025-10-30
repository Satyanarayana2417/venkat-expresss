# Voice Search - Visual Guide & UI Specifications

## 🎨 Visual Design Overview

This document provides detailed visual specifications for the voice search feature implementation.

---

## 📱 Mobile Header Layout

### Location: Top Navigation Bar
```
┌─────────────────────────────────────────────────┐
│  [Logo]  [Search: "search venkat express"]  [🎤] │  ← Blue Header (#7B89C2)
└─────────────────────────────────────────────────┘
```

### Microphone Icon Specifications:
- **Position:** Top-right corner of mobile header
- **Size:** 40px × 40px clickable area
- **Icon Size:** 24px × 24px (h-6 w-6)
- **Color:** White (#FFFFFF)
- **Background:** Transparent (becomes white/20 when active)
- **Border Radius:** Full (rounded-full)

### Idle State:
```css
Normal appearance
White icon on blue background
No animation
Hover: Subtle white/10 background
```

### Active (Listening) State:
```css
White/20 background with rounded corners
Pulsing animation (animate-pulse)
Icon remains white
Visual feedback that mic is active
```

---

## 🎭 Voice Search Overlay

### Full-Screen Modal Specifications

#### Layout Structure:
```
┌───────────────────────────────────────────────┐
│  Background: Black/70 + Backdrop Blur         │
│                                               │
│   ┌─────────────────────────────────┐        │
│   │     [X]                          │ ← Close Button
│   │                                  │        │
│   │         ╔═══════╗                │        │
│   │         ║  ◉◉◉  ║ ← Pulsing Rings│        │
│   │         ║   🎤   ║ ← Microphone   │        │
│   │         ╚═══════╝                │        │
│   │                                  │        │
│   │       Listening...               │ ← Status Text
│   │       Speak now                  │        │
│   │                                  │        │
│   │  ┌──────────────────────────┐   │        │
│   │  │ You said:                │   │        │
│   │  │ "wireless headphones"    │ ← Transcript
│   │  └──────────────────────────┘   │        │
│   │                                  │        │
│   │    [  Tap to cancel  ]          │ ← Cancel Button
│   │                                  │        │
│   └─────────────────────────────────┘        │
│                                               │
└───────────────────────────────────────────────┘
```

#### Component Specifications:

**1. Background Overlay:**
- Color: `rgba(0, 0, 0, 0.7)` (black/70)
- Backdrop Filter: `blur(8px)`
- Z-index: 150
- Full viewport coverage
- Click to close functionality

**2. Content Card:**
- Background: White (#FFFFFF)
- Border Radius: 16px (rounded-2xl)
- Padding: 32px (p-8)
- Max Width: 384px (max-w-sm)
- Shadow: 2xl
- Centered in viewport

**3. Close Button:**
- Position: Absolute, top-right (top-4 right-4)
- Size: 32px × 32px (w-8 h-8)
- Icon: X (Lucide, 20px)
- Background: Transparent (hover: gray-100)
- Border Radius: Full

**4. Microphone Icon with Rings:**
- **Main Icon:**
  - Size: 64px × 64px (w-16 h-16)
  - Background: Primary Blue (#7B89C2)
  - Icon: Mic (Lucide, 32px, white)
  - Border Radius: Full
  - Shadow: Large
  - Z-index: 10 (relative)

- **Pulsing Ring 1:**
  - Size: 80px × 80px
  - Position: Absolute, centered
  - Color: Primary Blue with opacity
  - Animation: Scale 1 → 1.5 → 1 (1.5s, infinite)
  - Opacity: 0.5 → 0 → 0.5

- **Pulsing Ring 2:**
  - Size: 80px × 80px
  - Position: Absolute, centered
  - Color: Primary Blue with opacity
  - Animation: Scale 1 → 1.3 → 1 (1.5s, infinite, 0.2s delay)
  - Opacity: 0.3 → 0 → 0.3

**5. Status Text:**
- **"Listening..." Heading:**
  - Font Size: 18px (text-lg)
  - Font Weight: 600 (font-semibold)
  - Color: Gray-900
  - Margin Top: 24px (mt-6)
  - Margin Bottom: 8px (mb-2)
  - Animation: Opacity pulse (1.5s, infinite)

- **"Speak now" Subtitle:**
  - Font Size: 14px (text-sm)
  - Color: Gray-600
  - Margin Bottom: 16px (mb-4)

**6. Live Transcript Box:**
- Background: Gray-50
- Border Radius: 8px (rounded-lg)
- Padding: 16px (p-4)
- Margin Top: 16px (mt-4)
- Animation: Fade in + slide up (0.3s)
- **Label:** "You said:" (12px, gray-500)
- **Transcript:** 14px, gray-900, font-medium, quoted

**7. Cancel Button:**
- Margin Top: 24px (mt-6)
- Padding: 8px 24px (px-6 py-2)
- Background: Gray-100 (hover: gray-200, active: gray-300)
- Border Radius: Full
- Font Size: 14px (text-sm)
- Font Weight: 500 (font-medium)
- Color: Gray-700
- Transition: All colors

---

## 🎬 Animation Specifications

### 1. Microphone Icon (Header)
```css
/* Idle State */
transition: all 0.3s ease

/* Listening State */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
background: rgba(255, 255, 255, 0.2)
```

### 2. Overlay Entrance/Exit
```css
/* Entrance */
initial: { opacity: 0 }
animate: { opacity: 1 }
transition: duration 0.3s

/* Content Card Entrance */
initial: { scale: 0.9, opacity: 0 }
animate: { scale: 1, opacity: 1 }
transition: duration 0.3s
```

### 3. Pulsing Rings
```css
/* Ring 1 */
animate: {
  scale: [1, 1.5, 1]
  opacity: [0.5, 0, 0.5]
}
transition: {
  duration: 1.5s
  repeat: Infinity
  ease: "easeInOut"
}

/* Ring 2 */
animate: {
  scale: [1, 1.3, 1]
  opacity: [0.3, 0, 0.3]
}
transition: {
  duration: 1.5s
  repeat: Infinity
  ease: "easeInOut"
  delay: 0.2s
}
```

### 4. "Listening..." Text Pulse
```css
animate: {
  opacity: [1, 0.5, 1]
}
transition: {
  duration: 1.5s
  repeat: Infinity
  ease: "easeInOut"
}
```

### 5. Transcript Slide-In
```css
initial: { opacity: 0, y: 10 }
animate: { opacity: 1, y: 0 }
transition: duration 0.3s
```

---

## 🎨 Color Palette

### Primary Colors:
- **Primary Blue:** #7B89C2 (Header background, mic icon)
- **Primary Dark:** #1565C0 (Border accents)

### Neutral Colors:
- **White:** #FFFFFF (Icons, text, cards)
- **Gray-50:** #F9FAFB (Transcript background)
- **Gray-100:** #F3F4F6 (Button background)
- **Gray-200:** #E5E7EB (Button hover)
- **Gray-300:** #D1D5DB (Button active)
- **Gray-400:** #9CA3AF (Secondary icons)
- **Gray-500:** #6B7280 (Secondary text)
- **Gray-600:** #4B5563 (Body text)
- **Gray-700:** #374151 (Button text)
- **Gray-900:** #111827 (Headings)

### Status Colors:
- **Error Red:** #DC2626 (Error heading)
- **Success Green:** #16A34A (Future use)

### Opacity Values:
- **Overlay:** 70% black
- **Active Icon Background:** 20% white
- **Hover Background:** 10% white
- **Ring Pulses:** 50% → 0% and 30% → 0%

---

## 📐 Spacing & Sizing

### Header:
- **Logo Height:** 36px (h-9)
- **Search Bar Height:** 40px (h-10)
- **Mic Button Size:** 40px × 40px (w-10 h-10)
- **Icon Size:** 24px × 24px (h-6 w-6)
- **Padding:** 12px horizontal (px-3), 10px vertical (py-2.5)

### Overlay Card:
- **Padding:** 32px (p-8)
- **Max Width:** 384px (max-w-sm)
- **Border Radius:** 16px (rounded-2xl)

### Microphone:
- **Icon Container:** 64px × 64px
- **Icon Size:** 32px × 32px
- **Ring Size:** 80px × 80px

### Text Spacing:
- **Heading to Subtitle:** 8px (mb-2)
- **Section Spacing:** 24px (mt-6)
- **Transcript Label to Text:** 4px (mb-1)

### Button:
- **Height:** Auto (py-2)
- **Horizontal Padding:** 24px (px-6)
- **Border Radius:** Full (rounded-full)

---

## 🖼️ State Variations

### 1. Idle State (Icon Only)
```
┌────────────────────────────────────┐
│  [Logo]  [Search Box]  [🎤]        │
└────────────────────────────────────┘
     White icon, no animation
```

### 2. Listening State
```
┌────────────────────────────────────┐
│  [Logo]  [Search Box]  [(🎤)]      │ ← Pulsing
└────────────────────────────────────┘
     White/20 background + pulse
     
     +
     
┌─────────────────────────────────────┐
│       FULL OVERLAY VISIBLE          │
│   Animated microphone + transcript  │
└─────────────────────────────────────┘
```

### 3. Error State
```
┌──────────────────────────────┐
│     [X]                       │
│                              │
│    [🎤 with static rings]    │
│                              │
│    ⚠️ Error                  │ ← Red text
│    Permission denied...      │ ← Error message
│                              │
│    [  Tap to cancel  ]      │
└──────────────────────────────┘
```

### 4. Transcript Visible
```
┌──────────────────────────────┐
│     [X]                       │
│                              │
│    [🎤 with pulsing rings]   │
│                              │
│    Listening...              │
│    Speak now                 │
│                              │
│  ┌────────────────────────┐  │
│  │ You said:              │  │ ← Transcript box
│  │ "laptop gaming"        │  │
│  └────────────────────────┘  │
│                              │
│    [  Tap to cancel  ]      │
└──────────────────────────────┘
```

---

## 🎯 Interactive Elements

### Microphone Icon (Header)
```
Idle State:
- Cursor: pointer
- Background: transparent
- Hover: bg-white/10

Listening State:
- Cursor: pointer
- Background: bg-white/20
- Animation: pulse
```

### Close Button (Overlay)
```
Default:
- Background: transparent
- Cursor: pointer

Hover:
- Background: gray-100
- Transition: 0.2s
```

### Cancel Button (Overlay)
```
Default:
- Background: gray-100
- Cursor: pointer

Hover:
- Background: gray-200
- Transition: colors

Active:
- Background: gray-300
```

### Background Overlay
```
Click Handler: Close overlay
Cursor: default
Backdrop Filter: blur(8px)
```

---

## 📱 Responsive Behavior

### Mobile Only (< 768px):
- All voice search UI visible
- Microphone icon in header
- Full-screen overlay
- Optimized touch targets (40px min)

### Tablet/Desktop (≥ 768px):
- Voice search hidden (`md:hidden`)
- No microphone icon
- No overlay component rendered
- Zero impact on layout

---

## 🎨 Typography

### Font Family:
- System font stack (inherited from app)
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

### Font Sizes:
- **Large Heading:** 18px (text-lg) - "Listening..."
- **Medium Text:** 14px (text-sm) - "Speak now", transcript
- **Small Text:** 12px (text-xs) - "You said:" label

### Font Weights:
- **Semibold:** 600 - Headings
- **Medium:** 500 - Buttons, transcript
- **Normal:** 400 - Body text

### Line Heights:
- Default (1.5) for readability

---

## 🔄 Transition Timing

### Quick Transitions (0.2s):
- Button hover states
- Background changes

### Standard Transitions (0.3s):
- Overlay entrance/exit
- Content card scale
- Transcript slide-in

### Slow Animations (1.5s):
- Ring pulses (infinite)
- Text opacity pulse (infinite)
- Microphone icon pulse (infinite)

---

## ✨ Accessibility

### ARIA Labels:
```tsx
<button aria-label="Voice Search">
  {/* Mic icon */}
</button>
```

### Focus States:
- Visible focus ring on all interactive elements
- Keyboard navigation support
- Tab order preserved

### Screen Reader:
- "Voice Search" button label
- Status announcements (future enhancement)
- Error messages readable

### Touch Targets:
- Minimum 40px × 40px for all buttons
- Adequate spacing between elements
- No tiny click areas

---

## 🎬 Animation Performance

### Optimizations:
- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid `width`, `height`, `top`, `left` animations
- Use `will-change` sparingly
- Framer Motion handles optimization automatically

### Smooth Performance:
- 60fps animations on modern devices
- Minimal CPU usage
- No janky scrolling
- Battery-friendly

---

## 🖼️ Asset Requirements

### Icons:
- **Source:** Lucide React
- **Microphone:** `<Mic />` component
- **Close:** `<X />` component
- **No custom SVGs needed**

### Images:
- None required (pure CSS + icons)

### Fonts:
- System fonts only (no web fonts)

---

## 📊 Visual Hierarchy

### Priority Order:
1. **Pulsing Microphone** (focal point)
2. **"Listening..." Text** (status)
3. **Live Transcript** (feedback)
4. **Cancel Button** (action)
5. **Close Button** (secondary action)

### Visual Weight:
- Microphone: Largest element (64px)
- Status text: Medium prominence
- Transcript: Secondary focus
- Buttons: Tertiary elements

---

## 🎨 Design Tokens (CSS Variables)

```css
/* Colors */
--primary: #7B89C2;
--primary-dark: #1565C0;
--white: #FFFFFF;
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-900: #111827;

/* Spacing */
--space-2: 0.5rem;  /* 8px */
--space-4: 1rem;    /* 16px */
--space-6: 1.5rem;  /* 24px */
--space-8: 2rem;    /* 32px */

/* Sizes */
--mic-icon: 64px;
--mic-button: 40px;
--close-button: 32px;

/* Timing */
--fast: 0.2s;
--normal: 0.3s;
--slow: 1.5s;

/* Radius */
--radius-full: 9999px;
--radius-xl: 12px;
--radius-2xl: 16px;
```

---

## 🔍 Visual Quality Checklist

- [x] Smooth animations (60fps)
- [x] Consistent spacing
- [x] Proper color contrast (WCAG AA)
- [x] Sharp icons (vector-based)
- [x] No pixelation or blur
- [x] Responsive to all mobile sizes
- [x] Touch-friendly targets (40px+)
- [x] Clear visual hierarchy
- [x] Professional appearance
- [x] Brand consistency

---

## 🎯 Design System Alignment

### Matches Existing Design:
- Same primary blue (#7B89C2)
- Consistent rounded corners
- Matching font sizes
- Same spacing scale
- Aligned with brand

### Maintains Consistency:
- Button styles match app
- Color palette matches theme
- Animation style matches UI
- Typography matches design system

---

**Visual Guide Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Design Status:** ✅ Production Ready

