import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/authSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiRequest } from '../lib/api';

// Define form validation schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  profileImage: z.string().optional(),
});

const roommatePreferencesSchema = z.object({
  cleanlinessLevel: z.number().min(1).max(5),
  noiseLevel: z.number().min(1).max(5),
  sleepSchedule: z.string(),
  dietPreferences: z.string(),
  smokingPreferences: z.string(),
  petsPreferences: z.string(),
  guestPreferences: z.string(),
  ageRangeMin: z.number().min(18).max(100),
  ageRangeMax: z.number().min(18).max(100),
  interests: z.array(z.string()).optional(),
  additionalNotes: z.string().max(500).optional(),
});

const Profile = () => {
  const [location, navigate] = useLocation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const queryClient = useQueryClient();
  
  const availableInterests = [
    "Reading", "Cooking", "Fitness", "Outdoor Activities", "Movies", "Music", 
    "Art", "Travel", "Gaming", "Sports", "Technology", "Photography"
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your profile",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate, toast]);

  // Fetch roommate preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ['/api/roommate-preferences'],
    enabled: isAuthenticated
  });

  // Initialize form for personal info
  const personalInfoForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      personalInfoForm.reset({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user, personalInfoForm]);

  // Initialize form for roommate preferences
  const preferencesForm = useForm({
    resolver: zodResolver(roommatePreferencesSchema),
    defaultValues: {
      cleanlinessLevel: 3,
      noiseLevel: 3,
      sleepSchedule: "flexible",
      dietPreferences: "no_restrictions",
      smokingPreferences: "no",
      petsPreferences: "no",
      guestPreferences: "sometimes",
      ageRangeMin: 20,
      ageRangeMax: 40,
      interests: [],
      additionalNotes: "",
    },
  });

  // Update form values when preferences data is loaded
  useEffect(() => {
    if (preferences) {
      preferencesForm.reset({
        cleanlinessLevel: preferences.cleanlinessLevel || 3,
        noiseLevel: preferences.noiseLevel || 3,
        sleepSchedule: preferences.sleepSchedule || "flexible",
        dietPreferences: preferences.dietPreferences || "no_restrictions",
        smokingPreferences: preferences.smokingPreferences || "no",
        petsPreferences: preferences.petsPreferences || "no",
        guestPreferences: preferences.guestPreferences || "sometimes",
        ageRangeMin: preferences.ageRangeMin || 20,
        ageRangeMax: preferences.ageRangeMax || 40,
        interests: preferences.interests || [],
        additionalNotes: preferences.additionalNotes || "",
      });
    }
  }, [preferences, preferencesForm]);

  // Define mutation for updating personal info
  const updatePersonalInfoMutation = useMutation({
    mutationFn: async (data) => {
      // In a real app, this would be an actual API call
      // return await apiRequest('PUT', '/api/users/profile', data);
      
      // For development, we'll dispatch to our Redux store
      dispatch(updateProfile(data));
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Define mutation for updating roommate preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data) => {
      // In a real app, this would be an actual API call
      // if (preferences) {
      //   return await apiRequest('PUT', '/api/roommate-preferences', data);
      // } else {
      //   return await apiRequest('POST', '/api/roommate-preferences', data);
      // }
      
      return { success: true, data };
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your roommate preferences have been updated successfully."
      });
      // Invalidate the preferences query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['/api/roommate-preferences'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update preferences. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmitPersonalInfo = (data) => {
    updatePersonalInfoMutation.mutate(data);
  };

  const onSubmitPreferences = (data) => {
    updatePreferencesMutation.mutate(data);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account information and roommate preferences
            </p>

            <Tabs defaultValue="personal-info" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
                <TabsTrigger value="roommate-preferences">Roommate Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal-info" className="mt-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <Form {...personalInfoForm}>
                    <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-6">
                      <div className="flex flex-col items-center mb-6">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={user?.profileImage} alt={user?.fullName} />
                          <AvatarFallback className="text-lg">{getInitials(user?.fullName)}</AvatarFallback>
                        </Avatar>
                        <FormField
                          control={personalInfoForm.control}
                          name="profileImage"
                          render={({ field }) => (
                            <FormItem className="w-full max-w-sm">
                              <FormLabel>Profile Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://example.com/your-image.jpg"
                                />
                              </FormControl>
                              <FormDescription>
                                Enter a URL to your profile image
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={personalInfoForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John Doe" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="johndoe123" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="john@example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="(555) 123-4567" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={personalInfoForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Tell potential roommates about yourself..."
                                className="h-32"
                              />
                            </FormControl>
                            <FormDescription>
                              Share a little about yourself, your lifestyle, and what you're looking for in a roommate.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto"
                        disabled={updatePersonalInfoMutation.isPending}
                      >
                        {updatePersonalInfoMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="roommate-preferences" className="mt-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <Form {...preferencesForm}>
                    <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-8">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={preferencesForm.control}
                          name="cleanlinessLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cleanliness Level: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={1}
                                  max={5}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                1 = Very relaxed, 5 = Very neat
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="noiseLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Noise Level: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={1}
                                  max={5}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                1 = Very quiet, 5 = Often loud
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="sleepSchedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sleep Schedule</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your sleep schedule" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="early_bird">Early Bird</SelectItem>
                                  <SelectItem value="night_owl">Night Owl</SelectItem>
                                  <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="dietPreferences"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Diet Preferences</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your diet preference" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="vegan">Vegan</SelectItem>
                                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                  <SelectItem value="no_restrictions">No Restrictions</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="smokingPreferences"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Smoking Preferences</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="smoking-yes" />
                                    <label htmlFor="smoking-yes">I smoke</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="smoking-no" />
                                    <label htmlFor="smoking-no">No smoking</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="outdoors_only" id="smoking-outdoors" />
                                    <label htmlFor="smoking-outdoors">Outdoors only</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="petsPreferences"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Pet Preferences</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="pets-yes" />
                                    <label htmlFor="pets-yes">I have/want pets</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="pets-no" />
                                    <label htmlFor="pets-no">No pets</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="depends" id="pets-depends" />
                                    <label htmlFor="pets-depends">Depends on the pet</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="guestPreferences"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Guest Preferences</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="often" id="guests-often" />
                                    <label htmlFor="guests-often">Often have guests over</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sometimes" id="guests-sometimes" />
                                    <label htmlFor="guests-sometimes">Occasionally have guests</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="rarely" id="guests-rarely" />
                                    <label htmlFor="guests-rarely">Rarely have guests</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="ageRangeMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Age Preference: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={18}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={preferencesForm.control}
                          name="ageRangeMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Age Preference: {field.value}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={18}
                                  max={100}
                                  step={1}
                                  value={[field.value]}
                                  onValueChange={(values) => field.onChange(values[0])}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={preferencesForm.control}
                        name="interests"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="text-base">Interests</FormLabel>
                              <FormDescription>
                                Select interests to help find compatible roommates
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {availableInterests.map((item) => (
                                <FormField
                                  key={item}
                                  control={preferencesForm.control}
                                  name="interests"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(item)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value, item])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== item
                                                    )
                                                  )
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {item}
                                        </FormLabel>
                                      </FormItem>
                                    )
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preferencesForm.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Any additional preferences or requirements..."
                                className="h-32"
                              />
                            </FormControl>
                            <FormDescription>
                              Add any other preferences that are important to you when finding a roommate.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full sm:w-auto"
                        disabled={updatePreferencesMutation.isPending}
                      >
                        {updatePreferencesMutation.isPending ? "Saving..." : "Save Preferences"}
                      </Button>
                    </form>
                  </Form>
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

export default Profile;
