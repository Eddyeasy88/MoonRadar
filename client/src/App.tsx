import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Logout from "@/pages/Logout";
import Dashboard from "@/pages/Dashboard";
import CoinDetail from "@/pages/CoinDetail";
import ShareCoin from "@/pages/ShareCoin";
import Profile from "@/pages/Profile";
import VipUpgrade from "@/pages/VipUpgrade";
import InviteFriends from "@/pages/InviteFriends";
import MoonPhaseHeatmap from "@/pages/MoonPhaseHeatmap";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

function App() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Diese Logik leitet Benutzer um, basierend auf Auth-Status
  useEffect(() => {
    // 1. Wenn der Benutzer nicht authentifiziert ist und nicht auf Login/Register/Logout-Seite
    if (!isLoading && !isAuthenticated && 
        !location.startsWith("/login") && 
        !location.startsWith("/register") &&
        !location.startsWith("/logout")) {
      console.log("Nicht authentifiziert, Weiterleitung zu /login");
      setLocation("/login");
    }
    
    // 2. Wenn der Benutzer bereits authentifiziert ist und auf Login/Register-Seite
    if (!isLoading && isAuthenticated && 
        (location.startsWith("/login") || location.startsWith("/register"))) {
      console.log("Bereits authentifiziert, Weiterleitung zu /");
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, location, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse w-16 h-16 rounded-full border-2 border-primary" />
      </div>
    );
  }
  
  // Logging für Debugging
  console.log("Auth Status:", { isAuthenticated, user, currentLocation: location });
  
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/logout" component={Logout} />
        
        <Route path="/">
          {isAuthenticated ? (
            <Layout>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/coin/:symbol" component={CoinDetail} />
                <Route path="/share/:symbol" component={ShareCoin} />
                <Route path="/profile" component={Profile} />
                <Route path="/vip" component={VipUpgrade} />
                <Route path="/invite" component={InviteFriends} />
                <Route path="/heatmap" component={MoonPhaseHeatmap} />
                <Route component={NotFound} />
              </Switch>
            </Layout>
          ) : (
            <Route component={Login} />
          )}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
