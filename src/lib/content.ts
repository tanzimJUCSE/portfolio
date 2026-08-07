import yaml from 'js-yaml';

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

export type PublicationStatus = 'published' | 'accepted' | 'under-review';
export type PublicationType = 'journal' | 'conference' | 'workshop' | 'other';

export interface SiteLink {
  label: string;
  url: string;
  icon: string;
}

export interface SkillGroup {
  label: string;
  icon?: string;
  items: string[];
}

export interface PageIntro {
  title: string;
  intro?: string;
}

export interface SiteData {
  name: string;
  initials: string;
  role: string;
  affiliation: string;
  department: string;
  lab: string;
  advisor: string;
  location: string;
  url: string;
  email: string;
  phone: string;
  showPhone: boolean;
  photo: string;
  cv: string;
  tagline: string;
  availability: string;
  bio: string;
  interests: string[];
  skills: SkillGroup[];
  links: SiteLink[];
  seoDescription: string;
  keywords: string[];
  ogImage: string;
  footerNote: string;
  pages: Record<string, PageIntro>;
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number | string;
  type: PublicationType;
  status: PublicationStatus;
  link: string;
  preprint: string;
  impactFactor: string;
  coreRank: string;
  note: string;
  restricted: boolean;
  featured: boolean;
}

export interface Patent {
  title: string;
  inventors: string;
  status: string;
  number: string;
  year: number | string;
  note: string;
  link: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  period: string;
  detail: string;
  bullets: string[];
}

export interface Experience {
  role: string;
  org: string;
  location: string;
  period: string;
  detail: string;
  bullets: string[];
}

export interface Service {
  role: string;
  org: string;
  detail: string;
  date: string;
}

export interface TalkAppearance {
  format: string;
  venue: string;
  location: string;
  date: string;
}

export interface TalkGroup {
  title: string;
  appearances: TalkAppearance[];
}

export interface Award {
  title: string;
  org: string;
  year: number | string;
  bullets: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  link: string;
}

export interface Project {
  title: string;
  category: string;
  description: string;
  bullets: string[];
  tags: string[];
  link: string;
}

export interface NewsItem {
  date: string;
  text: string;
  link: string;
}

export interface Venue {
  name: string;
  note: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
}

export interface Hobby {
  title: string;
  emoji: string;
  body: string;
  images: GalleryImage[];
}

/* --------------------------------------------------------------------------
   Raw YAML loading
   -------------------------------------------------------------------------- */

const rawFiles = import.meta.glob('/src/data/**/*.yml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function read(path: string, raw: string): unknown {
  if (raw.trim() === '') return undefined;
  try {
    return yaml.load(raw);
  } catch (error) {
    throw new Error(
      `Could not read ${path}. It probably has an unclosed quote or bad indentation.\n${(error as Error).message}`
    );
  }
}

/** Reads a single data file, e.g. `site` -> src/data/site.yml */
function parse(name: string): unknown {
  const path = `/src/data/${name}.yml`;
  const raw = rawFiles[path];
  if (typeof raw !== 'string') return undefined;
  return read(path, raw);
}

/** Reads every file in a data folder, e.g. `publications` -> src/data/publications/*.yml */
function parseFolder(folder: string): unknown[] {
  const prefix = `/src/data/${folder}/`;
  return Object.keys(rawFiles)
    .filter((path) => path.startsWith(prefix))
    .sort()
    .map((path) => read(path, rawFiles[path]))
    .filter((entry) => entry !== undefined && entry !== null);
}

/* --------------------------------------------------------------------------
   Coercion helpers - every field gets a safe default so a half-filled CMS
   entry renders instead of crashing the build.
   -------------------------------------------------------------------------- */

const str = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const bool = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : typeof value === 'string' ? value.toLowerCase() === 'true' : fallback;

const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const strList = (value: unknown): string[] =>
  list(value)
    .map((item) => str(item))
    .filter(Boolean);

const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

/** A single YAML file holding a top-level list. */
function collection<T>(name: string, map: (row: Record<string, unknown>) => T): T[] {
  return list(parse(name)).map((row) => map(record(row)));
}

/** A folder of YAML files, one entry per file. */
function folder<T>(name: string, map: (row: Record<string, unknown>) => T): T[] {
  return parseFolder(name).map((row) => map(record(row)));
}

/* --------------------------------------------------------------------------
   Site settings
   -------------------------------------------------------------------------- */

function buildSite(): SiteData {
  const raw = record(parse('site'));
  const name = str(raw.name, 'Your Name');
  const pagesRaw = record(raw.pages);
  const pages: Record<string, PageIntro> = {};
  for (const [key, value] of Object.entries(pagesRaw)) {
    const page = record(value);
    pages[key] = { title: str(page.title, key), intro: str(page.intro) };
  }

  return {
    name,
    initials:
      str(raw.initials) ||
      name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join(''),
    role: str(raw.role),
    affiliation: str(raw.affiliation),
    department: str(raw.department),
    lab: str(raw.lab),
    advisor: str(raw.advisor),
    location: str(raw.location),
    url: str(raw.url, 'https://example.com').replace(/\/+$/, ''),
    email: str(raw.email),
    phone: str(raw.phone),
    showPhone: bool(raw.showPhone),
    photo: str(raw.photo),
    cv: str(raw.cv),
    tagline: str(raw.tagline),
    availability: str(raw.availability),
    bio: str(raw.bio),
    interests: strList(raw.interests),
    skills: list(raw.skills).map((group) => {
      const item = record(group);
      return { label: str(item.label), icon: str(item.icon), items: strList(item.items) };
    }),
    links: list(raw.links)
      .map((link) => {
        const item = record(link);
        return { label: str(item.label), url: str(item.url), icon: str(item.icon, 'link') };
      })
      .filter((link) => link.url !== ''),
    seoDescription: str(raw.seoDescription),
    keywords: strList(raw.keywords),
    ogImage: str(raw.ogImage),
    footerNote: str(raw.footerNote),
    pages,
  };
}

export const site = buildSite();

export function page(key: string, fallbackTitle: string): PageIntro {
  return site.pages[key] ?? { title: fallbackTitle, intro: '' };
}

/** Splits a `text` field into paragraphs on blank lines. */
export function paragraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

/* --------------------------------------------------------------------------
   Collections
   -------------------------------------------------------------------------- */

const PUBLICATION_TYPES: PublicationType[] = ['journal', 'conference', 'workshop', 'other'];
const PUBLICATION_STATUSES: PublicationStatus[] = ['published', 'accepted', 'under-review'];

export const publications: Publication[] = folder<Publication>('publications', (row) => {
  const type = str(row.type, 'other').toLowerCase() as PublicationType;
  const status = str(row.status, 'published').toLowerCase() as PublicationStatus;
  return {
    title: str(row.title, 'Untitled'),
    authors: str(row.authors),
    venue: str(row.venue),
    year: str(row.year),
    type: PUBLICATION_TYPES.includes(type) ? type : 'other',
    status: PUBLICATION_STATUSES.includes(status) ? status : 'published',
    link: str(row.link),
    preprint: str(row.preprint),
    impactFactor: str(row.impactFactor),
    coreRank: str(row.coreRank),
    note: str(row.note),
    restricted: bool(row.restricted),
    featured: bool(row.featured),
  };
}).sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

export const patents: Patent[] = collection<Patent>('patents', (row) => ({
  title: str(row.title, 'Untitled'),
  inventors: str(row.inventors),
  status: str(row.status, 'Provisional patent submitted'),
  number: str(row.number),
  year: str(row.year),
  note: str(row.note),
  link: str(row.link),
}));

export const education: Education[] = collection<Education>('education', (row) => ({
  degree: str(row.degree),
  institution: str(row.institution),
  location: str(row.location),
  period: str(row.period),
  detail: str(row.detail),
  bullets: strList(row.bullets),
}));

export const experience: Experience[] = collection<Experience>('experience', (row) => ({
  role: str(row.role),
  org: str(row.org),
  location: str(row.location),
  period: str(row.period),
  detail: str(row.detail),
  bullets: strList(row.bullets),
}));

export const services: Service[] = collection<Service>('service', (row) => ({
  role: str(row.role),
  org: str(row.org),
  detail: str(row.detail),
  date: str(row.date),
}));

export const talks: TalkGroup[] = collection<TalkGroup>('talks', (row) => ({
  title: str(row.title),
  appearances: list(row.appearances).map((entry) => {
    const item = record(entry);
    return {
      format: str(item.format),
      venue: str(item.venue),
      location: str(item.location),
      date: str(item.date),
    };
  }),
}));

export const awards: Award[] = collection<Award>('awards', (row) => ({
  title: str(row.title),
  org: str(row.org),
  year: str(row.year),
  bullets: strList(row.bullets),
})).sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

export const certifications: Certification[] = collection<Certification>('certifications', (row) => ({
  title: str(row.title),
  issuer: str(row.issuer),
  link: str(row.link),
}));

export const projects: Project[] = collection<Project>('projects', (row) => ({
  title: str(row.title),
  category: str(row.category),
  description: str(row.description),
  bullets: strList(row.bullets),
  tags: strList(row.tags),
  link: str(row.link),
}));

export const news: NewsItem[] = collection<NewsItem>('news', (row) => ({
  date: str(row.date),
  text: str(row.text),
  link: str(row.link),
}));

export const venues: Venue[] = collection<Venue>('venues', (row) => ({
  name: str(row.name),
  note: str(row.note),
}));

export const hobbies: Hobby[] = collection<Hobby>('hobbies', (row) => ({
  title: str(row.title),
  emoji: str(row.emoji),
  body: str(row.body),
  images: list(row.images)
    .map((entry) => {
      if (typeof entry === 'string') return { src: entry.trim(), caption: '' };
      const item = record(entry);
      return { src: str(item.src ?? item.image), caption: str(item.caption) };
    })
    .filter((image) => image.src !== ''),
}));

/* --------------------------------------------------------------------------
   Derived views
   -------------------------------------------------------------------------- */

export const publishedWork = publications.filter((item) => item.status !== 'under-review');
export const underReview = publications.filter((item) => item.status === 'under-review');
export const featuredWork = publications.filter((item) => item.featured);

export const stats = [
  { value: `${publishedWork.length}`, label: publishedWork.length === 1 ? 'Publication' : 'Publications' },
  { value: `${patents.length}`, label: patents.length === 1 ? 'Patent filing' : 'Patent filings' },
  { value: `${awards.length}`, label: awards.length === 1 ? 'Award' : 'Awards & grants' },
  {
    value: `${talks.reduce((total, group) => total + group.appearances.length, 0)}`,
    label: 'Talks & posters',
  },
].filter((stat) => stat.value !== '0');

/** Splits an author string so the site owner's name can be emphasised. */
export function splitAuthors(authors: string, me = site.name): { text: string; isMe: boolean }[] {
  if (!authors) return [];
  if (!me) return [{ text: authors, isMe: false }];

  const parts: { text: string; isMe: boolean }[] = [];
  let cursor = 0;
  const needle = me.toLowerCase();
  const haystack = authors.toLowerCase();

  for (;;) {
    const index = haystack.indexOf(needle, cursor);
    if (index === -1) break;
    if (index > cursor) parts.push({ text: authors.slice(cursor, index), isMe: false });
    parts.push({ text: authors.slice(index, index + me.length), isMe: true });
    cursor = index + me.length;
  }

  if (cursor < authors.length) parts.push({ text: authors.slice(cursor), isMe: false });
  return parts.length ? parts : [{ text: authors, isMe: false }];
}

export const STATUS_LABELS: Record<PublicationStatus, string> = {
  published: 'Published',
  accepted: 'Accepted',
  'under-review': 'Under review',
};

export const TYPE_LABELS: Record<PublicationType, string> = {
  journal: 'Journal',
  conference: 'Conference',
  workshop: 'Workshop',
  other: 'Other',
};
