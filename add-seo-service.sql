-- Adds the SEO Services page (target keyword: "seo services in pakistan").
-- Run once in Supabase SQL editor. Safe to re-run.
INSERT INTO services (title, description, icon, color, slug, content, meta_title, meta_description)
SELECT 'SEO Services', 'Rank higher on Google with result-driven SEO services in Pakistan: technical SEO, keyword research, on-page optimisation, local SEO and link building.', 'Search', 'bg-white-900/20 text-white-400', 'seo-services',
       '## SEO Services in Pakistan That Bring Real Traffic

TechFNM is an SEO agency in Pakistan that helps businesses rank on Google, get more qualified traffic and turn visitors into leads. We work with local businesses in Karachi, Lahore and Islamabad, and with international clients who want affordable, results-driven SEO.

### What our SEO services include

- **SEO audit:** a full technical and content audit with a clear, prioritised fix list.
- **Keyword research:** the terms your customers actually search, mapped to the right pages.
- **On-page SEO:** titles, meta descriptions, headings, internal links and content optimisation.
- **Technical SEO:** site speed, Core Web Vitals, indexing, sitemaps, schema markup and crawlability.
- **Local SEO:** Google Business Profile optimisation and local citations to win the map pack.
- **Content & link building:** SEO content writing and white-hat backlinks that build authority.
- **Monthly reporting:** rankings, traffic and leads, explained in plain language.

### Why choose TechFNM for SEO in Pakistan

- Transparent pricing with no long lock-in contracts
- White-hat methods that follow Google guidelines
- One team for SEO, content and web development, so fixes ship fast
- Clients in Pakistan, the UK, the US and the Middle East

### How we work

1. Free consultation and SEO audit
2. Keyword strategy and roadmap
3. On-page and technical fixes
4. Content and link building
5. Monthly reporting and optimisation

Ready to grow your organic traffic? [Request a free SEO audit](/request-service) or [contact us](/contact).', 'SEO Services in Pakistan | Affordable SEO Agency | TechFNM', 'Looking for SEO services in Pakistan? TechFNM offers technical SEO, keyword research, on-page and local SEO, and link building that grow traffic and leads.'
WHERE NOT EXISTS (SELECT 1 FROM services WHERE slug IN ('seo-services', '/services/seo-services'));
