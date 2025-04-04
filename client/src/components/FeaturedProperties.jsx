import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

const FeaturedProperties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: properties, isLoading, isError } = useQuery({
    queryKey: ['/api/properties/featured'],
    enabled: false // This would be true in a real implementation
  });

  const [featuredProperties, setFeaturedProperties] = useState([
    {
      id: 1,
      title: 'Modern Downtown Apartment',
      location: 'Downtown, 123 Main St',
      price: '$1,800/mo',
      bedrooms: '2 beds',
      bathrooms: '2 baths',
      area: '950 sq ft',
      description: 'Bright and spacious apartment in the heart of downtown. Recently renovated with modern appliances and hardwood floors throughout.',
      amenities: ['Washer/Dryer', 'Dishwasher', 'Central AC', 'Parking'],
      status: 'Available Now',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      interestedUsers: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      ]
    },
    {
      id: 2,
      title: 'Spacious Townhouse',
      location: 'Westside, 456 Oak Ave',
      price: '$2,200/mo',
      bedrooms: '3 beds',
      bathrooms: '2.5 baths',
      area: '1,450 sq ft',
      description: 'Beautiful townhouse with 3 bedrooms, perfect for roommates. Features a cozy fireplace, private patio, and an updated kitchen.',
      amenities: ['Fireplace', 'Patio', 'Garage', 'Pet-friendly'],
      status: 'Available Soon',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      interestedUsers: []
    },
    {
      id: 3,
      title: 'Urban Loft',
      location: 'Arts District, 789 Brick Ln',
      price: '$2,000/mo',
      bedrooms: '2 beds',
      bathrooms: '2 baths',
      area: '1,200 sq ft',
      description: 'Stunning loft with exposed brick walls, high ceilings, and industrial finishes. Located in the vibrant Arts District with easy access to restaurants and shops.',
      amenities: ['High Ceilings', 'Stainless Steel', 'Gym Access', 'Rooftop'],
      status: 'Available Now',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
      interestedUsers: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      ]
    }
  ]);

  const handleViewDetails = (propertyId) => {
    // In a real implementation, this would navigate to the property details page
    console.log(`View details for property ${propertyId}`);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Featured Properties</h2>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
            Find your next home
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Discover roommate-friendly properties in your area. Perfect for sharing with your new roommates.
          </p>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <div key={property.id} className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative">
                <img className="h-64 w-full object-cover" src={property.image} alt={property.title} />
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <Badge variant={property.status === 'Available Now' ? 'success' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{property.price}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <i className="fa-solid fa-bed text-gray-400 mr-1"></i>
                      <span className="text-sm text-gray-500">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-bath text-gray-400 mr-1"></i>
                      <span className="text-sm text-gray-500">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fa-solid fa-ruler text-gray-400 mr-1"></i>
                      <span className="text-sm text-gray-500">{property.area}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 line-clamp-2">
                  {property.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{amenity}</span>
                  ))}
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
                      <div className="h-7 w-7 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                        +3
                      </div>
                    )}
                  </div>
                  <Button size="sm" onClick={() => handleViewDetails(property.id)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/properties">
            <Button size="lg" className="inline-flex items-center">
              View more properties
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
