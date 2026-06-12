# Project Context

Project Name:
OrangeHRM Employee Chat Assistant

Purpose:
A chatbot application integrated with OrangeHRM.

Users authenticate through OrangeHRM OAuth 2.0.

After authentication users can access a chatbot that can interact with HRMS APIs.

Core Features:

1. OAuth Login with OrangeHRM
2. Access Token Handling
3. Refresh Token Handling
4. Floating Chat Widget
5. Home Page
6. Chat Popup Window
7. Mobile Responsive Design

Frontend Stack:

* React
* Vite
* JavaScript
* Tailwind CSS
* Shadcn UI
* Radix UI

Authentication:

* OAuth 2.0 Authorization Code with PKCE
* OrangeHRM OAuth Server

State Management:

* Zustand

HTTP Client:

* Axios

Design Goals:

* Clean
* Modern
* Fast
* Minimal
* Corporate HR Look

## Theme & Design System Refresh

### Objective

Refresh the entire AUFI application theme to create a premium, modern AI-first experience using a purple-based design language while maintaining the existing enterprise aesthetic and glassmorphism effects.

---

### Brand Colors

#### Primary Purple

* Primary: `#E4AFFF`
* Secondary: `#720ED9`

#### Base Colors

* Background: `#000000`
* Surface: Dark charcoal variants
* Text Primary: `#FFFFFF`
* Text Secondary: `rgba(255,255,255,0.75)`
* Borders: Purple-tinted translucent borders

---

## Login Experience Theme

Redesign the authentication flow using the new purple brand palette.

### Requirements

* Replace current theme colors with:

  * `#E4AFFF`
  * `#720ED9`
* Maintain modern glassmorphism styling
* Use purple gradients for:

  * Login buttons
  * Call-to-action elements
  * Active states
  * Focus states
* Update text, icons, hover states, and accent elements to match the new color palette.
* Create a premium AI-product appearance similar to modern SaaS applications.

### Login Button Style

Gradient:

```css
linear-gradient(
  135deg,
  #E4AFFF 0%,
  #720ED9 100%
)
```

---

## AI Workspace Theme Refresh

Keep the existing dark workspace foundation but replace all emerald-green accents with the new AUFI purple palette.

### Requirements

* Preserve the current black background.
* Preserve existing gradients and visual effects.
* Replace all green accents with purple equivalents.
* Update all UI components to follow the new theme.

### Color Mapping

Replace:

* Green accents → `#E4AFFF`
* Emerald highlights → `#720ED9`
* Green glow effects → Purple glow effects
* Green borders → Purple borders
* Green focus rings → Purple focus rings

---

## Chat Experience Theme

### User Message Bubbles

Use:

```css
background: linear-gradient(
  135deg,
  #E4AFFF 0%,
  #720ED9 100%
);
```

Text:

```css
color: #FFFFFF;
```

---

### Assistant Messages

* White text
* Purple accent branding
* Purple streaming cursor
* Purple highlights and links

---

### Input Area

Update:

* Border color
* Focus states
* Active states
* Icons
* Placeholder accents

Use subtle purple glow effects instead of green.

Example:

```css
border: 1px solid rgba(228,175,255,0.25);

box-shadow:
0 0 0 1px rgba(228,175,255,0.15),
0 0 30px rgba(114,14,217,0.15);
```

---

### Quick Action Cards

Update all cards to use:

* Purple hover states
* Purple borders
* Purple glow effects
* Purple active indicators

Maintain glassmorphism styling.

---

### Welcome Section

Replace green accent styling with purple.

Maintain:

* Existing layout
* Existing spacing
* Existing hierarchy

Update:

* Highlight text
* Icons
* Decorative effects
* Accent gradients

---

### Glassmorphism Design System

Preserve the current glassmorphism implementation while updating colors.

Example:

```css
background: rgba(255,255,255,0.04);

backdrop-filter: blur(20px);

border: 1px solid rgba(228,175,255,0.12);
```

---

## Desired Visual Outcome

The final product should feel like:

* A premium AI assistant
* Modern SaaS platform
* Enterprise-ready HR workspace
* Gemini-level polish
* Dark luxury interface
* Black + Purple design language
* Consistent AUFI branding throughout authentication and chat experiences

The redesign should maintain all existing layouts, gradients, animations, and functionality while replacing the green-based theme with a cohesive purple theme built around `#E4AFFF` and `#720ED9`.

