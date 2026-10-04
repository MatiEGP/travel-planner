import { Navbar } from '../../../components/landing/Navbar';
import { Hero } from '../../../components/landing/Hero';
import { Features } from '../../../components/landing/Features';

export const HomePage = () => {
  return (
    <div className="w-full">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
};

