import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  deliveryDays: number;
  category: 'websites' | 'mobile-apps' | 'digital-marketing' | 'branding';
  description: string;
  descriptionHi: string;
  features: string[];
  featuresHi: string[];
  image: string;
}

export interface Category {
  id: string;
  name: string;
  nameHi: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServicesAndCategories();
  }, []);

  const fetchServicesAndCategories = async () => {
    try {
      // For now, we'll still use the hardcoded data since we need to sync the frontend service interface
      // with the backend API structure. In a production app, this would fetch from /api/services
      
      const hardcodedCategories = [
        { id: 'all', name: 'All Services', nameHi: 'सभी सेवाएं' },
        { id: 'websites', name: 'Websites', nameHi: 'वेबसाइट्स' },
        { id: 'mobile-apps', name: 'Mobile Apps', nameHi: 'मोबाइल ऐप्स' },
        { id: 'digital-marketing', name: 'Digital Marketing', nameHi: 'डिजिटल मार्केटिंग' },
        { id: 'branding', name: 'Branding', nameHi: 'ब्रांडिंग' }
      ];

      const hardcodedServices = [
        // Websites
        {
          id: 'business-website',
          name: 'Business Website',
          nameHi: 'बिजनेस वेबसाइट',
          price: 2999,
          deliveryDays: 3,
          category: 'websites' as const,
          description: 'Professional business website with responsive design, contact forms, and basic SEO optimization.',
          descriptionHi: 'रिस्पॉन्सिव डिज़ाइन, संपर्क फॉर्म और बेसिक SEO ऑप्टिमाइज़ेशन के साथ पेशेवर बिजनेस वेबसाइट।',
          features: ['Responsive Design', 'Contact Forms', 'SEO Optimized', '5 Pages', 'Free Domain Setup'],
          featuresHi: ['रिस्पॉन्सिव डिज़ाइन', 'संपर्क फॉर्म', 'SEO ऑप्टिमाइज़्ड', '5 पेज', 'फ्री डोमेन सेटअप'],
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
        },
        {
          id: 'ecommerce-website',
          name: 'E-commerce Website',
          nameHi: 'ई-कॉमर्स वेबसाइट',
          price: 7999,
          deliveryDays: 7,
          category: 'websites' as const,
          description: 'Complete online store with payment gateway, product management, and order tracking.',
          descriptionHi: 'पेमेंट गेटवे, प्रोडक्ट मैनेजमेंट और ऑर्डर ट्रैकिंग के साथ कंप्लीट ऑनलाइन स्टोर।',
          features: ['Payment Gateway', 'Product Management', 'Order Tracking', 'Mobile Responsive', 'Admin Panel'],
          featuresHi: ['पेमेंट गेटवे', 'प्रोडक्ट मैनेजमेंट', 'ऑर्डर ट्रैकिंग', 'मोबाइल रिस्पॉन्सिव', 'एडमिन पैनल'],
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
        },
        {
          id: 'portfolio-website',
          name: 'Portfolio Website',
          nameHi: 'पोर्टफोलियो वेबसाइट',
          price: 1999,
          deliveryDays: 2,
          category: 'websites' as const,
          description: 'Stunning portfolio website to showcase your work and attract clients.',
          descriptionHi: 'अपने काम को दिखाने और क्लाइंट्स को आकर्षित करने के लिए शानदार पोर्टफोलियो वेबसाइट।',
          features: ['Gallery Section', 'Contact Form', 'Responsive Design', 'Fast Loading', 'Modern UI'],
          featuresHi: ['गैलरी सेक्शन', 'संपर्क फॉर्म', 'रिस्पॉन्सिव डिज़ाइन', 'फास्ट लोडिंग', 'मॉडर्न UI'],
          image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
        },
        // Mobile Apps
        {
          id: 'android-app',
          name: 'Android App',
          nameHi: 'एंड्रॉइड ऐप',
          price: 15999,
          deliveryDays: 14,
          category: 'mobile-apps' as const,
          description: 'Custom Android application with modern UI and core functionality.',
          descriptionHi: 'मॉडर्न UI और कोर फंक्शनैलिटी के साथ कस्टम एंड्रॉइड एप्लिकेशन।',
          features: ['Native Android', 'Modern UI', 'Push Notifications', 'Offline Support', 'Play Store Ready'],
          featuresHi: ['नेटिव एंड्रॉइड', 'मॉडर्न UI', 'पुश नोटिफिकेशन', 'ऑफलाइन सपोर्ट', 'प्ले स्टोर रेडी'],
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
        },
        {
          id: 'flutter-app',
          name: 'Flutter App',
          nameHi: 'फ्लटर ऐप',
          price: 12999,
          deliveryDays: 12,
          category: 'mobile-apps' as const,
          description: 'Cross-platform mobile app that works on both Android and iOS.',
          descriptionHi: 'क्रॉस-प्लेटफॉर्म मोबाइल ऐप जो एंड्रॉइड और iOS दोनों पर काम करता है।',
          features: ['Cross Platform', 'Single Codebase', 'Fast Performance', 'Modern UI', 'Both Stores Ready'],
          featuresHi: ['क्रॉस प्लेटफॉर्म', 'सिंगल कोडबेस', 'फास्ट परफॉर्मेंस', 'मॉडर्न UI', 'दोनों स्टोर रेडी'],
          image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
        },
        // Digital Marketing
        {
          id: 'seo-optimization',
          name: 'SEO Optimization',
          nameHi: 'SEO ऑप्टिमाइज़ेशन',
          price: 4999,
          deliveryDays: 7,
          category: 'digital-marketing' as const,
          description: 'Complete SEO optimization to improve your website ranking on Google.',
          descriptionHi: 'गूगल पर आपकी वेबसाइट की रैंकिंग बेहतर करने के लिए कंप्लीट SEO ऑप्टिमाइज़ेशन।',
          features: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Content Optimization', 'Performance Report'],
          featuresHi: ['कीवर्ड रिसर्च', 'ऑन-पेज SEO', 'टेक्निकल SEO', 'कंटेंट ऑप्टिमाइज़ेशन', 'परफॉर्मेंस रिपोर्ट'],
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
        },
        {
          id: 'social-media-setup',
          name: 'Social Media Setup',
          nameHi: 'सोशल मीडिया सेटअप',
          price: 2999,
          deliveryDays: 3,
          category: 'digital-marketing' as const,
          description: 'Professional setup of all major social media platforms for your business.',
          descriptionHi: 'आपके बिजनेस के लिए सभी मुख्य सोशल मीडिया प्लेटफॉर्म का प्रोफेशनल सेटअप।',
          features: ['Facebook Page', 'Instagram Business', 'LinkedIn Company', 'Twitter Profile', 'Content Calendar'],
          featuresHi: ['फेसबुक पेज', 'इंस्टाग्राम बिजनेस', 'लिंक्डइन कंपनी', 'ट्विटर प्रोफाइल', 'कंटेंट कैलेंडर'],
          image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop'
        },
        // Branding
        {
          id: 'logo-design',
          name: 'Logo Design',
          nameHi: 'लोगो डिज़ाइन',
          price: 1999,
          deliveryDays: 3,
          category: 'branding' as const,
          description: 'Professional logo design with multiple concepts and unlimited revisions.',
          descriptionHi: 'मल्टिपल कॉन्सेप्ट्स और अनलिमिटेड रिवीजन के साथ प्रोफेशनल लोगो डिज़ाइन।',
          features: ['3 Concepts', 'Unlimited Revisions', 'Vector Files', 'Brand Guidelines', 'Commercial License'],
          featuresHi: ['3 कॉन्सेप्ट्स', 'अनलिमिटेड रिवीजन', 'वेक्टर फाइल्स', 'ब्रांड गाइडलाइन्स', 'कमर्शियल लाइसेंस'],
          image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop'
        },
        {
          id: 'brand-identity',
          name: 'Brand Identity Package',
          nameHi: 'ब्रांड आइडेंटिटी पैकेज',
          price: 7999,
          deliveryDays: 7,
          category: 'branding' as const,
          description: 'Complete brand identity including logo, business cards, letterhead, and style guide.',
          descriptionHi: 'लोगो, बिजनेस कार्ड्स, लेटरहेड और स्टाइल गाइड सहित कंप्लीट ब्रांड आइडेंटिटी।',
          features: ['Logo Design', 'Business Cards', 'Letterhead', 'Style Guide', 'Brand Colors'],
          featuresHi: ['लोगो डिज़ाइन', 'बिजनेस कार्ड्स', 'लेटरहेड', 'स्टाइल गाइड', 'ब्रांड कलर्स'],
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
        }
      ];

      setCategories(hardcodedCategories);
      setServices(hardcodedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  return { services, categories, loading };
};
