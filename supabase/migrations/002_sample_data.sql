-- Sample Data for Taliyo Marketplace
-- Run this after the initial schema

-- Website Services
INSERT INTO services (name_en, name_hi, price, delivery_time, short_desc_en, short_desc_hi, full_desc_en, full_desc_hi, features_en, features_hi, category_id, is_active) VALUES
('Basic Website', 'बेसिक वेबसाइट', 9999, 7, 
 'Simple 5-page responsive website', 
 'सरल 5-पेज रिस्पॉन्सिव वेबसाइट',
 'Perfect for small businesses and personal portfolios. Includes home, about, services, contact, and gallery pages.',
 'छोटे व्यवसायों और व्यक्तिगत पोर्टफोलियो के लिए बिल्कुल सही। होम, अबाउट, सर्विसेज, कॉन्टैक्ट और गैलरी पेज शामिल हैं।',
 '["5 Pages", "Mobile Responsive", "Contact Form", "1 Year Support", "Free Hosting Setup"]',
 '["5 पेज", "मोबाइल रिस्पॉन्सिव", "कॉन्टैक्ट फॉर्म", "1 साल सपोर्ट", "फ्री होस्टिंग सेटअप"]',
 1, TRUE),

('E-commerce Store', 'ई-कॉमर्स स्टोर', 29999, 14,
 'Full-featured online store with payment gateway',
 'पेमेंट गेटवे के साथ पूर्ण ऑनलाइन स्टोर',
 'Complete e-commerce solution with product management, cart, checkout, and payment integration.',
 'उत्पाद प्रबंधन, कार्ट, चेकआउट और पेमेंट इंटीग्रेशन के साथ पूर्ण ई-कॉमर्स समाधान।',
 '["Unlimited Products", "Payment Gateway", "Order Management", "Mobile App Ready", "SEO Optimized"]',
 '["असीमित उत्पाद", "पेमेंट गेटवे", "ऑर्डर मैनेजमेंट", "मोबाइल ऐप रेडी", "SEO ऑप्टिमाइज़्ड"]',
 1, TRUE),

('Business Website', 'बिजनेस वेबसाइट', 19999, 10,
 'Professional business website with CMS',
 'CMS के साथ प्रोफेशनल बिजनेस वेबसाइट',
 'Feature-rich business website with content management system for easy updates.',
 'आसान अपडेट के लिए कंटेंट मैनेजमेंट सिस्टम के साथ फीचर-रिच बिजनेस वेबसाइट।',
 '["10+ Pages", "CMS Integration", "Blog Section", "SEO Ready", "Analytics Setup"]',
 '["10+ पेज", "CMS इंटीग्रेशन", "ब्लॉग सेक्शन", "SEO रेडी", "एनालिटिक्स सेटअप"]',
 1, TRUE);

-- Mobile App Services
INSERT INTO services (name_en, name_hi, price, delivery_time, short_desc_en, short_desc_hi, full_desc_en, full_desc_hi, features_en, features_hi, category_id, is_active) VALUES
('Android App', 'एंड्रॉइड ऐप', 49999, 30,
 'Custom Android application',
 'कस्टम एंड्रॉइड एप्लिकेशन',
 'Native Android app development with modern UI/UX and backend integration.',
 'आधुनिक UI/UX और बैकएंड इंटीग्रेशन के साथ नेटिव एंड्रॉइड ऐप डेवलपमेंट।',
 '["Native Android", "Material Design", "API Integration", "Push Notifications", "Play Store Upload"]',
 '["नेटिव एंड्रॉइड", "मटेरियल डिज़ाइन", "API इंटीग्रेशन", "पुश नोटिफिकेशन", "प्ले स्टोर अपलोड"]',
 2, TRUE),

('iOS App', 'iOS ऐप', 59999, 35,
 'Custom iOS application for iPhone/iPad',
 'iPhone/iPad के लिए कस्टम iOS एप्लिकेशन',
 'Native iOS app with SwiftUI and seamless Apple ecosystem integration.',
 'SwiftUI और सहज Apple इकोसिस्टम इंटीग्रेशन के साथ नेटिव iOS ऐप।',
 '["Native iOS", "SwiftUI", "iCloud Sync", "Apple Pay", "App Store Upload"]',
 '["नेटिव iOS", "SwiftUI", "iCloud सिंक", "Apple Pay", "ऐप स्टोर अपलोड"]',
 2, TRUE);

-- Digital Marketing Services
INSERT INTO services (name_en, name_hi, price, delivery_time, short_desc_en, short_desc_hi, full_desc_en, full_desc_hi, features_en, features_hi, category_id, is_active) VALUES
('SEO Package', 'SEO पैकेज', 14999, 30,
 'Monthly SEO optimization service',
 'मासिक SEO अनुकूलन सेवा',
 'Comprehensive SEO service including keyword research, on-page optimization, and monthly reports.',
 'कीवर्ड रिसर्च, ऑन-पेज ऑप्टिमाइज़ेशन और मासिक रिपोर्ट सहित व्यापक SEO सेवा।',
 '["Keyword Research", "On-Page SEO", "Link Building", "Monthly Reports", "Google Analytics"]',
 '["कीवर्ड रिसर्च", "ऑन-पेज SEO", "लिंक बिल्डिंग", "मासिक रिपोर्ट", "Google Analytics"]',
 3, TRUE),

('Social Media Marketing', 'सोशल मीडिया मार्केटिंग', 9999, 30,
 'Monthly social media management',
 'मासिक सोशल मीडिया प्रबंधन',
 'Complete social media management including content creation, posting, and engagement.',
 'कंटेंट क्रिएशन, पोस्टिंग और एंगेजमेंट सहित पूर्ण सोशल मीडिया प्रबंधन।',
 '["Content Creation", "Daily Posts", "Engagement", "Analytics", "Ad Campaigns"]',
 '["कंटेंट क्रिएशन", "दैनिक पोस्ट", "एंगेजमेंट", "एनालिटिक्स", "विज्ञापन अभियान"]',
 3, TRUE);

-- Branding Services
INSERT INTO services (name_en, name_hi, price, delivery_time, short_desc_en, short_desc_hi, full_desc_en, full_desc_hi, features_en, features_hi, category_id, is_active) VALUES
('Logo Design', 'लोगो डिज़ाइन', 4999, 5,
 'Professional logo design with revisions',
 'रिविज़न के साथ प्रोफेशनल लोगो डिज़ाइन',
 'Custom logo design with multiple concepts and unlimited revisions until satisfaction.',
 'संतुष्टि तक कई कॉन्सेप्ट और असीमित रिविज़न के साथ कस्टम लोगो डिज़ाइन।',
 '["3 Concepts", "Unlimited Revisions", "Vector Files", "Brand Guidelines", "Social Media Kit"]',
 '["3 कॉन्सेप्ट", "असीमित रिविज़न", "वेक्टर फाइलें", "ब्रांड गाइडलाइन", "सोशल मीडिया किट"]',
 4, TRUE),

('Brand Identity Package', 'ब्रांड आइडेंटिटी पैकेज', 19999, 10,
 'Complete brand identity design',
 'पूर्ण ब्रांड आइडेंटिटी डिज़ाइन',
 'Full branding package including logo, business cards, letterhead, and brand guidelines.',
 'लोगो, बिजनेस कार्ड, लेटरहेड और ब्रांड गाइडलाइन सहित पूर्ण ब्रांडिंग पैकेज।',
 '["Logo Design", "Business Cards", "Letterhead", "Brand Guidelines", "Social Media Templates"]',
 '["लोगो डिज़ाइन", "बिजनेस कार्ड", "लेटरहेड", "ब्रांड गाइडलाइन", "सोशल मीडिया टेम्पलेट"]',
 4, TRUE);
