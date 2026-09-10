import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  Check,
  X,
  Eye,
  Save,
  RotateCcw,
  ArrowLeft,
  Calendar,
  User,
  Sparkles,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Globe,
  Upload,
  Layers,
  Code,
  Smartphone,
  PenTool,
  ShoppingCart,
  Share2,
  CheckCircle2,
  Shield,
  Zap,
  DollarSign,
  ArrowRight,
  ListPlus,
  CheckSquare,
  BarChart3,
  TrendingUp,
  Clock,
  HelpCircle,
  Building,
  Target,
  Award,
  MapPin,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  MessageSquare,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import SeoSettingsPanel, { SeoSettingsData } from '../../components/admin/SeoSettingsPanel';
import { setCached, CANONICAL_SERVICES } from '../../lib/canonicalData';
import { triggerContentUpdate } from '../../lib/cmsContent';

export interface CorePillar {
  title: string;
  desc: string;
  icon: string;
}

export interface CapabilityItem {
  title: string;
  desc: string;
  icon: string;
}

export interface StrategicBenefit {
  title: string;
  desc: string;
  icon: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export interface CaseWin {
  stat: string;
  title: string;
  timeframe: string;
  story: string;
}

export interface TargetIndustry {
  title: string;
  desc: string;
  image: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: 'one-time' | 'month';
  popular: boolean;
  features: string[];
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceItem {
  id: any;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
  content?: string;
  author?: string;
  status?: 'published' | 'draft' | 'trash';
  updated_at?: string;
  hero_badge?: string;
  hero_accent?: string;
  hero_bullets?: string[];
  core_pillars?: CorePillar[];
  capabilities?: CapabilityItem[];
  benefits?: StrategicBenefit[];
  process_steps?: ProcessStep[];
  case_wins?: CaseWin[];
  target_industries?: TargetIndustry[];
  tools_used?: string[];
  pricing?: PricingPlan[];
  faqs?: ServiceFaq[];
  features?: any[];
  worldwide_badge?: string;
  worldwide_title?: string;
  worldwide_desc?: string;
  countries_served?: string | string[];
  map_query?: string;
  map_status_text?: string;
  map_coverage_text?: string;
  seo_settings?: SeoSettingsData & {
    hero_badge?: string;
    hero_accent?: string;
    hero_bullets?: string[];
    core_pillars?: CorePillar[];
    capabilities?: CapabilityItem[];
    benefits?: StrategicBenefit[];
    process_steps?: ProcessStep[];
    case_wins?: CaseWin[];
    target_industries?: TargetIndustry[];
    tools_used?: string[];
    pricing?: PricingPlan[];
    faqs?: ServiceFaq[];
    features?: any[];
    worldwide_badge?: string;
    worldwide_title?: string;
    worldwide_desc?: string;
    countries_served?: string | string[];
    map_query?: string;
    map_status_text?: string;
    map_coverage_text?: string;
  };
}

const AVAILABLE_ICONS = [
  { name: 'Code', icon: Code, label: 'Web / Code' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile App' },
  { name: 'PenTool', icon: PenTool, label: 'Design / Writing' },
  { name: 'Globe', icon: Globe, label: 'SEO / Marketing' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'E-Commerce' },
  { name: 'Share2', icon: Share2, label: 'Social Media' },
  { name: 'Target', icon: Target, label: 'Ads / PPC' },
  { name: 'BarChart3', icon: BarChart3, label: 'Analytics' }
];

const iconMap: Record<string, any> = {
  Code,
  Smartphone,
  PenTool,
  Globe,
  ShoppingCart,
  Share2,
  Target,
  BarChart3,
  Briefcase,
  Layers,
  Sparkles,
  Zap,
  Shield
};

const featIconMap: Record<string, any> = {
  Sparkles,
  Zap,
  Shield,
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  CheckCircle2,
  ArrowRight,
  Layers,
  BarChart3,
  Award,
  Search,
  Building,
  Target,
  Briefcase
};

const COLOR_PRESETS = [
  { label: 'Brand Red-Orange Glow', value: 'bg-red-500/10 text-red-500 border-red-500/30' },
  { label: 'Solid Red-Orange Fill', value: 'bg-red-600 text-white border-red-600' },
  { label: 'Subtle Zinc Outline', value: 'bg-zinc-900 text-zinc-200 border-zinc-800' }
];

const DEFAULT_HERO_BULLETS = [
  'Full Profile Optimization & Technical Architecture',
  'First-Page Visibility & Conversion-Driven Funnels',
  'Reputation Management & Review Acceleration',
  'Transparent Telemetry & Continuous Refinement'
];

const DEFAULT_CORE_PILLARS: CorePillar[] = [
  {
    title: 'Solid Foundation',
    desc: 'A complete, clean infrastructure comes first. We eliminate errors, lock in keywords, and ensure consistent brand signals.',
    icon: 'Layers'
  },
  {
    title: 'Market Authority',
    desc: 'We amplify prominence through citation networks, organic credibility signals, and quality references.',
    icon: 'Shield'
  },
  {
    title: 'Conversion Triggers',
    desc: 'Traffic without action is useless. We optimize copy, media, calls to action, and user journeys so impressions turn into paying clients.',
    icon: 'Zap'
  }
];

const DEFAULT_CAPABILITIES: CapabilityItem[] = [
  {
    title: 'End-to-End Management',
    desc: 'We implement frequent updates, fresh content, technical maintenance, and swift community engagement.',
    icon: 'Briefcase'
  },
  {
    title: 'Deep Technical Audit',
    desc: 'Our comprehensive audit reveals structural bottlenecks, ranking gaps, and priority action items.',
    icon: 'Search'
  },
  {
    title: 'Asset Recovery & Shielding',
    desc: 'We isolate policy and technical issues, rectify records, and restore visibility fast.',
    icon: 'Shield'
  },
  {
    title: 'Local & Organic Discovery',
    desc: 'Hyper-localized geotargeting captures consumers at the exact micro-moment of intent.',
    icon: 'Target'
  },
  {
    title: 'Conversion Engineering',
    desc: 'Turn passive searchers into phone calls and scheduled meetings with custom CTAs.',
    icon: 'TrendingUp'
  },
  {
    title: 'Live Telemetry & Reporting',
    desc: 'Real-time performance dashboards track keyword velocity, impressions, and ROI.',
    icon: 'BarChart3'
  }
];

const DEFAULT_BENEFITS: StrategicBenefit[] = [
  {
    title: 'Own the High-Value Local Grid',
    desc: 'Dominate top positions in the Google 3-Pack and search results where 78% of local buyers make fast decisions.',
    icon: 'Target'
  },
  {
    title: 'Protect Your Brand Reputation',
    desc: 'Filter spam attacks, resolve unfair customer disputes, and preserve spotless five-star ratings consistently.',
    icon: 'Shield'
  },
  {
    title: 'Turn Browsers Into Inbound Calls',
    desc: 'Engineered CTAs and structured booking funnels transform passing foot-traffic into paying inquiries.',
    icon: 'Zap'
  },
  {
    title: 'Defensible Market Advantage',
    desc: 'Continuous keyword expansion and citation authority put massive distance between you and competitors.',
    icon: 'Award'
  }
];

const DEFAULT_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Deep Technical Diagnostics',
    desc: 'Comprehensive indexing audit, keyword gap analysis, and conversion bottleneck discovery.'
  },
  {
    step: '02',
    title: 'Infrastructure & Foundation Setup',
    desc: 'Fixing architecture errors, sanitizing citations, and optimizing metadata elements.'
  },
  {
    step: '03',
    title: 'Authority Velocity & Optimization',
    desc: 'Deploying custom schema, publishing geo-rich updates, and activating customer trust funnels.'
  },
  {
    step: '04',
    title: 'Scale, Telemetry & Refinement',
    desc: 'Continuous performance tracking, ongoing A/B testing, and ROI acceleration.'
  }
];

const DEFAULT_CASE_WINS: CaseWin[] = [
  {
    stat: '+320%',
    title: 'Direct Phone Inquiries',
    timeframe: '90 Days Post-Launch',
    story: 'Rebuilt profile structure and geo-grid citations for a regional dental clinic network.'
  },
  {
    stat: 'Top 3',
    title: 'Rankings Across 18 Keywords',
    timeframe: '60 Days',
    story: 'Took an HVAC provider from page 4 to dominating top 3 positions across key metro suburbs.'
  },
  {
    stat: '4.8X',
    title: 'Monthly ROI on Ad Spend',
    timeframe: '6 Months',
    story: 'Organic local conversion funnel replaced dependency on paid ad bidding entirely.'
  }
];

const DEFAULT_INDUSTRIES: TargetIndustry[] = [
  {
    title: 'Healthcare & Medical Clinics',
    desc: 'Urgent care centers, dental clinics, and specialized practitioners seeking verified patients.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Home & Professional Services',
    desc: 'Roofing, HVAC, electrical, and legal firms relying on local service dominance.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Boutique Retail & Hospitality',
    desc: 'Restaurants, luxury retail, and franchises driving verified foot-traffic.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  }
];

const DEFAULT_TOOLS = [
  'Google Business Profile API',
  'Google Maps Engine',
  'Ahrefs SEO Suite',
  'SEMrush Intelligence',
  'BrightLocal Grid',
  'Whitespark Citation Tracker'
];

const DEFAULT_PRICING: PricingPlan[] = [
  {
    name: 'Foundation & Cleanup',
    price: '$490',
    period: 'one-time',
    popular: false,
    features: [
      'Complete Profile Health & Indexing Audit',
      'NAP Consistency & Duplicate Profile Removal',
      'Primary Category & Secondary Tag Optimization',
      'Local Geo-Coordinate Schema Markup',
      'Initial High-Authority Citation Submission'
    ]
  },
  {
    name: 'Dominance & Growth',
    price: '$790',
    period: 'month',
    popular: true,
    features: [
      'Everything in Foundation Package',
      'Weekly Geo-Targeted Media & Offer Posts',
      'Reputation Shielding & Review Ingestion Funnel',
      'Monthly Citation Expansion & Competitor Monitoring',
      'Live Monthly Performance Dashboard & Strategy Call'
    ]
  },
  {
    name: 'Enterprise Multi-Location',
    price: '$1,490',
    period: 'month',
    popular: false,
    features: [
      'Everything in Dominance Package',
      'Up to 5 Regional Locations Included',
      'Custom API Synchronization & Inventory Sync',
      'Dedicated Account Director & Priority Support',
      'Custom Bi-Weekly Ranking Reports'
    ]
  }
];

const DEFAULT_FAQS: ServiceFaq[] = [
  {
    q: 'How fast can we expect visible improvements in local rankings?',
    a: 'Most clients observe measurable improvements in impressions and keyword grid positioning within 30 to 60 days following our structural audits and cleanup.'
  },
  {
    q: 'Can you assist if our business profile has been suspended or flagged?',
    a: 'Yes. We conduct complete policy compliance audits, rectify documentation gaps, and submit formal reinstatement appeals to restore visibility.'
  },
  {
    q: 'Do you work with businesses that have multiple branch locations?',
    a: 'Absolutely. We manage multi-unit franchises, medical groups, and regional service businesses with centralized branding and localized geo-targeting.'
  }
];

const formatSlug = (slugText: string, fallback: string = '') => {
  if (!slugText) return fallback;
  const clean = slugText
    .toLowerCase()
    .replace(/^\/?services\/?/, '')
    .replace(/^\//, '')
    .replace(/\/$/, '');
  return clean || fallback;
};

export default function ServicesManager() {
  const navigate = useNavigate();
  const { action, itemId } = useParams();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Full Editor State
  const [isFullEditing, setIsFullEditing] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editorSubTab, setEditorSubTab] = useState<'sections' | 'raw'>('sections');
  
  // Section Accordions state (Sections 1 to 9)
  const [openSectionAccordions, setOpenSectionAccordions] = useState<Record<string, boolean>>({
    'section-1': true,
    'section-2': false,
    'section-3': false,
    'section-4': false,
    'section-5': false,
    'section-6': false,
    'section-7': false,
    'section-8': false,
    'section-9': false
  });

  const toggleSectionAccordion = (id: string) => {
    setOpenSectionAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllAccordions = () => {
    setOpenSectionAccordions({
      'section-1': true,
      'section-2': true,
      'section-3': true,
      'section-4': true,
      'section-5': true,
      'section-6': true,
      'section-7': true,
      'section-8': true,
      'section-9': true
    });
  };

  const collapseAllAccordions = () => {
    setOpenSectionAccordions({});
  };

  // Quick Edit State
  const [quickEditingId, setQuickEditingId] = useState<any | null>(null);
  const [quickEditData, setQuickEditData] = useState({
    title: '',
    slug: '',
    icon: 'Code',
    status: 'published' as 'published' | 'draft'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        const mapped: ServiceItem[] = data.map((row: any) => {
          const rawSlug = row.slug || row.seo_settings?.slug || String(row.id);
          const currentSlug = formatSlug(rawSlug, String(row.id));
          const sSeo = row.seo_settings || {};
          return {
            id: row.id,
            title: row.title || 'Untitled Service',
            slug: currentSlug,
            description: row.description || '',
            icon: row.icon || 'Code',
            color: row.color || 'bg-red-500/10 text-red-500 border-red-500/30',
            image: row.image || row.featured_image || '',
            content: row.content || '',
            author: row.author || 'admin',
            status: (row.status as any) || 'published',
            updated_at: row.updated_at || new Date().toISOString(),
            hero_badge: row.hero_badge || sSeo.hero_badge || '',
            hero_accent: row.hero_accent || sSeo.hero_accent || '',
            hero_bullets: (Array.isArray(row.hero_bullets) && row.hero_bullets.length > 0)
              ? row.hero_bullets
              : (sSeo.hero_bullets || DEFAULT_HERO_BULLETS),
            core_pillars: (Array.isArray(row.core_pillars) && row.core_pillars.length > 0)
              ? row.core_pillars
              : (sSeo.core_pillars || DEFAULT_CORE_PILLARS),
            capabilities: (Array.isArray(row.capabilities) && row.capabilities.length > 0)
              ? row.capabilities
              : (sSeo.capabilities || row.features || DEFAULT_CAPABILITIES),
            benefits: (Array.isArray(row.benefits) && row.benefits.length > 0)
              ? row.benefits
              : (sSeo.benefits || DEFAULT_BENEFITS),
            process_steps: (Array.isArray(row.process_steps) && row.process_steps.length > 0)
              ? row.process_steps
              : (sSeo.process_steps || DEFAULT_STEPS),
            case_wins: (Array.isArray(row.case_wins) && row.case_wins.length > 0)
              ? row.case_wins
              : (sSeo.case_wins || DEFAULT_CASE_WINS),
            target_industries: (Array.isArray(row.target_industries) && row.target_industries.length > 0)
              ? row.target_industries
              : (sSeo.target_industries || DEFAULT_INDUSTRIES),
            tools_used: (Array.isArray(row.tools_used) && row.tools_used.length > 0)
              ? row.tools_used
              : (sSeo.tools_used || DEFAULT_TOOLS),
            pricing: (Array.isArray(row.pricing) && row.pricing.length > 0)
              ? row.pricing
              : (sSeo.pricing || DEFAULT_PRICING),
            faqs: (Array.isArray(row.faqs) && row.faqs.length > 0)
              ? row.faqs
              : (sSeo.faqs || DEFAULT_FAQS),
            worldwide_badge: row.worldwide_badge || sSeo.worldwide_badge || 'Global Deployment',
            worldwide_title: row.worldwide_title || sSeo.worldwide_title || 'Worldwide Operations & 24/7 Client Coverage',
            worldwide_desc: row.worldwide_desc || sSeo.worldwide_desc || 'Delivering high-performance software engineering, SEO dominance, and growth solutions to businesses across North America, Europe, the Middle East, and Asia.',
            countries_served: row.countries_served || sSeo.countries_served || 'United States, United Kingdom, United Arab Emirates, Germany, Canada, Australia, Pakistan',
            map_query: row.map_query || sSeo.map_query || 'United States',
            map_status_text: row.map_status_text || sSeo.map_status_text || 'Global Deployment Ready',
            map_coverage_text: row.map_coverage_text || sSeo.map_coverage_text || '24/7 Client Coverage',
            seo_settings: {
              ...sSeo,
              seoTitle: row.meta_title || sSeo.seoTitle || row.title,
              metaDescription: row.meta_description || sSeo.metaDescription || row.description,
              slug: currentSlug
            }
          };
        });
        setServices(mapped);
        setCached('techfnm_services_cache', mapped);
      } else {
        // Use canonical baseline
        const initial = CANONICAL_SERVICES.map((s: any) => ({
          ...s,
          slug: s.slug ? formatSlug(s.slug, String(s.id)) : String(s.id),
          author: 'admin',
          status: 'published',
          updated_at: new Date().toISOString(),
          hero_bullets: DEFAULT_HERO_BULLETS,
          core_pillars: DEFAULT_CORE_PILLARS,
          capabilities: DEFAULT_CAPABILITIES,
          benefits: DEFAULT_BENEFITS,
          process_steps: DEFAULT_STEPS,
          case_wins: DEFAULT_CASE_WINS,
          target_industries: DEFAULT_INDUSTRIES,
          tools_used: DEFAULT_TOOLS,
          pricing: DEFAULT_PRICING,
          faqs: DEFAULT_FAQS,
          worldwide_badge: 'Global Deployment',
          worldwide_title: 'Worldwide Operations & 24/7 Client Coverage',
          worldwide_desc: 'Delivering high-performance software engineering, SEO dominance, and growth solutions to businesses across North America, Europe, the Middle East, and Asia.',
          countries_served: 'United States, United Kingdom, United Arab Emirates, Germany, Canada, Australia, Pakistan',
          map_query: 'United States',
          map_status_text: 'Global Deployment Ready',
          map_coverage_text: '24/7 Client Coverage',
          color: 'bg-red-500/10 text-red-500 border-red-500/30',
          seo_settings: {
            seoTitle: s.title,
            metaDescription: s.description,
            slug: s.slug ? formatSlug(s.slug, String(s.id)) : String(s.id)
          }
        }));
        setServices(initial);
        setCached('techfnm_services_cache', initial);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  // Check URL params for direct edit route /admin/services/edit/:itemId
  useEffect(() => {
    if (action === 'edit' && itemId && services.length > 0) {
      const match = services.find(s => String(s.id) === String(itemId) || s.slug === itemId);
      if (match) {
        openFullEditor(match);
      }
    }
  }, [action, itemId, services]);

  const openFullEditor = (srv: ServiceItem) => {
    setEditingService({ ...srv });
    setIsFullEditing(true);
    setEditorSubTab('sections');
    setOpenSectionAccordions({
      'section-1': true,
      'section-2': false,
      'section-3': false,
      'section-4': false,
      'section-5': false,
      'section-6': false,
      'section-7': false,
      'section-8': false,
      'section-9': false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeFullEditor = () => {
    setIsFullEditing(false);
    setEditingService(null);
    navigate('/admin/services', { replace: true });
  };

  const createNewService = () => {
    const newSrv: ServiceItem = {
      id: null,
      title: '',
      slug: '',
      description: '',
      icon: 'Code',
      color: 'bg-red-500/10 text-red-500 border-red-500/30',
      image: '',
      content: '',
      author: 'admin',
      status: 'published',
      updated_at: new Date().toISOString(),
      hero_badge: 'High-Growth Digital Service',
      hero_accent: 'That Converts High-Ticket Clients',
      hero_bullets: [...DEFAULT_HERO_BULLETS],
      core_pillars: [...DEFAULT_CORE_PILLARS],
      capabilities: [...DEFAULT_CAPABILITIES],
      benefits: [...DEFAULT_BENEFITS],
      process_steps: [...DEFAULT_STEPS],
      case_wins: [...DEFAULT_CASE_WINS],
      target_industries: [...DEFAULT_INDUSTRIES],
      tools_used: [...DEFAULT_TOOLS],
      pricing: [...DEFAULT_PRICING],
      faqs: [...DEFAULT_FAQS],
      worldwide_badge: 'Global Deployment',
      worldwide_title: 'Worldwide Operations & 24/7 Client Coverage',
      worldwide_desc: 'Delivering high-performance software engineering, SEO dominance, and growth solutions to businesses across North America, Europe, the Middle East, and Asia.',
      countries_served: 'United States, United Kingdom, United Arab Emirates, Germany, Canada, Australia, Pakistan',
      map_query: 'United States',
      map_status_text: 'Global Deployment Ready',
      map_coverage_text: '24/7 Client Coverage',
      seo_settings: {
        seoTitle: '',
        metaDescription: '',
        slug: ''
      }
    };
    openFullEditor(newSrv);
  };

  // Full Editor Save
  const saveFullEditor = async () => {
    if (!editingService) return;
    if (!editingService.title.trim()) {
      toast.error('Service title cannot be empty.');
      return;
    }

    const finalSlug = formatSlug(
      editingService.slug || editingService.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, ''),
      String(editingService.id || 'service')
    );

    const extSeo = {
      ...(editingService.seo_settings || {}),
      seoTitle: editingService.seo_settings?.seoTitle || editingService.title,
      metaDescription: editingService.seo_settings?.metaDescription || editingService.description,
      slug: finalSlug,
      hero_badge: editingService.hero_badge,
      hero_accent: editingService.hero_accent,
      hero_bullets: editingService.hero_bullets,
      core_pillars: editingService.core_pillars,
      capabilities: editingService.capabilities,
      benefits: editingService.benefits,
      process_steps: editingService.process_steps,
      case_wins: editingService.case_wins,
      target_industries: editingService.target_industries,
      tools_used: editingService.tools_used,
      pricing: editingService.pricing,
      faqs: editingService.faqs,
      worldwide_badge: editingService.worldwide_badge,
      worldwide_title: editingService.worldwide_title,
      worldwide_desc: editingService.worldwide_desc,
      countries_served: editingService.countries_served,
      map_query: editingService.map_query,
      map_status_text: editingService.map_status_text,
      map_coverage_text: editingService.map_coverage_text
    };

    const serviceToSave: ServiceItem = {
      ...editingService,
      slug: finalSlug,
      updated_at: new Date().toISOString(),
      seo_settings: extSeo
    };

    const rowPayload = {
      title: serviceToSave.title,
      slug: finalSlug,
      description: serviceToSave.description,
      icon: serviceToSave.icon,
      color: serviceToSave.color,
      image: serviceToSave.image || '',
      featured_image: serviceToSave.image || '',
      hero_badge: serviceToSave.hero_badge || '',
      features: serviceToSave.capabilities || [],
      pricing: serviceToSave.pricing || [],
      process_steps: serviceToSave.process_steps || [],
      content: serviceToSave.content || '',
      author: serviceToSave.author || 'admin',
      status: serviceToSave.status || 'published',
      meta_title: extSeo.seoTitle || serviceToSave.title,
      meta_description: extSeo.metaDescription || serviceToSave.description,
      seo_settings: extSeo,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingService.id) {
        const numId = !isNaN(Number(editingService.id)) ? Number(editingService.id) : editingService.id;
        const { error: updateError } = await supabase.from('services').update(rowPayload).eq('id', numId);
        if (updateError) {
          console.warn('Supabase update notice:', updateError);
        }
        const updated = services.map(s => (s.id === editingService.id ? serviceToSave : s));
        setServices(updated);
        setCached('techfnm_services_cache', updated);
        triggerContentUpdate();
        setEditingService(serviceToSave);
        toast.success(`Service "${serviceToSave.title}" saved & published live!`);
      } else {
        const { data: newRow, error: insertError } = await supabase.from('services').insert([rowPayload]).select().maybeSingle();
        if (insertError) {
          console.warn('Supabase insert notice:', insertError);
        }
        const newId = newRow?.id || Date.now();
        const createdService = { ...serviceToSave, id: newId };
        const updated = [...services, createdService];
        setServices(updated);
        setCached('techfnm_services_cache', updated);
        triggerContentUpdate();
        setEditingService(createdService);
        navigate(`/admin/services/edit/${createdService.id}`, { replace: true });
        toast.success(`Service "${createdService.title}" created & published live!`);
      }
    } catch (err) {
      console.error('Error saving service:', err);
      toast.error('Failed to save service.');
    }
  };

  // Quick Edit Save
  const saveQuickEdit = async () => {
    if (!quickEditingId) return;
    const target = services.find(s => s.id === quickEditingId);
    if (!target) return;

    const newSlug = formatSlug(quickEditData.slug || target.slug, String(target.id));
    const updatedService: ServiceItem = {
      ...target,
      title: quickEditData.title || target.title,
      slug: newSlug,
      icon: quickEditData.icon,
      status: quickEditData.status,
      updated_at: new Date().toISOString()
    };

    const rowPayload = {
      title: updatedService.title,
      slug: newSlug,
      icon: updatedService.icon,
      status: updatedService.status,
      updated_at: updatedService.updated_at
    };

    try {
      const numId = !isNaN(Number(target.id)) ? Number(target.id) : target.id;
      await supabase.from('services').update(rowPayload).eq('id', numId);
    } catch (e) {
      // fallback
    }

    const updated = services.map(s => (s.id === quickEditingId ? updatedService : s));
    setServices(updated);
    setCached('techfnm_services_cache', updated);
    triggerContentUpdate();
    setQuickEditingId(null);
    toast.success('Service updated.');
  };

  const handleTrashService = async (srv: ServiceItem) => {
    if (!window.confirm(`Move "${srv.title}" to trash?`)) return;
    const updated = services.map(s => (s.id === srv.id ? { ...s, status: 'trash' as const } : s));
    setServices(updated);
    setCached('techfnm_services_cache', updated);
    try {
      const numId = !isNaN(Number(srv.id)) ? Number(srv.id) : srv.id;
      await supabase.from('services').update({ status: 'trash' }).eq('id', numId);
    } catch (e) {}
    toast.success(`"${srv.title}" moved to trash.`);
  };

  const handleRestoreService = async (srv: ServiceItem) => {
    const updated = services.map(s => (s.id === srv.id ? { ...s, status: 'published' as const } : s));
    setServices(updated);
    setCached('techfnm_services_cache', updated);
    try {
      const numId = !isNaN(Number(srv.id)) ? Number(srv.id) : srv.id;
      await supabase.from('services').update({ status: 'published' }).eq('id', numId);
    } catch (e) {}
    toast.success(`"${srv.title}" restored.`);
  };

  const handleDeletePermanent = async (srv: ServiceItem) => {
    if (!window.confirm(`Permanently delete "${srv.title}"? This cannot be undone.`)) return;
    const updated = services.filter(s => s.id !== srv.id);
    setServices(updated);
    setCached('techfnm_services_cache', updated);
    try {
      const numId = !isNaN(Number(srv.id)) ? Number(srv.id) : srv.id;
      await supabase.from('services').delete().eq('id', numId);
    } catch (e) {}
    toast.success(`"${srv.title}" deleted.`);
  };

  // Bulk actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredServices.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: any) => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleApplyBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;
    if (bulkAction === 'trash') {
      const updated = services.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'trash' as const } : s));
      setServices(updated);
      setCached('techfnm_services_cache', updated);
      setSelectedIds([]);
      toast.success('Selected services moved to trash.');
    } else if (bulkAction === 'restore') {
      const updated = services.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'published' as const } : s));
      setServices(updated);
      setCached('techfnm_services_cache', updated);
      setSelectedIds([]);
      toast.success('Selected services restored.');
    } else if (bulkAction === 'delete') {
      if (!window.confirm('Delete selected services permanently?')) return;
      const updated = services.filter(s => !selectedIds.includes(s.id));
      setServices(updated);
      setCached('techfnm_services_cache', updated);
      setSelectedIds([]);
      toast.success('Selected services deleted.');
    }
  };

  // Filtering
  const filteredServices = services
    .filter(s => {
      if (activeTab === 'all') return s.status !== 'trash';
      if (activeTab === 'published') return s.status === 'published';
      if (activeTab === 'draft') return s.status === 'draft';
      if (activeTab === 'trash') return s.status === 'trash';
      return true;
    })
    .filter(s => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q);
    });

  const allCount = services.filter(s => s.status !== 'trash').length;
  const pubCount = services.filter(s => s.status === 'published').length;
  const draftCount = services.filter(s => s.status === 'draft').length;
  const trashCount = services.filter(s => s.status === 'trash').length;

  // Handle Featured Image Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = uploadEvent => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl && editingService) {
        setEditingService({ ...editingService, image: dataUrl });
        toast.success('Featured image loaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  // ── FULL EDITOR VIEW (1:1 PAGE MANAGER LAYOUT & UX) ──
  if (isFullEditing && editingService) {
    return (
      <div className="space-y-5 font-sans text-zinc-100 animate-in fade-in duration-150">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* TOP BAR: Back button, Title & Action controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={closeFullEditor}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer"
              title="Return to Services list"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {editingService.title ? `Edit Service: ${editingService.title}` : 'Add New Service Page'}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                  editingService.status === 'published'
                    ? 'bg-red-950/40 text-red-400 border-red-900/40'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}>
                  {editingService.status || 'published'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Edit title & slug at top, configure sections A to Z, and publish from the fixed right sidebar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {editingService.slug && (
              <a
                href={`/services/${editingService.slug}`}
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

        {/* TWO-COLUMN WORDPRESS LAYOUT: LEFT CONTENT (8 COLS) + FIXED RIGHT SIDEBAR (4 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── LEFT COLUMN (MAIN WORKSPACE: 8 COLS) ── */}
          <div className="lg:col-span-8 space-y-5 min-w-0">

            {/* 1. TOP SERVICE TITLE & PERMALINK */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Service Page Title
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. GMB Optimization & Local SEO Dominance"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-zinc-600 outline-none transition-all"
                />
              </div>

              {/* Permalink row directly below title */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 bg-[#141419] border border-zinc-800 rounded-xl px-4 py-2">
                <span className="font-semibold text-zinc-500">Permalink:</span>
                <span className="text-zinc-600">https://techfnm.com/services/</span>
                <input
                  type="text"
                  value={editingService.slug}
                  onChange={(e) => {
                    const newSlug = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
                    setEditingService({ ...editingService, slug: newSlug });
                  }}
                  placeholder="service-slug"
                  className="bg-transparent border-b border-dashed border-red-500/50 focus:border-red-500 text-red-400 font-mono text-xs outline-none px-1 py-0.5 min-w-[120px]"
                />
                {editingService.slug && (
                  <a
                    href={`/services/${editingService.slug}`}
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

            {/* 2. SECTION MANAGER TABS & CONTROLS */}
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
                  <span>⚡ Section Manager (9 Sections)</span>
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
                  <span>📝 Service Body Copy</span>
                </button>
              </div>

              {editorSubTab === 'sections' && (
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={expandAllAccordions}
                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllAccordions}
                    className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              )}
            </div>

            {/* SECTIONS ACCORDION CONTAINER */}
            {editorSubTab === 'sections' && (
              <div className="space-y-3">

                {/* ── SECTION 1: HERO & TRUST SIGNALS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-1')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <Sparkles size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 1</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Hero Section & Trust Bar
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Top fold with primary headline, highlighted accent, value proposition, and bullet highlights.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        14 Fields
                      </span>
                      {openSectionAccordions['section-1'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-1'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Type size={12} className="text-red-400" />
                            <span>Badge / Tagline</span>
                          </label>
                          <input
                            type="text"
                            value={editingService.hero_badge || ''}
                            onChange={(e) => setEditingService({ ...editingService, hero_badge: e.target.value })}
                            placeholder="e.g. High-Growth Solutions"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Type size={12} className="text-red-400" />
                            <span>Headline Highlight Accent</span>
                          </label>
                          <input
                            type="text"
                            value={editingService.hero_accent || ''}
                            onChange={(e) => setEditingService({ ...editingService, hero_accent: e.target.value })}
                            placeholder="e.g. That Turn Searches Into Loyal Customers"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-red-400 placeholder-zinc-600 outline-none"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <AlignLeft size={12} className="text-zinc-400" />
                            <span>Main Value Proposition / Description</span>
                          </label>
                          <textarea
                            rows={3}
                            value={editingService.description}
                            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                            placeholder="Drive targeted traffic and boost brand visibility with our data-driven strategies..."
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none resize-y"
                          />
                        </div>
                      </div>

                      {/* Checklist Bullets */}
                      <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-red-400" />
                            <span>Hero Proof Checklist Bullets</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const list = editingService.hero_bullets || [];
                              setEditingService({
                                ...editingService,
                                hero_bullets: [...list, 'New high-conversion proof point']
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Add Bullet</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(editingService.hero_bullets || []).map((bullet, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const list = [...(editingService.hero_bullets || [])];
                                  list[idx] = e.target.value;
                                  setEditingService({ ...editingService, hero_bullets: list });
                                }}
                                className="flex-1 bg-[#131318] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-red-600/50"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (editingService.hero_bullets || []).filter((_, i) => i !== idx);
                                  setEditingService({ ...editingService, hero_bullets: list });
                                }}
                                className="p-2 text-zinc-500 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 2: 3 CORE PILLARS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-2')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <Layers size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 2</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Core Capabilities & 3 Feature Pillars
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          3 strategic pillars that establish the core technical advantage of this service.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        3 Pillars
                      </span>
                      {openSectionAccordions['section-2'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-2'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {(editingService.core_pillars || []).map((pillar, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Pillar {idx + 1}</span>
                              <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-red-400">
                                <Zap size={11} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Title</label>
                              <input
                                type="text"
                                value={pillar.title}
                                onChange={(e) => {
                                  const list = [...(editingService.core_pillars || [])];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  setEditingService({ ...editingService, core_pillars: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Description</label>
                              <textarea
                                rows={3}
                                value={pillar.desc}
                                onChange={(e) => {
                                  const list = [...(editingService.core_pillars || [])];
                                  list[idx] = { ...list[idx], desc: e.target.value };
                                  setEditingService({ ...editingService, core_pillars: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 outline-none resize-y"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 3: STRATEGIC BENEFITS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-3')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <TrendingUp size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 3</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Strategic Benefits (Why This Service Wins)
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Cards showing why professional execution quietly decides who wins the market.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        4 Benefits
                      </span>
                      {openSectionAccordions['section-3'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-3'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {(editingService.benefits || []).map((ben, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Benefit #{idx + 1} Title</label>
                              <input
                                type="text"
                                value={ben.title}
                                onChange={(e) => {
                                  const list = [...(editingService.benefits || [])];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  setEditingService({ ...editingService, benefits: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Description</label>
                              <textarea
                                rows={2}
                                value={ben.desc}
                                onChange={(e) => {
                                  const list = [...(editingService.benefits || [])];
                                  list[idx] = { ...list[idx], desc: e.target.value };
                                  setEditingService({ ...editingService, benefits: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 outline-none resize-y"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 4: 4-STAGE DELIVERY PROCESS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-4')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <CheckSquare size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 4</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            4-Stage Delivery Process Framework
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Step-by-step roadmap from technical scope to deployment and optimization.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        4 Steps
                      </span>
                      {openSectionAccordions['section-4'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-4'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {(editingService.process_steps || []).map((step, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-red-400 font-bold">{step.step || `0${idx + 1}`}</span>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Step Title</label>
                              <input
                                type="text"
                                value={step.title}
                                onChange={(e) => {
                                  const list = [...(editingService.process_steps || [])];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  setEditingService({ ...editingService, process_steps: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Description</label>
                              <textarea
                                rows={2}
                                value={step.desc}
                                onChange={(e) => {
                                  const list = [...(editingService.process_steps || [])];
                                  list[idx] = { ...list[idx], desc: e.target.value };
                                  setEditingService({ ...editingService, process_steps: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 outline-none resize-y"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 5: PROVEN CASE WINS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-5')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <BarChart3 size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 5</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Proven Case Wins & Measurable ROI
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Showcase real client metrics (+320%, +210%, 4X ROI) and turnaround stories.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        {(editingService.case_wins || []).length} Case Wins
                      </span>
                      {openSectionAccordions['section-5'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-5'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const list = editingService.case_wins || [];
                            setEditingService({
                              ...editingService,
                              case_wins: [
                                ...list,
                                { stat: '+250%', title: 'Revenue Metric', timeframe: '3 Months', story: 'Transformation narrative...' }
                              ]
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Case Win</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {(editingService.case_wins || []).map((win, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-zinc-500">Case Win #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (editingService.case_wins || []).filter((_, i) => i !== idx);
                                  setEditingService({ ...editingService, case_wins: list });
                                }}
                                className="text-zinc-500 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-zinc-400">Stat (e.g. +320%)</label>
                              <input
                                type="text"
                                value={win.stat}
                                onChange={(e) => {
                                  const list = [...(editingService.case_wins || [])];
                                  list[idx] = { ...list[idx], stat: e.target.value };
                                  setEditingService({ ...editingService, case_wins: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-red-400 font-bold outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-zinc-400">Title</label>
                              <input
                                type="text"
                                value={win.title}
                                onChange={(e) => {
                                  const list = [...(editingService.case_wins || [])];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  setEditingService({ ...editingService, case_wins: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-zinc-400">Timeframe</label>
                              <input
                                type="text"
                                value={win.timeframe}
                                onChange={(e) => {
                                  const list = [...(editingService.case_wins || [])];
                                  list[idx] = { ...list[idx], timeframe: e.target.value };
                                  setEditingService({ ...editingService, case_wins: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 6: TARGET INDUSTRIES & TOOLS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-6')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <Building size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 6</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Target Industries & Tools Ecosystem
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Verticals that achieve the highest conversion uplift from this service.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        {(editingService.target_industries || []).length} Industries
                      </span>
                      {openSectionAccordions['section-6'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-6'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {(editingService.target_industries || []).map((ind, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Industry Name</label>
                              <input
                                type="text"
                                value={ind.title}
                                onChange={(e) => {
                                  const list = [...(editingService.target_industries || [])];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  setEditingService({ ...editingService, target_industries: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Description</label>
                              <textarea
                                rows={2}
                                value={ind.desc}
                                onChange={(e) => {
                                  const list = [...(editingService.target_industries || [])];
                                  list[idx] = { ...list[idx], desc: e.target.value };
                                  setEditingService({ ...editingService, target_industries: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 outline-none resize-y"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 7: PRICING & DELIVERABLES ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-7')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <DollarSign size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 7</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Pricing & Deliverables Packages
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Starter, Growth, and Enterprise tier pricing with deliverable lists.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        3 Tiers
                      </span>
                      {openSectionAccordions['section-7'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-7'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {(editingService.pricing || []).map((plan, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Tier {idx + 1}</span>
                              <label className="flex items-center gap-1 text-[10px] text-zinc-400 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={plan.popular}
                                  onChange={(e) => {
                                    const list = [...(editingService.pricing || [])];
                                    list[idx] = { ...list[idx], popular: e.target.checked };
                                    setEditingService({ ...editingService, pricing: list });
                                  }}
                                  className="rounded border-zinc-700 text-red-600 bg-zinc-900"
                                />
                                <span>Popular</span>
                              </label>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Plan Name</label>
                              <input
                                type="text"
                                value={plan.name}
                                onChange={(e) => {
                                  const list = [...(editingService.pricing || [])];
                                  list[idx] = { ...list[idx], name: e.target.value };
                                  setEditingService({ ...editingService, pricing: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-zinc-300">Price Display</label>
                              <input
                                type="text"
                                value={plan.price}
                                onChange={(e) => {
                                  const list = [...(editingService.pricing || [])];
                                  list[idx] = { ...list[idx], price: e.target.value };
                                  setEditingService({ ...editingService, pricing: list });
                                }}
                                className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-red-400 font-bold outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 8: WORLDWIDE OPERATIONS & DYNAMIC LIVE MAP ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-8')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <Globe size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 8</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Worldwide Operations & Dynamic Live Map
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Global deployment badge, headline, countries served list, and real-color Google Maps query.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-0.5 rounded">
                        Live Map Enabled
                      </span>
                      {openSectionAccordions['section-8'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-8'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Type size={12} className="text-red-400" />
                            <span>Section Badge</span>
                          </label>
                          <input
                            type="text"
                            value={editingService.worldwide_badge || ''}
                            onChange={(e) => setEditingService({ ...editingService, worldwide_badge: e.target.value })}
                            placeholder="e.g. Global Deployment"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Type size={12} className="text-red-400" />
                            <span>Section Main Headline</span>
                          </label>
                          <input
                            type="text"
                            value={editingService.worldwide_title || ''}
                            onChange={(e) => setEditingService({ ...editingService, worldwide_title: e.target.value })}
                            placeholder="e.g. Worldwide Operations & 24/7 Client Coverage"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <AlignLeft size={12} className="text-zinc-400" />
                            <span>Worldwide Operations Description</span>
                          </label>
                          <textarea
                            rows={2}
                            value={editingService.worldwide_desc || ''}
                            onChange={(e) => setEditingService({ ...editingService, worldwide_desc: e.target.value })}
                            placeholder="Delivering high-performance software engineering, SEO dominance, and growth solutions..."
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 outline-none resize-y"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <MapPin size={12} className="text-red-400" />
                            <span>Countries & Regions Actively Served (comma separated)</span>
                          </label>
                          <input
                            type="text"
                            value={
                              Array.isArray(editingService.countries_served)
                                ? editingService.countries_served.join(', ')
                                : (editingService.countries_served || '')
                            }
                            onChange={(e) => setEditingService({ ...editingService, countries_served: e.target.value })}
                            placeholder="United States, United Kingdom, UAE, Germany, Canada, Australia, Pakistan"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Globe size={12} className="text-red-400" />
                            <span>Google Maps Search Query / Coordinates</span>
                          </label>
                          <input
                            type="text"
                            value={editingService.map_query || ''}
                            onChange={(e) => setEditingService({ ...editingService, map_query: e.target.value })}
                            placeholder="e.g. United States or New York, USA"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-red-400" />
                            <span>Map Bottom Status Badge</span>
                          </label>
                          <input
                            type="text"
                            value={editingService.map_status_text || ''}
                            onChange={(e) => setEditingService({ ...editingService, map_status_text: e.target.value })}
                            placeholder="e.g. Global Deployment Ready"
                            className="w-full bg-[#131318] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                          />
                        </div>
                      </div>

                      {/* Map Live Preview Box */}
                      <div className="pt-2 border-t border-zinc-800/80">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                          Live Map Output Preview (Real Natural Colors)
                        </label>
                        <div className="h-44 w-full rounded-xl overflow-hidden border border-zinc-800 bg-black">
                          <iframe
                            title="Admin Map Preview"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(editingService.map_query || 'United States')}&t=m&z=3&output=embed&iwloc=near`}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── SECTION 9: FAQS ── */}
                <div className="rounded-2xl border border-zinc-800/90 bg-[#0e0e12] overflow-hidden shadow-md transition-all">
                  <button
                    type="button"
                    onClick={() => toggleSectionAccordion('section-9')}
                    className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#131319] hover:bg-[#171720] border-b border-zinc-800/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-red-400 shrink-0">
                        <HelpCircle size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase">Section 9</span>
                          <span className="text-zinc-600">•</span>
                          <h4 className="text-sm font-bold text-white tracking-tight truncate">
                            Frequently Asked Questions (FAQ)
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                          Questions and authoritative answers that address common buyer objections.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-[10px] font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline">
                        {(editingService.faqs || []).length} Questions
                      </span>
                      {openSectionAccordions['section-9'] ? <ChevronUp size={15} className="text-zinc-400" /> : <ChevronDown size={15} className="text-zinc-400" />}
                    </div>
                  </button>

                  {openSectionAccordions['section-9'] && (
                    <div className="p-4 sm:p-5 space-y-4 bg-[#0e0e12]">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const list = editingService.faqs || [];
                            setEditingService({
                              ...editingService,
                              faqs: [...list, { q: 'New question here?', a: 'Direct, confident answer...' }]
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold border border-zinc-800 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Question</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(editingService.faqs || []).map((faq, idx) => (
                          <div key={idx} className="bg-[#131318] border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-zinc-500">FAQ #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = (editingService.faqs || []).filter((_, i) => i !== idx);
                                  setEditingService({ ...editingService, faqs: list });
                                }}
                                className="text-zinc-500 hover:text-red-400 cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => {
                                const list = [...(editingService.faqs || [])];
                                list[idx] = { ...list[idx], q: e.target.value };
                                setEditingService({ ...editingService, faqs: list });
                              }}
                              placeholder="Question..."
                              className="w-full bg-[#181820] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold outline-none"
                            />
                            <textarea
                              rows={2}
                              value={faq.a}
                              onChange={(e) => {
                                const list = [...(editingService.faqs || [])];
                                list[idx] = { ...list[idx], a: e.target.value };
                                setEditingService({ ...editingService, faqs: list });
                              }}
                              placeholder="Answer..."
                              className="w-full bg-[#181820] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 outline-none resize-y"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* RAW BODY CONTENT */}
            {editorSubTab === 'raw' && (
              <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Service Detailed Body Content & Markdown
                  </label>
                  <span className="text-[11px] text-zinc-500">Extended service documentation</span>
                </div>
                <textarea
                  rows={12}
                  value={editingService.content || ''}
                  onChange={(e) => setEditingService({ ...editingService, content: e.target.value })}
                  placeholder="Enter main narrative paragraphs or HTML copy..."
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
                />
              </div>
            )}

            {/* YOAST / RANKMATH STYLE SEO SETTINGS PANEL */}
            <SeoSettingsPanel
              data={editingService.seo_settings || {}}
              onChange={(updated) => setEditingService({ ...editingService, seo_settings: updated })}
              defaultTitle={editingService.title}
              defaultSlug={editingService.slug}
              defaultDescription={editingService.description}
              defaultImage={editingService.image}
              contentType="service"
            />

          </div>

          {/* ── RIGHT COLUMN (FIXED SIDEBAR: 4 COLS - ALWAYS VISIBLE AS REQUESTED) ── */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">

            {/* 1. PUBLISH & STATUS CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish</span>
                <span className={`w-2 h-2 rounded-full ${editingService.status === 'published' ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <select
                    value={editingService.status || 'published'}
                    onChange={(e) => setEditingService({ ...editingService, status: e.target.value as any })}
                    className="bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-white outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Visibility:</span>
                  <span className="font-semibold text-white">Public</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Author:</span>
                  <span className="font-semibold text-white">{editingService.author || 'admin'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Date:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">
                    {editingService.updated_at ? new Date(editingService.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Move this service to trash?')) {
                        handleTrashService(editingService);
                        closeFullEditor();
                      }
                    }}
                    className="text-red-400 hover:text-red-300 hover:underline text-xs cursor-pointer"
                  >
                    Move to Trash
                  </button>

                  <button
                    type="button"
                    onClick={() => saveFullEditor()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-950/30 transition-all cursor-pointer"
                  >
                    Update & Publish
                  </button>
                </div>
              </div>
            </div>

            {/* 2. SERVICE ATTRIBUTES */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Service Attributes</span>
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold block">Service Icon</label>
                  <select
                    value={editingService.icon}
                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  >
                    {AVAILABLE_ICONS.map(i => (
                      <option key={i.name} value={i.name}>{i.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 font-semibold block">Brand Color Theme</label>
                  <select
                    value={editingService.color}
                    onChange={(e) => setEditingService({ ...editingService, color: e.target.value })}
                    className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  >
                    {COLOR_PRESETS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. FEATURED IMAGE */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Featured Image</span>
                <ImageIcon size={13} className="text-red-400" />
              </div>

              <div className="p-4 space-y-3 text-xs">
                {editingService.image ? (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-video group">
                    <img
                      src={editingService.image}
                      alt="Featured"
                      className="w-full h-full object-cover"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setEditingService({ ...editingService, image: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-zinc-500">
                    <ImageIcon size={24} className="mx-auto text-zinc-600 mb-1" />
                    <span>No image set</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/50 text-red-400 font-bold border border-red-900/40 cursor-pointer transition-colors">
                    <Upload size={13} />
                    <span>Choose Image from PC</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    placeholder="Or paste image URL here..."
                    className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 outline-none"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ── TABLE / LIST VIEW (1:1 PAGE MANAGER LAYOUT AS SHOWN IN USER'S SCREENSHOT 3) ──
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="text-red-500" size={24} />
            <span>Services Catalog</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage high-converting service landing pages, lead capture funnels, and section-by-section content.
          </p>
        </div>

        <button
          onClick={createNewService}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* STATUS TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-red-950/40 text-red-400 border border-red-900/40 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All <span className="text-zinc-500 font-mono text-[11px]">({allCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'published'
                ? 'bg-red-950/40 text-red-400 border border-red-900/40 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Published <span className="text-zinc-500 font-mono text-[11px]">({pubCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'draft'
                ? 'bg-red-950/40 text-red-400 border border-red-900/40 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Drafts <span className="text-zinc-500 font-mono text-[11px]">({draftCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('trash')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'trash'
                ? 'bg-red-950/40 text-red-400 border border-red-900/40 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Trash <span className="text-zinc-500 font-mono text-[11px]">({trashCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-[#111116] border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-600/50"
          />
        </div>
      </div>

      {/* BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
          <span className="text-zinc-400">{selectedIds.length} selected</span>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 outline-none text-xs"
          >
            <option value="">Bulk Actions</option>
            {activeTab !== 'trash' ? (
              <option value="trash">Move to Trash</option>
            ) : (
              <>
                <option value="restore">Restore</option>
                <option value="delete">Delete Permanently</option>
              </>
            )}
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* TABLE MATCHING IMAGE 3 */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#131319] text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3.5 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredServices.length && filteredServices.length > 0}
                    className="rounded border-zinc-700 text-red-600 focus:ring-red-500 bg-zinc-900"
                  />
                </th>
                <th className="px-4 py-3.5">Title</th>
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Managed Sections</th>
                <th className="px-4 py-3.5 w-12 text-center">
                  <MessageSquare size={13} className="inline text-zinc-500" />
                </th>
                <th className="px-4 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono">
                    Loading services...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No services found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map(srv => {
                  const SrvIcon = iconMap[srv.icon] || Code;
                  const currentSlug = formatSlug(srv.slug, String(srv.id));

                  if (quickEditingId === srv.id) {
                    return (
                      <tr key={srv.id} className="bg-zinc-900/60 border-l-2 border-red-500">
                        <td className="p-4" colSpan={6}>
                          <div className="space-y-3 p-2">
                            <span className="font-bold text-xs text-white">Quick Edit: {srv.title}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Title</label>
                                <input
                                  type="text"
                                  value={quickEditData.title}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Slug</label>
                                <input
                                  type="text"
                                  value={quickEditData.slug}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, slug: e.target.value })}
                                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Status</label>
                                <select
                                  value={quickEditData.status}
                                  onChange={(e) => setQuickEditData({ ...quickEditData, status: e.target.value as any })}
                                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200"
                                >
                                  <option value="published">Published</option>
                                  <option value="draft">Draft</option>
                                </select>
                              </div>
                              <div className="flex items-end gap-2">
                                <button
                                  onClick={saveQuickEdit}
                                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setQuickEditingId(null)}
                                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={srv.id} className="hover:bg-zinc-900/30 transition-colors group">
                      <td className="px-4 py-3.5 align-top">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(srv.id)}
                          onChange={() => handleSelectOne(srv.id)}
                          className="rounded border-zinc-700 text-red-600 focus:ring-red-500 bg-zinc-900 mt-1"
                        />
                      </td>

                      {/* TITLE + HOVER ACTIONS */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openFullEditor(srv)}
                              className="font-bold text-sm text-white hover:text-red-400 hover:underline text-left cursor-pointer"
                            >
                              {srv.title}
                            </button>
                            {srv.status === 'draft' && (
                              <span className="text-[11px] text-zinc-400 font-medium">
                                — Draft
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 opacity-80 group-hover:opacity-100 transition-opacity">
                            {srv.status === 'trash' ? (
                              <>
                                <button
                                  onClick={() => handleRestoreService(srv)}
                                  className="text-white hover:underline cursor-pointer"
                                >
                                  Restore
                                </button>
                                <span>|</span>
                                <button
                                  onClick={() => handleDeletePermanent(srv)}
                                  className="text-red-400 hover:underline cursor-pointer"
                                >
                                  Delete Permanently
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => openFullEditor(srv)}
                                  className="text-zinc-400 hover:text-red-400 hover:underline cursor-pointer font-medium"
                                >
                                  Edit (Sections A-Z)
                                </button>
                                <span>|</span>
                                <button
                                  onClick={() => {
                                    setQuickEditingId(srv.id);
                                    setQuickEditData({
                                      title: srv.title,
                                      slug: currentSlug,
                                      icon: srv.icon,
                                      status: srv.status as any || 'published'
                                    });
                                  }}
                                  className="text-zinc-400 hover:text-red-400 hover:underline cursor-pointer"
                                >
                                  Quick Edit
                                </button>
                                <span>|</span>
                                <button
                                  onClick={() => handleTrashService(srv)}
                                  className="text-red-400 hover:underline cursor-pointer"
                                >
                                  Trash
                                </button>
                                <span>|</span>
                                <a
                                  href={`/services/${currentSlug}`}
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

                      {/* AUTHOR */}
                      <td className="px-4 py-3.5 align-top text-zinc-400 font-medium">
                        <span className="text-zinc-300 hover:text-white cursor-pointer">
                          {srv.author || 'admin'}
                        </span>
                      </td>

                      {/* MANAGED SECTIONS PILL */}
                      <td className="px-4 py-3.5 align-top">
                        <button
                          onClick={() => openFullEditor(srv)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 transition-colors cursor-pointer"
                        >
                          <Layers size={10} className="text-red-400" />
                          <span>9 Live Sections</span>
                        </button>
                      </td>

                      {/* COMMENTS */}
                      <td className="px-4 py-3.5 align-top text-center text-zinc-600">
                        —
                      </td>

                      {/* DATE & STATUS */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="text-zinc-300 font-medium">
                          {srv.status === 'published' ? 'Published' : 'Draft'}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          {srv.updated_at ? new Date(srv.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
