# 📈 FinSight

FinSight is a modern, AI-powered financial analysis dashboard that helps investors and analysts quickly understand a company's financial health. Built with Next.js, it leverages the Gemini API to provide an interactive AI analyst, while visualizing key metrics using Recharts.

![FinSight Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-blue?logo=google)

## ✨ Features

- **Multi-Company Dashboard**: Search and seamlessly switch between major tech and finance giants (Apple, Microsoft, Google, IBM, JPMorgan, etc.) to view tailored financial data.
- **AI Financial Analyst**: Talk to the context-aware Gemini AI (`gemini-flash-lite-latest`) directly in the dashboard to ask questions about revenue trends, margins, or stock performance.
- **Financial Forecasting**: Includes linear regression algorithms to automatically project revenue and net income for the next 2 years.
- **Dynamic Health Score**: Computes a proprietary 0-100 company health score based on revenue growth, debt-to-equity, EPS, and stock performance, summarized in one sentence by the AI.
- **Rich Data Visualizations**: Interactive, responsive charts built with Recharts (Revenue vs Net Income, Growth Trends, Stock Price history).
- **Live News Feed**: Keeps you updated with the latest headlines relevant to the selected company.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI / Custom Glassmorphism UI
- **Data Visualization**: [Recharts](https://recharts.org/)
- **AI Integration**: Google Generative AI (Gemini API)
- **Markdown Rendering**: `react-markdown` + `@tailwindcss/typography`

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/FinSight.git
cd FinSight
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and add your Google Gemini API key.
```bash
cp .env.example .env.local
```
Open `.env.local` and add your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## 📂 Project Structure

- `/src/app` - Next.js App Router pages and API routes (including the `/api/chat` Gemini integration).
- `/src/components` - Reusable UI components (Metric Cards, Charts, Chat Panel, Health Score).
- `/src/lib` - Utility functions, regression algorithms, formatting, and mock data APIs (`yahoo.ts`).
- `/src/types` - TypeScript interfaces for robust typing across the app.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
