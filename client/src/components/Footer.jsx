import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/">
              <a className="text-base text-gray-300 hover:text-white">
                Home
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/roommates">
              <a className="text-base text-gray-300 hover:text-white">
                Find Roommates
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link href="/properties">
              <a className="text-base text-gray-300 hover:text-white">
                Properties
              </a>
            </Link>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              About
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              FAQs
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              Contact
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              Privacy
            </a>
          </div>

          <div className="px-5 py-2">
            <a href="#" className="text-base text-gray-300 hover:text-white">
              Terms
            </a>
          </div>
        </nav>

        <div className="mt-8 flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Facebook</span>
            <i className="fa-brands fa-facebook text-xl"></i>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Instagram</span>
            <i className="fa-brands fa-instagram text-xl"></i>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">Twitter</span>
            <i className="fa-brands fa-twitter text-xl"></i>
          </a>

          <a href="#" className="text-gray-400 hover:text-gray-300">
            <span className="sr-only">LinkedIn</span>
            <i className="fa-brands fa-linkedin text-xl"></i>
          </a>
        </div>

        <p className="mt-8 text-center text-base text-gray-400">
          &copy; 2023 RoommateFinder Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
