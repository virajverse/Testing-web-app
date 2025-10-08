import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { LanguageProvider } from "@/react-app/contexts/LanguageContext";
import HomePage from "@/react-app/pages/Home";
import Admin from "@/react-app/pages/Admin";
import AuthCallback from "@/react-app/pages/AuthCallback";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
