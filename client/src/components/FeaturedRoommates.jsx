import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

const FeaturedRoommates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: roommates, isLoading, isError } = useQuery({
    queryKey: ['/api/roommates/featured'],
    enabled: false // This would be true in a real implementation
  });

  const [featuredRoommates, setFeaturedRoommates] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 28,
      compatibility: '92% Match',
      tags: ['Professional', 'Non-smoker', 'Pet-friendly', 'Early riser'],
      bio: 'Marketing professional looking for a clean and quiet apartment to share. I\'m tidy, respectful of privacy, and love cooking on weekends.',
      location: 'Downtown',
      budget: '$800 - $1,200/mo',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
    },
    {
      id: 2,
      name: 'Michael Torres',
      age: 24,
      compatibility: '78% Match',
      tags: ['Student', 'Non-smoker', 'Night owl', 'Vegetarian'],
      bio: 'Computer science student looking for roommates near campus. I\'m clean, enjoy video games and watching movies. Looking for someone with similar interests.',
      location: 'University District',
      budget: '$600 - $900/mo',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
    },
    {
      id: 3,
      name: 'Priya Patel',
      age: 31,
      compatibility: '95% Match',
      tags: ['Healthcare', 'Non-smoker', 'Fitness enthusiast', 'Early riser'],
      bio: 'Registered nurse looking for a responsible roommate. I work shifts, so I value a quiet and respectful living situation. I enjoy yoga and hiking on my days off.',
      location: 'Eastside',
      budget: '$900 - $1,400/mo',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
    }
  ]);

  const handleConnect = async (roommateId) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in or register to connect with potential roommates.",
        variant: "destructive"
      });
      return;
    }

    try {
      // This would be the real API call
      // await apiRequest('POST', `/api/matches`, { userId2: roommateId });
      
      toast({
        title: "Connection Request Sent",
        description: "Your request has been sent. You'll be notified when they respond.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to send connection request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Featured Roommates</h2>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
            Find your perfect match
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Browse through some of our featured potential roommates looking for a shared living situation.
          </p>
        </div>

        <div className="mt-12 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRoommates.map((roommate) => (
            <div key={roommate.id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative">
                <img className="h-48 w-full object-cover" src={roommate.profileImage} alt={`Profile picture of ${roommate.name}`} />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold text-lg">{roommate.name}</p>
                      <p className="text-white/80 text-sm">{roommate.age} years old</p>
                    </div>
                    <div className={`${roommate.compatibility.startsWith('9') ? 'bg-green-500' : 'bg-amber-500'} text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
                      <i className="fa-solid fa-check text-xs mr-1"></i> 
                      <span>{roommate.compatibility}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {roommate.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {roommate.bio}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">
                      <i className="fa-solid fa-location-dot mr-1"></i>
                      <span>{roommate.location}</span>
                    </p>
                    <p className="text-gray-500 text-sm">
                      <i className="fa-solid fa-dollar-sign mr-1"></i>
                      <span>{roommate.budget}</span>
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleConnect(roommate.id)}>
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/roommates">
            <Button size="lg" className="inline-flex items-center">
              View more roommates
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRoommates;
