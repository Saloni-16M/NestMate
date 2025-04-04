import { useAuth } from "@/hooks/use-auth";
import { Loader } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  redirectTo = "/auth"
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to={redirectTo} />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}

export function RoleProtectedRoute({
  path,
  component: Component,
  role,
  redirectTo = "/dashboard"
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (user.userType !== role) {
    return (
      <Route path={path}>
        <Redirect to={redirectTo} />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}