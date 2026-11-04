# 19Network News Intelligence Studio

> **Editorial Technology Concept Demonstration**  
> An integrated editorial intelligence, multi-source regional news discovery, omnichannel content ideation, and AI search readiness platform tailored for UAE digital publishing.  
> *Note: This application is an independent concept demonstration and is not an officially commissioned system of 19Network.*

Official Reference: [19network.com](https://www.19network.com/) | Instagram: [@19network.news](https://www.instagram.com/19network.news/) | LinkedIn: [19Network](https://www.linkedin.com/company/19network-com/)

---

## 1. Product Purpose & Editorial Workflow

The **19Network News Intelligence Studio** connects the digital newsroom into a single, cohesive loop:

```
Discover Trending Story ──► Evaluate Newsworthiness ──► Generate Editorial Brief
                                                               │
Prepare for Website CMS ◄── Analyze AI & SEO Readiness ◄── Platform-Specific Packaging
```

Every module directly feeds into this pipeline, eliminating context switching between news feeds, spreadsheets, social scheduling tools, and CMS drafts.

---

## 2. Core Modules

| # | Module | Core Functionality |
|---|---|---|
| **01** | **Overview** | Real-time command center with 8 top KPIs (distinguishing live feed, verified baseline, algorithmic, and sample data), news discovery velocity curves, geographic balance (UAE vs GCC vs World), and 1-click editorial opportunity triage. |
| **02** | **Topic Radar** | Live multi-source news discovery engine powered by Google News UAE & GCC RSS feeds, GDELT DOC 2.0 international API, and regional publisher feeds. Features transparent 100-point opportunity scoring, duplicate story clustering, and multi-dimensional filters. |
| **03** | **Story Intelligence** | Deep editorial research workspace generating 7 distinct angles (Breaking, Business, UAE Perspective, GCC Transformation, Explainer Q&A, Data Analysis, Weekend Feature) with a verified fact-checking checklist against primary sources. |
| **04** | **Content Ideation** | High-speed deterministic rules-and-templates generation engine. Produces 5 headline variations, SEO slugs, H2 structures, and platform-native copy for Instagram (5-slide visual carousel), LinkedIn, X (4-tweet thread), Facebook, and TikTok (hook + timestamped video script). |
| **05** | **Editorial Calendar** | Interactive content calendar in Asia/Dubai Gulf Standard Time (GST). Supports Month, Week, and List views, weekly publishing targets per platform, status progression (Idea to Published), CSV export, and native `.ics` iCalendar export. |
| **06** | **Social Intelligence** | Zero-cost social analytics tracking 5 channels. Features verified starting baselines for `@19network.news` (19.4k followers, 1,110 posts) and LinkedIn (971 followers), engagement rate computation `(Engagements ÷ Impressions) × 100`, and native CSV import for creator studios without paid API keys. |
| **07** | **AI Compatibility** | 100-point algorithmic readiness analyzer for Perplexity, Google SGE, and search engines. Audits BLUF structure, entity density, and author bylines while strictly generating and validating Schema.org `NewsArticle` JSON-LD according to Google Search Central standards. |
| **08** | **Website Publishing** | CMS publishing workbench with rich markdown editor, live reader preview, editorial sign-off verification, optional server-side WordPress REST API draft synchronization, and instant HTML, Markdown, and JSON package exports. |
| **09** | **Reports** | Downloadable executive summaries, coverage audits, daily dispatch logs, and print-ready PDF-optimized briefing sheets for newsroom management. |
| **10** | **Settings** | Algorithmic scoring weights customizer, RSS source enable/disable toggles, custom feed ingestion, timezone configuration (Asia/Dubai), backup JSON export, and demo workspace reset. |

---

## 3. Brand & Visual Identity

The Studio uses an editorial green palette crafted for modern media technology:
- **Primary Forest Green**: `#123B2B`
- **Dark Green**: `#0B2119`
- **Emerald**: `#16834A`
- **Bright Accent Green**: `#22A06B`
- **Soft Mint**: `#DDF5E8`
- **Background**: `#F5F8F5`
- **Primary Text**: `#14231B`
- **Secondary Text**: `#728078`
- **Borders**: `#DCE6DF`

---

## 4. Technology Stack

- **Framework**: Next.js 15 (App Router, Strict Mode)
- **Language**: TypeScript 5.7+
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Data Visualizations**: Recharts
- **Feed Ingestion**: `fast-xml-parser` with SSRF validation
- **Persistence**: Browser `localStorage` / `sessionStorage` with reactive window dispatch events
- **Testing**: Vitest (Unit) + Playwright (End-to-End)
- **Hosting**: Vercel

---

## 5. Getting Started

### Prerequisites

- Node.js 18.18+ or 20+ (tested on v22)
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/asheshthakur/19network-news-intelligence-studio.git
cd 19network-news-intelligence-studio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Environment Variables

The application runs **100% operational in free standalone mode** without paid APIs. Optional server-side integrations can be configured in `.env.local`:

```env
# Optional WordPress REST API Integration (Server-side only)
WORDPRESS_SITE_URL=https://www.19network.com
WORDPRESS_USERNAME=
WORDPRESS_APP_PASSWORD=

# Newsroom Timezone (Defaults to UAE Gulf Standard Time)
DEFAULT_TIMEZONE=Asia/Dubai
```

---

## 7. Testing & Quality Assurance

Run unit tests:
```bash
npm run test
```

Run end-to-end tests:
```bash
npx playwright test
```

Run TypeScript compilation check:
```bash
npx tsc --noEmit
```

Run production build:
```bash
npm run build
```

---

## 8. Security & Data Integrity

- **SSRF Prevention**: Feed fetching endpoints restrict external HTTP/HTTPS requests to public domains and block private/loopback IP ranges (`127.0.0.1`, `10.x`, `192.168.x`, `169.254.x`).
- **No Secret Leakage**: All CMS credentials remain exclusively server-side. Never exposed to browser bundles.
- **Truth in Data**: All metrics explicitly distinguish actual feed data, verified manual baselines, calculated heuristics, and sample records.

---

## 9. License

MIT License. Designed and developed as an independent interview demonstration for digital news publishers in the United Arab Emirates.
