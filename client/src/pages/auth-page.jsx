import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  userType: z.enum(['renter', 'landlord']),
});

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      fullName: '',
      userType: 'renter',
    },
  });

  const onLoginSubmit = (data) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data) => {
    registerMutation.mutate(data);
  };

  if (user) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <div className="flex min-h-[80vh]">
      {/* Left side - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome to RoommateFinder</h2>
            <p className="mt-2 text-sm text-gray-600">Your journey to finding the perfect roommate starts here</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : 'Login'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a:</FormLabel>
                        <div className="flex space-x-4">
                          <Button
                            type="button"
                            variant={field.value === 'renter' ? 'default' : 'outline'}
                            onClick={() => field.onChange('renter')}
                            className="flex-1"
                          >
                            Room Seeker
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'landlord' ? 'default' : 'outline'}
                            onClick={() => field.onChange('landlord')}
                            className="flex-1"
                          >
                            Landlord
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : 'Register'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero image and text */}
      <div className="hidden md:flex md:w-1/2 bg-primary/5 items-center justify-center">
        <div className="max-w-md text-center px-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Find Your Perfect Match</h2>
          <div className="space-y-4 text-left">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Room Seekers</h3>
              <p>Find compatible roommates based on lifestyle, habits, and preferences. Connect with verified listings.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Property Owners</h3>
              <p>List your properties to find qualified tenants. Our matching algorithm helps find the perfect fit.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Secure & Trusted</h3>
              <p>Verified users, secure messaging, and trusted payment processing for a worry-free experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;