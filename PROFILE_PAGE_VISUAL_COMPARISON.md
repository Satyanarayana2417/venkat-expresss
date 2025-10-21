# Profile Page - Visual Design Comparison

## 📱 Responsive Design Overview

### Mobile View (< 768px) - UNCHANGED
```
┌─────────────────────────────────┐
│ ← Profile Information           │ ← Header with back button
├─────────────────────────────────┤
│                                 │
│  ┌────┐                         │
│  │ 👤 │  Username               │
│  └────┘  Customer               │
│                                 │
│  Full Name                      │
│  [John Doe]                     │
│                                 │
│  Email Address                  │
│  [email@example.com]            │
│                                 │
│  Phone Number                   │
│  [+91 XXXXXXXXXX]               │
│                                 │
└─────────────────────────────────┘
```

### Desktop View (≥ 768px) - NEW DESIGN
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Personal Information                   Edit      │ │
│  ├──────────────────────────────────────────────────┤ │
│  │                                                  │ │
│  │ [First Name]          [Last Name]               │ │
│  │                                                  │ │
│  │ Your Gender                                      │ │
│  │ ○ Male   ○ Female                               │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Email Address                          Edit      │ │
│  ├──────────────────────────────────────────────────┤ │
│  │                                                  │ │
│  │ [email@example.com]                             │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Mobile Number                          Edit      │ │
│  ├──────────────────────────────────────────────────┤ │
│  │                                                  │ │
│  │ [+91 XXXXXXXXXX]                                │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🎨 Section Designs

### 1. Personal Information Section

#### View Mode
```
┌──────────────────────────────────────────────┐
│ Personal Information              Edit       │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────┐  ┌──────────────┐          │
│ │   Saaayoo    │  │     bfjj     │          │
│ └──────────────┘  └──────────────┘          │
│                                              │
│ Your Gender                                  │
│ ● Male   ○ Female                           │
│                                              │
└──────────────────────────────────────────────┘
```

#### Edit Mode
```
┌──────────────────────────────────────────────┐
│ Personal Information      Cancel    Save     │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────┐  ┌──────────────┐          │
│ │[Edit first]  │  │[Edit last]   │          │
│ └──────────────┘  └──────────────┘          │
│                                              │
│ Your Gender                                  │
│ ● Male   ○ Female        ← Can change       │
│                                              │
└──────────────────────────────────────────────┘
```

### 2. Email Address Section

#### View Mode
```
┌──────────────────────────────────────────────┐
│ Email Address                     Edit       │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ snsnarayanachodisetti@gmail.com         │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

#### Edit Mode
```
┌──────────────────────────────────────────────┐
│ Email Address             Cancel    Save     │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │[Edit email address]                     │ │
│ └──────────────────────────────────────────┘ │
│ Note: Changing email requires verification   │
│                                              │
└──────────────────────────────────────────────┘
```

### 3. Mobile Number Section

#### View Mode
```
┌──────────────────────────────────────────────┐
│ Mobile Number                     Edit       │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ +919121055512                           │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

#### Edit Mode
```
┌──────────────────────────────────────────────┐
│ Mobile Number             Cancel    Save     │
├──────────────────────────────────────────────┤
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │[Edit phone number]                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎨 Design Elements Breakdown

### Card Structure
```
┌─────────────────────────────────────────────┐
│ ← Header Section →                          │
│   Title (left)              Button (right)  │
│ ────────────────────────────────────────────│ ← Border
│ ← Content Section →                         │
│   Fields and inputs                         │
│                                             │
└─────────────────────────────────────────────┘
```

**Styling**:
- Background: `bg-white`
- Border: `border border-gray-200`
- Border radius: `rounded-lg`
- Header border: `border-b border-gray-200`

---

### Header Section
```
┌─────────────────────────────────────────────┐
│ Section Title                    Edit       │
└─────────────────────────────────────────────┘
     ↑                                 ↑
text-base                       text-sm
font-semibold                   font-medium
text-gray-900                   text-blue-600
```

**Padding**: `px-6 py-4`

### Content Section
```
┌─────────────────────────────────────────────┐
│                                             │
│  Content Area                               │
│  (Fields, inputs, radio buttons)            │
│                                             │
└─────────────────────────────────────────────┘
```

**Padding**: `p-6`

---

## 📐 Field Designs

### Text Field - View Mode
```
┌──────────────────────────┐
│ Field Value              │ ← bg-gray-50
└──────────────────────────┘
```

**Styling**:
- Background: `bg-gray-50`
- Border: `border border-gray-200`
- Border radius: `rounded-lg`
- Padding: `px-4 py-2.5`
- Text: `text-sm text-gray-900`

### Text Field - Edit Mode
```
┌──────────────────────────┐
│[Editable text input]     │ ← White with border
└──────────────────────────┘
```

**Styling**:
- Background: `bg-white`
- Border: `border border-gray-300`
- Focus: `focus:ring-2 focus:ring-blue-500`
- Padding: `px-4 py-2.5`
- Text: `text-sm`

### Side-by-Side Fields
```
┌─────────────┐  ┌─────────────┐
│ First Name  │  │ Last Name   │
└─────────────┘  └─────────────┘
     50%              50%
```

**Layout**: `grid grid-cols-2 gap-4`

---

## 🎨 Button Designs

### Edit Button
```
┌──────┐
│ Edit │ ← text-blue-600
└──────┘
```

**Styling**:
- Text: `text-sm font-medium text-blue-600`
- Hover: `hover:text-blue-700`
- No background or border

### Cancel Button (in Edit Mode)
```
┌────────┐
│ Cancel │ ← text-gray-600
└────────┘
```

**Styling**:
- Text: `text-sm font-medium text-gray-600`
- Hover: `hover:text-gray-700`

### Save Button (in Edit Mode)
```
┌──────┐
│ Save │ ← text-blue-600
└──────┘
```

**Styling**:
- Text: `text-sm font-medium text-blue-600`
- Hover: `hover:text-blue-700`
- Disabled: `opacity-50` when saving

---

## 🎨 Radio Button Design

### Gender Selection
```
Your Gender

●  Male      ○  Female
↑               ↑
Selected    Not selected
```

**Styling**:
- Size: `w-4 h-4`
- Color: `text-blue-600`
- Border: `border-gray-300`
- Focus: `focus:ring-blue-500`
- Layout: `flex gap-6`

**States**:
- **View mode**: Disabled (shows selection)
- **Edit mode**: Enabled (can change)

---

## 🎯 Color Palette

### Backgrounds
```css
White cards:        bg-white
Field view:         bg-gray-50
Field edit:         bg-white
Page background:    Default (from layout)
```

### Borders
```css
Card border:        border-gray-200
Field border:       border-gray-200 (view)
                    border-gray-300 (edit)
Header separator:   border-gray-200
```

### Text Colors
```css
Headers:           text-gray-900
Field labels:      text-gray-700
Field values:      text-gray-900
Edit button:       text-blue-600
Cancel button:     text-gray-600
Save button:       text-blue-600
Helper text:       text-gray-500
```

### Interactive States
```css
Hover (Edit):      hover:text-blue-700
Hover (Cancel):    hover:text-gray-700
Focus ring:        ring-blue-500
Disabled:          opacity-50
```

---

## 📏 Spacing System

### Container
```
max-w-3xl  →  Max width: 768px
           Center aligned
```

### Section Spacing
```
space-y-6  →  24px gap between sections
```

### Card Padding
```
Header:    px-6 py-4   (24px horizontal, 16px vertical)
Content:   p-6         (24px all around)
```

### Field Spacing
```
Field padding:     px-4 py-2.5
Grid gap:         gap-4  (16px between fields)
Radio button gap: gap-6  (24px between options)
```

---

## 📊 Dimensions

### Container
```
Desktop max-width: 768px (max-w-3xl)
Mobile: Full width with padding
```

### Fields
```
Full width:      100% of container
Two columns:     50% each with gap
Height (view):   auto (min ~40px with padding)
Height (edit):   auto (min ~40px with padding)
```

### Buttons
```
Width:  Auto (based on text)
Height: Auto (text + padding)
Gap:    8px (gap-2) between Cancel/Save
```

---

## 🔄 State Transitions

### Edit Button Click
```
┌─────────────────────┐
│ Title      Edit     │
└─────────────────────┘
        ↓ Click
┌─────────────────────┐
│ Title Cancel  Save  │ ← Buttons change
└─────────────────────┘
   ↓
Fields become editable
```

### Save Flow
```
Edit Mode
   ↓ Click Save
Saving... (button disabled)
   ↓ Success
Toast notification
   ↓
Exit edit mode
   ↓
Fields show new values
```

### Cancel Flow
```
Edit Mode (with changes)
   ↓ Click Cancel
Revert to original values
   ↓
Exit edit mode
   ↓
Fields show original values
```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
```css
.mobile-view { display: block; }
.desktop-view { display: none; }
```

**Shows**:
- Original single-form design
- Profile picture
- Simple read-only fields
- Back button navigation

### Desktop (≥ 768px)
```css
.mobile-view { display: none; }
.desktop-view { display: block; }
```

**Shows**:
- Three sectioned cards
- Per-section edit functionality
- First/Last name split
- Gender radio buttons
- Clean professional layout

---

## ✨ Visual Hierarchy

### Desktop Layout Priority
1. **Section Headers** - Bold, prominent
2. **Edit Buttons** - Blue, action-oriented
3. **Field Values** - Clear, readable
4. **Helper Text** - Subtle, gray
5. **Borders** - Light, structural

### Color Emphasis
1. **Edit/Save buttons** - Blue, highest emphasis
2. **Field values** - Black, high contrast
3. **Section titles** - Dark gray, medium emphasis
4. **Cancel button** - Gray, lower emphasis
5. **Borders** - Light gray, subtle structure

---

## 🔍 Interaction States

### Hover Effects
```css
Edit button:   text-blue-600 → text-blue-700
Cancel button: text-gray-600 → text-gray-700
Save button:   text-blue-600 → text-blue-700
```

### Focus States
```css
Input fields:  border-gray-300 → ring-2 ring-blue-500
Radio buttons: border-gray-300 → ring-blue-500
```

### Disabled States
```css
Save button (saving): opacity-50
Radio buttons (view):  Disabled appearance
```

---

## 📸 Reference Points

### Key Areas to Verify
1. ✓ Three separate sections
2. ✓ Edit button in each header (right side)
3. ✓ Two name fields side by side
4. ✓ Gender radio buttons (Male/Female)
5. ✓ Email field (single line)
6. ✓ Phone number field (single line)
7. ✓ White cards with gray borders
8. ✓ Clean spacing between sections

---

## 📊 Before vs After Comparison

### Desktop View
| Aspect | Before | After |
|--------|--------|-------|
| Layout | Single form | **Three sections** |
| Editing | All at once | **Per-section** |
| Name fields | One field | **Two fields (split)** |
| Gender | Not shown | **Radio buttons** |
| Edit button | Global | **Per-section** |
| Save/Cancel | Global | **Per-section** |
| Visual style | Form in card | **Separate cards** |

### Mobile View
| Aspect | Before | After |
|--------|--------|-------|
| Layout | Simple form | **Identical** |
| Fields | Read-only | **Identical** |
| Design | Original | **Preserved** |

---

## 🎯 Design Goals Achieved

✅ **Sectioned layout** - Three clear sections  
✅ **Per-section editing** - Independent edit modes  
✅ **First/Last name** - Split name fields  
✅ **Gender selection** - Radio buttons  
✅ **Edit buttons** - In section headers  
✅ **Clean design** - White cards with borders  
✅ **Responsive** - Desktop new, mobile preserved  
✅ **Professional** - Matches modern profile UIs  

---

## 🎨 Typography Scale

### Headers
- **Section titles**: 16px (text-base), semibold
- **Button text**: 14px (text-sm), medium

### Fields
- **Field labels**: 14px (text-sm), medium, gray-700
- **Field values**: 14px (text-sm), gray-900
- **Input text**: 14px (text-sm)
- **Helper text**: 12px (text-xs), gray-500

---

## ✨ Micro-interactions

### Transitions
```css
Button hover:     color transition
Input focus:      ring appearance
Save button:      Disabled state fade
```

### Animations
- **Toast notifications**: Slide in/out
- **Loading state**: "Saving..." text
- **Focus rings**: Smooth appearance

---

**Visual Design**: ✅ Complete  
**Matches Reference**: ✅ Yes  
**Responsive**: ✅ Desktop + Mobile  
**Status**: Ready for Production
