const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "I was nervous about finding a roommate online, but this platform made it so easy! The matching algorithm paired me with someone who has similar habits and interests, and we've been living together for 6 months now without any issues.",
      name: "Alex Thompson",
      role: "Graduate Student",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
    },
    {
      id: 2,
      quote: "As a property owner, this website has been a game-changer. I can list my properties, screen potential tenants, and find compatible roommate groups all in one place. Highly recommend for any landlord looking to streamline their rental process.",
      name: "Rachel Chen",
      role: "Property Owner",
      avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
    },
    {
      id: 3,
      quote: "After moving to a new city for work, I was struggling to find affordable housing. This platform not only helped me find a great apartment, but also connected me with two amazing roommates who have become close friends. The compatibility scores are spot on!",
      name: "Tara Wilson",
      role: "Marketing Professional",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
    }
  ];

  return (
    <div className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
            Hear from our happy users
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            See what our users say about their experience finding roommates and properties on our platform.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="text-amber-500 flex">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img className="h-10 w-10 rounded-full" src={testimonial.avatar} alt="" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
