import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';

const Dashboard = () => {
  const [location, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Fetch user's matches
  const { 
    data: matches, 
    isLoading: matchesLoading 
  } = useQuery({
    queryKey: ['/api/matches'],
    enabled: !!user,
  });

  // Fetch user's property interests
  const { 
    data: propertyInterests, 
    isLoading: interestsLoading 
  } = useQuery({
    queryKey: ['/api/property-interests'],
    enabled: !!user,
  });

  // Fetch user's messages
  const { 
    data: messages, 
    isLoading: messagesLoading 
  } = useQuery({
    queryKey: ['/api/messages'],
    enabled: !!user,
  });

  // Mock data for development
  const mockMatches = [
    {
      id: 1,
      compatibilityScore: 92,
      status: 'accepted',
      otherUser: {
        id: 2,
        fullName: 'Sarah Johnson',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    },
    {
      id: 2,
      compatibilityScore: 85,
      status: 'pending',
      otherUser: {
        id: 3,
        fullName: 'Michael Torres',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    }
  ];

  const mockPropertyInterests = [
    {
      id: 1,
      status: 'interested',
      property: {
        id: 1,
        title: 'Modern Downtown Apartment',
        location: 'Downtown, 123 Main St',
        price: '$1,800/mo',
        bedrooms: 2,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
      }
    },
    {
      id: 2,
      status: 'viewed',
      property: {
        id: 3,
        title: 'Urban Loft',
        location: 'Arts District, 789 Brick Ln',
        price: '$2,000/mo',
        bedrooms: 2,
        bathrooms: 2,
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
      }
    }
  ];

  const mockMessages = [
    {
      otherUserId: 2,
      otherUser: {
        fullName: 'Sarah Johnson',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      latestMessage: {
        content: 'Hey, I wanted to ask about your availability for a viewing this weekend?',
        dateSent: new Date(Date.now() - 3600000)
      },
      unreadCount: 2
    },
    {
      otherUserId: 4,
      otherUser: {
        fullName: 'Alex Johnson',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      latestMessage: {
        content: 'Thanks for connecting! When would be a good time to chat?',
        dateSent: new Date(Date.now() - 86400000)
      },
      unreadCount: 0
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.fullName || 'User'}! Here's an overview of your activity.
            </p>

            <Tabs defaultValue="matches" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="matches">Roommate Matches</TabsTrigger>
                <TabsTrigger value="properties">Property Interests</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                  {mockMatches.map((match) => (
                    <Card key={match.id} className="overflow-hidden">
                      <CardHeader className="pb-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={match.otherUser.profileImage} alt={match.otherUser.fullName} />
                              <AvatarFallback>{getInitials(match.otherUser.fullName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{match.otherUser.fullName}</CardTitle>
                              <CardDescription>
                                {match.compatibilityScore}% compatible
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={
                            match.status === 'accepted' ? 'bg-green-500' :
                            match.status === 'pending' ? 'bg-amber-500' :
                            'bg-red-500'
                          }>
                            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {match.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                            <Button size="sm" className="flex-1">Accept</Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/messages?userId=${match.otherUser.id}`)}
                          >
                            Message
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="flex items-center justify-center p-6">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/roommates')}
                    >
                      Find More Roommates
                    </Button>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="properties">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                  {mockPropertyInterests.map((interest) => (
                    <Card key={interest.id} className="overflow-hidden">
                      <div className="h-48 w-full overflow-hidden">
                        <img 
                          src={interest.property.image} 
                          alt={interest.property.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{interest.property.title}</CardTitle>
                            <CardDescription>
                              {interest.property.location}
                            </CardDescription>
                          </div>
                          <p className="font-bold text-primary">{interest.property.price}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <i className="fa-solid fa-bed text-gray-400 mr-1"></i>
                            <span className="text-sm text-gray-500">{interest.property.bedrooms} beds</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fa-solid fa-bath text-gray-400 mr-1"></i>
                            <span className="text-sm text-gray-500">{interest.property.bathrooms} baths</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                  <Card className="flex items-center justify-center p-6">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/properties')}
                    >
                      Browse More Properties
                    </Button>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="messages">
                <div className="mt-4">
                  {mockMessages.map((conversation) => (
                    <Card 
                      key={conversation.otherUserId} 
                      className="mb-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/messages?userId=${conversation.otherUserId}`)}
                    >
                      <CardContent className="p-4 flex items-start">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={conversation.otherUser.profileImage} alt={conversation.otherUser.fullName} />
                          <AvatarFallback>{getInitials(conversation.otherUser.fullName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{conversation.otherUser.fullName}</h3>
                            <p className="text-xs text-gray-500">{formatDate(conversation.latestMessage.dateSent)}</p>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{conversation.latestMessage.content}</p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2 bg-primary">{conversation.unreadCount}</Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/messages')}
                    >
                      View All Messages
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
