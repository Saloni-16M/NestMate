import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoading, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                RoommateFinder
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`${location === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Home
              </Link>
              <Link href="/roommates" className={`${location === '/roommates' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Find Roommates
              </Link>
              <Link href="/properties" className={`${location === '/properties' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                Properties
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <>
                <button type="button" className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                </button>

                <div className="ml-3 relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative rounded-full flex text-sm bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        <span className="sr-only">Open user menu</span>
                        <Avatar>
                          <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                          <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link href="/profile" className="w-full">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/dashboard" className="w-full">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost" className="text-primary">Log in</Button>
                </Link>
                <Link href="/auth">
                  <Button className="ml-4">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className={`${location === '/' ? 'bg-primary-50 border-primary text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Home
            </Link>
            <Link href="/roommates" className={`${location === '/roommates' ? 'bg-primary-50 border-primary text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Find Roommates
            </Link>
            <Link href="/properties" className={`${location === '/properties' ? 'bg-primary-50 border-primary text-primary' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
              Properties
            </Link>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                    <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.fullName}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link href="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Your Profile
                </Link>
                <Link href="/dashboard" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link href="/auth" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                  Log in
                </Link>
                <Link href="/auth" className="block px-4 py-2 text-base font-medium text-primary hover:text-primary-dark hover:bg-gray-100">
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
