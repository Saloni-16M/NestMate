const HowItWorks = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            3 Simple Steps to Find Your Match
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Whether you're looking for a roommate or a place to stay, our platform makes it easy to find your perfect match.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <i className="fa-solid fa-user-plus text-xl"></i>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Create a profile</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Sign up and tell us about yourself, your preferences, habits, and what you're looking for in a roommate or property.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <i className="fa-solid fa-magnifying-glass text-xl"></i>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Browse matches</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Our algorithm finds compatible roommates and properties based on your preferences, budget, and location requirements.
              </dd>
            </div>

            <div className="relative">
              <dt>
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <i className="fa-solid fa-comments text-xl"></i>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Connect & move in</p>
              </dt>
              <dd className="mt-2 ml-16 text-base text-gray-500">
                Message potential roommates, schedule viewings, and find your perfect living situation. It's that simple!
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
