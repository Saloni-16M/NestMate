import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import FeaturedRoommates from '../components/FeaturedRoommates';
import FeaturedProperties from '../components/FeaturedProperties';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <FeaturedRoommates />
        <FeaturedProperties />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
