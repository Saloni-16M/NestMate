import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '../lib/api';

const PropertySearch = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    location: '',
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    amenities: []
  });

  const [filteredProperties, setFilteredProperties] = useState([]);

  // Get all properties
  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/properties');
        return response.json();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch properties. Please try again.",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Mock data for development purposes
  const mockProperties = [
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      location: 'Downtown',
      address: '123 Main St',
      price: 1800,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 950,
      propertyType: 'apartment',
      isAvailable: true,
      amenities: ['Washer/Dryer', 'Dishwasher', 'Central AC', 'Parking'],
      description: 'Bright and spacious apartment in the heart of downtown. Recently renovated with modern appliances and hardwood floors throughout.',
      images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'],
      interestedUsers: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      ]
    },
    {
      id: 2,
      title: 'Spacious Townhouse',
      location: 'Westside',
      address: '456 Oak Ave',
      price: 2200,
      bedrooms: 3,
      bathrooms: 2.5,
      areaSqFt: 1450,
      propertyType: 'townhouse',
      isAvailable: true,
      amenities: ['Fireplace', 'Patio', 'Garage', 'Pet-friendly'],
      description: 'Beautiful townhouse with 3 bedrooms, perfect for roommates. Features a cozy fireplace, private patio, and an updated kitchen.',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'],
      interestedUsers: []
    },
    {
      id: 3,
      title: 'Urban Loft',
      location: 'Arts District',
      address: '789 Brick Ln',
      price: 2000,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1200,
      propertyType: 'loft',
      isAvailable: true,
      amenities: ['High Ceilings', 'Stainless Steel', 'Gym Access', 'Rooftop'],
      description: 'Stunning loft with exposed brick walls, high ceilings, and industrial finishes. Located in the vibrant Arts District with easy access to restaurants and shops.',
      images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'],
      interestedUsers: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      ]
    },
    {
      id: 4,
      title: 'Cozy Garden Apartment',
      location: 'Eastside',
      address: '567 Maple St',
      price: 1600,
      bedrooms: 1,
      bathrooms: 1,
      areaSqFt: 750,
      propertyType: 'apartment',
      isAvailable: true,
      amenities: ['Private Garden', 'Laundry', 'Hardwood Floors', 'Pet-friendly'],
      description: 'Charming garden apartment with private entrance and outdoor space. Perfect for a single person or couple. Close to parks and public transportation.',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'],
      interestedUsers: []
    },
    {
      id: 5,
      title: 'Luxury Highrise Apartment',
      location: 'Downtown',
      address: '888 Sky Ave',
      price: 2500,
      bedrooms: 2,
      bathrooms: 2,
      areaSqFt: 1100,
      propertyType: 'apartment',
      isAvailable: true,
      amenities: ['Doorman', 'Pool', 'Fitness Center', 'Concierge'],
      description: 'Stunning luxury apartment with panoramic city views, located in a full-service building with amenities including pool, gym, and 24-hour concierge.',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'],
      interestedUsers: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      ]
    },
    {
      id: 6,
      title: 'Renovated Victorian House',
      location: 'Historic District',
      address: '321 Heritage Ln',
      price: 2800,
      bedrooms: 4,
      bathrooms: 2,
      areaSqFt: 1800,
      propertyType: 'house',
      isAvailable: true,
      amenities: ['Backyard', 'Front Porch', 'Original Details', 'Basement'],
      description: 'Beautiful renovated Victorian home with original architectural details. Spacious rooms, high ceilings, and modern updates while preserving historic charm.',
      images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80'],
      interestedUsers: []
    }
  ];

  // Filter properties based on user preferences
  useEffect(() => {
    const applyFilters = () => {
      const filtered = mockProperties.filter(property => {
        // Apply location filter
        if (filters.location && property.location !== filters.location) {
          return false;
        }
        
        // Apply price filter
        if (property.price < filters.minPrice || property.price > filters.maxPrice) {
          return false;
        }
        
        // Apply bedrooms filter
        if (filters.bedrooms && property.bedrooms.toString() !== filters.bedrooms) {
          return false;
        }
        
        // Apply bathrooms filter
        if (filters.bathrooms && property.bathrooms.toString() !== filters.bathrooms) {
          return false;
        }
        
        // Apply property type filter
        if (filters.propertyType && property.propertyType !== filters.propertyType) {
          return false;
        }
        
        // Apply amenities filter
        if (filters.amenities.length > 0) {
          for (const amenity of filters.amenities) {
            if (!property.amenities.includes(amenity)) {
              return false;
            }
          }
        }
        
        return true;
      });
      
      setFilteredProperties(filtered);
    };
    
    applyFilters();
  }, [filters]);

  const handleViewDetails = (propertyId) => {
    // In a real implementation, this would navigate to the property details page
    toast({
      title: "Property Details",
      description: `Viewing details for property ID: ${propertyId}`,
    });
  };

  const handleInterest = async (propertyId) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in or register to express interest in properties.",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, this would be an actual API call
      // await apiRequest('POST', `/api/property-interests`, { propertyId });
      
      toast({
        title: "Interest Registered",
        description: "The property owner will be notified of your interest.",
      });
    } catch (error) {
      toast({
        title: "Failed to Register Interest",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const currentAmenities = [...prev.amenities];
      if (currentAmenities.includes(amenity)) {
        return { ...prev, amenities: currentAmenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...currentAmenities, amenity] };
      }
    });
  };

  // Set locations, property types, and amenities for the dropdowns
  const locations = [...new Set(mockProperties.map(p => p.location))];
  const propertyTypes = [...new Set(mockProperties.map(p => p.propertyType))];
  const allAmenities = [...new Set(mockProperties.flatMap(p => p.amenities))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Properties</h2>
                
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
                
                {/* Price Range Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ${filters.minPrice} - ${filters.maxPrice}
                  </Label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 5000]}
                      min={0}
                      max={10000}
                      step={100}
                      value={[filters.minPrice, filters.maxPrice]}
                      onValueChange={(value) => {
                        handleFilterChange('minPrice', value[0]);
                        handleFilterChange('maxPrice', value[1]);
                      }}
                    />
                  </div>
                </div>
                
                {/* Bedrooms Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('bedrooms', value)}
                    value={filters.bedrooms}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any number</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Bathrooms Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('bathrooms', value)}
                    value={filters.bathrooms}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any number</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Property Type Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </Label>
                  <Select
                    onValueChange={(value) => handleFilterChange('propertyType', value)}
                    value={filters.propertyType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any type</SelectItem>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Amenities Filter */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </Label>
                  <div className="space-y-2">
                    {allAmenities.map(amenity => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-900">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Reset Filters Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({
                    location: '',
                    minPrice: 0,
                    maxPrice: 5000,
                    bedrooms: '',
                    bathrooms: '',
                    propertyType: '',
                    amenities: []
                  })}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* Properties list */}
            <div className="lg:col-span-3">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Next Home</h1>
              
              {filteredProperties.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more rental options.</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative">
                        <img className="h-64 w-full object-cover" src={property.images[0]} alt={property.title} />
                        <div className="absolute top-0 right-0 mt-4 mr-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Available Now
                          </Badge>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{property.location}, {property.address}</p>
                          </div>
                          <p className="text-lg font-bold text-primary">${property.price}/mo</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex space-x-4">
                            <div className="flex items-center">
                              <i className="fa-solid fa-bed text-gray-400 mr-1"></i>
                              <span className="text-sm text-gray-500">{property.bedrooms} beds</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fa-solid fa-bath text-gray-400 mr-1"></i>
                              <span className="text-sm text-gray-500">{property.bathrooms} baths</span>
                            </div>
                            <div className="flex items-center">
                              <i className="fa-solid fa-ruler text-gray-400 mr-1"></i>
                              <span className="text-sm text-gray-500">{property.areaSqFt} sq ft</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                          {property.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {property.amenities.slice(0, 4).map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 4 && (
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              +{property.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {property.interestedUsers.slice(0, 2).map((user, index) => (
                              <img
                                key={index}
                                className="h-7 w-7 rounded-full ring-2 ring-white"
                                src={user}
                                alt=""
                              />
                            ))}
                            {property.interestedUsers.length > 2 && (
                              <div className="h-7 w-7 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                                +{property.interestedUsers.length - 2}
                              </div>
                            )}
                            {property.interestedUsers.length === 0 && (
                              <div className="text-sm text-gray-500">Be the first to show interest!</div>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleInterest(property.id)}>
                              I'm Interested
                            </Button>
                            <Button size="sm" onClick={() => handleViewDetails(property.id)}>
                              View Details
                            </Button>
                          </div>
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

export default PropertySearch;
