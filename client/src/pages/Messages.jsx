import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '../lib/api';
import { format } from 'date-fns';

const Messages = () => {
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  
  // Extract userId from query params
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const selectedUserId = searchParams.get('userId') ? parseInt(searchParams.get('userId')) : null;
  
  const messagesEndRef = useRef(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access your messages",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  // Get all conversations
  const { data: conversations, isLoading: conversationsLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['/api/messages'],
    enabled: isAuthenticated
  });

  // Get conversation with selected user
  const { data: currentConversation, isLoading: conversationLoading, refetch: refetchConversation } = useQuery({
    queryKey: ['/api/messages', selectedUserId],
    enabled: isAuthenticated && selectedUserId !== null
  });

  // Mock data for development
  const mockConversations = [
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
      otherUserId: 3,
      otherUser: {
        fullName: 'Michael Torres',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      latestMessage: {
        content: 'That sounds great! Looking forward to meeting up.',
        dateSent: new Date(Date.now() - 86400000 * 2)
      },
      unreadCount: 0
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
    },
    {
      otherUserId: 5,
      otherUser: {
        fullName: 'Emma Rodriguez',
        profileImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      latestMessage: {
        content: 'I just saw your profile and we seem to have similar interests. Would you be interested in discussing the possibility of being roommates?',
        dateSent: new Date(Date.now() - 86400000 * 3)
      },
      unreadCount: 0
    }
  ];

  // Mock conversation messages
  const getMockConversation = (userId) => {
    const currentDate = new Date();
    
    const mockUsers = {
      2: {
        fullName: 'Sarah Johnson',
        messages: [
          {
            id: 1,
            senderId: 2,
            recipientId: user?.id || 1,
            content: 'Hi there! I noticed we matched as potential roommates and I wanted to reach out.',
            dateSent: new Date(currentDate.getTime() - 86400000 * 2 - 3600000 * 3),
            isRead: true
          },
          {
            id: 2,
            senderId: user?.id || 1,
            recipientId: 2,
            content: "Hello! Thanks for reaching out. I'd love to chat more about possibly being roommates.",
            dateSent: new Date(currentDate.getTime() - 86400000 * 2 - 3600000 * 2),
            isRead: true
          },
          {
            id: 3,
            senderId: 2,
            recipientId: user?.id || 1,
            content: "Great! I'm looking for a place starting next month. What's your timeline?",
            dateSent: new Date(currentDate.getTime() - 86400000 * 2 - 3600000),
            isRead: true
          },
          {
            id: 4,
            senderId: user?.id || 1,
            recipientId: 2,
            content: "That works for me too. I'm looking at a few places downtown. Have you seen any good ones?",
            dateSent: new Date(currentDate.getTime() - 86400000 - 3600000 * 12),
            isRead: true
          },
          {
            id: 5,
            senderId: 2,
            recipientId: user?.id || 1,
            content: 'Actually, I found a great 2-bedroom apartment on Main Street. Would you be interested in checking it out together?',
            dateSent: new Date(currentDate.getTime() - 3600000 * 5),
            isRead: true
          },
          {
            id: 6,
            senderId: 2,
            recipientId: user?.id || 1,
            content: 'Hey, I wanted to ask about your availability for a viewing this weekend?',
            dateSent: new Date(currentDate.getTime() - 3600000),
            isRead: false
          }
        ]
      },
      3: {
        fullName: 'Michael Torres',
        messages: [
          {
            id: 7,
            senderId: user?.id || 1,
            recipientId: 3,
            content: "Hi Michael, I saw that we matched on RoommateFinder. I'm looking for someone to share an apartment near the university.",
            dateSent: new Date(currentDate.getTime() - 86400000 * 3),
            isRead: true
          },
          {
            id: 8,
            senderId: 3,
            recipientId: user?.id || 1,
            content: "Hey! That sounds perfect. I'm a student and definitely need somewhere close to campus.",
            dateSent: new Date(currentDate.getTime() - 86400000 * 3 + 3600000),
            isRead: true
          },
          {
            id: 9,
            senderId: user?.id || 1,
            recipientId: 3,
            content: 'Great! I found a few places we could check out. Would you be free sometime next week?',
            dateSent: new Date(currentDate.getTime() - 86400000 * 2 + 3600000 * 2),
            isRead: true
          },
          {
            id: 10,
            senderId: 3,
            recipientId: user?.id || 1,
            content: 'That sounds great! Looking forward to meeting up.',
            dateSent: new Date(currentDate.getTime() - 86400000 * 2),
            isRead: true
          }
        ]
      },
      4: {
        fullName: 'Alex Johnson',
        messages: [
          {
            id: 11,
            senderId: 4,
            recipientId: user?.id || 1,
            content: 'Hi there! I noticed your profile and we have a high compatibility score.',
            dateSent: new Date(currentDate.getTime() - 86400000 * 2),
            isRead: true
          },
          {
            id: 12,
            senderId: user?.id || 1,
            recipientId: 4,
            content: 'Hello Alex! Thanks for reaching out. I see we both prefer cleanliness and are early risers.',
            dateSent: new Date(currentDate.getTime() - 86400000 * 1.5),
            isRead: true
          },
          {
            id: 13,
            senderId: 4,
            recipientId: user?.id || 1,
            content: "Exactly! I think we'd make great roommates. Would you like to meet for coffee and discuss?",
            dateSent: new Date(currentDate.getTime() - 86400000 * 1.2),
            isRead: true
          },
          {
            id: 14,
            senderId: user?.id || 1,
            recipientId: 4,
            content: 'That would be perfect. How about Saturday morning?',
            dateSent: new Date(currentDate.getTime() - 86400000),
            isRead: true
          },
          {
            id: 15,
            senderId: 4,
            recipientId: user?.id || 1,
            content: 'Thanks for connecting! When would be a good time to chat?',
            dateSent: new Date(currentDate.getTime() - 86400000),
            isRead: true
          }
        ]
      },
      5: {
        fullName: 'Emma Rodriguez',
        messages: [
          {
            id: 16,
            senderId: 5,
            recipientId: user?.id || 1,
            content: 'I just saw your profile and we seem to have similar interests. Would you be interested in discussing the possibility of being roommates?',
            dateSent: new Date(currentDate.getTime() - 86400000 * 3),
            isRead: true
          },
          {
            id: 17,
            senderId: user?.id || 1,
            recipientId: 5,
            content: 'Hi Emma! I would definitely be interested. What area are you looking to live in?',
            dateSent: new Date(currentDate.getTime() - 86400000 * 2.8),
            isRead: true
          }
        ]
      }
    };
    
    return userId && mockUsers[userId] ? 
      { 
        otherUser: { 
          id: userId, 
          fullName: mockUsers[userId].fullName 
        },
        messages: mockUsers[userId].messages
      } : null;
  };

  // Auto-scroll to the bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedUserId, currentConversation]);

  // Mark messages as read when viewed
  useEffect(() => {
    if (selectedUserId && isAuthenticated) {
      // In a real implementation, this would be an API call to mark messages as read
      // Here we would update the mockConversations data
    }
  }, [selectedUserId, isAuthenticated]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedUserId || !isAuthenticated) return;

    try {
      // In a real implementation, this would be an actual API call
      // await apiRequest('POST', '/api/messages', { recipientId: selectedUserId, content: message });
      
      // For now, we'll just add to our mock data
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      
      setMessage('');
      // Refetch conversation to update UI
      // refetchConversation();
      // refetchConversations();
    } catch (error) {
      toast({
        title: "Message Failed",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatMessageDate = (date) => {
    if (!date) return '';
    
    const messageDate = new Date(date);
    const now = new Date();
    
    // If today, just show time
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    }
    
    // If yesterday, show "Yesterday" and time
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${format(messageDate, 'h:mm a')}`;
    }
    
    // If within the last week, show day of week and time
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    if (messageDate > lastWeek) {
      return format(messageDate, 'EEEE, h:mm a');
    }
    
    // Otherwise show full date
    return format(messageDate, 'MMM d, yyyy, h:mm a');
  };

  const getSelectedConversation = () => {
    if (selectedUserId) {
      return getMockConversation(selectedUserId);
    }
    return null;
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Conversations list */}
            <div className="md:col-span-1">
              <Card className="h-[calc(100vh-230px)] flex flex-col">
                <CardContent className="p-0 flex-grow overflow-y-auto">
                  {mockConversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No conversations yet</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {mockConversations.map((conversation) => (
                        <li 
                          key={conversation.otherUserId}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedUserId === conversation.otherUserId ? 'bg-gray-100' : ''}`}
                          onClick={() => navigate(`/messages?userId=${conversation.otherUserId}`)}
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conversation.otherUser.profileImage} alt={conversation.otherUser.fullName} />
                              <AvatarFallback>{getInitials(conversation.otherUser.fullName)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {conversation.otherUser.fullName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatMessageDate(conversation.latestMessage.dateSent)}
                                </p>
                              </div>
                              <p className="text-sm text-gray-500 truncate">
                                {conversation.latestMessage.content}
                              </p>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary">{conversation.unreadCount}</Badge>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Message thread */}
            <div className="md:col-span-2">
              <Card className="h-[calc(100vh-230px)] flex flex-col">
                {selectedUserId ? (
                  <>
                    {/* Message thread header */}
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={getSelectedConversation()?.otherUser.fullName} />
                          <AvatarFallback>{getInitials(getSelectedConversation()?.otherUser.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {getSelectedConversation()?.otherUser.fullName}
                          </h3>
                        </div>
                      </div>
                    </div>
                    
                    {/* Messages container */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                      {getSelectedConversation()?.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] ${msg.senderId === user?.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'} rounded-lg px-4 py-2`}>
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                              {formatMessageDate(msg.dateSent)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Message input */}
                    <div className="p-4 border-t">
                      <div className="flex space-x-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button onClick={sendMessage}>Send</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-grow flex items-center justify-center p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
