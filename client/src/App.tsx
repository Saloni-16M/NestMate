import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./store/authSlice";

// Page Imports
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import RoommateSearch from "@/pages/RoommateSearch";
import PropertySearch from "@/pages/PropertySearch";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/roommates" component={RoommateSearch} />
        <Route path="/properties" component={PropertySearch} />
        <Route path="/messages" component={Messages} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
