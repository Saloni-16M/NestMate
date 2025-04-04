import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '../lib/api';

const RoommateSearch = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    ageRange: [20, 40],
    cleanlinessLevel: 0,
    noiseLevel: 0,
    sleepSchedule: '',
    smokingPreferences: '',
    petsPreferences: '',
    dietPreferences: '',
    location: '',
    budgetMin: 0,
    budgetMax: 3000
  });

  const [filteredRoommates, setFilteredRoommates] = useState([]);

  // Get all users with roommate preferences
  const { data: roommates, isLoading, refetch } = useQuery({
    queryKey: ['/api/roommates'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/roommates');
        return response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch potential roommates. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: isAuthenticated
  });

  // Mock data for development purposes
  const mockRoommates = [
    {
      id: 1,
      user: {
        id: 101,
        fullName: 'Sarah Johnson',
        age: 28,
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      preferences: {
        cleanlinessLevel: 4,
        noiseLevel: 2,
        sleepSchedule: 'early_bird',
        smokingPreferences: 'no',
        petsPreferences: 'yes',
        dietPreferences: 'no_restrictions',
        ageRangeMin: 25,
        ageRangeMax: 35,
        location: 'Downtown',
        budgetMin: 800,
        budgetMax: 1200
      },
      compatibility: 92,
      tags: ['Professional', 'Non-smoker', 'Pet-friendly', 'Early riser'],
      bio: 'Marketing professional looking for a clean and quiet apartment to share. I\'m tidy, respectful of privacy, and love cooking on weekends.'
    },
    {
      id: 2,
      user: {
        id: 102,
        fullName: 'Michael Torres',
        age: 24,
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      preferences: {
        cleanlinessLevel: 3,
        noiseLevel: 3,
        sleepSchedule: 'night_owl',
        smokingPreferences: 'no',
        petsPreferences: 'no',
        dietPreferences: 'vegetarian',
        ageRangeMin: 21,
        ageRangeMax: 30,
        location: 'University District',
        budgetMin: 600,
        budgetMax: 900
      },
      compatibility: 78,
      tags: ['Student', 'Non-smoker', 'Night owl', 'Vegetarian'],
      bio: 'Computer science student looking for roommates near campus. I\'m clean, enjoy video games and watching movies. Looking for someone with similar interests.'
    },
    {
      id: 3,
      user: {
        id: 103,
        fullName: 'Priya Patel',
        age: 31,
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      preferences: {
        cleanlinessLevel: 5,
        noiseLevel: 1,
        sleepSchedule: 'early_bird',
        smokingPreferences: 'no',
        petsPreferences: 'no',
        dietPreferences: 'no_restrictions',
        ageRangeMin: 28,
        ageRangeMax: 40,
        location: 'Eastside',
        budgetMin: 900,
        budgetMax: 1400
      },
      compatibility: 95,
      tags: ['Healthcare', 'Non-smoker', 'Fitness enthusiast', 'Early riser'],
      bio: 'Registered nurse looking for a responsible roommate. I work shifts, so I value a quiet and respectful living situation. I enjoy yoga and hiking on my days off.'
    },
    {
      id: 4,
      user: {
        id: 104,
        fullName: 'James Wilson',
        age: 27,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      preferences: {
        cleanlinessLevel: 3,
        noiseLevel: 4,
        sleepSchedule: 'flexible',
        smokingPreferences: 'outdoors_only',
        petsPreferences: 'yes',
        dietPreferences: 'no_restrictions',
        ageRangeMin: 25,
        ageRangeMax: 35,
        location: 'Westside',
        budgetMin: 700,
        budgetMax: 1100
      },
      compatibility: 82,
      tags: ['Musician', 'Pet owner', 'Social', 'Flexible schedule'],
      bio: 'Freelance musician looking for an easygoing roommate. I practice during the day but am respectful of noise levels. I have a small, friendly dog named Max.'
    },
    {
      id: 5,
      user: {
        id: 105,
        fullName: 'Emma Rodriguez',
        age: 29,
        profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      preferences: {
        cleanlinessLevel: 4,
        noiseLevel: 2,
        sleepSchedule: 'early_bird',
        smokingPreferences: 'no',
        petsPreferences: 'depends',
        dietPreferences: 'vegan',
        ageRangeMin: 25,
        ageRangeMax: 35,
        location: 'Midtown',
        budgetMin: 800,
        budgetMax: 1300
      },
      compatibility: 88,
      tags: ['Professional', 'Vegan', 'Early riser', 'Eco-friendly'],
      bio: 'Environmental scientist who enjoys cooking plant-based meals and hiking on weekends. Looking for a like-minded roommate who values sustainability and clean living.'
    }
  ];

  // Filter roommates based on user preferences
  useEffect(() => {
    // In a real implementation, this would use the actual roommates data from the API
    const applyFilters = () => {
      const filtered = mockRoommates.filter(roommate => {
        // Apply age filter
        if (roommate.user.age < filters.ageRange[0] || roommate.user.age > filters.ageRange[1]) {
          return false;
        }
        
        // Apply location filter
        if (filters.location && roommate.preferences.location !== filters.location) {
          return false;
        }
        
        // Apply budget filter
        if (
          roommate.preferences.budgetMax < filters.budgetMin ||
          roommate.preferences.budgetMin > filters.budgetMax
        ) {
          return false;
        }
        
        // If cleanliness level is set and doesn't match within tolerance
        if (filters.cleanlinessLevel > 0 && 
            Math.abs(roommate.preferences.cleanlinessLevel - filters.cleanlinessLevel) > 1) {
          return false;
        }
        
        // If noise level is set and doesn't match within tolerance
        if (filters.noiseLevel > 0 && 
            Math.abs(roommate.preferences.noiseLevel - filters.noiseLevel) > 1) {
          return false;
        }
        
        // If sleep schedule is set and doesn't match
        if (filters.sleepSchedule && roommate.preferences.sleepSchedule !== filters.sleepSchedule) {
          return false;
        }
        
        // If smoking preference is set and doesn't match
        if (filters.smokingPreferences && 
            roommate.preferences.smokingPreferences !== filters.smokingPreferences) {
          return false;
        }
        
        // If pet preference is set and doesn't match
        if (filters.petsPreferences && 
            roommate.preferences.petsPreferences !== filters.petsPreferences) {
          return false;
        }
        
        // If diet preference is set and doesn't match
        if (filters.dietPreferences && 
            roommate.preferences.dietPreferences !== filters.dietPreferences) {
          return false;
        }
        
        return true;
      });
      
      setFilteredRoommates(filtered);
    };
    
    applyFilters();
  }, [filters]);

  const handleConnect = async (roommateId) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in or register to connect with potential roommates.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, this would be an actual API call
      // await apiRequest('POST', `/api/matches`, { 
      //   userId2: roommateId, 
      //   compatibilityScore: filteredRoommates.find(r => r.id === roommateId)?.compatibility || 50 
      // });
      
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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Set locations for the dropdown
  const locations = [...new Set(mockRoommates.map(r => r.preferences.location))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Roommates</h2>
                
                {/* Age Range Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                  </Label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[20, 40]}
                      min={18}
                      max={65}
                      step={1}
                      value={filters.ageRange}
                      onValueChange={(value) => handleFilterChange('ageRange', value)}
                    />
                  </div>
                </div>
                
                {/* Location Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('location', value)}
                    value={filters.location}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any location</SelectItem>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Budget Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range: ${filters.budgetMin} - ${filters.budgetMax}
                  </Label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 3000]}
                      min={0}
                      max={5000}
                      step={100}
                      value={[filters.budgetMin, filters.budgetMax]}
                      onValueChange={(value) => {
                        handleFilterChange('budgetMin', value[0]);
                        handleFilterChange('budgetMax', value[1]);
                      }}
                    />
                  </div>
                </div>
                
                {/* Cleanliness Level Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleanliness Level
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('cleanlinessLevel', parseInt(value))}
                    value={filters.cleanlinessLevel.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any level</SelectItem>
                      <SelectItem value="1">1 - Very relaxed</SelectItem>
                      <SelectItem value="2">2 - Relaxed</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Clean</SelectItem>
                      <SelectItem value="5">5 - Very clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Noise Level Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Noise Level
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('noiseLevel', parseInt(value))}
                    value={filters.noiseLevel.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any level</SelectItem>
                      <SelectItem value="1">1 - Very quiet</SelectItem>
                      <SelectItem value="2">2 - Quiet</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - Loud at times</SelectItem>
                      <SelectItem value="5">5 - Often loud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sleep Schedule Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Schedule
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('sleepSchedule', value)}
                    value={filters.sleepSchedule}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any schedule</SelectItem>
                      <SelectItem value="early_bird">Early bird</SelectItem>
                      <SelectItem value="night_owl">Night owl</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Smoking Preferences Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking Preferences
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('smokingPreferences', value)}
                    value={filters.smokingPreferences}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any preference</SelectItem>
                      <SelectItem value="yes">Smoker</SelectItem>
                      <SelectItem value="no">Non-smoker</SelectItem>
                      <SelectItem value="outdoors_only">Outdoors only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Pet Preferences Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Preferences
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('petsPreferences', value)}
                    value={filters.petsPreferences}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any preference</SelectItem>
                      <SelectItem value="yes">Pet-friendly</SelectItem>
                      <SelectItem value="no">No pets</SelectItem>
                      <SelectItem value="depends">Depends on pet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Diet Preferences Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Diet Preferences
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('dietPreferences', value)}
                    value={filters.dietPreferences}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any preference</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="no_restrictions">No restrictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Reset Filters Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({
                    ageRange: [20, 40],
                    cleanlinessLevel: 0,
                    noiseLevel: 0,
                    sleepSchedule: '',
                    smokingPreferences: '',
                    petsPreferences: '',
                    dietPreferences: '',
                    location: '',
                    budgetMin: 0,
                    budgetMax: 3000
                  })}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Roommates list */}
            <div className="lg:col-span-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Roommate</h1>
              
              {filteredRoommates.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more potential roommates.</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRoommates.map((roommate) => (
                    <div key={roommate.id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative">
                        <img className="h-48 w-full object-cover" src={roommate.user.profileImage} alt={`Profile picture of ${roommate.user.fullName}`} />
                        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white font-semibold text-lg">{roommate.user.fullName}</p>
                              <p className="text-white/80 text-sm">{roommate.user.age} years old</p>
                            </div>
                            <div className={`${roommate.compatibility >= 90 ? 'bg-green-500' : roommate.compatibility >= 80 ? 'bg-green-500' : 'bg-amber-500'} text-white text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center`}>
                              <i className="fa-solid fa-check text-xs mr-1"></i> 
                              <span>{roommate.compatibility}% Match</span>
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
                              <span>{roommate.preferences.location}</span>
                            </p>
                            <p className="text-gray-500 text-sm">
                              <i className="fa-solid fa-dollar-sign mr-1"></i>
                              <span>${roommate.preferences.budgetMin} - ${roommate.preferences.budgetMax}/mo</span>
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
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoommateSearch;
