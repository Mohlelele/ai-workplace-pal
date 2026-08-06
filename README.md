# AI Workplace Pal

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

The application should not require user registration or login, and must not use a database. All data should exist only during the current browser session (temporary state only).

Features

1. Smart Email Generator

Generate professional workplace emails.

Support three tones:

Formal

Friendly

Persuasive

Input fields:

Recipient

Purpose

Additional Context

Display editable AI-generated output.

2. AI Task Planner

Generate daily or weekly work schedules.

Prioritize tasks by High, Medium, or Low priority.

Inputs:

Goal

Planning Period (Daily/Weekly)

Priority

Available Working Hours

Display editable AI-generated schedule.

3. AI Chatbot

Interactive workplace AI assistant.

Accept user prompts and provide AI responses.

Maintain conversation only during the current session.

Responses should be editable and copyable.

User Interface

Create a clean, modern SaaS dashboard with:

Responsive design

Left sidebar navigation

Top navigation bar

Dashboard home page

Card-based layout

Rounded corners and subtle shadows

Professional typography

Color Scheme

Primary: Light Blue

Accent: Soft Yellow

Background: White

Text: Dark Gray

AI Experience

Use structured prompts internally for each AI feature.

All AI outputs must be editable.

Include Copy and Regenerate actions for generated content.

Responsible AI

Display the following disclaimer throughout the application:

AI-generated content may contain inaccuracies. Always review and verify outputs before using them for professional or business purposes. Do not enter confidential or sensitive information.

Constraints

No authentication.

No user accounts.

No database.

No data persistence.

No backend storage.

Keep the application lightweight and suitable for a free Lovable project.

Goal: Build a polished, professional AI productivity assistant with three core tools (Email Generator, Task Planner, and AI Chatbot) that feels like a modern SaaS application while remaining simple enough for Lovable's free plan.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/127a7b3f-64f6-476e-86bc-f9e549b9a816).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
