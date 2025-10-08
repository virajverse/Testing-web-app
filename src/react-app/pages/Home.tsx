import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ServiceGrid from '../components/ServiceGrid';
import InstallPrompt from '../components/InstallPrompt';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ServiceGrid selectedCategory={selectedCategory} />
      <InstallPrompt />
    </div>
  );
}
