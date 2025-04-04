import { Link } from 'wouter';
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to find your perfect match?</span>
          <span className="block text-indigo-200">Start your roommate search today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Get started
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link href="/roommates">
              <Button variant="outline" className="bg-indigo-700 text-white hover:bg-indigo-800 border-transparent" size="lg">
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
