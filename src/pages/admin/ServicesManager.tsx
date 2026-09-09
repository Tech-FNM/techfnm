import React, { useEffect, useState } from 'react';
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
  CheckSquare
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import SeoSettingsPanel, { SeoSettingsData } from '../../components/admin/SeoSettingsPanel';
import { setCached, CANONICAL_SERVICES } from '../../lib/canonicalData';
import { triggerContentUpdate } from '../../lib/cmsContent';

export interface FeatureBenefit {
  title: string;
  desc: string;
  icon: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: 'one-time' | 'month';
  popular: boolean;
  features: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

const AVAILABLE_ICONS = [
  { name: 'Code', icon: Code, label: 'Web / Code' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile App' },
  { name: 'PenTool', icon: PenTool, label: 'Design / Writing' },
  { name: 'Globe', icon: Globe, label: 'SEO / Marketing' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'E-Commerce' },
  { name: 'Share2', icon: Share2, label: 'Social Media' }
];

const AVAILABLE_FEATURE_ICONS = [
  { name: 'Sparkles', icon: Sparkles, label: 'Sparkles / AI' },
  { name: 'Zap', icon: Zap, label: 'Speed / Fast' },
  { name: 'Shield', icon: Shield, label: 'Security' },
  { name: 'Code', icon: Code, label: 'Code / Dev' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile' },
  { name: 'Globe', icon: Globe, label: 'SEO / Web' },
  { name: 'PenTool', icon: PenTool, label: 'Design / Creative' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'E-Commerce' },
  { name: 'Share2', icon: Share2, label: 'Social' },
  { name: 'CheckCircle2', icon: CheckCircle2, label: 'Verified' },
  { name: 'ArrowRight', icon: ArrowRight, label: 'Growth' }
];

const COLOR_PRESETS = [
  { label: 'Red Glow', value: 'bg-red-500/10 text-red-500 border-red-500/30' },
  { label: 'Blue Sky', value: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { label: 'Purple Neon', value: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { label: 'Emerald Mint', value: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { label: 'Amber Gold', value: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { label: 'Rose Pink', value: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
];

const DEFAULT_FEATURES: FeatureBenefit[] = [
  { title: 'Tailored Strategy', desc: 'Solutions crafted specifically around your unique business objectives and target audience.', icon: 'Sparkles' },
  { title: 'Performance First', desc: 'Optimized execution ensuring fast response times and high usability index.', icon: 'Zap' },
  { title: 'Continuous Support', desc: 'Technical support post-delivery to ensure system updates and stable operation.', icon: 'Shield' }
];

const DEFAULT_PRICING: PricingPlan[] = [
  { name: 'Essential Pack', price: '$399', period: 'one-time', popular: false, features: ['Basic setup & implementation', 'Optimized standard layouts', '2 Revision cycles', 'Standard support'] },
  { name: 'Professional Suite', price: '$799', period: 'one-time', popular: true, features: ['Comprehensive custom features', 'High-performance components', '5 Revision cycles', 'Priority support'] },
  { name: 'Enterprise Custom', price: 'Custom Quote', period: 'one-time', popular: false, features: ['Fully tailored system requirements', 'Unlimited scale architectures', 'Unlimited revisions', 'Dedicated developer resource'] }
];

const DEFAULT_STEPS: ProcessStep[] = [
  { step: '01', title: 'Consultation & Scope', desc: 'Understanding your product vision, key features, and growth metrics.' },
  { step: '02', title: 'Strategy & Mockups', desc: 'Creating structured layouts, interactive user paths, and wireframes.' },
  { step: '03', title: 'Agile Implementation', desc: 'Writing clean, production-ready code with continuous feature reviews.' },
  { step: '04', title: 'Deployment & Support', desc: 'Launching the system online followed by periodic optimization reports.' }
];

const SERVICE_FEATURES_MAP: Record<string, FeatureBenefit[]> = {
  'web development': [
    { title: 'Custom Architectures', desc: 'Custom built codebases optimized for loading speeds, scalability, and security.', icon: 'Code' },
    { title: 'Responsive Design', desc: 'Perfect layouts across mobile, tablet, and widescreen monitor displays.', icon: 'Smartphone' },
    { title: 'SEO Optimized Structure', desc: 'Semantic markup designed to help search engine crawlers rank your site higher.', icon: 'Globe' }
  ],
  'content writing': [
    { title: 'SEO Friendly Copy', desc: 'Crafting texts targeting organic search keywords while maintaining human engagement.', icon: 'Globe' },
    { title: 'Brand Tone Alignment', desc: 'Aligning vocabulary and voice with your corporate values and targeted demographics.', icon: 'PenTool' },
    { title: 'Proofread & Ready', desc: 'Flawless execution with ZERO grammatical errors or formatting issues.', icon: 'Sparkles' }
  ],
  'digital marketing': [
    { title: 'Data-Driven Insights', desc: 'Targeting demographics based on real-time search trends and customer actions.', icon: 'Zap' },
    { title: 'Lead Ingestion', desc: 'Converting traffic into actual prospects through structured funnels and CTAs.', icon: 'ArrowRight' },
    { title: 'High ROI Campaigns', desc: 'Budget allocation focused on channels showing maximum click-through rates.', icon: 'Shield' }
  ],
  'ui/ux design': [
    { title: 'Interactive Prototypes', desc: 'Before writing code, interact with high fidelity mockups to test workflows.', icon: 'Sparkles' },
    { title: 'Aesthetic Interfaces', desc: 'Stunning layouts crafted using modern typography, glassmorphism, and color theory.', icon: 'PenTool' },
    { title: 'User-Centric Journeys', desc: 'Flows designed to minimize friction and lead users straight to checkout or signup.', icon: 'CheckCircle2' }
  ],
  'e-commerce': [
    { title: 'Secure Payment Flow', desc: 'Integration with Stripe, PayPal, and local gateways prioritizing cardholder data safety.', icon: 'Shield' },
    { title: 'Easy Catalog Updates', desc: 'Admin panel configured to easily update inventory, prices, and discounts.', icon: 'ShoppingCart' },
    { title: 'Fast Checkouts', desc: 'Minimize cart abandonment with optimized, single-page checkout forms.', icon: 'Zap' }
  ]
};

const SERVICE_PRICING_MAP: Record<string, PricingPlan[]> = {
  'web development': [
    { name: 'Starter Pack', price: '$499', period: 'one-time', popular: false, features: ['5 Sections Landing Page', 'Custom Framer Motion animations', 'Basic SEO optimization', '3 Revision cycles', '1 Month post support'] },
    { name: 'Standard Growth', price: '$999', period: 'one-time', popular: true, features: ['Up to 5 custom pages', 'Interactive dynamic dashboard', 'SEO audit & keyword mapping', '5 Revision cycles', '3 Months priority support'] },
    { name: 'Enterprise Custom', price: '$2,499', period: 'one-time', popular: false, features: ['Unlimited customized pages', 'API & Serverless integrations', 'Complete design system', 'Unlimited revisions', '12 Months SLA support'] }
  ],
  'content writing': [
    { name: 'Blog Starter', price: '$99', period: 'one-time', popular: false, features: ['3 Custom blogs (1000 words)', 'Keyword SEO research', '1 Revision cycle', 'Turnaround: 5 days'] },
    { name: 'Brand Authority', price: '$249', period: 'one-time', popular: true, features: ['10 Optimized blogs (1200 words)', 'Topic research & strategy', 'Tone of voice alignment', '3 Revision cycles', 'Turnaround: 10 days'] },
    { name: 'Full Ingestion Pack', price: '$599', period: 'one-time', popular: false, features: ['Complete website copywriting', 'Continuous newsletter campaigns', 'Meta descriptions & Alt texts', 'Unlimited revisions', 'Dedicated content editor'] }
  ],
  'digital marketing': [
    { name: 'Social Setup', price: '$199', period: 'month', popular: false, features: ['Social audits & profiles setup', '4 Custom creatives/mo', 'Basic hashtag analysis', 'Monthly analytics report'] },
    { name: 'Lead Multiplier', price: '$499', period: 'month', popular: true, features: ['PPC Ads campaign setup', '12 Custom creatives/mo', 'A/B testing & landing copy', 'Weekly performance sync'] },
    { name: 'Market Omnipresence', price: '$1,199', period: 'month', popular: false, features: ['Complete Google & Meta PPC management', 'Daily keyword optimization', 'Advanced conversion funnels', 'Dedicated marketing lead'] }
  ],
  'ui/ux design': [
    { name: 'Visual Draft', price: '$299', period: 'one-time', popular: false, features: ['Landing page UI layout design', 'Complete typography & assets', '2 Revision cycles', 'Figma source delivery'] },
    { name: 'Interactive System', price: '$699', period: 'one-time', popular: true, features: ['Full web/mobile app design system', 'High-fidelity dynamic prototype', 'User journey mapping', '5 Revision cycles', 'Figma dev handoff'] },
    { name: 'Product Suite Design', price: '$1,499', period: 'one-time', popular: false, features: ['Unlimited product UI assets', 'Full SaaS dashboard design', 'Interactive UX animations', 'Unlimited revisions', 'Design review syncs'] }
  ],
  'e-commerce': [
    { name: 'Shopify Lite', price: '$699', period: 'one-time', popular: false, features: ['Shopify store setup & premium theme', 'Up to 20 products setup', 'Payment & shipping integrations', 'Basic training guide'] },
    { name: 'Advanced WooCommerce', price: '$1,499', period: 'one-time', popular: true, features: ['Custom WordPress/Next.js store', 'Up to 100 products setup', 'Fast checkout flow integration', '3 Months developer support'] },
    { name: 'Headless Scaler', price: '$3,499', period: 'one-time', popular: false, features: ['Complete Headless commerce engine', 'Unlimited products / collections', 'ERP & warehouse integrations', 'Custom payment pipelines', '12 Months SLA support'] }
  ]
};

interface ServiceItem {
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
  features?: FeatureBenefit[];
  pricing?: PricingPlan[];
  process_steps?: ProcessStep[];
  seo_settings?: SeoSettingsData & {
    hero_badge?: string;
    features?: FeatureBenefit[];
    pricing?: PricingPlan[];
    process_steps?: ProcessStep[];
  };
}

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Full Editor State
  const [isFullEditing, setIsFullEditing] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

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
        const mapped: ServiceItem[] = data.map((row: any) => ({
          id: row.id,
          title: row.title || 'Untitled Service',
          slug: `/services/${row.id}`,
          description: row.description || '',
          icon: row.icon || 'Code',
          color: row.color || 'bg-red-500/10 text-red-500',
          image: row.image || row.featured_image || '',
          content: row.content || '',
          author: row.author || 'admin',
          status: (row.status as any) || 'published',
          updated_at: row.updated_at || new Date().toISOString(),
          hero_badge: row.hero_badge || row.seo_settings?.hero_badge || '',
          features: row.features || row.seo_settings?.features,
          pricing: row.pricing || row.seo_settings?.pricing,
          process_steps: row.process_steps || row.seo_settings?.process_steps,
          seo_settings: row.seo_settings || {
            seoTitle: row.meta_title,
            metaDescription: row.meta_description
          }
        }));
        setServices(mapped);
        setCached('techfnm_services_cache', mapped);
      } else {
        // Use canonical baseline
        setServices(
          CANONICAL_SERVICES.map((s: any) => ({
            ...s,
            slug: `/services/${s.id}`,
            author: 'admin',
            status: 'published',
            updated_at: new Date().toISOString()
          }))
        );
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveServicesList = async (updated: ServiceItem[]) => {
    setServices(updated);
    setCached('techfnm_services_cache', updated);
    triggerContentUpdate();

    try {
      const rows = updated.map(s => {
        const extSeo = {
          ...(s.seo_settings || {}),
          hero_badge: s.hero_badge,
          features: s.features,
          pricing: s.pricing,
          process_steps: s.process_steps
        };
        return {
          id: typeof s.id === 'number' ? s.id : undefined,
          title: s.title,
          slug: s.slug,
          description: s.description,
          icon: s.icon,
          color: s.color,
          image: s.image,
          content: s.content,
          author: s.author || 'admin',
          status: s.status || 'published',
          meta_title: s.seo_settings?.seoTitle || s.title,
          meta_description: s.seo_settings?.metaDescription || s.description,
          seo_settings: extSeo,
          updated_at: new Date().toISOString()
        };
      });

      // Upsert into Supabase services table
      for (const row of rows) {
        if (row.id) {
          await supabase.from('services').upsert(row);
        } else {
          await supabase.from('services').insert(row);
        }
      }
    } catch (err) {
      console.error('Error syncing services to Supabase:', err);
    }
  };

  // Counts for top tabs
  const counts = {
    all: services.filter(s => s.status !== 'trash').length,
    published: services.filter(s => s.status === 'published').length,
    draft: services.filter(s => s.status === 'draft').length,
    trash: services.filter(s => s.status === 'trash').length
  };

  // Filtered list
  const filteredServices = services.filter(service => {
    if (activeTab === 'all' && service.status === 'trash') return false;
    if (activeTab === 'published' && service.status !== 'published') return false;
    if (activeTab === 'draft' && service.status !== 'draft') return false;
    if (activeTab === 'trash' && service.status !== 'trash') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = service.title.toLowerCase().includes(q);
      const matchDesc = service.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredServices.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: any) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApplyBulkAction = async () => {
    if (selectedIds.length === 0) {
      toast.error('No services selected.');
      return;
    }

    if (bulkAction === 'trash') {
      const updated = services.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'trash' as const } : s));
      saveServicesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} service(s) moved to Trash.`);
    } else if (bulkAction === 'restore') {
      const updated = services.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'published' as const } : s));
      saveServicesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} service(s) restored.`);
    } else if (bulkAction === 'delete') {
      if (!window.confirm(`Permanently delete ${selectedIds.length} service(s)?`)) return;
      const updated = services.filter(s => !selectedIds.includes(s.id));
      for (const id of selectedIds) {
        await supabase.from('services').delete().eq('id', id);
      }
      saveServicesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} service(s) deleted permanently.`);
    }
  };

  // Full Editor Open
  const openFullEditor = (service?: ServiceItem) => {
    if (service) {
      const key = (service.title || '').toLowerCase().trim();
      const existingFeatures = service.features || service.seo_settings?.features || SERVICE_FEATURES_MAP[key] || DEFAULT_FEATURES;
      const existingPricing = service.pricing || service.seo_settings?.pricing || SERVICE_PRICING_MAP[key] || DEFAULT_PRICING;
      const existingSteps = service.process_steps || service.seo_settings?.process_steps || DEFAULT_STEPS;
      const existingHeroBadge = service.hero_badge || service.seo_settings?.hero_badge || 'Innovative Solutions';

      setEditingService({
        ...service,
        hero_badge: existingHeroBadge,
        features: JSON.parse(JSON.stringify(existingFeatures)),
        pricing: JSON.parse(JSON.stringify(existingPricing)),
        process_steps: JSON.parse(JSON.stringify(existingSteps)),
        seo_settings: service.seo_settings || {
          seoTitle: service.title,
          slug: service.slug,
          metaDescription: service.description
        }
      });
    } else {
      setEditingService({
        id: null,
        title: '',
        slug: '',
        description: '',
        icon: 'Code',
        color: 'bg-red-500/10 text-red-500',
        image: '',
        content: '',
        author: 'admin',
        status: 'published',
        updated_at: new Date().toISOString(),
        hero_badge: 'Innovative Solutions',
        features: JSON.parse(JSON.stringify(DEFAULT_FEATURES)),
        pricing: JSON.parse(JSON.stringify(DEFAULT_PRICING)),
        process_steps: JSON.parse(JSON.stringify(DEFAULT_STEPS)),
        seo_settings: {}
      });
    }
    setIsFullEditing(true);
  };

  // Save Full Editor
  const saveFullEditor = async () => {
    if (!editingService || !editingService.title.trim()) {
      toast.error('Please enter a service title.');
      return;
    }

    const extendedSeoSettings = {
      ...(editingService.seo_settings || {}),
      hero_badge: editingService.hero_badge,
      features: editingService.features,
      pricing: editingService.pricing,
      process_steps: editingService.process_steps
    };

    let updatedList: ServiceItem[];
    if (editingService.id) {
      const cleanSlug = `/services/${editingService.id}`;
      const updatedService: ServiceItem = {
        ...editingService,
        slug: cleanSlug,
        seo_settings: extendedSeoSettings,
        updated_at: new Date().toISOString()
      };
      updatedList = services.map(s => (s.id === updatedService.id ? updatedService : s));

      await supabase.from('services').update({
        title: updatedService.title,
        slug: cleanSlug,
        description: updatedService.description,
        icon: updatedService.icon,
        color: updatedService.color,
        image: updatedService.image,
        content: updatedService.content,
        author: updatedService.author,
        status: updatedService.status,
        meta_title: updatedService.seo_settings?.seoTitle || updatedService.title,
        meta_description: updatedService.seo_settings?.metaDescription || updatedService.description,
        seo_settings: extendedSeoSettings,
        updated_at: new Date().toISOString()
      }).eq('id', updatedService.id);

      setServices(updatedList);
      setCached('techfnm_services_cache', updatedList);
      triggerContentUpdate();
      setIsFullEditing(false);
      setEditingService(null);
      toast.success(`Service "${updatedService.title}" updated successfully!`);
    } else {
      const { data: newRow } = await supabase.from('services').insert([{
        title: editingService.title,
        description: editingService.description,
        icon: editingService.icon,
        color: editingService.color,
        image: editingService.image,
        content: editingService.content,
        author: editingService.author,
        status: editingService.status,
        meta_title: editingService.seo_settings?.seoTitle || editingService.title,
        meta_description: editingService.seo_settings?.metaDescription || editingService.description,
        seo_settings: extendedSeoSettings,
        updated_at: new Date().toISOString()
      }]).select().single();

      const newId = newRow ? newRow.id : Date.now();
      const cleanSlug = `/services/${newId}`;

      // Update the generated slug with the id
      if (newRow) {
        await supabase.from('services').update({ slug: cleanSlug }).eq('id', newId);
      }

      const createdService: ServiceItem = {
        ...editingService,
        id: newId,
        slug: cleanSlug,
        seo_settings: extendedSeoSettings,
        updated_at: new Date().toISOString()
      };

      updatedList = [createdService, ...services];
      setServices(updatedList);
      setCached('techfnm_services_cache', updatedList);
      triggerContentUpdate();
      setIsFullEditing(false);
      setEditingService(null);
      toast.success(`Service "${createdService.title}" created successfully at ${cleanSlug}!`);
    }
  };

  // Quick Edit Save
  const saveQuickEdit = async () => {
    if (!quickEditingId) return;
    const updated = services.map(s => {
      if (s.id === quickEditingId) {
        return {
          ...s,
          title: quickEditData.title,
          slug: `/services/${s.id}`,
          icon: quickEditData.icon,
          status: quickEditData.status
        };
      }
      return s;
    });
    await saveServicesList(updated);
    setQuickEditingId(null);
    toast.success('Service updated.');
  };

  // Handle Featured Image Upload from PC
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
        toast.success('Featured image loaded from PC!');
      }
    };
    reader.readAsDataURL(file);
  };

  // ── FULL EDITOR VIEW ──
  if (isFullEditing && editingService) {
    return (
      <div className="space-y-5 font-sans text-zinc-100 animate-in fade-in duration-150">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* TOP BAR: Back button & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsFullEditing(false); setEditingService(null); }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer"
              title="Return to Services list"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-red-500" />
                <span>{editingService.id ? `Edit Service: ${editingService.title}` : 'Add New Service Page'}</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Configure dedicated service page (/services/{editingService.id || 'id'}), deliverables, and SEO settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveFullEditor}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{editingService.status === 'published' ? 'Update & Publish' : 'Save Service Draft'}</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: 8 COLS LEFT, 4 COLS RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLS */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. TITLE, HERO BADGE & SERVICE PAGE URL CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Service Title</label>
                  <input
                    type="text"
                    value={editingService.title}
                    onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                    placeholder="e.g. Web Development"
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-base text-white font-bold placeholder-zinc-600 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Hero Badge (Top Pill)
                  </label>
                  <input
                    type="text"
                    value={editingService.hero_badge || ''}
                    onChange={e => setEditingService({ ...editingService, hero_badge: e.target.value })}
                    placeholder="e.g. Full-Cycle Engineering"
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Dedicated Service Page URL
                  </label>
                  {editingService.id && (
                    <a
                      href={`/services/${editingService.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <span>Open Live Page</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs">
                  <span className="text-zinc-300 font-mono">
                    https://techfnm.com/services/<span className="text-red-400 font-bold">{editingService.id || 'auto-assigned'}</span>
                  </span>
                  {editingService.id && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://techfnm.com/services/${editingService.id}`);
                        toast.success('Service URL copied to clipboard!');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Copy URL
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 2. SHORT SUMMARY DESCRIPTION */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Card Description (Shown on Homepage & Services Grid)
              </label>
              <textarea
                rows={3}
                value={editingService.description}
                onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                placeholder="Get a high-performance, responsive website built with the latest tech..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* 3. CORE ADVANTAGES / FEATURES BENEFITS (3-COLUMN GRID) */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-red-500" />
                    <span>Core Advantages (Features Section)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Highlighted cards shown in the 3-column benefits grid on the live service page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = editingService.features || [];
                    setEditingService({
                      ...editingService,
                      features: [
                        ...current,
                        { title: 'New Advantage', desc: 'Key outcome, guarantee, or architecture benefit...', icon: 'Sparkles' }
                      ]
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Advantage</span>
                </button>
              </div>

              <div className="space-y-3">
                {(editingService.features || []).map((feat, idx) => (
                  <div key={idx} className="bg-[#141419] border border-zinc-800 rounded-xl p-3.5 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        Advantage #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingService.features || []).filter((_, i) => i !== idx);
                          setEditingService({ ...editingService, features: updated });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remove Advantage"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Title</label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={e => {
                            const list = [...(editingService.features || [])];
                            list[idx] = { ...list[idx], title: e.target.value };
                            setEditingService({ ...editingService, features: list });
                          }}
                          placeholder="e.g. Custom Architectures"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-red-500/50"
                        />
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Icon</label>
                        <select
                          value={feat.icon || 'Sparkles'}
                          onChange={e => {
                            const list = [...(editingService.features || [])];
                            list[idx] = { ...list[idx], icon: e.target.value };
                            setEditingService({ ...editingService, features: list });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-red-500/50"
                        >
                          {AVAILABLE_FEATURE_ICONS.map(i => (
                            <option key={i.name} value={i.name}>
                              {i.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">Description</label>
                      <textarea
                        rows={2}
                        value={feat.desc}
                        onChange={e => {
                          const list = [...(editingService.features || [])];
                          list[idx] = { ...list[idx], desc: e.target.value };
                          setEditingService({ ...editingService, features: list });
                        }}
                        placeholder="Explain how this benefits the client..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-red-500/50 resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. PRICING TABLES & PACKAGES (3-COLUMN GRID) */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign size={16} className="text-red-500" />
                    <span>Pricing Tables & Packages</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Manage the 3 pricing tiers displayed on the service page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = editingService.pricing || [];
                    setEditingService({
                      ...editingService,
                      pricing: [
                        ...current,
                        {
                          name: 'New Tier',
                          price: '$499',
                          period: 'one-time',
                          popular: false,
                          features: ['Deliverable 1', 'Deliverable 2', 'Support included']
                        }
                      ]
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Plan</span>
                </button>
              </div>

              <div className="space-y-4">
                {(editingService.pricing || []).map((plan, idx) => (
                  <div key={idx} className="bg-[#141419] border border-zinc-800 rounded-xl p-4 space-y-3 relative">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-850 pb-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Tier #{idx + 1}
                        </span>
                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={plan.popular || false}
                            onChange={e => {
                              const list = [...(editingService.pricing || [])];
                              list[idx] = { ...list[idx], popular: e.target.checked };
                              setEditingService({ ...editingService, pricing: list });
                            }}
                            className="rounded border-zinc-700 text-red-600 focus:ring-red-500 bg-zinc-900"
                          />
                          <span className="text-[11px] text-zinc-400">Mark as "Most Popular"</span>
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingService.pricing || []).filter((_, i) => i !== idx);
                          setEditingService({ ...editingService, pricing: updated });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remove Plan"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Package Name</label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={e => {
                            const list = [...(editingService.pricing || [])];
                            list[idx] = { ...list[idx], name: e.target.value };
                            setEditingService({ ...editingService, pricing: list });
                          }}
                          placeholder="e.g. Standard Growth"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-red-500/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Price Display</label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={e => {
                            const list = [...(editingService.pricing || [])];
                            list[idx] = { ...list[idx], price: e.target.value };
                            setEditingService({ ...editingService, pricing: list });
                          }}
                          placeholder="e.g. $999 or Custom Quote"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-red-500/50 font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-zinc-400">Billing Cadence</label>
                        <select
                          value={plan.period || 'one-time'}
                          onChange={e => {
                            const list = [...(editingService.pricing || [])];
                            list[idx] = { ...list[idx], period: e.target.value as any };
                            setEditingService({ ...editingService, pricing: list });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-red-500/50"
                        >
                          <option value="one-time">One-time payment (/pack)</option>
                          <option value="month">Monthly subscription (/mo)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-400">
                          Included Deliverables & Checklist
                        </label>
                        <span className="text-[10px] text-zinc-500">1 deliverable per line</span>
                      </div>
                      <textarea
                        rows={4}
                        value={Array.isArray(plan.features) ? plan.features.join('\n') : ''}
                        onChange={e => {
                          const lines = e.target.value.split('\n');
                          const list = [...(editingService.pricing || [])];
                          list[idx] = { ...list[idx], features: lines };
                          setEditingService({ ...editingService, pricing: list });
                        }}
                        placeholder="5 Sections Landing Page&#10;Custom Framer Motion animations&#10;SEO audit & keyword mapping"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-red-500/50 resize-y font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. WORKING PROCESS TIMELINE (STEP-BY-STEP) */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ListPlus size={16} className="text-red-500" />
                    <span>Working Process (Step-by-Step Delivery)</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Execution milestones shown in the process section on the service page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = editingService.process_steps || [];
                    const nextNum = current.length + 1;
                    setEditingService({
                      ...editingService,
                      process_steps: [
                        ...current,
                        {
                          step: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
                          title: 'New Milestone',
                          desc: 'Description of milestone actions...'
                        }
                      ]
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(editingService.process_steps || []).map((step, idx) => (
                  <div key={idx} className="bg-[#141419] border border-zinc-800 rounded-xl p-3.5 space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        STEP {step.step || `0${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingService.process_steps || []).filter((_, i) => i !== idx);
                          setEditingService({ ...editingService, process_steps: updated });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remove Step"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">Stage Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={e => {
                          const list = [...(editingService.process_steps || [])];
                          list[idx] = { ...list[idx], title: e.target.value };
                          setEditingService({ ...editingService, process_steps: list });
                        }}
                        placeholder="e.g. Consultation & Scope"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-red-500/50 font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">Description</label>
                      <textarea
                        rows={2}
                        value={step.desc}
                        onChange={e => {
                          const list = [...(editingService.process_steps || [])];
                          list[idx] = { ...list[idx], desc: e.target.value };
                          setEditingService({ ...editingService, process_steps: list });
                        }}
                        placeholder="What is delivered during this phase..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-red-500/50 resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. DETAILED CONTENT / NARRATIVE */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Detailed Service Overview / Case Breakdown
                </label>
                <span className="text-[11px] text-zinc-500">HTML / Markdown copy</span>
              </div>
              <textarea
                rows={8}
                value={editingService.content || ''}
                onChange={e => setEditingService({ ...editingService, content: e.target.value })}
                placeholder="Detailed explanation of technologies, process deliverables, guarantees, and workflows..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* 7. YOAST / RANKMATH STYLE SEO SETTINGS PANEL */}
            <SeoSettingsPanel
              data={editingService.seo_settings || {}}
              onChange={updated => setEditingService({ ...editingService, seo_settings: updated })}
              defaultTitle={editingService.title}
              defaultSlug={editingService.id ? `/services/${editingService.id}` : '/services'}
              defaultDescription={editingService.description}
              defaultImage={editingService.image}
              contentType="service"
            />
          </div>

          {/* RIGHT 4 COLS (STICKY SIDEBAR) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            {/* 1. PUBLISH CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish</span>
                <span className={`w-2 h-2 rounded-full ${editingService.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status:</span>
                  <select
                    value={editingService.status}
                    onChange={e => setEditingService({ ...editingService, status: e.target.value as any })}
                    className="bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 outline-none font-medium"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Visibility:</span>
                  <span className="text-zinc-200 font-medium">Public</span>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={saveFullEditor}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                  >
                    {editingService.status === 'published' ? 'Update & Publish' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. ICON & STYLING CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Icon & Visual Theme</span>
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-2 font-medium">Select Service Icon</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_ICONS.map(item => {
                      const IconComp = item.icon;
                      const isSelected = editingService.icon === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setEditingService({ ...editingService, icon: item.name })}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected ? 'bg-red-500/20 border-red-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <IconComp size={20} />
                          <span className="text-[10px] truncate max-w-full">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-2 font-medium">Color Badge Accent</label>
                  <select
                    value={editingService.color}
                    onChange={e => setEditingService({ ...editingService, color: e.target.value })}
                    className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none font-medium"
                  >
                    {COLOR_PRESETS.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. FEATURED IMAGE CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Featured Image</span>
                <ImageIcon size={14} className="text-amber-400" />
              </div>
              <div className="p-4 space-y-3 text-xs">
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-650/20 to-red-900/20 hover:from-red-600/30 hover:to-red-900/30 border border-red-600/30 text-red-400 hover:text-red-300 font-bold text-xs cursor-pointer transition-all shadow-sm">
                  <Upload size={14} />
                  <span>Upload Image from Device</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 block font-medium">Or Paste Image URL</label>
                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                  />
                </div>

                {editingService.image && (
                  <div className="relative rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 aspect-video">
                    <img
                      src={editingService.image}
                      alt="Featured Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST / TABLE VIEW (PAGE MANAGEMENT STYLE) ──
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="text-red-500" size={24} />
            <span>Services Management</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage all customer-facing services, technical capabilities, pricing tiers, and SEO schema.
          </p>
        </div>

        <button
          onClick={() => openFullEditor()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* TOP TABS & STATS */}
      <div className="flex items-center gap-2 text-xs border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'all' ? 'bg-red-500/10 text-red-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All <span className="text-zinc-500 font-mono">({counts.all})</span>
        </button>
        <span className="text-zinc-700">|</span>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'published' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Published <span className="text-zinc-500 font-mono">({counts.published})</span>
        </button>
        <span className="text-zinc-700">|</span>
        <button
          onClick={() => setActiveTab('draft')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'draft' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Draft <span className="text-zinc-500 font-mono">({counts.draft})</span>
        </button>
        {counts.trash > 0 && (
          <>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setActiveTab('trash')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'trash' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Trash <span className="text-zinc-500 font-mono">({counts.trash})</span>
            </button>
          </>
        )}
      </div>

      {/* FILTER CONTROLS (BULK ACTIONS & SEARCH) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={bulkAction}
            onChange={e => setBulkAction(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
          >
            <option value="">Bulk actions</option>
            {activeTab !== 'trash' && <option value="trash">Move to Trash</option>}
            {activeTab === 'trash' && <option value="restore">Restore</option>}
            <option value="delete">Delete Permanently</option>
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 rounded-xl text-xs font-semibold text-zinc-200 cursor-pointer transition-all"
          >
            Apply
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-[#121217] border border-zinc-800 focus:border-red-600/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* TABLE LIST VIEW */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14141a] border-b border-zinc-800/80 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredServices.length > 0 && selectedIds.length === filteredServices.length}
                    className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
                  />
                </th>
                <th className="p-4">Title</th>
                <th className="p-4 w-28">Icon</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-28">Author</th>
                <th className="p-4 w-36">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-500 text-xs">
                    No services found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map(service => {
                  const isSelected = selectedIds.includes(service.id);
                  const isQuick = quickEditingId === service.id;

                  if (isQuick) {
                    return (
                      <tr key={service.id} className="bg-zinc-900/90 border-b border-zinc-700">
                        <td colSpan={6} className="p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-red-400">
                              Quick Edit Service
                            </span>
                            <button
                              onClick={() => setQuickEditingId(null)}
                              className="text-zinc-500 hover:text-zinc-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Title</label>
                              <input
                                type="text"
                                value={quickEditData.title}
                                onChange={e => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Service URL</label>
                              <div className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-red-400 font-mono">
                                /services/{quickEditingId}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Status</label>
                              <select
                                value={quickEditData.status}
                                onChange={e => setQuickEditData({ ...quickEditData, status: e.target.value as any })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setQuickEditingId(null)}
                              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveQuickEdit}
                              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                            >
                              Update Service
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={service.id}
                      className={`hover:bg-zinc-900/40 transition-colors group ${
                        isSelected ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(service.id)}
                          className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
                        />
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => openFullEditor(service)}
                            className="font-bold text-sm text-white hover:text-red-400 text-left transition-colors cursor-pointer block"
                          >
                            {service.title}
                          </button>
                          <span className="text-[11px] text-zinc-400 font-mono block truncate max-w-md">
                            https://techfnm.com/services/{service.id}
                          </span>

                          {/* Action links */}
                          <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
                            <button
                              onClick={() => openFullEditor(service)}
                              className="text-red-400 hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={() => {
                                setQuickEditingId(service.id);
                                setQuickEditData({
                                  title: service.title,
                                  slug: `/services/${service.id}`,
                                  icon: service.icon,
                                  status: service.status === 'trash' ? 'draft' : (service.status as any)
                                });
                              }}
                              className="text-indigo-400 hover:underline cursor-pointer"
                            >
                              Quick Edit
                            </button>
                            <span className="text-zinc-700">|</span>
                            {service.status === 'trash' ? (
                              <button
                                onClick={() => {
                                  const updated = services.map(s => (s.id === service.id ? { ...s, status: 'published' as const } : s));
                                  saveServicesList(updated);
                                  toast.success('Service restored.');
                                }}
                                className="text-emerald-400 hover:underline cursor-pointer"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const updated = services.map(s => (s.id === service.id ? { ...s, status: 'trash' as const } : s));
                                  saveServicesList(updated);
                                  toast.success('Moved to Trash.');
                                }}
                                className="text-rose-400 hover:underline cursor-pointer"
                              >
                                Trash
                              </button>
                            )}
                            <span className="text-zinc-700">|</span>
                            <a
                              href={`/services/${service.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${service.color || 'bg-red-500/10 text-red-500'}`}>
                          {service.icon}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : service.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {service.status}
                        </span>
                      </td>

                      <td className="p-4 text-zinc-400 font-medium">
                        {service.author || 'admin'}
                      </td>

                      <td className="p-4 text-zinc-400 text-[11px] font-mono">
                        {new Date(service.updated_at || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
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
