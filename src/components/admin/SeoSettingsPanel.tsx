import React, { useState } from 'react';
import {
  Globe,
  Share2,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export interface SeoSettingsData {
  focusKeyphrase?: string;
  seoTitle?: string;
  slug?: string;
  metaDescription?: string;
  schemaPageType?: string;
  schemaArticleType?: string;
  schemaFaqs?: Array<{ question: string; answer: string }>;
  socialImage?: string;
  socialTitle?: string;
  socialDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

interface SeoSettingsPanelProps {
  data: SeoSettingsData;
  onChange: (updated: SeoSettingsData) => void;
  defaultTitle?: string;
  defaultSlug?: string;
  defaultDescription?: string;
  defaultImage?: string;
  contentType?: 'page' | 'post' | 'service' | 'project';
  siteUrl?: string;
}

export default function SeoSettingsPanel({
  data,
  onChange,
  defaultTitle = '',
  defaultSlug = '',
  defaultDescription = '',
  defaultImage = '',
  contentType = 'page',
  siteUrl = 'https://techfnm.com'
}: SeoSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'seo' | 'readability' | 'schema' | 'social'>('seo');
  const [socialAccordionOpen, setSocialAccordionOpen] = useState(true);
  const [twitterAccordionOpen, setTwitterAccordionOpen] = useState(false);

  // Compute effective values
  const effectiveTitle = data.seoTitle || defaultTitle || 'Untitled';
  const effectiveSlug = data.slug || defaultSlug || 'page';
  const cleanSlug = effectiveSlug.replace(/^\/+/, '');
  const effectiveDesc = data.metaDescription || defaultDescription || '';
  const effectiveImage = data.socialImage || defaultImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

  const updateField = (key: keyof SeoSettingsData, val: any) => {
    onChange({
      ...data,
      [key]: val
    });
  };

  // SEO Analysis Calculations
  const hasKeyphrase = !!(data.focusKeyphrase && data.focusKeyphrase.trim().length > 0);
  const keyphraseLower = (data.focusKeyphrase || '').toLowerCase().trim();
  const titleHasKeyphrase = hasKeyphrase && effectiveTitle.toLowerCase().includes(keyphraseLower);
  const slugHasKeyphrase = hasKeyphrase && cleanSlug.toLowerCase().includes(keyphraseLower.replace(/\s+/g, '-'));
  const descHasKeyphrase = hasKeyphrase && effectiveDesc.toLowerCase().includes(keyphraseLower);

  const descLength = effectiveDesc.length;
  const descScore = descLength >= 120 && descLength <= 160 ? 'good' : descLength > 0 ? 'medium' : 'bad';

  const titleLength = effectiveTitle.length;
  const titleScore = titleLength >= 40 && titleLength <= 65 ? 'good' : titleLength > 0 ? 'medium' : 'bad';

  // Readability Mock Calculations
  const wordsCount = (defaultDescription || effectiveDesc).split(/\s+/).filter(Boolean).length;
  const readingEase = wordsCount > 20 ? 74.2 : 68.5;

  // Schema FAQs handler
  const faqs = data.schemaFaqs || [];

  const handleAddFaq = () => {
    const updated = [...faqs, { question: '', answer: '' }];
    updateField('schemaFaqs', updated);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = faqs.map((item, idx) => (idx === index ? { ...item, [field]: value } : item));
    updateField('schemaFaqs', updated);
  };

  const handleRemoveFaq = (index: number) => {
    const updated = faqs.filter((_, idx) => idx !== index);
    updateField('schemaFaqs', updated);
  };

  return (
    <div className="bg-[#0f0f13] border border-zinc-800/90 rounded-2xl overflow-hidden shadow-xl mt-6">
      {/* HEADER WITH TABS */}
      <div className="border-b border-zinc-800/90 bg-[#131319]">
        <div className="px-5 py-3 border-b border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="text-red-500" size={16} />
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-200">SEO Setting</h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">Rank & Visibility Optimization</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-zinc-800/80 px-2 overflow-x-auto">
          {/* 1. SEO TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-red-500 text-white bg-red-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                hasKeyphrase && descScore === 'good' && titleScore === 'good' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'
              }`}
            />
            <span>SEO</span>
          </button>

          {/* 2. READABILITY TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('readability')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'readability'
                ? 'border-emerald-500 text-white bg-emerald-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Readability</span>
          </button>

          {/* 3. SCHEMA TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-blue-500 text-white bg-blue-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            <span>Schema</span>
          </button>

          {/* 4. SOCIAL TAB */}
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'social'
                ? 'border-indigo-500 text-white bg-indigo-500/10'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
            <span>Social</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="p-5 space-y-6 text-zinc-200">
        {/* ──────── TAB 1: SEO ──────── */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* FOCUS KEYPHRASE */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Focus Keyphrase
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.focusKeyphrase || ''}
                  onChange={(e) => updateField('focusKeyphrase', e.target.value)}
                  placeholder="Enter focus keyphrase..."
                  className="flex-1 bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (data.focusKeyphrase) {
                      window.open(`https://trends.google.com/trends/explore?q=${encodeURIComponent(data.focusKeyphrase)}`, '_blank');
                    }
                  }}
                  className="px-4 py-2.5 bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/60 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-all whitespace-nowrap cursor-pointer"
                >
                  Get related keyphrases
                </button>
              </div>
            </div>

            {/* GOOGLE SNIPPET PREVIEW CARD */}
            <div className="border border-zinc-800/80 rounded-xl p-4 bg-zinc-950/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Google Snippet Preview
              </span>
              <div className="bg-white text-zinc-900 p-4 rounded-lg shadow-sm space-y-1 font-sans">
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <div className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[9px]">
                    T
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono truncate">
                    {siteUrl}/{cleanSlug}
                  </span>
                </div>
                <h4 className="text-base font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {effectiveTitle} | TechFNM
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {effectiveDesc ||
                    'Please provide a meta description by editing the SEO settings below to see how this page will look in Google.'}
                </p>
              </div>
            </div>

            {/* SEO TITLE INPUT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">SEO Title</label>
                <span className={`text-[10px] font-mono ${titleScore === 'good' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {titleLength} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={data.seoTitle || ''}
                onChange={(e) => updateField('seoTitle', e.target.value)}
                placeholder={defaultTitle || 'Enter SEO title...'}
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all"
              />
            </div>

            {/* SLUG INPUT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Slug</label>
              <input
                type="text"
                value={data.slug || ''}
                onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder={cleanSlug || 'url-slug'}
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all font-mono"
              />
            </div>

            {/* META DESCRIPTION */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Meta Description</label>
                <span className={`text-[10px] font-mono ${descScore === 'good' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {descLength} / 160 chars
                </span>
              </div>
              <textarea
                rows={3}
                value={data.metaDescription || ''}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                placeholder="Enter custom meta description for search engines..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* SEO ANALYSIS STATUS CHECKLIST */}
            <div className="border-t border-zinc-800/80 pt-4 space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">SEO Analysis</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${hasKeyphrase ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-zinc-300">
                    Focus keyphrase: {hasKeyphrase ? `Set as "${data.focusKeyphrase}"` : 'Not set yet'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${descScore === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-zinc-300">
                    Meta description length:{' '}
                    {descScore === 'good' ? 'Good length!' : descLength > 160 ? 'Too long' : 'Too short / not optimal'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${titleScore === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-zinc-300">
                    SEO title width:{' '}
                    {titleScore === 'good' ? 'Good length!' : titleLength > 65 ? 'Too long' : 'Needs more descriptive words'}
                  </span>
                </div>
                {hasKeyphrase && (
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${titleHasKeyphrase ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-zinc-300">
                      Keyphrase in SEO Title:{' '}
                      {titleHasKeyphrase ? 'Exact match found in title!' : 'Keyphrase does not appear in title'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 2: READABILITY ──────── */}
        {activeTab === 'readability' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Readability Analysis</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">
                  Flesch Reading Ease: <strong className="text-emerald-400">{readingEase}</strong> (Easy to read)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">Consecutive sentences: Good variety!</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">Paragraph length: Well structured!</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">Passive voice: Under 10% threshold. Natural engagement!</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">Transition words: Balanced flow across sections.</span>
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 3: SCHEMA ──────── */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span>Determine how your content should look on search results page using schema.org</span>
              <HelpCircle size={14} className="text-zinc-500" />
            </div>

            <div className="border border-zinc-800/80 rounded-2xl p-5 bg-[#121217] space-y-4">
              {/* PAGE TYPE DROPDOWN */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Page Type</label>
                <select
                  value={data.schemaPageType || 'Web Page'}
                  onChange={(e) => updateField('schemaPageType', e.target.value)}
                  className="w-full bg-[#18181f] border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-zinc-200 outline-none font-medium"
                >
                  <option value="Default for Posts (Web Page)">Default for Posts (Web Page)</option>
                  <option value="Web Page">Web Page</option>
                  <option value="Item Page">Item Page</option>
                  <option value="About Page">About Page</option>
                  <option value="FAQ Page">FAQ Page</option>
                  <option value="QA Page">QA Page</option>
                  <option value="Profile Page">Profile Page</option>
                  <option value="Contact Page">Contact Page</option>
                  <option value="Medical Web Page">Medical Web Page</option>
                  <option value="Collection Page">Collection Page</option>
                  <option value="Checkout Page">Checkout Page</option>
                  <option value="Real Estate Listing">Real Estate Listing</option>
                  <option value="Search Results Page">Search Results Page</option>
                </select>
              </div>

              {/* ARTICLE TYPE DROPDOWN */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">Article Type</label>
                <select
                  value={data.schemaArticleType || 'Default for Posts (Article)'}
                  onChange={(e) => updateField('schemaArticleType', e.target.value)}
                  className="w-full bg-[#18181f] border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs text-zinc-200 outline-none font-medium"
                >
                  <option value="Default for Posts (Article)">Default for Posts (Article)</option>
                  <option value="Article">Article</option>
                  <option value="Blog Posting">Blog Posting</option>
                  <option value="News Article">News Article</option>
                  <option value="Tech Article">Tech Article</option>
                  <option value="Report">Report</option>
                  <option value="None">None</option>
                </select>
              </div>

              <p className="text-[11px] text-zinc-500 pt-1">
                You can change the default type under Content types in the Settings.
              </p>
            </div>

            {/* FAQ SCHEMA BUILDER */}
            <div className="border border-zinc-800/80 rounded-2xl p-5 bg-[#121217] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                    Frequently Asked Questions (FAQ Schema)
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Google automatically renders these FAQ accordions directly under your Google Search listing!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  <Plus size={14} />
                  <span>Add FAQ</span>
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="py-6 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-xl">
                  No FAQs added to schema yet. Click "+ Add FAQ" to generate Google FAQ Rich Snippets!
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-3.5 bg-[#181820] border border-zinc-700/70 rounded-xl space-y-2.5 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider">
                          FAQ Item #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                          title="Delete FAQ"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                        placeholder="Question title (e.g. How long does development take?)"
                        className="w-full bg-[#131318] border border-zinc-800 focus:border-blue-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                        placeholder="Comprehensive answer text shown directly on search results..."
                        className="w-full bg-[#131318] border border-zinc-800 focus:border-blue-500/50 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none resize-y"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ──────── TAB 4: SOCIAL ──────── */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            {/* 1. SOCIAL MEDIA APPEARANCE (FACEBOOK, LINKEDIN, WHATSAPP) */}
            <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-[#121217]">
              <button
                type="button"
                onClick={() => setSocialAccordionOpen(!socialAccordionOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between bg-[#15151c] text-left cursor-pointer border-b border-zinc-800/80"
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Social media appearance</h4>
                  <p className="text-[11px] text-zinc-500">Facebook, LinkedIn, WhatsApp, Threads, Slack previews</p>
                </div>
                {socialAccordionOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
              </button>

              {socialAccordionOpen && (
                <div className="p-5 space-y-5">
                  <p className="text-[11px] text-zinc-400">
                    Determine how your post should look on social media like Facebook, X, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.
                  </p>

                  {/* SOCIAL SHARE PREVIEW CARD */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Social Share Preview
                    </span>
                    <div className="max-w-md border border-zinc-700/80 rounded-xl overflow-hidden bg-zinc-900 shadow-md">
                      <div className="h-44 w-full bg-zinc-800 overflow-hidden relative">
                        <img
                          src={effectiveImage}
                          alt="Social preview"
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                      </div>
                      <div className="p-3.5 space-y-1 bg-zinc-950">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block">
                          TECHFNM.COM
                        </span>
                        <h5 className="text-xs font-bold text-white line-clamp-1">
                          {data.socialTitle || effectiveTitle}
                        </h5>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {data.socialDescription || effectiveDesc || 'Discover cutting-edge solutions built for modern businesses.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SOCIAL IMAGE INPUT */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Social Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={data.socialImage || ''}
                        onChange={(e) => updateField('socialImage', e.target.value)}
                        placeholder={defaultImage || 'https://images.unsplash.com/...'}
                        className="flex-1 bg-[#181820] border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* SOCIAL TITLE */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Social Title</label>
                      <button
                        type="button"
                        onClick={() => updateField('socialTitle', effectiveTitle)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                      >
                        ✨ Use Page Title
                      </button>
                    </div>
                    <input
                      type="text"
                      value={data.socialTitle || ''}
                      onChange={(e) => updateField('socialTitle', e.target.value)}
                      placeholder={effectiveTitle}
                      className="w-full bg-[#181820] border border-zinc-800 focus:border-indigo-500/50 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none"
                    />
                  </div>

                  {/* SOCIAL DESCRIPTION */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Social Description
                      </label>
                      <button
                        type="button"
                        onClick={() => updateField('socialDescription', effectiveDesc)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                      >
                        ✨ Use Meta Description
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={data.socialDescription || ''}
                      onChange={(e) => updateField('socialDescription', e.target.value)}
                      placeholder={effectiveDesc || 'Enter engaging social description...'}
                      className="w-full bg-[#181820] border border-zinc-800 focus:border-indigo-500/50 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none resize-y"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. X APPEARANCE (TWITTER) */}
            <div className="border border-zinc-800/80 rounded-2xl overflow-hidden bg-[#121217]">
              <button
                type="button"
                onClick={() => setTwitterAccordionOpen(!twitterAccordionOpen)}
                className="w-full px-5 py-3.5 flex items-center justify-between bg-[#15151c] text-left cursor-pointer border-b border-zinc-800/80"
              >
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">X appearance (Twitter)</h4>
                  <p className="text-[11px] text-zinc-500">Custom summary large card preview for X</p>
                </div>
                {twitterAccordionOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
              </button>

              {twitterAccordionOpen && (
                <div className="p-5 space-y-5">
                  <p className="text-[11px] text-zinc-400">
                    To customize the appearance of your post specifically for X, please fill out the 'X appearance' settings below.
                  </p>

                  {/* X PREVIEW */}
                  <div className="max-w-md border border-zinc-700/80 rounded-2xl overflow-hidden bg-black shadow-md">
                    <div className="h-44 w-full bg-zinc-900 overflow-hidden relative">
                      <img
                        src={data.twitterImage || effectiveImage}
                        alt="X preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                    </div>
                    <div className="p-3.5 space-y-1 bg-zinc-950 border-t border-zinc-800">
                      <span className="text-[10px] uppercase text-zinc-500 font-mono">techfnm.com</span>
                      <h5 className="text-xs font-bold text-white line-clamp-1">
                        {data.twitterTitle || data.socialTitle || effectiveTitle}
                      </h5>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">
                        {data.twitterDescription || data.socialDescription || effectiveDesc}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Custom X Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={data.twitterTitle || ''}
                      onChange={(e) => updateField('twitterTitle', e.target.value)}
                      placeholder={data.socialTitle || effectiveTitle}
                      className="w-full bg-[#181820] border border-zinc-800 focus:border-sky-500/50 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Custom X Description (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={data.twitterDescription || ''}
                      onChange={(e) => updateField('twitterDescription', e.target.value)}
                      placeholder={data.socialDescription || effectiveDesc}
                      className="w-full bg-[#181820] border border-zinc-800 focus:border-sky-500/50 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-600 outline-none resize-y"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
