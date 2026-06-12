# Current Goal

## Phase 1 — Authentication, AI Workspace & Conversational Experience

### Completed

#### Authentication Foundation

* Home Page
* Login Button
* OAuth Redirect
* OrangeHRM Login
* Callback Page
* Access Token Storage
* Refresh Token Flow
* Protected Routes

---

## Current Focus

Build a production-ready AUFI HR Assistant experience with a premium AI workspace, authenticated user context, and a modern conversational interface.

---

## Requirements

### Authentication & Session Management

* Secure Token Storage
* Automatic Token Refresh
* Session Management
* Logout Functionality
* Protected Routes
* Session Persistence Across Refreshes
* Automatic Redirect to AI Workspace After Login
* No Authentication Tokens Visible in UI

---

### AI Workspace UI

* Gemini-inspired workspace experience
* Black and emerald-green gradient theme
* AUFI branding
* Personalized welcome section
* Responsive layout
* Glassmorphism design system
* Modern enterprise design language
* Smooth page transitions and animations

---

### Conversational Experience

#### Chat Interface

* Real-time chat experience
* User message bubbles
* Assistant message rendering
* Conversation history
* Session persistence
* Auto-scroll to latest message

#### Streaming Responses

* Gemini/ChatGPT-style response generation
* Progressive text rendering (word-by-word or token streaming)
* Blinking cursor while generating
* Smooth response animation
* Markdown support during streaming
* No layout shifts during generation

#### Typography System

* Plus Jakarta Sans as the primary font
* Consistent typography across:

  * User messages
  * Assistant messages
  * Input field
  * Placeholder text
  * Welcome section
  * Quick action cards

#### Input Experience

* Compact Gemini-inspired input design
* Improved spacing and sizing
* Smooth focus animations
* Consistent typography while typing
* Optimized keyboard experience

#### Input Focus Management

* Input remains focused after sending messages
* Works for both Enter key and Send button
* User can immediately type the next message
* Focus remains intact during streaming
* Focus remains intact after response completion
* Supports rapid back-to-back messaging

---

### User Context Integration

* Authenticated User Context
* Employee Profile Context
* Department Information
* Role-Based Context
* User Session Awareness
* Future Memory Support

---

### Initial HR Assistant Features

* Chat Interface
* Employee Profile Context
* User Context Integration
* Conversation History
* Session Persistence
* HR Knowledge Base Access

---

## Landing Page Experience

After successful OrangeHRM authentication, users should be redirected directly to the AUFI AI Workspace.

### Welcome Message

> Hi! Need help with your HR tasks?

### Prompt Placeholder

> Ask about leave, attendance, employees, policies, onboarding, or HR workflows...

### Quick Actions

* Check Leave Balance
* Apply for Leave
* View Attendance
* Employee Directory
* Company Policies
* Team Information

---

## Success Criteria

### Authentication

* User can login through OrangeHRM
* Secure authenticated session is established
* Protected routes function correctly
* Session persists across browser refreshes
* Logout works correctly

### Workspace Experience

* User is redirected directly to AUFI Workspace after login
* No token information is displayed anywhere in the UI
* Workspace follows AUFI enterprise design language
* Fully responsive across devices

### Chat Experience

* User can immediately start chatting after login
* Responses stream smoothly like Gemini/ChatGPT
* Plus Jakarta Sans is used throughout the chat experience
* Input remains focused after sending messages
* Users can send consecutive messages without reselecting the input field
* Chat feels fast, modern, and production-ready

### Foundation for Phase 2

The platform is ready for:

* OrangeHRM API integrations
* Tool calling
* User memory
* Multi-session conversations
* Advanced HR workflows
* Personalized AI assistance
