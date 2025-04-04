import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute, RoleProtectedRoute } from './lib/protected-route';

// Pages
import Home from './pages/Home';
import AuthPage from './pages/auth-page';
import NotFound from './pages/not-found';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PropertySearch from './pages/PropertySearch';
import RoommateSearch from './pages/RoommateSearch';
import Messages from './pages/Messages';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/roommates" component={RoommateSearch} />
      <ProtectedRoute path="/properties" component={PropertySearch} />
      <ProtectedRoute path="/messages" component={Messages} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;