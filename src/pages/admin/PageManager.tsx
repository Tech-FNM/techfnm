import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  MessageSquare,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  FileText,
  Save,
  HelpCircle,
  SlidersHorizontal,
  ArrowLeft,
  Calendar,
  User,
  Layers,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  AlignLeft,
  Settings,
  Globe,
  Share2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  FolderGit2,
  ListOrdered,
  BarChart3,
  Upload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { triggerContentUpdate } from '../../lib/cmsContent';
import { toast, Toaster } from 'react-hot-toast';
import SeoSettingsPanel, { SeoSettingsData } from '../../components/admin/SeoSettingsPanel';

interface SectionField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'url';
  placeholder?: string;
  help?: string;
}

interface PageSectionConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  fields: SectionField[];
}

interface PageItem {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: 'published' | 'draft' | 'trash';
  date: string;
  commentsCount: number;
  isFrontPage?: boolean;
  content?: string;
  template?: string;
  featuredImage?: string;
  sectionsData: Record<string, any>;
  seoSettings?: SeoSettingsData;
}

// ── DEFINITION OF SECTIONS FOR EVERY PAGE (A TO Z) ──
const PAGE_SECTIONS_REGISTRY: Record<string, PageSectionConfig[]> = {
  'page-home': [
    {
      id: 'hero',
      title: '1. Hero Section (Fexora Top Fold)',
      description: 'Main hero headline, lime highlighted word, lead text, buttons and 3 metric counter cards.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Tagline Badge Pill', type: 'text', placeholder: 'e.g. Your Digital Growth Experts' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Growth Focused Digital Agency Solutions' },
        { key: 'hero_highlight_word', label: 'Neon Lime Highlight Word', type: 'text', placeholder: 'e.g. Digital' },
        { key: 'hero_desc', label: 'Paragraph Description', type: 'textarea', placeholder: 'Describe your core value proposition...' },
        { key: 'hero_cta1_text', label: 'Primary Button Text', type: 'text', placeholder: 'e.g. Get Free Quote' },
        { key: 'hero_cta1_link', label: 'Primary Button Link', type: 'url', placeholder: 'e.g. /request-service' },
        { key: 'hero_cta2_text', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Our Services' },
        { key: 'hero_cta2_link', label: 'Secondary Button Link', type: 'url', placeholder: 'e.g. #services' },
        { key: 'hero_stat1_num', label: 'Counter 1 Value', type: 'text', placeholder: 'e.g. 95%' },
        { key: 'hero_stat1_lbl', label: 'Counter 1 Label', type: 'text', placeholder: 'e.g. Client Satisfaction Rate' },
        { key: 'hero_stat2_num', label: 'Counter 2 Value', type: 'text', placeholder: 'e.g. 50%' },
        { key: 'hero_stat2_lbl', label: 'Counter 2 Label', type: 'text', placeholder: 'e.g. Influencer collaboration' },
        { key: 'hero_stat3_num', label: 'Counter 3 Value', type: 'text', placeholder: 'e.g. 250+' },
        { key: 'hero_stat3_lbl', label: 'Counter 3 Label', type: 'text', placeholder: 'e.g. Projects Completed' },
      ]
    },
    {
      id: 'clients',
      title: '2. Client & Partner Ticker',
      description: 'Infinite marquee logo ticker header text.',
      icon: Globe,
      fields: [
        { key: 'clients_badge', label: 'Ticker Heading / Label', type: 'text', placeholder: 'e.g. Trusted By 200+ Global Brands & Visionary Startups' },
      ]
    },
    {
      id: 'about',
      title: '3. About Our Agency (Mission, Vision, Goals)',
      description: 'Agency story, founder card with avatar, and interactive tabs.',
      icon: User,
      fields: [
        { key: 'about_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. About Our Agency' },
        { key: 'about_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g. We deliver result through digital innovation' },
        { key: 'about_desc', label: 'Main Description Paragraph', type: 'textarea', placeholder: 'Introduce your company mission...' },
        { key: 'about_founder_name', label: 'Founder Name', type: 'text', placeholder: 'e.g. Muhammad Naeem' },
        { key: 'about_founder_role', label: 'Founder Role / Title', type: 'text', placeholder: 'e.g. Founder & CEO' },
        { key: 'about_founder_avatar', label: 'Founder Avatar Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
        { key: 'about_mission_title', label: 'Tab 1 Title (Mission)', type: 'text', placeholder: 'e.g. Our Mission' },
        { key: 'about_mission_desc', label: 'Tab 1 Content (Mission)', type: 'textarea', placeholder: 'Mission statement text...' },
        { key: 'about_vision_title', label: 'Tab 2 Title (Vision)', type: 'text', placeholder: 'e.g. Our Vision' },
        { key: 'about_vision_desc', label: 'Tab 2 Content (Vision)', type: 'textarea', placeholder: 'Vision statement text...' },
        { key: 'about_goals_title', label: 'Tab 3 Title (Goals)', type: 'text', placeholder: 'e.g. Our Goals' },
        { key: 'about_goals_desc', label: 'Tab 3 Content (Goals)', type: 'textarea', placeholder: 'Goals statement text...' },
        { key: 'about_btn_text', label: 'CTA Button Text', type: 'text', placeholder: 'e.g. More About Us' },
        { key: 'about_btn_link', label: 'CTA Button Link', type: 'url', placeholder: 'e.g. /about' },
        { key: 'about_image', label: 'Feature Showcase Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
      ]
    },
    {
      id: 'services',
      title: '4. Digital Services Showcase',
      description: 'Services grid headline, badge, and navigation button.',
      icon: Briefcase,
      fields: [
        { key: 'services_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Our Services' },
        { key: 'services_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Digital services designed for your growth' },
        { key: 'services_desc', label: 'Section Description', type: 'textarea', placeholder: 'Describe your range of capabilities...' },
        { key: 'services_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. View All Services' },
        { key: 'services_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /services' },
      ]
    },
    {
      id: 'features',
      title: '5. Core Features Bento Grid',
      description: '6 innovative digital solutions bento cards.',
      icon: Layers,
      fields: [
        { key: 'features_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Core Feature' },
        { key: 'features_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Innovative features for modern digital solutions' },
        { key: 'features_desc', label: 'Section Description', type: 'textarea', placeholder: 'Everything you need to outperform...' },
        { key: 'feat1_title', label: 'Feature 1 Title', type: 'text', placeholder: 'e.g. Data-Driven Strategy' },
        { key: 'feat1_desc', label: 'Feature 1 Description', type: 'textarea', placeholder: 'Smart strategies powered by data...' },
        { key: 'feat2_title', label: 'Feature 2 Title', type: 'text', placeholder: 'e.g. Social Media Growth' },
        { key: 'feat2_desc', label: 'Feature 2 Description', type: 'textarea', placeholder: 'Scalable campaigns designed to engage...' },
        { key: 'feat3_title', label: 'Feature 3 Title', type: 'text', placeholder: 'e.g. Search Optimization' },
        { key: 'feat3_desc', label: 'Feature 3 Description', type: 'textarea', placeholder: 'Dominant organic search rankings...' },
        { key: 'feat4_title', label: 'Feature 4 Title', type: 'text', placeholder: 'e.g. Paid Advertising' },
        { key: 'feat4_desc', label: 'Feature 4 Description', type: 'textarea', placeholder: 'High-ROI PPC campaigns...' },
        { key: 'feat5_title', label: 'Feature 5 Title', type: 'text', placeholder: 'e.g. Brand Strategy' },
        { key: 'feat5_desc', label: 'Feature 5 Description', type: 'textarea', placeholder: 'Distinctive corporate visual identities...' },
        { key: 'feat6_title', label: 'Feature 6 Title', type: 'text', placeholder: 'e.g. Custom Digital Solutions' },
        { key: 'feat6_desc', label: 'Feature 6 Description', type: 'textarea', placeholder: 'Full-stack web applications...' },
      ]
    },
    {
      id: 'portfolio',
      title: '6. Featured Works / Case Studies',
      description: 'Featured works and case studies overview on the homepage.',
      icon: FolderGit2,
      fields: [
        { key: 'portfolio_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Our Featured Works' },
        { key: 'portfolio_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Turn ideas into powerful digital experience' },
        { key: 'portfolio_desc', label: 'Section Description', type: 'textarea', placeholder: 'Highlight recent project achievements...' },
        { key: 'portfolio_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. View Projects' },
        { key: 'portfolio_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /portfolio' },
      ]
    },
    {
      id: 'process',
      title: '7. How It Works (Simple 3-Step Process)',
      description: 'Streamlined 3-step workflow with feature image and action button.',
      icon: ListOrdered,
      fields: [
        { key: 'process_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. How It Work' },
        { key: 'process_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Simple process that drives real business results' },
        { key: 'process_desc', label: 'Section Description', type: 'textarea', placeholder: 'Our streamlined process is designed...' },
        { key: 'process_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Get Started Now' },
        { key: 'process_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /request-service' },
        { key: 'step1_num', label: 'Step 1 Number', type: 'text', placeholder: 'e.g. Step - 01' },
        { key: 'step1_title', label: 'Step 1 Title', type: 'text', placeholder: 'e.g. Discovery & Strategy' },
        { key: 'step1_desc', label: 'Step 1 Description', type: 'textarea', placeholder: 'We carefully analyze your goals...' },
        { key: 'step2_num', label: 'Step 2 Number', type: 'text', placeholder: 'e.g. Step - 02' },
        { key: 'step2_title', label: 'Step 2 Title', type: 'text', placeholder: 'e.g. Design & Development' },
        { key: 'step2_desc', label: 'Step 2 Description', type: 'textarea', placeholder: 'Our specialists build bespoke platforms...' },
        { key: 'step3_num', label: 'Step 3 Number', type: 'text', placeholder: 'e.g. Step - 03' },
        { key: 'step3_title', label: 'Step 3 Title', type: 'text', placeholder: 'e.g. Support & Growth' },
        { key: 'step3_desc', label: 'Step 3 Description', type: 'textarea', placeholder: 'Continuous performance monitoring...' },
        { key: 'process_image', label: 'Feature Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
      ]
    },
    {
      id: 'pricing',
      title: '8. Pricing Plans Section',
      description: '3 tiered pricing plans (Basic, Standard [Popular lime], Premium).',
      icon: BarChart3,
      fields: [
        { key: 'pricing_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Our Pricing Plan' },
        { key: 'pricing_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Choose the right plan for you' },
        { key: 'pricing_desc', label: 'Section Description', type: 'textarea', placeholder: 'Explore flexible pricing options...' },
        { key: 'plan1_name', label: 'Plan 1 Name', type: 'text', placeholder: 'e.g. Basic Plan' },
        { key: 'plan1_price', label: 'Plan 1 Price (USD)', type: 'text', placeholder: 'e.g. 29.00' },
        { key: 'plan1_desc', label: 'Plan 1 Description', type: 'textarea', placeholder: 'Ideal for growing businesses...' },
        { key: 'plan1_features', label: 'Plan 1 Features (1 per line)', type: 'textarea', placeholder: 'Feature 1\nFeature 2...' },
        { key: 'plan2_name', label: 'Plan 2 Name', type: 'text', placeholder: 'e.g. Standard Plan' },
        { key: 'plan2_price', label: 'Plan 2 Price (USD)', type: 'text', placeholder: 'e.g. 49.00' },
        { key: 'plan2_badge', label: 'Plan 2 Highlight Badge', type: 'text', placeholder: 'e.g. Popular Choice' },
        { key: 'plan2_desc', label: 'Plan 2 Description', type: 'textarea', placeholder: 'Best value for scaling businesses...' },
        { key: 'plan2_features', label: 'Plan 2 Features (1 per line)', type: 'textarea', placeholder: 'Feature 1\nFeature 2...' },
        { key: 'plan3_name', label: 'Plan 3 Name', type: 'text', placeholder: 'e.g. Premium Plan' },
        { key: 'plan3_price', label: 'Plan 3 Price (USD)', type: 'text', placeholder: 'e.g. 99.00' },
        { key: 'plan3_desc', label: 'Plan 3 Description', type: 'textarea', placeholder: 'Enterprise level digital transformation...' },
        { key: 'plan3_features', label: 'Plan 3 Features (1 per line)', type: 'textarea', placeholder: 'Feature 1\nFeature 2...' },
      ]
    },
    {
      id: 'awards',
      title: '9. Winning Awards & Recognition',
      description: 'Awards stats box (50+ awards) and recognition cards.',
      icon: Sparkles,
      fields: [
        { key: 'awards_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Winning Awards' },
        { key: 'awards_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Honored for excellence in digital innovation' },
        { key: 'awards_desc', label: 'Section Description', type: 'textarea', placeholder: 'We take pride in being recognized...' },
        { key: 'awards_count', label: 'Awards Counter Value', type: 'text', placeholder: 'e.g. 50+' },
        { key: 'awards_count_text', label: 'Awards Counter Subtitle', type: 'text', placeholder: 'e.g. We have won 50+ awards believe in quality.' },
        { key: 'award1_title', label: 'Award 1 Title', type: 'text', placeholder: 'e.g. Google Premier Partner' },
        { key: 'award1_desc', label: 'Award 1 Description', type: 'text', placeholder: 'e.g. 3x Highlight of the day' },
        { key: 'award1_year', label: 'Award 1 Year', type: 'text', placeholder: 'e.g. 2023' },
        { key: 'award2_title', label: 'Award 2 Title', type: 'text', placeholder: 'e.g. Dribbble Design Award' },
        { key: 'award2_desc', label: 'Award 2 Description', type: 'text', placeholder: 'e.g. Best Agency Interface of the Year' },
        { key: 'award2_year', label: 'Award 2 Year', type: 'text', placeholder: 'e.g. 2024' },
        { key: 'award3_title', label: 'Award 3 Title', type: 'text', placeholder: 'e.g. Clutch Global Leader' },
        { key: 'award3_desc', label: 'Award 3 Description', type: 'text', placeholder: 'e.g. Top Web & Digital Agency Winner' },
        { key: 'award3_year', label: 'Award 3 Year', type: 'text', placeholder: 'e.g. 2025' },
      ]
    },
    {
      id: 'faq',
      title: '10. FAQ Accordion & Trust Score',
      description: 'Frequently asked questions and trust score review badge.',
      icon: HelpCircle,
      fields: [
        { key: 'faq_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Frequently Asked Questions.' },
        { key: 'faq_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Find answers to common questions here' },
        { key: 'faq_desc', label: 'Section Description', type: 'textarea', placeholder: 'Explore clear and helpful answers...' },
        { key: 'faq_trust_score', label: 'Trust Rating Score', type: 'text', placeholder: 'e.g. 5.0/5' },
        { key: 'faq_trust_label', label: 'Trust Rating Label', type: 'text', placeholder: 'e.g. Rated 5.0 Stars on Google Reviews' },
      ]
    },
    {
      id: 'testimonials',
      title: '11. Client Testimonials',
      description: 'Customer feedback and proof section headers.',
      icon: MessageSquare,
      fields: [
        { key: 'testimonials_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Our Testimonials' },
        { key: 'testimonials_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Hear from our happy clients' },
        { key: 'testimonials_desc', label: 'Section Description', type: 'textarea', placeholder: 'Discover what our clients have to say...' },
      ]
    },
    {
      id: 'blogs',
      title: '12. Latest Blogs & Insights',
      description: 'Blog insights section heading, badge, and view all link.',
      icon: FileText,
      fields: [
        { key: 'blogs_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Latest Blogs' },
        { key: 'blogs_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Insights tips & trends from the world of marketing' },
        { key: 'blogs_desc', label: 'Section Description', type: 'textarea', placeholder: 'Stay informed with valuable insights...' },
        { key: 'blogs_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. View All Blogs' },
        { key: 'blogs_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /portfolio' },
      ]
    },
    {
      id: 'contact_cta',
      title: '13. Bottom Digital Growth CTA & Contact',
      description: 'Closing call to action encouraging clients to get in touch.',
      icon: Phone,
      fields: [
        { key: 'cta_badge', label: 'Section Badge', type: 'text', placeholder: "e.g. Let's start digital growth" },
        { key: 'cta_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Ready to transform your brand into a digital powerhouse?' },
        { key: 'cta_desc', label: 'Description Text', type: 'textarea', placeholder: 'Schedule a free strategy session...' },
        { key: 'phone_number', label: 'Direct Phone Number', type: 'text', placeholder: 'e.g. 0313-9023118' },
        { key: 'email_address', label: 'Direct Email Address', type: 'text', placeholder: 'e.g. techhfnm@gmail.com' },
        { key: 'location_address', label: 'Company Location', type: 'text', placeholder: 'e.g. Karachi, Pakistan' },
      ]
    }
  ],

  'page-about': [
    {
      id: 'about_hero',
      title: 'Hero Section & Trust Bar',
      description: 'About page top fold with main headline, lead text, CTA buttons, and quick proof metrics.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge / Tagline', type: 'text', placeholder: 'e.g. ABOUT TECHFNM' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Digital Agency Where Strategy, Design, and Performance Work Together' },
        { key: 'hero_desc', label: 'Lead Paragraph', type: 'textarea', placeholder: 'We engineer high-performance web applications, mobile platforms, and digital engines...' },
        { key: 'hero_cta1_text', label: 'Primary Button Text', type: 'text', placeholder: 'e.g. Start Your Project' },
        { key: 'hero_cta1_link', label: 'Primary Button Link', type: 'url', placeholder: 'e.g. /request-service' },
        { key: 'hero_cta2_text', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Explore Our Work' },
        { key: 'hero_cta2_link', label: 'Secondary Button Link', type: 'url', placeholder: 'e.g. /portfolio' },
        { key: 'hero_stat1_num', label: 'Trust Metric 1 Value', type: 'text', placeholder: 'e.g. 3,000+' },
        { key: 'hero_stat1_lbl', label: 'Trust Metric 1 Label', type: 'text', placeholder: 'e.g. Businesses Served' },
        { key: 'hero_stat2_num', label: 'Trust Metric 2 Value', type: 'text', placeholder: 'e.g. 5.0/5' },
        { key: 'hero_stat2_lbl', label: 'Trust Metric 2 Label', type: 'text', placeholder: 'e.g. Google Client Rating' },
        { key: 'hero_stat3_num', label: 'Trust Metric 3 Value', type: 'text', placeholder: 'e.g. 2023' },
        { key: 'hero_stat3_lbl', label: 'Trust Metric 3 Label', type: 'text', placeholder: 'e.g. Founded & Scaling' },
        { key: 'hero_image', label: 'Hero Visual Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
      ]
    },
    {
      id: 'about_metrics',
      title: 'High-Impact Metric Grid (5 Stats)',
      description: '5 milestone statistics displayed in the dark glass ribbon.',
      icon: BarChart3,
      fields: [
        { key: 'stat1_val', label: 'Stat 1 Value', type: 'text', placeholder: 'e.g. 3,000+' },
        { key: 'stat1_lbl', label: 'Stat 1 Label', type: 'text', placeholder: 'e.g. Businesses Served' },
        { key: 'stat2_val', label: 'Stat 2 Value', type: 'text', placeholder: 'e.g. 50+' },
        { key: 'stat2_lbl', label: 'Stat 2 Label', type: 'text', placeholder: 'e.g. Industries Worked With' },
        { key: 'stat3_val', label: 'Stat 3 Value', type: 'text', placeholder: 'e.g. 2023' },
        { key: 'stat3_lbl', label: 'Stat 3 Label', type: 'text', placeholder: 'e.g. Established Since' },
        { key: 'stat4_val', label: 'Stat 4 Value', type: 'text', placeholder: 'e.g. 5.0' },
        { key: 'stat4_lbl', label: 'Stat 4 Label', type: 'text', placeholder: 'e.g. Google Rating Score' },
        { key: 'stat5_val', label: 'Stat 5 Value', type: 'text', placeholder: 'e.g. 95%' },
        { key: 'stat5_lbl', label: 'Stat 5 Label', type: 'text', placeholder: 'e.g. Client Retention Rate' },
      ]
    },
    {
      id: 'about_story',
      title: 'Who We Are & Culture',
      description: 'Founding story, brand mission, and 3 strategic core pillars.',
      icon: User,
      fields: [
        { key: 'story_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. WHO WE ARE' },
        { key: 'story_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g. The People Behind Every Pixel and Profitable Click' },
        { key: 'story_p1', label: 'Story Paragraph 1', type: 'textarea', placeholder: 'We are a specialized digital agency where strategy, design, and engineering converge...' },
        { key: 'story_p2', label: 'Story Paragraph 2', type: 'textarea', placeholder: 'Unlike traditional agencies that hand clients off to junior coordinators...' },
        { key: 'pill1_title', label: 'Pillar 1 Title', type: 'text', placeholder: 'e.g. Strategy-First' },
        { key: 'pill1_desc', label: 'Pillar 1 Description', type: 'textarea', placeholder: 'e.g. We do not touch a pixel before thoroughly analyzing your revenue model and growth targets.' },
        { key: 'pill2_title', label: 'Pillar 2 Title', type: 'text', placeholder: 'e.g. Conversion-Focused' },
        { key: 'pill2_desc', label: 'Pillar 2 Description', type: 'textarea', placeholder: 'e.g. Every design element and line of code is structured to turn casual visitors into paying clients.' },
        { key: 'pill3_title', label: 'Pillar 3 Title', type: 'text', placeholder: 'e.g. Long-Term Partner' },
        { key: 'pill3_desc', label: 'Pillar 3 Description', type: 'textarea', placeholder: 'e.g. We act as your extended technology arm, consistently optimizing as your business scales.' },
        { key: 'story_image', label: 'Story Feature Image URL', type: 'image', placeholder: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' },
        { key: 'story_exp_years', label: 'Experience Years Badge', type: 'text', placeholder: 'e.g. 5+' },
        { key: 'story_exp_text', label: 'Experience Badge Label', type: 'text', placeholder: 'e.g. Years Delivering Digital Excellence' },
      ]
    },
    {
      id: 'about_mission',
      title: 'Mission & Vision',
      description: 'Dual interactive cards highlighting our purpose and global trajectory.',
      icon: Layers,
      fields: [
        { key: 'mission_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. PURPOSE & DIRECTION' },
        { key: 'mission_title', label: 'Mission Title', type: 'text', placeholder: 'e.g. Our Mission' },
        { key: 'mission_text', label: 'Mission Statement', type: 'textarea', placeholder: 'To eliminate the guesswork in digital growth by providing high-performance software...' },
        { key: 'vision_title', label: 'Vision Title', type: 'text', placeholder: 'e.g. Our Vision' },
        { key: 'vision_text', label: 'Vision Statement', type: 'textarea', placeholder: 'To become the premier engineering partner for modern enterprises worldwide...' },
      ]
    },
    {
      id: 'about_process',
      title: 'Our 4-Step Growth Process',
      description: 'The exact step-by-step engineering roadmap that turns ideas into profitable assets.',
      icon: ListOrdered,
      fields: [
        { key: 'process_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. THE PROCESS' },
        { key: 'process_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g. How We Turn Your Idea Into Real, Measurable Growth' },
        { key: 'process_desc', label: 'Process Description', type: 'textarea', placeholder: 'A battle-tested 4-step framework engineered for zero wasted budget and maximum speed to market.' },
        { key: 'step1_title', label: 'Step 1 Title', type: 'text', placeholder: 'e.g. Deep Discovery & Technical Audit' },
        { key: 'step1_desc', label: 'Step 1 Description', type: 'textarea', placeholder: 'We dissect your business model, competitors, and revenue goals to uncover high-impact opportunities.' },
        { key: 'step2_title', label: 'Step 2 Title', type: 'text', placeholder: 'e.g. Strategic Roadmap & Architecture' },
        { key: 'step2_desc', label: 'Step 2 Description', type: 'textarea', placeholder: 'We architect modern wireframes, database schemas, and conversion pathways before writing a single line of code.' },
        { key: 'step3_title', label: 'Step 3 Title', type: 'text', placeholder: 'e.g. Precision Engineering & Agile Build' },
        { key: 'step3_desc', label: 'Step 3 Description', type: 'textarea', placeholder: 'Senior engineers build your solution using modern frameworks with zero bloat and clean, scalable code.' },
        { key: 'step4_title', label: 'Step 4 Title', type: 'text', placeholder: 'e.g. Launch, Scale & Continuous Optimization' },
        { key: 'step4_desc', label: 'Step 4 Description', type: 'textarea', placeholder: 'We execute zero-downtime deployment, SEO sitemap indexing, and telemetry tracking for compounding ROI.' },
      ]
    },
    {
      id: 'about_industries',
      title: 'Industries We Serve',
      description: 'Domain expertise header and description for the industry vertical cards.',
      icon: Briefcase,
      fields: [
        { key: 'ind_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. INDUSTRIES WE SERVE' },
        { key: 'ind_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g. Tailored Solutions for Every High-Growth Industry' },
        { key: 'ind_desc', label: 'Section Description', type: 'textarea', placeholder: 'We bring deep domain-specific knowledge to your project, understanding exactly what converts in your market.' },
      ]
    },
    {
      id: 'about_why_us',
      title: 'Why Businesses Choose Us',
      description: 'Key agency differentiators and verified founder/client quote card.',
      icon: CheckCircle2,
      fields: [
        { key: 'why_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. WHY TECHFNM' },
        { key: 'why_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Why Ambitious Brands Partner With TechFNM' },
        { key: 'diff1_title', label: 'Differentiator 1 Title', type: 'text', placeholder: 'e.g. Direct Founder & Engineer Access' },
        { key: 'diff1_desc', label: 'Differentiator 1 Description', type: 'textarea', placeholder: 'No account managers or junior liaisons. You speak directly to the technical architects building your product.' },
        { key: 'diff2_title', label: 'Differentiator 2 Title', type: 'text', placeholder: 'e.g. Transparent Milestones & No BS' },
        { key: 'diff2_desc', label: 'Differentiator 2 Description', type: 'textarea', placeholder: 'Clear bi-weekly deliverables, real-time code visibility, and accurate timelines with zero excuses.' },
        { key: 'diff3_title', label: 'Differentiator 3 Title', type: 'text', placeholder: 'e.g. Modern Architecture & Fast Stacks' },
        { key: 'diff3_desc', label: 'Differentiator 3 Description', type: 'textarea', placeholder: 'We build with React, Next.js, and cloud backends—giving you unmatched speed, security, and scalability.' },
        { key: 'diff4_title', label: 'Differentiator 4 Title', type: 'text', placeholder: 'e.g. 100% Code & Asset Ownership' },
        { key: 'diff4_desc', label: 'Differentiator 4 Description', type: 'textarea', placeholder: 'You retain complete ownership of all repositories, domains, designs, and credentials from day one.' },
        { key: 'diff_quote_text', label: 'Featured Client Quote', type: 'textarea', placeholder: 'TechFNM completely transformed our digital presence. Inbound leads increased by over 300% in 90 days.' },
        { key: 'diff_quote_author', label: 'Quote Author Name', type: 'text', placeholder: 'e.g. Alex Morgan' },
        { key: 'diff_quote_company', label: 'Quote Author Title & Company', type: 'text', placeholder: 'e.g. CEO, Apex Ventures' },
      ]
    },
    {
      id: 'about_founder',
      title: 'Leadership & Founder Spotlight',
      description: 'Personal note from leadership highlighting technical integrity and commitment.',
      icon: User,
      fields: [
        { key: 'founder_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. LEADERSHIP' },
        { key: 'founder_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g. A Message From Our Leadership' },
        { key: 'founder_name', label: 'Leader Name', type: 'text', placeholder: 'e.g. Naeem Haider' },
        { key: 'founder_role', label: 'Leader Title', type: 'text', placeholder: 'e.g. Founder & Lead Technical Architect' },
        { key: 'founder_quote', label: 'Founder Statement / Letter', type: 'textarea', placeholder: 'We started TechFNM with a simple belief: businesses deserve digital partners who understand real engineering...' },
        { key: 'founder_image', label: 'Leader Portrait URL', type: 'image', placeholder: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
      ]
    },
    {
      id: 'about_cta',
      title: 'Closing Project CTA Banner',
      description: 'Bottom consultation card prompting visitors to schedule a strategy call.',
      icon: Phone,
      fields: [
        { key: 'cta_badge', label: 'Banner Badge', type: 'text', placeholder: 'e.g. LET\'S BUILD SOMETHING EXTRAORDINARY' },
        { key: 'cta_heading', label: 'Banner Heading', type: 'text', placeholder: 'e.g. Ready to Scale Your Business With a Proven Digital Partner?' },
        { key: 'cta_desc', label: 'Banner Description', type: 'textarea', placeholder: 'Book a complimentary 30-minute discovery consultation. We\'ll analyze your digital footprint and present a custom growth blueprint.' },
        { key: 'cta_btn1_text', label: 'Primary Button Text', type: 'text', placeholder: 'e.g. Start Your Project' },
        { key: 'cta_btn1_link', label: 'Primary Button Link', type: 'url', placeholder: 'e.g. /request-service' },
        { key: 'cta_btn2_text', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Contact Our Team' },
        { key: 'cta_btn2_link', label: 'Secondary Button Link', type: 'url', placeholder: 'e.g. /contact' },
      ]
    }
  ],

  'page-services': [
    {
      id: 'services_hero',
      title: 'Hero Section',
      description: 'Services page banner heading and primary call-to-action.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge', type: 'text', placeholder: 'e.g. What We Offer' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Comprehensive Digital Solutions' },
        { key: 'hero_desc', label: 'Paragraph Description', type: 'textarea', placeholder: 'From concept to deployment, we build high-impact web and mobile solutions...' },
        { key: 'hero_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Request a Consultation' },
        { key: 'hero_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /request-service' },
      ]
    },
    {
      id: 'services_process',
      title: '4-Stage Delivery Process',
      description: 'Step-by-step engineering roadmap shown on the services page.',
      icon: ListOrdered,
      fields: [
        { key: 'process_heading', label: 'Process Heading', type: 'text', placeholder: 'e.g. Our 4-Stage Delivery Framework' },
        { key: 'step1_title', label: 'Step 1 Title', type: 'text', placeholder: 'e.g. 1. Discovery & Technical Scope' },
        { key: 'step1_desc', label: 'Step 1 Details', type: 'textarea', placeholder: 'Deep dive into business metrics...' },
        { key: 'step2_title', label: 'Step 2 Title', type: 'text', placeholder: 'e.g. 2. UI/UX Architecture' },
        { key: 'step2_desc', label: 'Step 2 Details', type: 'textarea', placeholder: 'High-converting interactive wireframes...' },
        { key: 'step3_title', label: 'Step 3 Title', type: 'text', placeholder: 'e.g. 3. Full-Stack Engineering' },
        { key: 'step3_desc', label: 'Step 3 Details', type: 'textarea', placeholder: 'Production-ready code with CI/CD pipelines...' },
        { key: 'step4_title', label: 'Step 4 Title', type: 'text', placeholder: 'e.g. 4. Launch & Continuous Growth' },
        { key: 'step4_desc', label: 'Step 4 Details', type: 'textarea', placeholder: 'Deployment, sitemap indexing, and analytics...' },
      ]
    },
    {
      id: 'services_cta',
      title: 'Bottom CTA Banner',
      description: 'Action card prompting visitors to request a free project estimate.',
      icon: Phone,
      fields: [
        { key: 'cta_heading', label: 'Banner Heading', type: 'text', placeholder: 'e.g. Ready to Build Something Amazing?' },
        { key: 'cta_desc', label: 'Banner Description', type: 'textarea', placeholder: 'Let\'s turn your vision into a production-grade software asset.' },
        { key: 'cta_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Start Free Estimate' },
        { key: 'cta_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /request-service' },
      ]
    }
  ],

  'page-portfolio': [
    {
      id: 'portfolio_hero',
      title: 'Hero Section',
      description: 'Portfolio page banner with subtitle and direct quote CTA.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge', type: 'text', placeholder: 'e.g. Featured Works' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Showcasing Digital Excellence' },
        { key: 'hero_desc', label: 'Description', type: 'textarea', placeholder: 'Explore our collection of successful client projects and case studies.' },
        { key: 'hero_btn_text', label: 'CTA Button Text', type: 'text', placeholder: 'e.g. Request Similar Project' },
        { key: 'hero_btn_link', label: 'CTA Button Link', type: 'url', placeholder: 'e.g. /request-service' },
      ]
    },
    {
      id: 'portfolio_categories',
      title: 'Category Filter Bar',
      description: 'Available category filter tags for project filtering.',
      icon: Layers,
      fields: [
        { key: 'categories_heading', label: 'Filter Label', type: 'text', placeholder: 'e.g. Browse by Discipline' },
        { key: 'categories_list', label: 'Categories (comma separated)', type: 'text', placeholder: 'All, Web Development, Mobile App, UI/UX Design, Digital Marketing' },
      ]
    },
    {
      id: 'portfolio_cta',
      title: 'Bottom Consultation Banner',
      description: 'Closing call to action on the portfolio page.',
      icon: Phone,
      fields: [
        { key: 'cta_heading', label: 'Banner Heading', type: 'text', placeholder: 'e.g. Have a Unique Vision in Mind?' },
        { key: 'cta_desc', label: 'Banner Description', type: 'textarea', placeholder: 'We can design, engineer, and deploy your custom project in record time.' },
        { key: 'cta_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Start Your Project' },
        { key: 'cta_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /contact' },
      ]
    }
  ],

  'page-contact': [
    {
      id: 'contact_hero',
      title: 'Hero Section',
      description: 'Contact header, tagline, and introductory copy.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge', type: 'text', placeholder: 'e.g. Get In Touch' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Let\'s Build Something Great Together' },
        { key: 'hero_desc', label: 'Description', type: 'textarea', placeholder: 'Have a project idea, question, or need a technical consultation? We are here to help.' },
      ]
    },
    {
      id: 'contact_cards',
      title: 'Direct Contact Details',
      description: 'Office address, direct email, phone number, and response guarantee.',
      icon: MapPin,
      fields: [
        { key: 'office_address', label: 'Office Address', type: 'text', placeholder: 'e.g. Lahore, Pakistan / Remote Global Delivery' },
        { key: 'official_email', label: 'Official Contact Email', type: 'text', placeholder: 'e.g. naeemhaiderf73@gmail.com' },
        { key: 'official_phone', label: 'Phone / WhatsApp Number', type: 'text', placeholder: 'e.g. +92 313 9023118' },
        { key: 'response_sla', label: 'Response Guarantee SLA', type: 'text', placeholder: 'e.g. Guaranteed reply within 24 business hours' },
      ]
    },
    {
      id: 'contact_form',
      title: 'Message Form Copy',
      description: 'Headings and button text for the direct contact form.',
      icon: Mail,
      fields: [
        { key: 'form_heading', label: 'Form Heading', type: 'text', placeholder: 'e.g. Send Us a Direct Message' },
        { key: 'form_desc', label: 'Form Description', type: 'textarea', placeholder: 'Fill in your project details and our team will get back to you promptly.' },
        { key: 'form_submit_text', label: 'Submit Button Text', type: 'text', placeholder: 'e.g. Send Message' },
      ]
    },
    {
      id: 'contact_socials',
      title: 'Social Channels',
      description: 'URLs for company social profiles displayed on the contact page.',
      icon: Share2,
      fields: [
        { key: 'facebook_url', label: 'Facebook URL', type: 'url', placeholder: 'https://facebook.com/...' },
        { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/company/...' },
        { key: 'instagram_url', label: 'Instagram URL', type: 'url', placeholder: 'https://instagram.com/...' },
        { key: 'youtube_url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/@...' },
        { key: 'github_url', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...' },
      ]
    }
  ],

  'page-faq': [
    {
      id: 'faq_hero',
      title: 'Hero Section',
      description: 'FAQ banner title, badge, and intro text.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge', type: 'text', placeholder: 'e.g. Support Center' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Frequently Asked Questions' },
        { key: 'hero_desc', label: 'Description', type: 'textarea', placeholder: 'Everything you need to know about working with TechFNM, our pricing, and delivery timelines.' },
      ]
    },
    {
      id: 'faq_search',
      title: 'Search Box Settings',
      description: 'Placeholder and filter settings for the questions search box.',
      icon: Search,
      fields: [
        { key: 'search_placeholder', label: 'Search Input Placeholder', type: 'text', placeholder: 'e.g. Search frequently asked questions...' },
      ]
    },
    {
      id: 'faq_cta',
      title: 'Still Have Questions Banner',
      description: 'Direct contact fallback prompt shown below the FAQ list.',
      icon: Phone,
      fields: [
        { key: 'cta_heading', label: 'Banner Heading', type: 'text', placeholder: 'e.g. Still Have Questions?' },
        { key: 'cta_desc', label: 'Banner Description', type: 'textarea', placeholder: 'Can\'t find the answer you\'re looking for? Speak directly to our technical team.' },
        { key: 'cta_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Talk to Our Engineers' },
        { key: 'cta_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /contact' },
      ]
    }
  ],

  'page-request-service': [
    {
      id: 'request_hero',
      title: 'Hero Section',
      description: 'Project request page headline and estimate expectations.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge', type: 'text', placeholder: 'e.g. Start A Project' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Request a Custom Quote' },
        { key: 'hero_desc', label: 'Description', type: 'textarea', placeholder: 'Tell us about your requirements, target timeline, and budget. We\'ll formulate a strategic plan.' },
      ]
    },
    {
      id: 'request_form',
      title: 'Form Step Labels & Guarantees',
      description: 'Labels for the multi-step project request form.',
      icon: FileText,
      fields: [
        { key: 'step1_title', label: 'Step 1 Title', type: 'text', placeholder: 'e.g. 1. Personal & Business Information' },
        { key: 'step2_title', label: 'Step 2 Title', type: 'text', placeholder: 'e.g. 2. Select Service & Project Scope' },
        { key: 'submit_btn_text', label: 'Submit Button Text', type: 'text', placeholder: 'e.g. Submit Consultation Request' },
        { key: 'guarantee_text', label: 'Privacy & NDA Note', type: 'text', placeholder: 'e.g. 100% Confidential. Protected under NDA.' },
      ]
    }
  ]
};

const GENERIC_CUSTOM_SECTIONS: PageSectionConfig[] = [
  {
    id: 'custom_hero',
    title: 'Hero Section',
    description: 'Top banner fold with title, subtitle, CTA button and image.',
    icon: Sparkles,
    fields: [
      { key: 'hero_badge', label: 'Badge / Tagline', type: 'text', placeholder: 'e.g. Overview' },
      { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. Page Title' },
      { key: 'hero_desc', label: 'Paragraph Description', type: 'textarea', placeholder: 'Introduction to this page...' },
      { key: 'hero_cta_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Get Started' },
      { key: 'hero_cta_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /contact' },
      { key: 'hero_image', label: 'Banner Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
    ]
  },
  {
    id: 'custom_cta',
    title: 'Call to Action Section',
    description: 'Closing call to action banner for this page.',
    icon: Phone,
    fields: [
      { key: 'cta_heading', label: 'CTA Heading', type: 'text', placeholder: 'e.g. Ready to Work with Us?' },
      { key: 'cta_desc', label: 'CTA Description', type: 'textarea', placeholder: 'Prompt the visitor to take action...' },
      { key: 'cta_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Contact Our Team' },
      { key: 'cta_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /contact' },
    ]
  }
];

const DEFAULT_PAGES: PageItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    slug: '/',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: true,
    content: 'Crafting premium web applications, branding, and conversion flows.',
    template: 'Front Page',
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    sectionsData: {
      hero_badge: 'Your Digital Growth Experts',
      hero_title: 'Growth Focused Digital Agency Solutions',
      hero_highlight_word: 'Digital',
      hero_desc: "We deliver data-driven digital strategies designed to accelerate your brand's growth. From marketing to creative execution, our solutions are built to maximize reach, and measurable results.",
      hero_cta1_text: 'Get Free Quote',
      hero_cta1_link: '/request-service',
      hero_cta2_text: 'Our Services',
      hero_cta2_link: '#services',
      hero_stat1_num: '95%',
      hero_stat1_lbl: 'Client Satisfaction Rate',
      hero_stat2_num: '50%',
      hero_stat2_lbl: 'Influencer collaboration',
      hero_stat3_num: '250+',
      hero_stat3_lbl: 'Projects Completed',

      clients_badge: 'Trusted By 200+ Global Brands & Visionary Startups',

      about_badge: 'About Our Agency',
      about_heading: 'We deliver result through digital innovation',
      about_desc: 'We combine creative thinking with cutting-edge technology to deliver innovative digital solutions that drive real, measurable results for your business.',
      about_founder_name: 'Muhammad Naeem',
      about_founder_role: 'Founder & CEO',
      about_founder_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      about_mission_title: 'Our Mission',
      about_mission_desc: 'Our mission is to empower brands with innovative digital solutions that drive growth, enhance visibility, and deliver measurable return on investment.',
      about_vision_title: 'Our Vision',
      about_vision_desc: 'To be a world-class digital agency transforming complex challenges into effortless growth platforms for visionary enterprises.',
      about_goals_title: 'Our Goals',
      about_goals_desc: 'Deliver state-of-the-art software, nurture long-term partnerships, and consistently exceed conversion expectations.',
      about_btn_text: 'More About Us',
      about_btn_link: '/about',
      about_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',

      services_badge: 'Our Services',
      services_heading: 'Digital services designed for your growth',
      services_desc: 'We design and deliver digital solutions that align with your business helping you reach the right audience, scale effectively.',
      services_btn_text: 'View All Services',
      services_btn_link: '/services',

      features_badge: 'Core Feature',
      features_heading: 'Innovative features for modern digital solutions',
      features_desc: 'Everything you need to outperform your competitors with precision engineering and high-conversion creative strategy.',
      feat1_title: 'Data-Driven Strategy',
      feat1_desc: 'Smart strategies powered by data to drive better results and continuous growth.',
      feat2_title: 'Social Media Growth',
      feat2_desc: 'Scalable campaigns designed to engage target demographics and build brand loyalty.',
      feat3_title: 'Search Optimization',
      feat3_desc: 'Dominant organic search rankings engineered to convert visitors into loyal clients.',
      feat4_title: 'Paid Advertising',
      feat4_desc: 'High-ROI PPC campaigns calibrated for minimum cost per acquisition.',
      feat5_title: 'Brand Strategy',
      feat5_desc: 'Distinctive corporate visual identities that establish authority and trust.',
      feat6_title: 'Custom Digital Solutions',
      feat6_desc: 'Full-stack web applications, scalable APIs, and performance-tuned software.',

      portfolio_badge: 'Our Featured Works',
      portfolio_heading: 'Turn ideas into powerful digital experience',
      portfolio_desc: 'We combine creativity, technology, and strategic thinking to deliver digital solutions that help businesses grow and succeed online.',
      portfolio_btn_text: 'View Projects',
      portfolio_btn_link: '/portfolio',

      process_badge: 'How It Work',
      process_heading: 'Simple process that drives real business results',
      process_desc: 'Our streamlined process is designed to deliver clarity, efficiency helping your business grow without unnecessary complexity.',
      process_btn_text: 'Get Started Now',
      process_btn_link: '/request-service',
      step1_num: 'Step - 01',
      step1_title: 'Discovery & Strategy',
      step1_desc: 'We carefully analyze your goals, target audience, and market trends to build a clear and effective roadmap.',
      step2_num: 'Step - 02',
      step2_title: 'Design & Development',
      step2_desc: 'Our specialists build bespoke, high-converting digital platforms with meticulous attention to detail.',
      step3_num: 'Step - 03',
      step3_title: 'Support & Growth',
      step3_desc: 'Continuous performance monitoring, conversion rate optimization, and agile scaling support.',
      process_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',

      pricing_badge: 'Our Pricing Plan',
      pricing_heading: 'Choose the right plan for you',
      pricing_desc: "Explore flexible pricing options designed to suit businesses of all sizes and needs. Whether you're just starting out or looking to scale.",
      plan1_name: 'Basic Plan',
      plan1_desc: 'Ideal for growing businesses looking to expand online presence.',
      plan1_price: '29.00',
      plan1_features: 'Advanced SEO Optimization\nFull SEO & Marketing Setup\nMobile Responsive Design\n24/7 Technical Support',
      plan2_name: 'Standard Plan',
      plan2_desc: 'Best value for scaling businesses wanting aggressive online growth.',
      plan2_price: '49.00',
      plan2_badge: 'Popular Choice',
      plan2_features: 'Everything in Basic Plan\nCustom Web & Mobile Development\nMulti-Channel Social Growth\nDedicated Account Manager\nWeekly Performance Audits',
      plan3_name: 'Premium Plan',
      plan3_desc: 'Enterprise level digital transformation for market leaders.',
      plan3_price: '99.00',
      plan3_features: 'Full Suite Custom Digital Solutions\nDedicated Team of Engineers\nContinuous Conversion Optimization\nPriority 1-Hour SLA Support\nUnlimited Maintenance & Updates',

      awards_badge: 'Winning Awards',
      awards_heading: 'Honored for excellence in digital innovation',
      awards_desc: 'We take pride in being recognized for our commitment to innovation, creativity, and excellence in the digital space.',
      awards_count: '50+',
      awards_count_text: 'We have won 50+ awards believe in quality.',
      award1_title: 'Google Premier Partner',
      award1_desc: '3x Highlight of the day',
      award1_year: '2023',
      award2_title: 'Dribbble Design Award',
      award2_desc: 'Best Agency Interface of the Year',
      award2_year: '2024',
      award3_title: 'Clutch Global Leader',
      award3_desc: 'Top Web & Digital Agency Winner',
      award3_year: '2025',

      faq_badge: 'Frequently Asked Questions.',
      faq_heading: 'Find answers to common questions here',
      faq_desc: 'Explore clear and helpful answers to the most common questions about our services, process, and solutions.',
      faq_trust_score: '5.0/5',
      faq_trust_label: 'Rated 5.0 Stars on Google Reviews',

      testimonials_badge: 'Our Testimonials',
      testimonials_heading: 'Hear from our happy clients',
      testimonials_desc: 'Discover what our clients have to say about their experience working with us. From successful project outcomes to long-term partnerships.',

      blogs_badge: 'Latest Blogs',
      blogs_heading: 'Insights tips & trends from the world of marketing',
      blogs_desc: 'Stay informed with valuable insights, practical tips, and the latest trends from the ever-evolving world of marketing.',
      blogs_btn_text: 'View All Blogs',
      blogs_btn_link: '/portfolio',

      cta_badge: "Let's start digital growth",
      cta_heading: 'Ready to transform your brand into a digital powerhouse?',
      cta_desc: 'Schedule a free strategy session with our senior digital architects and discover how we can accelerate your revenue.',
      cta_btn_text: 'Start Your Project',
      cta_btn_link: '/request-service',
      phone_number: '0313-9023118',
      email_address: 'techhfnm@gmail.com',
      location_address: 'Karachi, Pakistan',
    }
  },
  {
    id: 'page-about',
    title: 'About Us',
    slug: '/about',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Full-service digital transformation consultancy delivering custom web & mobile software.',
    template: 'Default Template',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    sectionsData: {
      hero_badge: 'ABOUT TECHFNM',
      hero_title: 'Digital Agency Where Strategy, Design, and Performance Work Together',
      hero_desc: 'We don\'t just build websites or run ads — we build digital engines that turn clicks into clients, visitors into buyers, and ideas into market leaders.',
      hero_cta1_text: 'Start Your Project',
      hero_cta1_link: '/request-service',
      hero_cta2_text: 'Explore Our Work',
      hero_cta2_link: '/portfolio',
      hero_stat1_num: '3,000+',
      hero_stat1_lbl: 'Businesses Served Globally',
      hero_stat2_num: '5.0/5',
      hero_stat2_lbl: 'Google Client Rating',
      hero_stat3_num: 'Since 2023',
      hero_stat3_lbl: 'Continuous Innovation',
      hero_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',

      stat1_val: '3,000+',
      stat1_lbl: 'Businesses Served Globally',
      stat2_val: '50+',
      stat2_lbl: 'Industries Transformed',
      stat3_val: '2023',
      stat3_lbl: 'Established & Scaling',
      stat4_val: '5.0',
      stat4_lbl: 'Google Rating Score',
      stat5_val: '95%',
      stat5_lbl: 'Client Retention & Growth',

      story_badge: 'WHO WE ARE',
      story_heading: 'The People Behind Every Pixel and Profitable Click',
      story_p1: 'TechFNM is a specialized digital transformation agency where analytical strategy, luxury design, and full-stack engineering work in total harmony. We eliminate the guesswork from digital growth.',
      story_p2: 'Unlike traditional agencies that pass clients between endless account managers, at TechFNM you collaborate directly with senior designers and engineers who care deeply about your business metrics.',
      pill1_title: 'Strategy-First',
      pill1_desc: 'We don\'t touch a pixel before thoroughly understanding your revenue model and growth targets.',
      pill2_title: 'Conversion-Focused',
      pill2_desc: 'Every design choice and code architecture is engineered to convert casual visitors into high-value clients.',
      pill3_title: 'Long-Term Partner',
      pill3_desc: 'We act as your dedicated engineering arm, refining and scaling your digital assets continuously.',
      story_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      story_exp_years: '5+',
      story_exp_text: 'Years Delivering Digital Excellence',

      mission_badge: 'PURPOSE & TRAJECTORY',
      mission_title: 'Our Mission',
      mission_text: 'To eliminate the guesswork in digital growth by providing modern enterprises with high-conversion software, custom web solutions, and measurable revenue acceleration.',
      vision_title: 'Our Vision',
      vision_text: 'To be the premier engineering partner for modern digital enterprises worldwide, recognized for unrivaled technical craftsmanship and transparent execution.',

      process_badge: 'THE PROCESS',
      process_heading: 'How We Turn Your Idea Into Real, Measurable Growth',
      process_desc: 'A battle-tested 4-step framework engineered for zero wasted budget and maximum speed to market.',
      step1_title: '1. Deep Discovery & Technical Audit',
      step1_desc: 'We dissect your business model, competitors, and revenue goals to uncover high-impact growth opportunities.',
      step2_title: '2. Strategic Roadmap & Architecture',
      step2_desc: 'We architect interactive wireframes, database models, and conversion pathways before writing a single line of code.',
      step3_title: '3. Precision Engineering & Agile Build',
      step3_desc: 'Senior full-stack developers build your solution using modern frameworks with zero bloat and clean, maintainable code.',
      step4_title: '4. Launch, Scale & Continuous Optimization',
      step4_desc: 'We execute zero-downtime deployment, SEO indexing, and telemetry tracking for compounding month-over-month ROI.',

      ind_badge: 'INDUSTRIES WE SERVE',
      ind_heading: 'Tailored Solutions for Every High-Growth Industry',
      ind_desc: 'We bring deep domain-specific knowledge to your project, understanding exactly what converts in your market.',

      why_badge: 'WHY TECHFNM',
      why_heading: 'Why Ambitious Brands Partner With TechFNM',
      diff1_title: 'Direct Founder & Engineer Access',
      diff1_desc: 'No account managers or junior liaisons. You speak directly to the technical architects building your product.',
      diff2_title: 'Transparent Milestones & No BS',
      diff2_desc: 'Clear bi-weekly deliverables, real-time code visibility, and accurate timelines with zero excuses.',
      diff3_title: 'Modern Architecture & Fast Stacks',
      diff3_desc: 'We build with React, Next.js, and cloud backends—giving you unmatched speed, security, and scalability.',
      diff4_title: '100% Code & Asset Ownership',
      diff4_desc: 'You retain complete ownership of all repositories, domains, designs, and credentials from day one.',
      diff_quote_text: 'TechFNM completely transformed our digital presence. Inbound qualified leads increased by over 300% in 90 days with seamless technical execution.',
      diff_quote_author: 'Alex Morgan',
      diff_quote_company: 'Managing Partner, Apex Ventures',

      founder_badge: 'LEADERSHIP',
      founder_heading: 'A Message From Our Leadership',
      founder_name: 'Naeem Haider',
      founder_role: 'Founder & Lead Technical Architect',
      founder_quote: 'We started TechFNM with a simple belief: businesses deserve digital partners who understand real engineering and business economics, not just pretty colors. We build tools that generate actual profit.',
      founder_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',

      cta_badge: 'LET\'S BUILD SOMETHING EXTRAORDINARY',
      cta_heading: 'Ready to Scale Your Business With a Proven Digital Partner?',
      cta_desc: 'Book a complimentary 30-minute discovery consultation. We\'ll analyze your digital footprint and present a custom growth blueprint.',
      cta_btn1_text: 'Start Your Project',
      cta_btn1_link: '/request-service',
      cta_btn2_text: 'Contact Our Team',
      cta_btn2_link: '/contact'
    }
  },
  {
    id: 'page-services',
    title: 'Services Catalog',
    slug: '/services',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Enterprise software, modern web apps, full-stack architecture, and cloud solutions.',
    template: 'Default Template',
    sectionsData: {
      hero_badge: 'What We Offer',
      hero_title: 'Comprehensive Digital Solutions',
      hero_desc: 'From concept to deployment, we build high-impact web and mobile solutions designed to accelerate growth.',
      hero_btn_text: 'Request a Consultation',
      hero_btn_link: '/request-service',
      process_heading: 'Our 4-Stage Delivery Framework',
      step1_title: '1. Discovery & Technical Scope',
      step1_desc: 'Deep dive into business metrics and architecture requirements.',
      step2_title: '2. UI/UX Architecture',
      step2_desc: 'High-converting interactive wireframes and conversion flow modeling.',
      step3_title: '3. Full-Stack Engineering',
      step3_desc: 'Production-ready code with automated CI/CD and rigorous QA testing.',
      step4_title: '4. Launch & Continuous Growth',
      step4_desc: 'Zero-downtime deployment, SEO sitemap indexing, and analytics telemetry.',
      cta_heading: 'Ready to Build Something Amazing?',
      cta_desc: 'Let\'s turn your vision into a production-grade software asset.',
      cta_btn_text: 'Start Free Estimate',
      cta_btn_link: '/request-service'
    }
  },
  {
    id: 'page-portfolio',
    title: 'Portfolio Works',
    slug: '/portfolio',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Case studies, verified deliveries, and production accomplishments.',
    template: 'Default Template',
    sectionsData: {
      hero_badge: 'Featured Works',
      hero_title: 'Showcasing Digital Excellence',
      hero_desc: 'Explore our collection of successful client projects, high-yield web platforms, and mobile apps.',
      hero_btn_text: 'Request Similar Project',
      hero_btn_link: '/request-service',
      categories_heading: 'Browse by Discipline',
      categories_list: 'All, Web Development, Mobile App, UI/UX Design, Digital Marketing',
      cta_heading: 'Have a Unique Vision in Mind?',
      cta_desc: 'We can design, engineer, and deploy your custom project in record time.',
      cta_btn_text: 'Start Your Project',
      cta_btn_link: '/contact'
    }
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    slug: '/contact',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Direct consultation booking and corporate inquiries.',
    template: 'Default Template',
    sectionsData: {
      hero_badge: 'Get In Touch',
      hero_title: 'Let\'s Build Something Great Together',
      hero_desc: 'Have a project idea, question, or need a technical consultation? We are here to help.',
      office_address: 'Lahore, Pakistan / Remote Global Delivery',
      official_email: 'naeemhaiderf73@gmail.com',
      official_phone: '+92 313 9023118',
      response_sla: 'Guaranteed reply within 24 business hours',
      form_heading: 'Send Us a Direct Message',
      form_desc: 'Fill in your project details and our team will get back to you promptly.',
      form_submit_text: 'Send Message',
      facebook_url: 'https://facebook.com',
      linkedin_url: 'https://linkedin.com',
      instagram_url: 'https://instagram.com',
      youtube_url: 'https://youtube.com',
      github_url: 'https://github.com'
    }
  },
  {
    id: 'page-faq',
    title: 'Frequently Asked Questions',
    slug: '/faq',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    commentsCount: 1,
    isFrontPage: false,
    content: 'Everything clients need to know before initiating a development project.',
    template: 'Default Template',
    sectionsData: {
      hero_badge: 'Support Center',
      hero_title: 'Frequently Asked Questions',
      hero_desc: 'Everything you need to know about working with TechFNM, our pricing, and delivery timelines.',
      search_placeholder: 'Search frequently asked questions...',
      cta_heading: 'Still Have Questions?',
      cta_desc: 'Can\'t find the answer you\'re looking for? Speak directly to our technical team.',
      cta_btn_text: 'Talk to Our Engineers',
      cta_btn_link: '/contact'
    }
  },
  {
    id: 'page-request-service',
    title: 'Request a Service',
    slug: '/request-service',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Interactive estimation form for bespoke development projects.',
    template: 'Default Template',
    sectionsData: {
      hero_badge: 'Start A Project',
      hero_title: 'Request a Custom Quote',
      hero_desc: 'Tell us about your requirements, target timeline, and budget. We\'ll formulate a strategic plan.',
      step1_title: '1. Personal & Business Information',
      step2_title: '2. Select Service & Project Scope',
      submit_btn_text: 'Submit Consultation Request',
      guarantee_text: '100% Confidential. Protected under NDA.'
    }
  }
];

export default function PageManager({ forcedPageId }: { forcedPageId?: string } = {}) {
  const navigate = useNavigate();
  const { action, itemId } = useParams();

  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Table Controls
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Quick Edit State
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null);
  const [quickEditData, setQuickEditData] = useState<{
    title: string;
    slug: string;
    status: 'published' | 'draft';
    author: string;
    template: string;
  }>({
    title: '',
    slug: '',
    status: 'published',
    author: 'admin',
    template: 'Default Template'
  });

  // Full Editor State
  const [isFullEditing, setIsFullEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);
  const [editorSubTab, setEditorSubTab] = useState<'sections' | 'raw'>('sections');
  const [openSectionAccordions, setOpenSectionAccordions] = useState<Record<string, boolean>>({});

  // Screen Options & Help
  const [showScreenOptions, setShowScreenOptions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      // 1. Instant load from local cache
      const cached = localStorage.getItem('techfnm_site_pages_v2');
      if (cached) {
        try {
          setPages(JSON.parse(cached));
        } catch {}
      }

      // 2. Fetch directly from Supabase site_pages table
      const { data: dbPages } = await supabase.from('site_pages').select('*');
      if (dbPages && dbPages.length > 0) {
        const mappedPages: PageItem[] = dbPages.map((row: any) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          author: row.author || 'admin',
          status: row.status || 'published',
          date: row.updated_at || new Date().toISOString(),
          commentsCount: 0,
          isFrontPage: row.is_front_page,
          template: row.template || 'Default Template',
          featuredImage: row.featured_image || '',
          content: row.content || '',
          sectionsData: row.sections_data || {},
          seoSettings: row.seo_settings || row.sections_data?.seo_settings || {}
        }));

        // Merge defaults
        const merged = [...mappedPages];
        DEFAULT_PAGES.forEach(dp => {
          if (!merged.some(m => m.id === dp.id)) {
            merged.push(dp);
          }
        });

        setPages(merged);
        localStorage.setItem('techfnm_site_pages_v2', JSON.stringify(merged));
      } else {
        // Seed default pages to Supabase site_pages
        const seedRows = DEFAULT_PAGES.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          author: p.author,
          status: p.status,
          template: p.template || 'Default Template',
          featured_image: p.featuredImage || '',
          content: p.content || '',
          sections_data: p.sectionsData || {},
          is_front_page: p.isFrontPage || false,
          updated_at: new Date().toISOString()
        }));
        await supabase.from('site_pages').upsert(seedRows);
        setPages(DEFAULT_PAGES);
        localStorage.setItem('techfnm_site_pages_v2', JSON.stringify(DEFAULT_PAGES));
      }
    } catch (err) {
      console.error('Error loading pages from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const savePagesList = async (updated: PageItem[]) => {
    setPages(updated);
    localStorage.setItem('techfnm_site_pages_v2', JSON.stringify(updated));
    triggerContentUpdate();

    try {
      const rows = updated.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        author: p.author,
        status: p.status,
        template: p.template || 'Default Template',
        featured_image: p.featuredImage || '',
        content: p.content || '',
        sections_data: p.sectionsData || {},
        seo_settings: p.seoSettings || p.sectionsData?.seo_settings || {},
        is_front_page: p.isFrontPage || false,
        updated_at: new Date().toISOString()
      }));
      await supabase.from('site_pages').upsert(rows);
    } catch (err) {
      console.error('Error syncing pages to Supabase:', err);
    }
  };

  const counts = {
    all: pages.filter(p => p.status !== 'trash').length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
    trash: pages.filter(p => p.status === 'trash').length,
  };

  const filteredPages = pages.filter((page) => {
    if (activeTab === 'all' && page.status === 'trash') return false;
    if (activeTab === 'published' && page.status !== 'published') return false;
    if (activeTab === 'draft' && page.status !== 'draft') return false;
    if (activeTab === 'trash' && page.status !== 'trash') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = page.title.toLowerCase().includes(q);
      const matchSlug = page.slug.toLowerCase().includes(q);
      if (!matchTitle && !matchSlug) return false;
    }

    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPages.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApplyBulkAction = () => {
    if (selectedIds.length === 0) {
      toast.error('No pages selected.');
      return;
    }

    if (bulkAction === 'trash') {
      const updated = pages.map(p => selectedIds.includes(p.id) ? { ...p, status: 'trash' as const } : p);
      savePagesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} page(s) moved to Trash.`);
    } else if (bulkAction === 'restore') {
      const updated = pages.map(p => selectedIds.includes(p.id) ? { ...p, status: 'published' as const } : p);
      savePagesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} page(s) restored.`);
    } else if (bulkAction === 'delete') {
      if (!window.confirm(`Permanently delete ${selectedIds.length} page(s)?`)) return;
      const updated = pages.filter(p => !selectedIds.includes(p.id));
      savePagesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} page(s) deleted permanently.`);
    }
  };

  const handleTrashPage = (page: PageItem) => {
    if (page.status === 'trash') {
      if (!window.confirm(`Permanently delete "${page.title}"?`)) return;
      savePagesList(pages.filter(p => p.id !== page.id));
      toast.success(`"${page.title}" deleted permanently.`);
    } else {
      savePagesList(pages.map(p => p.id === page.id ? { ...p, status: 'trash' } : p));
      toast.success(`"${page.title}" moved to Trash.`);
    }
  };

  const handleRestorePage = (page: PageItem) => {
    savePagesList(pages.map(p => p.id === page.id ? { ...p, status: 'published' } : p));
    toast.success(`"${page.title}" restored.`);
  };

  const startQuickEdit = (page: PageItem) => {
    setQuickEditingId(page.id);
    setQuickEditData({
      title: page.title,
      slug: page.slug,
      status: page.status === 'trash' ? 'draft' : page.status,
      author: page.author,
      template: page.template || 'Default Template'
    });
  };

  const saveQuickEdit = () => {
    if (!quickEditingId) return;
    const updated = pages.map(p => {
      if (p.id === quickEditingId) {
        return {
          ...p,
          title: quickEditData.title,
          slug: quickEditData.slug.startsWith('/') ? quickEditData.slug : `/${quickEditData.slug}`,
          status: quickEditData.status,
          author: quickEditData.author,
          template: quickEditData.template
        };
      }
      return p;
    });
    savePagesList(updated);
    setQuickEditingId(null);
    toast.success('Page updated successfully.');
  };

  const openFullEditor = (page?: PageItem) => {
    if (page) {
      setEditingPage({
        ...page,
        sectionsData: { ...page.sectionsData },
        seoSettings: page.seoSettings || page.sectionsData?.seo_settings || {}
      });
      const pageSections = PAGE_SECTIONS_REGISTRY[page.id] || GENERIC_CUSTOM_SECTIONS;
      const initialAccordions: Record<string, boolean> = {};
      pageSections.forEach((s, idx) => {
        initialAccordions[s.id] = idx === 0;
      });
      setOpenSectionAccordions(initialAccordions);
      if (itemId !== page.id || action !== 'edit') {
        navigate(`/admin/pages/edit/${page.id}`);
      }
    } else {
      const newId = `page-${Date.now()}`;
      setEditingPage({
        id: newId,
        title: '',
        slug: '',
        author: 'admin',
        status: 'published',
        date: new Date().toISOString(),
        commentsCount: 0,
        isFrontPage: false,
        content: '',
        template: 'Default Template',
        featuredImage: '',
        sectionsData: {},
        seoSettings: {}
      });
      setOpenSectionAccordions({ custom_hero: true, custom_cta: true });
      if (action !== 'new') {
        navigate('/admin/pages/new');
      }
    }
    setEditorSubTab('sections');
    setIsFullEditing(true);
  };

  const closeFullEditor = () => {
    setIsFullEditing(false);
    setEditingPage(null);
    if (action) {
      navigate('/admin/pages');
    }
  };

  useEffect(() => {
    if (pages.length === 0) return;
    const targetId = forcedPageId || (action === 'edit' ? itemId : null);
    if (targetId) {
      const target = pages.find(p => p.id === targetId || p.slug === targetId || p.slug === `/${targetId}`);
      if (target) {
        if (!editingPage || editingPage.id !== target.id) {
          openFullEditor(target);
        }
      }
    } else if (action === 'new') {
      if (!isFullEditing) {
        openFullEditor();
      }
    } else if (!action && !forcedPageId && isFullEditing) {
      setIsFullEditing(false);
      setEditingPage(null);
    }
  }, [action, itemId, pages.length, forcedPageId]);

  const toggleAccordion = (secId: string) => {
    setOpenSectionAccordions(prev => ({
      ...prev,
      [secId]: !prev[secId]
    }));
  };

  const updateSectionFieldValue = (key: string, value: any) => {
    if (!editingPage) return;
    setEditingPage({
      ...editingPage,
      sectionsData: {
        ...editingPage.sectionsData,
        [key]: value
      }
    });
  };

  const handleFeaturedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl && editingPage) {
        setEditingPage({ ...editingPage, featuredImage: dataUrl });
        toast.success('Featured image loaded from device!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Full Editor
  const saveFullEditor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPage || !editingPage.title.trim()) {
      toast.error('Please enter a valid page title.');
      return;
    }

    const cleanSlug = editingPage.slug.trim()
      ? (editingPage.slug.startsWith('/') ? editingPage.slug : `/${editingPage.slug}`)
      : `/${editingPage.title.toLowerCase().replace(/\s+/g, '-')}`;

    const updatedPage: PageItem = {
      ...editingPage,
      slug: cleanSlug,
      date: new Date().toISOString()
    };

    const exists = pages.some(p => p.id === updatedPage.id);
    const updatedList = exists
      ? pages.map(p => p.id === updatedPage.id ? updatedPage : p)
      : [updatedPage, ...pages];

    savePagesList(updatedList);

    // Sync to Supabase pages_content
    try {
      const upserts: any[] = [];
      if (updatedPage.id === 'page-home') {
        upserts.push(
          {
            id: 'home_hero',
            section_name: 'Homepage Hero',
            content: {
              title: updatedPage.sectionsData.hero_title || 'We Build What You Imagine',
              subtitle: updatedPage.sectionsData.hero_subtitle || 'Creative Solutions',
              description: updatedPage.sectionsData.hero_desc || '',
              cta1: updatedPage.sectionsData.hero_cta1_text || 'Getting Started',
              cta2: updatedPage.sectionsData.hero_cta2_text || 'Our Services'
            }
          },
          {
            id: 'home_about',
            section_name: 'Homepage About',
            content: {
              badge: updatedPage.sectionsData.about_badge,
              heading: updatedPage.sectionsData.about_heading,
              desc1: updatedPage.sectionsData.about_desc1,
              desc2: updatedPage.sectionsData.about_desc2,
              exp_years: updatedPage.sectionsData.about_exp_years,
              exp_text: updatedPage.sectionsData.about_exp_text,
              image: updatedPage.sectionsData.about_image,
              btn_text: updatedPage.sectionsData.about_btn_text,
              btn_link: updatedPage.sectionsData.about_btn_link
            }
          },
          {
            id: 'home_faq',
            section_name: 'Homepage FAQ',
            content: {
              title: updatedPage.sectionsData.faq_heading || 'Frequently Asked Questions',
              badge_text: updatedPage.sectionsData.faq_badge || 'Support Center'
            }
          },
          {
            id: 'page_sections_home',
            section_name: 'Homepage Sections Data',
            content: updatedPage.sectionsData
          }
        );
      } else {
        upserts.push({
          id: `page_sections_${updatedPage.id.replace('page-', '')}`,
          section_name: `${updatedPage.title} Sections`,
          content: updatedPage.sectionsData
        });
      }

      if (upserts.length > 0) {
        await supabase.from('pages_content').upsert(upserts);
      }
    } catch (err) {
      // silent fallback
    }

    setEditingPage(updatedPage);
    if (action === 'new') {
      navigate(`/admin/pages/edit/${updatedPage.id}`, { replace: true });
    }
    toast.success(`Page "${updatedPage.title}" & all sections published successfully!`);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
    } catch {
      return dateStr;
    }
  };

  // ── FULL PAGE & SECTION EDITOR VIEW (CLASSIC WORDPRESS FIXED SIDEBAR LAYOUT) ──
  if (isFullEditing && editingPage) {
    const currentSections = PAGE_SECTIONS_REGISTRY[editingPage.id] || GENERIC_CUSTOM_SECTIONS;

    return (
      <div className="space-y-5 font-sans text-zinc-100 animate-in fade-in duration-150">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* TOP BAR: Back button, Title & Action controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={closeFullEditor}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer"
              title="Return to Pages list"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {editingPage.title ? `Edit Page: ${editingPage.title}` : 'Add New Page'}
                </h2>
                {editingPage.isFrontPage && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/40 text-red-400 border border-red-900/40">
                    Front Page
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                  editingPage.status === 'published'
                    ? 'bg-red-950/40 text-red-400 border-red-900/40'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  {editingPage.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Edit title & slug at top, configure sections A to Z, and publish from the fixed right sidebar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {editingPage.slug && (
              <a
                href={editingPage.slug}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors"
              >
                <ExternalLink size={13} className="text-red-400" />
                <span>Preview Live Page</span>
              </a>
            )}

            <button
              type="button"
              onClick={closeFullEditor}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => saveFullEditor()}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>Save & Publish</span>
            </button>
          </div>
        </div>

        {/* TWO-COLUMN WORDPRESS LAYOUT: LEFT CONTENT + FIXED RIGHT SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT COLUMN (MAIN WORKSPACE: 8 COLS) ── */}
          <div className="lg:col-span-8 space-y-5 min-w-0">

            {/* 1. TOP PAGE TITLE & PERMALINK (FIXED ON TOP AS REQUESTED) */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  placeholder="Enter title here (e.g. About Us, Services, Contact)"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>

              {/* Permalink row directly below title */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 bg-[#141419] border border-zinc-800 rounded-xl px-4 py-2">
                <span className="font-semibold text-zinc-500">Permalink:</span>
                <span className="text-zinc-600">https://techfnm.com</span>
                <input
                  type="text"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  placeholder="/page-slug"
                  className="bg-transparent border-b border-dashed border-red-500/50 focus:border-red-500 text-red-400 font-mono text-xs outline-none px-1 py-0.5 min-w-[120px]"
                />
                {editingPage.slug && (
                  <a
                    href={`https://techfnm.com${editingPage.slug === '/' ? '' : editingPage.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 ml-auto"
                  >
                    <span>View Page</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* 2. SECTION MANAGER (A TO Z) & RAW CONTENT TOGGLES */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorSubTab('sections')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editorSubTab === 'sections'
                      ? 'bg-red-950/40 text-red-400 border border-red-900/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Layers size={13} />
                  <span>⚡ Section Manager ({currentSections.length} Sections)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorSubTab('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    editorSubTab === 'raw'
                      ? 'bg-red-950/40 text-red-400 border border-red-900/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FileText size={13} />
                  <span>📝 Page Body Copy</span>
                </button>
              </div>

              {editorSubTab === 'sections' && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      const allOpen: Record<string, boolean> = {};
                      currentSections.forEach(s => allOpen[s.id] = true);
                      setOpenSectionAccordions(allOpen);
                    }}
                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenSectionAccordions({})}
                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              )}
            </div>

            {/* SECTIONS ACCORDION LIST */}
            {editorSubTab === 'sections' && (
              <div className="space-y-3">
                {currentSections.map((section, idx) => {
                  const Icon = section.icon;
                  const isOpen = !!openSectionAccordions[section.id];

                  return (
                    <div
                      key={section.id}
                      className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all"
                    >
                      {/* Accordion header */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(section.id)}
                        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Section {idx + 1}</span>
                              <span className="text-zinc-600">•</span>
                              <h4 className="text-sm font-bold text-white tracking-tight truncate">
                                {section.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                              {section.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                            {section.fields.length} Fields
                          </span>
                          {isOpen ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                        </div>
                      </button>

                      {/* Accordion content */}
                      {isOpen && (
                        <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {section.fields.map((field) => {
                              const value = editingPage.sectionsData[field.key] ?? '';
                              const isFullWidth = field.type === 'textarea' || field.type === 'image';

                              return (
                                <div
                                  key={field.key}
                                  className={`space-y-1.5 ${isFullWidth ? 'md:col-span-2' : ''}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                                      {field.type === 'image' && <ImageIcon size={12} className="text-zinc-400" />}
                                      {field.type === 'url' && <LinkIcon size={12} className="text-red-400" />}
                                      {field.type === 'text' && <Type size={12} className="text-red-400" />}
                                      {field.type === 'textarea' && <AlignLeft size={12} className="text-zinc-400" />}
                                      <span>{field.label}</span>
                                    </label>
                                    <span className="text-[10px] font-mono text-zinc-600">{field.key}</span>
                                  </div>

                                  {field.type === 'textarea' ? (
                                    <textarea
                                      rows={3}
                                      value={value}
                                      onChange={(e) => updateSectionFieldValue(field.key, e.target.value)}
                                      placeholder={field.placeholder}
                                      className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
                                    />
                                  ) : field.type === 'image' ? (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateSectionFieldValue(field.key, e.target.value)}
                                        placeholder={field.placeholder || 'https://images.unsplash.com/...'}
                                        className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                                      />
                                      {value && (
                                        <div className="relative w-36 h-20 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                                          <img
                                            src={value}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e: any) => { e.target.style.display = 'none'; }}
                                          />
                                          <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-zinc-400 font-mono">
                                            Preview
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={value}
                                      onChange={(e) => updateSectionFieldValue(field.key, e.target.value)}
                                      placeholder={field.placeholder}
                                      className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* RAW BODY CONTENT */}
            {editorSubTab === 'raw' && (
              <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Page Body Content / Description
                  </label>
                  <span className="text-[11px] text-zinc-500">General copy markup</span>
                </div>
                <textarea
                  rows={10}
                  value={editingPage.content || ''}
                  onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                  placeholder="Enter main narrative paragraphs or HTML copy..."
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
                />
              </div>
            )}

            {/* YOAST / RANKMATH STYLE SEO SETTINGS PANEL */}
            <SeoSettingsPanel
              data={editingPage.seoSettings || {}}
              onChange={(updated) => setEditingPage({ ...editingPage, seoSettings: updated })}
              defaultTitle={editingPage.title}
              defaultSlug={editingPage.slug}
              defaultDescription={editingPage.content || editingPage.sectionsData?.hero_desc || editingPage.sectionsData?.about_desc1 || ''}
              defaultImage={editingPage.featuredImage || editingPage.sectionsData?.hero_bg_image || editingPage.sectionsData?.about_image || ''}
              contentType="page"
            />

          </div>

          {/* ── RIGHT COLUMN (FIXED SIDEBAR: 4 COLS - ALWAYS VISIBLE AS REQUESTED) ── */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">

            {/* 1. PUBLISH & STATUS CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish</span>
                <span className={`w-2 h-2 rounded-full ${editingPage.status === 'published' ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status:</span>
                  <select
                    value={editingPage.status}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as any })}
                    className="bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 outline-none font-medium"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Visibility:</span>
                  <span className="text-zinc-200 font-semibold">Public</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Author:</span>
                  <select
                    value={editingPage.author}
                    onChange={(e) => setEditingPage({ ...editingPage, author: e.target.value })}
                    className="bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 outline-none font-medium"
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Front Page:</span>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, isFrontPage: !editingPage.isFrontPage })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer ${
                      editingPage.isFrontPage
                        ? 'bg-red-950/40 text-red-400 border-red-900/40'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {editingPage.isFrontPage ? 'Yes (Front Page)' : 'No'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 text-[11px]">
                  <span className="text-zinc-500">Date:</span>
                  <span className="text-zinc-400 font-mono">{formatDate(editingPage.date)}</span>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { handleTrashPage(editingPage); setIsFullEditing(false); }}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold hover:underline cursor-pointer"
                  >
                    Move to Trash
                  </button>

                  <button
                    type="button"
                    onClick={() => saveFullEditor()}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-950/40 transition-all cursor-pointer text-center"
                  >
                    {editingPage.status === 'published' ? 'Update & Publish' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. PAGE ATTRIBUTES CARD (FIXED IN SIDEBAR) */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Page Attributes</span>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <label className="text-zinc-400 font-medium block">Template</label>
                <select
                  value={editingPage.template || 'Default Template'}
                  onChange={(e) => setEditingPage({ ...editingPage, template: e.target.value })}
                  className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none font-medium"
                >
                  <option value="Default Template">Default Template</option>
                  <option value="Front Page">Front Page Template</option>
                  <option value="Full Width">Full Width Page</option>
                  <option value="Contact Form Page">Contact Form Page</option>
                </select>
              </div>
            </div>

            {/* 3. FEATURED IMAGE CARD (FIXED IN SIDEBAR AS REQUESTED) */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Featured Image</span>
                <ImageIcon size={14} className="text-amber-400" />
              </div>
              <div className="p-4 space-y-3 text-xs">
                {/* Upload Button from Device */}
                <div className="space-y-2">
                  <label className="text-zinc-400 block font-medium">Upload Image from Device</label>
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-650/20 to-red-900/20 hover:from-red-600/30 hover:to-red-900/30 border border-red-600/30 text-red-400 hover:text-red-300 font-bold text-xs cursor-pointer transition-all shadow-sm">
                    <Upload size={14} />
                    <span>Choose Image from PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFeaturedFileUpload}
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 block font-medium">Or Paste Image URL</label>
                  <input
                    type="text"
                    value={editingPage.featuredImage || ''}
                    onChange={(e) => setEditingPage({ ...editingPage, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                  />
                </div>

                {editingPage.featuredImage ? (
                  <div className="space-y-2 pt-1 border-t border-zinc-850">
                    <div className="relative w-full h-36 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
                      <img
                        src={editingPage.featuredImage}
                        alt="Featured Preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPage({ ...editingPage, featuredImage: '' })}
                      className="text-[11px] text-red-400 hover:underline block cursor-pointer font-medium"
                    >
                      ✕ Remove featured image
                    </button>
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 space-y-1 bg-[#121217]">
                    <ImageIcon size={18} className="mx-auto text-zinc-600" />
                    <p className="text-[11px]">No featured image set yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // ── DEFAULT VIEW: CLASSIC WORDPRESS TABLE VIEW ──
  return (
    <div className="space-y-4 font-sans text-zinc-200 animate-in fade-in duration-150">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER: Pages + Add New button + Screen Options & Help */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Pages</h1>
          <button
            onClick={() => openFullEditor()}
            className="px-3 py-1 bg-[#1a1d24] hover:bg-red-600 hover:text-white text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={13} />
            <span>Add New</span>
          </button>
        </div>

        {/* Screen Options & Help Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <button
              onClick={() => { setShowScreenOptions(!showScreenOptions); setShowHelp(false); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors text-[11px] cursor-pointer"
            >
              <SlidersHorizontal size={12} />
              <span>Screen Options</span>
              <ChevronDown size={11} className={`transition-transform ${showScreenOptions ? 'rotate-180' : ''}`} />
            </button>
            {showScreenOptions && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#141419] border border-zinc-800 rounded-xl p-3.5 shadow-2xl z-30 text-xs space-y-2">
                <span className="font-bold text-zinc-300 block border-b border-zinc-800 pb-1.5 text-[11px] uppercase tracking-wider">
                  Columns Displayed
                </span>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Author</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Sections Count</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Comments</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Date</span>
                </label>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowHelp(!showHelp); setShowScreenOptions(false); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors text-[11px] cursor-pointer"
            >
              <HelpCircle size={12} />
              <span>Help</span>
              <ChevronDown size={11} className={`transition-transform ${showHelp ? 'rotate-180' : ''}`} />
            </button>
            {showHelp && (
              <div className="absolute right-0 mt-1.5 w-72 bg-[#141419] border border-zinc-800 rounded-xl p-3.5 shadow-2xl z-30 text-xs space-y-2">
                <span className="font-bold text-zinc-300 block border-b border-zinc-800 pb-1.5 text-[11px] uppercase tracking-wider">
                  Pages Management
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Click <strong>Edit (Sections A-Z)</strong> on any page to customize all its live headings, paragraphs, images, and buttons with direct live website integration!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUBNAV / STATUS FILTERS */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'all' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          All <span className="text-zinc-500">({counts.all})</span>
        </button>
        <span className="text-zinc-700">|</span>

        <button
          onClick={() => setActiveTab('published')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'published' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          Published <span className="text-zinc-500">({counts.published})</span>
        </button>
        <span className="text-zinc-700">|</span>

        <button
          onClick={() => setActiveTab('draft')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'draft' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          Drafts <span className="text-zinc-500">({counts.draft})</span>
        </button>

        {counts.trash > 0 && (
          <>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setActiveTab('trash')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'trash' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
              }`}
            >
              Trash <span className="text-zinc-500">({counts.trash})</span>
            </button>
          </>
        )}
      </div>

      {/* TOP CONTROLS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          >
            <option value="">Bulk Actions</option>
            {activeTab === 'trash' ? (
              <>
                <option value="restore">Restore</option>
                <option value="delete">Delete Permanently</option>
              </>
            ) : (
              <>
                <option value="trash">Move to Trash</option>
              </>
            )}
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          >
            <option value="all">All dates</option>
            <option value="march2026">March 2026</option>
            <option value="feb2026">February 2026</option>
          </select>
          <button
            onClick={() => toast('Date filtering applied')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors cursor-pointer"
          >
            Filter
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Pages..."
              className="bg-[#121217] border border-zinc-800 focus:border-red-600/40 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none w-40 sm:w-48 transition-all"
            />
            <button
              onClick={() => {}}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium text-xs transition-colors cursor-pointer"
            >
              Search Pages
            </button>
          </div>
          <span className="text-xs text-zinc-400 whitespace-nowrap">
            {filteredPages.length} items
          </span>
        </div>
      </div>

      {/* WORDPRESS DATA TABLE */}
      <div className="rounded-2xl border border-zinc-800/90 overflow-hidden bg-[#0e0e12] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 border-collapse">
            <thead className="bg-[#14141a] text-zinc-400 font-bold border-b border-zinc-800 select-none">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredPages.length > 0 && selectedIds.length === filteredPages.length}
                    onChange={handleSelectAll}
                    className="accent-red-600 rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-300">Title</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-36">Author</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-36">Managed Sections</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-20 text-center">
                  <MessageSquare size={13} className="mx-auto text-zinc-500" />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-44">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    Loading pages database...
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <p className="font-semibold text-zinc-300 text-sm">No pages found.</p>
                    <p className="text-xs text-zinc-500 mt-1">Try changing search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => {
                  const isQuickEditing = quickEditingId === page.id;
                  const isSelected = selectedIds.includes(page.id);
                  const sectionsCount = (PAGE_SECTIONS_REGISTRY[page.id] || GENERIC_CUSTOM_SECTIONS).length;

                  return (
                    <React.Fragment key={page.id}>
                      <tr className={`group transition-colors ${
                        isSelected ? 'bg-red-950/20' : 'hover:bg-[#16161d]/70'
                      }`}>
                        <td className="px-4 py-3.5 text-center align-top">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(page.id)}
                            className="accent-red-600 rounded cursor-pointer mt-1"
                          />
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openFullEditor(page)}
                                className="font-bold text-sm text-white hover:text-red-400 hover:underline text-left cursor-pointer"
                              >
                                {page.title}
                              </button>
                              {page.isFrontPage && (
                                <span className="text-[11px] text-zinc-400 font-normal italic">
                                  — Front Page
                                </span>
                              )}
                              {page.status === 'draft' && (
                                <span className="text-[11px] text-zinc-400 font-medium">
                                  — Draft
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-zinc-500 opacity-80 group-hover:opacity-100 transition-opacity">
                              {page.status === 'trash' ? (
                                <>
                                  <button
                                    onClick={() => handleRestorePage(page)}
                                    className="text-white hover:underline cursor-pointer"
                                  >
                                    Restore
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => handleTrashPage(page)}
                                    className="text-red-400 hover:underline cursor-pointer"
                                  >
                                    Delete Permanently
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => openFullEditor(page)}
                                    className="text-zinc-400 hover:text-red-400 hover:underline cursor-pointer font-medium"
                                  >
                                    Edit (Sections A-Z)
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => startQuickEdit(page)}
                                    className="text-zinc-400 hover:text-red-400 hover:underline cursor-pointer"
                                  >
                                    Quick Edit
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => handleTrashPage(page)}
                                    className="text-red-400 hover:underline cursor-pointer"
                                  >
                                    Trash
                                  </button>
                                  <span>|</span>
                                  <a
                                    href={page.slug}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-400 hover:text-red-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <span>View</span>
                                    <ExternalLink size={9} />
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 align-top text-zinc-400 font-medium">
                          <span className="text-zinc-300 hover:text-white cursor-pointer">
                            {page.author}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <button
                            onClick={() => openFullEditor(page)}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 transition-colors cursor-pointer"
                          >
                            <Layers size={10} className="text-red-400" />
                            <span>{sectionsCount} Live Sections</span>
                          </button>
                        </td>

                        <td className="px-4 py-3.5 align-top text-center text-zinc-500">
                          {page.commentsCount > 0 ? (
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                              {page.commentsCount}
                            </span>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-0.5">
                            <span className="text-zinc-300 block font-medium">
                              {page.status === 'published' ? 'Published' : 'Last Modified'}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono block">
                              {formatDate(page.date)}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* INLINE QUICK EDIT ROW */}
                      {isQuickEditing && (
                        <tr className="bg-[#121217] border-y-2 border-red-600/40">
                          <td colSpan={6} className="p-5">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                <span className="font-bold text-xs uppercase tracking-wider text-red-400">
                                  Quick Edit: {page.title}
                                </span>
                                <button
                                  onClick={() => setQuickEditingId(null)}
                                  className="text-zinc-500 hover:text-white"
                                >
                                  <X size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div className="space-y-2">
                                  <label className="text-zinc-400 font-semibold block">Title</label>
                                  <input
                                    type="text"
                                    value={quickEditData.title}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none focus:border-red-500"
                                  />

                                  <label className="text-zinc-400 font-semibold block pt-1">Slug</label>
                                  <input
                                    type="text"
                                    value={quickEditData.slug}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, slug: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 font-mono outline-none focus:border-red-500"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-zinc-400 font-semibold block">Author</label>
                                  <select
                                    value={quickEditData.author}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, author: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none"
                                  >
                                    <option value="admin">admin</option>
                                    <option value="editor">editor</option>
                                  </select>

                                  <label className="text-zinc-400 font-semibold block pt-1">Status</label>
                                  <select
                                    value={quickEditData.status}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, status: e.target.value as any })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none"
                                  >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-zinc-400 font-semibold block">Template</label>
                                  <select
                                    value={quickEditData.template}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, template: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none"
                                  >
                                    <option value="Default Template">Default Template</option>
                                    <option value="Front Page">Front Page</option>
                                    <option value="Full Width">Full Width</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                <button
                                  type="button"
                                  onClick={() => setQuickEditingId(null)}
                                  className="px-4 py-1.5 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={saveQuickEdit}
                                  className="px-5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950/40 transition-colors cursor-pointer"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            <tfoot className="bg-[#14141a] text-zinc-400 font-bold border-t border-zinc-800 select-none">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredPages.length > 0 && selectedIds.length === filteredPages.length}
                    onChange={handleSelectAll}
                    className="accent-red-600 rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-300">Title</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Author</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Managed Sections</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 text-center">
                  <MessageSquare size={13} className="mx-auto text-zinc-500" />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Date</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          >
            <option value="">Bulk Actions</option>
            {activeTab === 'trash' ? (
              <>
                <option value="restore">Restore</option>
                <option value="delete">Delete Permanently</option>
              </>
            ) : (
              <>
                <option value="trash">Move to Trash</option>
              </>
            )}
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>

        <span className="text-xs text-zinc-500">
          {filteredPages.length} items
        </span>
      </div>

      {/* FOOTER CREDITS */}
      <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
        <p>
          Thank you for creating with <span className="text-white font-medium">WordPress</span> & <span className="text-red-400 font-bold">TechFNM Console</span>.
        </p>
        <span className="font-mono text-zinc-400">Version 6.4.2</span>
      </div>

    </div>
  );
}
