import { BrowserRouter as Router, Routes, Route } from "react-router";
import { LanguageProvider } from "@/react-app/contexts/LanguageContext";
import HomePage from "@/react-app/pages/Home";
import Admin from "@/react-app/pages/Admin";
import ErrorBoundary from "@/react-app/components/ErrorBoundary";
import MobileDebug from "@/react-app/components/MobileDebug";

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
        <MobileDebug />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
