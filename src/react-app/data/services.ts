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

export const services: Service[] = [
  // Websites
  {
    id: 'business-website',
    name: 'Business Website',
    nameHi: 'बिजनेस वेबसाइट',
    price: 2999,
    deliveryDays: 3,
    category: 'websites',
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
    category: 'websites',
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
    category: 'websites',
    description: 'Stunning portfolio website to showcase your work and attract clients.',
    descriptionHi: 'अपने काम को दिखाने और क्लाइंट्स को आकर्षित करने के लिए शानदार पोर्टफोलियो वेबसाइट।',
    features: ['Gallery Section', 'Contact Form', 'Responsive Design', 'Fast Loading', 'Modern UI'],
    featuresHi: ['गैलरी सेक्शन', 'संपर्क फॉर्म', 'रिस्पॉन्सिव डिज़ाइन', 'फास्ट लोडिंग', 'मॉडर्न UI'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    nameHi: 'लैंडिंग पेज',
    price: 999,
    deliveryDays: 1,
    category: 'websites',
    description: 'High-converting landing page for your product or service launch.',
    descriptionHi: 'आपके प्रोडक्ट या सर्विस लॉन्च के लिए हाई-कन्वर्टिंग लैंडिंग पेज।',
    features: ['Single Page', 'Call-to-Action', 'Mobile Optimized', 'Fast Setup', 'Analytics Ready'],
    featuresHi: ['सिंगल पेज', 'कॉल-टू-एक्शन', 'मोबाइल ऑप्टिमाइज़्ड', 'फास्ट सेटअप', 'एनालिटिक्स रेडी'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
  },
  {
    id: 'restaurant-website',
    name: 'Restaurant Website',
    nameHi: 'रेस्टोरेंट वेबसाइट',
    price: 3999,
    deliveryDays: 4,
    category: 'websites',
    description: 'Restaurant website with menu display, online ordering, and table booking.',
    descriptionHi: 'मेनू डिस्प्ले, ऑनलाइन ऑर्डरिंग और टेबल बुकिंग के साथ रेस्टोरेंट वेबसाइट।',
    features: ['Menu Display', 'Online Ordering', 'Table Booking', 'Location Map', 'Mobile Friendly'],
    featuresHi: ['मेनू डिस्प्ले', 'ऑनलाइन ऑर्डरिंग', 'टेबल बुकिंग', 'लोकेशन मैप', 'मोबाइल फ्रेंडली'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
  },

  // Mobile Apps
  {
    id: 'android-app',
    name: 'Android App',
    nameHi: 'एंड्रॉइड ऐप',
    price: 15999,
    deliveryDays: 14,
    category: 'mobile-apps',
    description: 'Custom Android application with modern UI and core functionality.',
    descriptionHi: 'मॉडर्न UI और कोर फंक्शनैलिटी के साथ कस्टम एंड्रॉइड एप्लिकेशन।',
    features: ['Native Android', 'Modern UI', 'Push Notifications', 'Offline Support', 'Play Store Ready'],
    featuresHi: ['नेटिव एंड्रॉइड', 'मॉडर्न UI', 'पुश नोटिफिकेशन', 'ऑफलाइन सपोर्ट', 'प्ले स्टोर रेडी'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
  },
  {
    id: 'ios-app',
    name: 'iOS App',
    nameHi: 'iOS ऐप',
    price: 18999,
    deliveryDays: 16,
    category: 'mobile-apps',
    description: 'Native iOS application with seamless user experience and App Store optimization.',
    descriptionHi: 'सीमलेस यूजर एक्सपीरियंस और ऐप स्टोर ऑप्टिमाइज़ेशन के साथ नेटिव iOS एप्लिकेशन।',
    features: ['Native iOS', 'App Store Ready', 'Push Notifications', 'iCloud Integration', 'Modern Design'],
    featuresHi: ['नेटिव iOS', 'ऐप स्टोर रेडी', 'पुश नोटिफिकेशन', 'iCloud इंटीग्रेशन', 'मॉडर्न डिज़ाइन'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
  },
  {
    id: 'flutter-app',
    name: 'Flutter App',
    nameHi: 'फ्लटर ऐप',
    price: 12999,
    deliveryDays: 12,
    category: 'mobile-apps',
    description: 'Cross-platform mobile app that works on both Android and iOS.',
    descriptionHi: 'क्रॉस-प्लेटफॉर्म मोबाइल ऐप जो एंड्रॉइड और iOS दोनों पर काम करता है।',
    features: ['Cross Platform', 'Single Codebase', 'Fast Performance', 'Modern UI', 'Both Stores Ready'],
    featuresHi: ['क्रॉस प्लेटफॉर्म', 'सिंगल कोडबेस', 'फास्ट परफॉर्मेंस', 'मॉडर्न UI', 'दोनों स्टोर रेडी'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
  },
  {
    id: 'react-native-app',
    name: 'React Native App',
    nameHi: 'रिएक्ट नेटिव ऐप',
    price: 13999,
    deliveryDays: 13,
    category: 'mobile-apps',
    description: 'React Native mobile application with native performance and feel.',
    descriptionHi: 'नेटिव परफॉर्मेंस और फील के साथ रिएक्ट नेटिव मोबाइल एप्लिकेशन।',
    features: ['React Native', 'Native Performance', 'Hot Reload', 'Cross Platform', 'Easy Maintenance'],
    featuresHi: ['रिएक्ट नेटिव', 'नेटिव परफॉर्मेंस', 'हॉट रीलोड', 'क्रॉस प्लेटफॉर्म', 'आसान मेंटेनेंस'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
  },
  {
    id: 'pwa-app',
    name: 'Progressive Web App',
    nameHi: 'प्रोग्रेसिव वेब ऐप',
    price: 8999,
    deliveryDays: 8,
    category: 'mobile-apps',
    description: 'Progressive Web App that works like a native app in browsers.',
    descriptionHi: 'प्रोग्रेसिव वेब ऐप जो ब्राउज़र में नेटिव ऐप की तरह काम करता है।',
    features: ['Works Offline', 'Push Notifications', 'App-like Experience', 'No Store Required', 'Fast Loading'],
    featuresHi: ['ऑफलाइन काम करता है', 'पुश नोटिफिकेशन', 'ऐप जैसा एक्सपीरियंस', 'स्टोर की जरूरत नहीं', 'फास्ट लोडिंग'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
  },

  // Digital Marketing
  {
    id: 'seo-optimization',
    name: 'SEO Optimization',
    nameHi: 'SEO ऑप्टिमाइज़ेशन',
    price: 4999,
    deliveryDays: 7,
    category: 'digital-marketing',
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
    category: 'digital-marketing',
    description: 'Professional setup of all major social media platforms for your business.',
    descriptionHi: 'आपके बिजनेस के लिए सभी मुख्य सोशल मीडिया प्लेटफॉर्म का प्रोफेशनल सेटअप।',
    features: ['Facebook Page', 'Instagram Business', 'LinkedIn Company', 'Twitter Profile', 'Content Calendar'],
    featuresHi: ['फेसबुक पेज', 'इंस्टाग्राम बिजनेस', 'लिंक्डइन कंपनी', 'ट्विटर प्रोफाइल', 'कंटेंट कैलेंडर'],
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop'
  },
  {
    id: 'google-ads',
    name: 'Google Ads Campaign',
    nameHi: 'गूगल एड्स कैंपेन',
    price: 5999,
    deliveryDays: 5,
    category: 'digital-marketing',
    description: 'Targeted Google Ads campaign setup to drive traffic and conversions.',
    descriptionHi: 'ट्रैफिक और कन्वर्शन बढ़ाने के लिए टार्गेटेड गूगल एड्स कैंपेन सेटअप।',
    features: ['Campaign Setup', 'Keyword Research', 'Ad Creation', 'Landing Page', 'Performance Tracking'],
    featuresHi: ['कैंपेन सेटअप', 'कीवर्ड रिसर्च', 'एड क्रिएशन', 'लैंडिंग पेज', 'परफॉर्मेंस ट्रैकिंग'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing Setup',
    nameHi: 'ईमेल मार्केटिंग सेटअप',
    price: 3999,
    deliveryDays: 4,
    category: 'digital-marketing',
    description: 'Professional email marketing system with automated campaigns.',
    descriptionHi: 'ऑटोमेटेड कैंपेन के साथ प्रोफेशनल ईमेल मार्केटिंग सिस्टम।',
    features: ['Email Templates', 'Automation Setup', 'Subscriber Management', 'Analytics Dashboard', 'A/B Testing'],
    featuresHi: ['ईमेल टेम्प्लेट्स', 'ऑटोमेशन सेटअप', 'सब्सक्राइबर मैनेजमेंट', 'एनालिटिक्स डैशबोर्ड', 'A/B टेस्टिंग'],
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop'
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    nameHi: 'कंटेंट मार्केटिंग',
    price: 6999,
    deliveryDays: 10,
    category: 'digital-marketing',
    description: 'Strategic content creation and marketing to engage your audience.',
    descriptionHi: 'आपके ऑडियंस को एंगेज करने के लिए स्ट्रैटेजिक कंटेंट क्रिएशन और मार्केटिंग।',
    features: ['Content Strategy', 'Blog Posts', 'Social Media Content', 'Video Scripts', 'Content Calendar'],
    featuresHi: ['कंटेंट स्ट्रैटेजी', 'ब्लॉग पोस्ट्स', 'सोशल मीडिया कंटेंट', 'वीडियो स्क्रिप्ट्स', 'कंटेंट कैलेंडर'],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
  },

  // Branding
  {
    id: 'logo-design',
    name: 'Logo Design',
    nameHi: 'लोगो डिज़ाइन',
    price: 1999,
    deliveryDays: 3,
    category: 'branding',
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
    category: 'branding',
    description: 'Complete brand identity including logo, business cards, letterhead, and style guide.',
    descriptionHi: 'लोगो, बिजनेस कार्ड्स, लेटरहेड और स्टाइल गाइड सहित कंप्लीट ब्रांड आइडेंटिटी।',
    features: ['Logo Design', 'Business Cards', 'Letterhead', 'Style Guide', 'Brand Colors'],
    featuresHi: ['लोगो डिज़ाइन', 'बिजनेस कार्ड्स', 'लेटरहेड', 'स्टाइल गाइड', 'ब्रांड कलर्स'],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  },
  {
    id: 'business-cards',
    name: 'Business Card Design',
    nameHi: 'बिजनेस कार्ड डिज़ाइन',
    price: 999,
    deliveryDays: 2,
    category: 'branding',
    description: 'Professional business card design with print-ready files.',
    descriptionHi: 'प्रिंट-रेडी फाइल्स के साथ प्रोफेशनल बिजनेस कार्ड डिज़ाइन।',
    features: ['Double-sided Design', 'Print Ready', 'Multiple Formats', '3 Revisions', 'High Resolution'],
    featuresHi: ['डबल-साइडेड डिज़ाइन', 'प्रिंट रेडी', 'मल्टिपल फॉर्मेट्स', '3 रिवीजन', 'हाई रेज़ोल्यूशन'],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
  },
  {
    id: 'brochure-design',
    name: 'Brochure Design',
    nameHi: 'ब्रोशर डिज़ाइन',
    price: 2999,
    deliveryDays: 4,
    category: 'branding',
    description: 'Eye-catching brochure design for your business marketing needs.',
    descriptionHi: 'आपकी बिजनेस मार्केटिंग जरूरतों के लिए आकर्षक ब्रोशर डिज़ाइन।',
    features: ['Tri-fold Design', 'Print Ready', 'High Quality Images', 'Professional Layout', 'Multiple Formats'],
    featuresHi: ['ट्राई-फोल्ड डिज़ाइन', 'प्रिंट रेडी', 'हाई क्वालिटी इमेजेस', 'प्रोफेशनल लेआउट', 'मल्टिपल फॉर्मेट्स'],
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop'
  },
  {
    id: 'social-media-graphics',
    name: 'Social Media Graphics',
    nameHi: 'सोशल मीडिया ग्राफिक्स',
    price: 1999,
    deliveryDays: 3,
    category: 'branding',
    description: 'Complete set of social media graphics for all major platforms.',
    descriptionHi: 'सभी मुख्य प्लेटफॉर्म के लिए सोशल मीडिया ग्राफिक्स का कंप्लीट सेट।',
    features: ['Facebook Covers', 'Instagram Posts', 'Twitter Headers', 'LinkedIn Banners', 'Story Templates'],
    featuresHi: ['फेसबुक कवर्स', 'इंस्टाग्राम पोस्ट्स', 'ट्विटर हेडर्स', 'लिंक्डइन बैनर्स', 'स्टोरी टेम्प्लेट्स'],
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
  }
];

export const categories = [
  { id: 'all', name: 'All Services', nameHi: 'सभी सेवाएं' },
  { id: 'websites', name: 'Websites', nameHi: 'वेबसाइट्स' },
  { id: 'mobile-apps', name: 'Mobile Apps', nameHi: 'मोबाइल ऐप्स' },
  { id: 'digital-marketing', name: 'Digital Marketing', nameHi: 'डिजिटल मार्केटिंग' },
  { id: 'branding', name: 'Branding', nameHi: 'ब्रांडिंग' }
];
