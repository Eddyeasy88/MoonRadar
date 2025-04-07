import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
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
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated === false && !location.startsWith("/login") && !location.startsWith("/register")) {
      setLocation("/login");
    }
  }, [isAuthenticated, location, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-pulse w-16 h-16 rounded-full border-2 border-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        <Route path="/">
          {isAuthenticated ? (
            <Layout>
              <Route path="/" component={Dashboard} />
              <Route path="/coin/:symbol" component={CoinDetail} />
              <Route path="/share/:symbol" component={ShareCoin} />
              <Route path="/profile" component={Profile} />
              <Route path="/vip" component={VipUpgrade} />
              <Route path="/invite" component={InviteFriends} />
              <Route path="/heatmap" component={MoonPhaseHeatmap} />
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
