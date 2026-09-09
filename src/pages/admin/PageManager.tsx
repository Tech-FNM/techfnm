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
      title: 'Hero Section',
      description: 'The main hero fold with dynamic headline, subtitle, buttons and background.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge / Tagline', type: 'text', placeholder: 'e.g. Creative Solutions' },
        { key: 'hero_title', label: 'Main Headline (H1)', type: 'text', placeholder: 'e.g. We Build What You Imagine' },
        { key: 'hero_subtitle', label: 'Secondary Subtitle', type: 'text', placeholder: 'e.g. Your Digital Growth Partner' },
        { key: 'hero_desc', label: 'Paragraph Description', type: 'textarea', placeholder: 'Describe your core value proposition...' },
        { key: 'hero_cta1_text', label: 'Primary Button Text', type: 'text', placeholder: 'e.g. Getting Started' },
        { key: 'hero_cta1_link', label: 'Primary Button Link', type: 'url', placeholder: 'e.g. /request-service' },
        { key: 'hero_cta2_text', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Our Services' },
        { key: 'hero_cta2_link', label: 'Secondary Button Link', type: 'url', placeholder: 'e.g. /#services' },
        { key: 'hero_bg_image', label: 'Hero Background / Media URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
      ]
    },
    {
      id: 'about',
      title: 'About Us Section',
      description: 'Agency story, experience badge, and core value statements on the homepage.',
      icon: User,
      fields: [
        { key: 'about_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. About TechFNM' },
        { key: 'about_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g. We Are Creative Digital Agency' },
        { key: 'about_desc1', label: 'Main Description Paragraph', type: 'textarea', placeholder: 'Introduce your company mission...' },
        { key: 'about_desc2', label: 'Secondary Paragraph', type: 'textarea', placeholder: 'Team philosophy and standards...' },
        { key: 'about_exp_years', label: 'Experience Years', type: 'text', placeholder: 'e.g. 5+' },
        { key: 'about_exp_text', label: 'Experience Label', type: 'text', placeholder: 'e.g. Years Experience In Digital Solutions' },
        { key: 'about_image', label: 'Feature Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
        { key: 'about_btn_text', label: 'CTA Button Text', type: 'text', placeholder: 'e.g. Learn More About Us' },
        { key: 'about_btn_link', label: 'CTA Button Link', type: 'url', placeholder: 'e.g. /about' },
      ]
    },
    {
      id: 'services',
      title: 'Services Showcase Section',
      description: 'Services grid headline, badge, and navigation button.',
      icon: Briefcase,
      fields: [
        { key: 'services_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. What We Do' },
        { key: 'services_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Engineered For Peak Performance' },
        { key: 'services_desc', label: 'Section Description', type: 'textarea', placeholder: 'Describe your range of capabilities...' },
        { key: 'services_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. View All Services' },
        { key: 'services_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /services' },
      ]
    },
    {
      id: 'portfolio',
      title: 'Portfolio Showcase Section',
      description: 'Featured works and case studies overview on the homepage.',
      icon: FolderGit2,
      fields: [
        { key: 'portfolio_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Recent Works' },
        { key: 'portfolio_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Featured Case Studies' },
        { key: 'portfolio_desc', label: 'Section Description', type: 'textarea', placeholder: 'Highlight recent project achievements...' },
        { key: 'portfolio_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Explore All Projects' },
        { key: 'portfolio_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /portfolio' },
      ]
    },
    {
      id: 'leadership',
      title: 'Leadership & Team Section',
      description: 'Team and executive leadership header texts.',
      icon: User,
      fields: [
        { key: 'leadership_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Our Leadership' },
        { key: 'leadership_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Visionary Minds Driving TechFNM' },
        { key: 'leadership_desc', label: 'Section Description', type: 'textarea', placeholder: 'Brief summary of the leadership team...' },
      ]
    },
    {
      id: 'testimonials',
      title: 'Client Testimonials Section',
      description: 'Customer feedback and proof section headers.',
      icon: MessageSquare,
      fields: [
        { key: 'testimonials_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Client Voices' },
        { key: 'testimonials_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. What Founders Say About Us' },
        { key: 'testimonials_desc', label: 'Section Description', type: 'textarea', placeholder: 'Social proof and customer reviews...' },
      ]
    },
    {
      id: 'faq',
      title: 'FAQ Section',
      description: 'Homepage FAQ accordion title, badge, and support CTA.',
      icon: HelpCircle,
      fields: [
        { key: 'faq_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Support Center' },
        { key: 'faq_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Frequently Asked Questions' },
        { key: 'faq_desc', label: 'Section Description', type: 'textarea', placeholder: 'Clear answers to common questions...' },
        { key: 'faq_btn_text', label: 'Support Button Text', type: 'text', placeholder: 'e.g. Ask a Question' },
        { key: 'faq_btn_link', label: 'Support Button Link', type: 'url', placeholder: 'e.g. /contact' },
      ]
    },
    {
      id: 'contact_cta',
      title: 'Bottom Consultation CTA',
      description: 'Closing call to action encouraging clients to get in touch.',
      icon: Phone,
      fields: [
        { key: 'cta_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Get In Touch' },
        { key: 'cta_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Ready To Transform Your Digital Presence?' },
        { key: 'cta_desc', label: 'Description Text', type: 'textarea', placeholder: 'Invite clients for a discovery call...' },
        { key: 'cta_btn_text', label: 'Button Text', type: 'text', placeholder: 'e.g. Start Your Project' },
        { key: 'cta_btn_link', label: 'Button Link', type: 'url', placeholder: 'e.g. /request-service' },
      ]
    }
  ],

  'page-about': [
    {
      id: 'about_hero',
      title: 'Hero Section',
      description: 'About page banner heading, description and call-to-action buttons.',
      icon: Sparkles,
      fields: [
        { key: 'hero_badge', label: 'Badge', type: 'text', placeholder: 'e.g. About Us' },
        { key: 'hero_title', label: 'Main Heading (H1)', type: 'text', placeholder: 'e.g. Your Digital Growth Partner' },
        { key: 'hero_desc', label: 'Paragraph Description', type: 'textarea', placeholder: 'Brief overview of company vision...' },
        { key: 'hero_cta1_text', label: 'Primary Button Text', type: 'text', placeholder: 'e.g. Getting Started' },
        { key: 'hero_cta1_link', label: 'Primary Button Link', type: 'url', placeholder: 'e.g. /request-service' },
        { key: 'hero_cta2_text', label: 'Secondary Button Text', type: 'text', placeholder: 'e.g. Our Services' },
        { key: 'hero_cta2_link', label: 'Secondary Button Link', type: 'url', placeholder: 'e.g. /services' },
      ]
    },
    {
      id: 'about_story',
      title: 'Our Story & Statistics',
      description: 'Founding story, animated sphere stats, and milestone figures.',
      icon: AlignLeft,
      fields: [
        { key: 'story_badge', label: 'Badge', type: 'text', placeholder: 'e.g. Our Story' },
        { key: 'story_heading', label: 'Heading', type: 'text', placeholder: 'e.g. Architecting Next-Gen Software Since 2023' },
        { key: 'story_text', label: 'Narrative Story Text', type: 'textarea', placeholder: 'The history and foundation story...' },
        { key: 'stat1_val', label: 'Stat 1 Number', type: 'text', placeholder: 'e.g. 2023' },
        { key: 'stat1_lbl', label: 'Stat 1 Label', type: 'text', placeholder: 'e.g. Founded' },
        { key: 'stat2_val', label: 'Stat 2 Number', type: 'text', placeholder: 'e.g. 100%' },
        { key: 'stat2_lbl', label: 'Stat 2 Label', type: 'text', placeholder: 'e.g. Remote' },
        { key: 'stat3_val', label: 'Stat 3 Number', type: 'text', placeholder: 'e.g. 50+' },
        { key: 'stat3_lbl', label: 'Stat 3 Label', type: 'text', placeholder: 'e.g. Projects' },
      ]
    },
    {
      id: 'about_mission',
      title: 'Mission & Vision',
      description: 'Dual cards highlighting core purpose and future aspirations.',
      icon: Layers,
      fields: [
        { key: 'mission_title', label: 'Mission Title', type: 'text', placeholder: 'e.g. Our Mission' },
        { key: 'mission_text', label: 'Mission Statement', type: 'textarea', placeholder: 'To empower global businesses with robust, high-conversion tools...' },
        { key: 'vision_title', label: 'Vision Title', type: 'text', placeholder: 'e.g. Our Vision' },
        { key: 'vision_text', label: 'Vision Statement', type: 'textarea', placeholder: 'To become the premier engineering partner for modern enterprises...' },
      ]
    },
    {
      id: 'about_values',
      title: 'Why Choose Us / Values',
      description: 'Key principles and pillars that distinguish TechFNM.',
      icon: CheckCircle2,
      fields: [
        { key: 'values_badge', label: 'Section Badge', type: 'text', placeholder: 'e.g. Core Pillars' },
        { key: 'values_heading', label: 'Main Heading', type: 'text', placeholder: 'e.g. Why Industry Leaders Choose TechFNM' },
        { key: 'val1_title', label: 'Pillar 1 Title', type: 'text', placeholder: 'e.g. Speed & Execution' },
        { key: 'val1_desc', label: 'Pillar 1 Description', type: 'textarea', placeholder: 'Agile sprints with zero bloat...' },
        { key: 'val2_title', label: 'Pillar 2 Title', type: 'text', placeholder: 'e.g. Modern Architecture' },
        { key: 'val2_desc', label: 'Pillar 2 Description', type: 'textarea', placeholder: 'Built with React, Next.js, and cloud backends...' },
        { key: 'val3_title', label: 'Pillar 3 Title', type: 'text', placeholder: 'e.g. Direct Founder Access' },
        { key: 'val3_desc', label: 'Pillar 3 Description', type: 'textarea', placeholder: 'Zero middlemen, senior engineers on call...' },
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
      hero_badge: 'Creative Solutions',
      hero_title: 'We Build What You Imagine',
      hero_subtitle: 'Your Digital Growth Partner',
      hero_desc: 'Expert web development, mobile app solutions, and result-driven SEO services to grow your business online.',
      hero_cta1_text: 'Getting Started',
      hero_cta1_link: '/request-service',
      hero_cta2_text: 'Our Services',
      hero_cta2_link: '/#services',
      about_badge: 'About Us',
      about_heading: 'We Are Creative Digital Agency',
      about_desc1: 'TechFNM is a leading software company in Pakistan, dedicated to providing top-notch web development, mobile app solutions, and digital marketing services.',
      about_desc2: 'Our team of experts is passionate about technology and innovation. We stay up-to-date with the latest trends to ensure clients get high-conversion solutions.',
      about_exp_years: '5+',
      about_exp_text: 'Years Experience In Digital Solutions',
      about_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      about_btn_text: 'Discover More',
      about_btn_link: '#contact',
      services_badge: 'What We Do',
      services_heading: 'Our Services',
      services_desc: 'We provide comprehensive digital solutions to help your business thrive in the modern world.',
      services_btn_text: 'Explore All Services',
      services_btn_link: '/services',
      portfolio_badge: 'Portfolio & Project',
      portfolio_heading: 'Our Works',
      portfolio_desc: 'Explore our latest projects and see how we\'ve helped businesses achieve their goals.',
      portfolio_btn_text: 'Explore All Projects',
      portfolio_btn_link: '/portfolio',
      leadership_badge: 'Our Leadership',
      leadership_heading: 'Visionary Minds Driving TechFNM',
      leadership_desc: 'Meet the executive talent building tomorrow\'s web.',
      testimonials_badge: 'Client Voices',
      testimonials_heading: 'What Founders Say About Us',
      testimonials_desc: 'Trusted by forward-thinking companies worldwide.',
      faq_badge: 'Support Center',
      faq_heading: 'Frequently Asked Questions',
      faq_desc: 'Find answers to common questions about our services and process.',
      faq_btn_text: 'Ask a Question',
      faq_btn_link: '/contact',
      cta_badge: 'Get In Touch',
      cta_heading: 'Ready To Transform Your Digital Presence?',
      cta_desc: 'Schedule a discovery call with our solutions architects today.',
      cta_btn_text: 'Start Your Project',
      cta_btn_link: '/request-service',
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
      hero_badge: 'About Us',
      hero_title: 'Your Digital Growth Partner',
      hero_desc: 'Expert web development, mobile app solutions, and result-driven SEO services to grow your business online.',
      hero_cta1_text: 'Getting Started',
      hero_cta1_link: '/request-service',
      hero_cta2_text: 'Our Services',
      hero_cta2_link: '/services',
      story_badge: 'Our Story',
      story_heading: 'Architecting Next-Gen Software Since 2023',
      story_text: 'Founded with a clear mission to bridge innovative design with bulletproof engineering, TechFNM has evolved into a powerhouse digital partner for visionary brands worldwide.',
      stat1_val: '2023',
      stat1_lbl: 'Founded',
      stat2_val: '100%',
      stat2_lbl: 'Remote',
      stat3_val: '50+',
      stat3_lbl: 'Projects',
      mission_title: 'Our Mission',
      mission_text: 'To empower global businesses with robust, high-conversion digital tools and modern cloud software.',
      vision_title: 'Our Vision',
      vision_text: 'To become the premier engineering partner for modern digital enterprises across the globe.',
      values_badge: 'Core Pillars',
      values_heading: 'Why Industry Leaders Choose TechFNM',
      val1_title: 'Speed & Execution',
      val1_desc: 'Agile sprints with zero corporate red tape.',
      val2_title: 'Modern Architecture',
      val2_desc: 'Built with React, Next.js, and cloud backends.',
      val3_title: 'Direct Founder Access',
      val3_desc: 'Zero middlemen, senior engineers always on call.'
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

export default function PageManager() {
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
    if (action === 'edit' && itemId) {
      const target = pages.find(p => p.id === itemId || p.slug === itemId || p.slug === `/${itemId}`);
      if (target) {
        if (!editingPage || editingPage.id !== target.id) {
          openFullEditor(target);
        }
      }
    } else if (action === 'new') {
      if (!isFullEditing) {
        openFullEditor();
      }
    } else if (!action && isFullEditing) {
      setIsFullEditing(false);
      setEditingPage(null);
    }
  }, [action, itemId, pages.length]);

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

    closeFullEditor();
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
                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40'
                    : 'bg-amber-950/30 text-amber-400 border-amber-900/40'
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
                    href={editingPage.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 ml-auto"
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
                                      {field.type === 'image' && <ImageIcon size={12} className="text-amber-400" />}
                                      {field.type === 'url' && <LinkIcon size={12} className="text-blue-400" />}
                                      {field.type === 'text' && <Type size={12} className="text-red-400" />}
                                      {field.type === 'textarea' && <AlignLeft size={12} className="text-purple-400" />}
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
                <span className={`w-2 h-2 rounded-full ${editingPage.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
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
                                className="font-bold text-sm text-[#58a6ff] hover:text-[#79c0ff] hover:underline text-left cursor-pointer"
                              >
                                {page.title}
                              </button>
                              {page.isFrontPage && (
                                <span className="text-[11px] text-zinc-400 font-normal italic">
                                  — Front Page
                                </span>
                              )}
                              {page.status === 'draft' && (
                                <span className="text-[11px] text-amber-400/90 font-medium">
                                  — Draft
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-zinc-500 opacity-80 group-hover:opacity-100 transition-opacity">
                              {page.status === 'trash' ? (
                                <>
                                  <button
                                    onClick={() => handleRestorePage(page)}
                                    className="text-emerald-400 hover:underline cursor-pointer"
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
                                    className="text-[#58a6ff] hover:underline cursor-pointer font-medium"
                                  >
                                    Edit (Sections A-Z)
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => startQuickEdit(page)}
                                    className="text-[#58a6ff] hover:underline cursor-pointer"
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
                                    className="text-[#58a6ff] hover:underline flex items-center gap-0.5 cursor-pointer"
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
                          <span className="text-[#58a6ff] hover:underline cursor-pointer">
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
