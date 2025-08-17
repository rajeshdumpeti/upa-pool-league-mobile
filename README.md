# UPA Pool League Mobile App 🏆

This is a React Native (Expo) mobile application for managing upa Pool League matches, scoring, and schedules. The project follows Clean Architecture, using NativeWind for TailwindCSS styling and Zustand for state management.

## 📦 Tech Stack

- **Frontend**: React Native (Expo SDK 53), TypeScript
- **Styling**: TailwindCSS (NativeWind)
- **State Management**: Zustand
- **API Layer**: Axios + Tanstack React Query
- **Navigation**: React Navigation (Native Stack)
- **Dev Tools**: ESLint, Prettier, Metro Bundler
- **Environment Strategy**: dev (local), test (staging), master (production)

## 🗂 Folder Structure

```
/src
  ├── api/              # API Clients & Services
  ├── components/       # Reusable UI Components (common/)
  ├── features/         # Feature-specific Screens (home/, scoring/, schedule/)
  ├── hooks/            # Custom Hooks (useMatches, etc.)
  ├── navigation/       # Navigation Stack & AppNavigator
  ├── stores/           # Zustand Store Slices (matchStore.ts, etc.)
  ├── styles/           # Tailwind Extensions & Global CSS (optional)
  ├── types/            # TypeScript Global Types & Interfaces
  └── utils/            # Helper Functions
```

## 🚀 Getting Started

1. **Clone the Repo:**

   ```bash
   git clone https://github.com/rajeshdumpeti/upa-pool-league-mobile.git
   cd upa-pool-league-mobile
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the App:**
   ```bash
   npm run ios   # For iOS Simulator
   npm run android  # For Android Emulator
   npm run web   # For Web preview
   ```

## 🏗 Environment Branching

| Branch | Purpose                |
| ------ | ---------------------- |
| dev    | Local development      |
| test   | Staging/QA Environment |
| master | Production Release     |

## 🧑‍💻 Development Flow

1. **Feature Screens** live in `/src/features/`
2. **Global State** is managed via Zustand in `/src/stores/`
3. **API Requests** are handled using React Query + Axios under `/src/api/` and `/src/hooks/`
4. **UI Components** are created in `/src/components/` using TailwindCSS classes.
5. Navigation is structured under `/src/navigation/`.

## 📱 Screens

- Home Screen: View Matches (via API)
- Schedule Screen: List of Scheduled Matches (Upcoming)
- Scoring Screen: Enter & Submit Scores

## ⚙️ Configuration Files

- `babel.config.js`: NativeWind Babel Plugin Setup
- `tailwind.config.js`: Tailwind Content Paths
- `.eslintrc.js` & `prettier.config.js`: Linting & Formatting Rules

## 🗒️ TODO (Upcoming)

- API Integration for Live Matches & Scoring
- Zustand State for Selected Match & Scoring
- User Authentication Flow
- Environment-Specific Config for API Endpoints
- Deploy to TestFlight & Play Store

---

### 👨‍💻 Maintained by Rajesh Dumpeti
