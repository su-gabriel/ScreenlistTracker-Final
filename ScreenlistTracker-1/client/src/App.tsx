import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import OnboardingPage from "@/pages/onboarding-page";
import MyListPage from "@/pages/my-list-page";
import InsightsPage from "@/pages/insights-page";
import SearchPage from "@/pages/search-page";
import { ProtectedRoute } from "./lib/protected-route";

function App() {
  return (
    <div className="min-h-screen bg-background-light">
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/">
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        </Route>
        <Route path="/onboarding">
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        </Route>
        <Route path="/my-list">
          <ProtectedRoute>
            <MyListPage />
          </ProtectedRoute>
        </Route>
        <Route path="/insights">
          <ProtectedRoute>
            <InsightsPage />
          </ProtectedRoute>
        </Route>
        <Route path="/search">
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </div>
  );
}

export default App;
