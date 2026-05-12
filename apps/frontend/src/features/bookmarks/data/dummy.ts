export type Tag = {
  id: string;
  name: string;
  count: number;
};

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  tags: string[];
  createdAt: string;
};

export const DUMMY_TAGS: Tag[] = [
  { id: '1', name: 'AI', count: 4 },
  { id: '2', name: 'Design', count: 7 },
  { id: '3', name: 'React', count: 12 },
  { id: '4', name: 'TypeScript', count: 6 },
  { id: '5', name: 'CSS', count: 3 },
  { id: '6', name: 'Tools', count: 9 },
];

export const DUMMY_BOOKMARKS: Bookmark[] = [
  {
    id: '1',
    title: 'Vercel AI SDK — Build AI-powered applications',
    url: 'https://sdk.vercel.ai',
    domain: 'sdk.vercel.ai',
    description:
      'The AI Toolkit for TypeScript. Unified API for generating text, structured data, and tool calls with LLMs.',
    tags: ['AI', 'TypeScript', 'Tools'],
    createdAt: '2025-05-01',
  },
  {
    id: '2',
    title: 'TanStack Router — Type-safe routing for React',
    url: 'https://tanstack.com/router',
    domain: 'tanstack.com',
    description:
      'A fully type-safe router with first-class search params, layouts, and nested routing for React applications.',
    tags: ['React', 'TypeScript'],
    createdAt: '2025-04-28',
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 — Utility-first CSS framework',
    url: 'https://tailwindcss.com',
    domain: 'tailwindcss.com',
    description:
      'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    tags: ['CSS', 'Design'],
    createdAt: '2025-04-20',
  },
  {
    id: '4',
    title: 'Radix UI — Accessible component primitives',
    url: 'https://radix-ui.com',
    domain: 'radix-ui.com',
    description:
      'Unstyled, accessible components for building high-quality design systems and web applications in React.',
    tags: ['React', 'Design'],
    createdAt: '2025-04-15',
  },
  {
    id: '5',
    title: 'OpenAI Platform — API reference and docs',
    url: 'https://platform.openai.com',
    domain: 'platform.openai.com',
    description:
      'Access GPT-4, DALL·E, Whisper and other models via a simple API. Build AI-powered products at scale.',
    tags: ['AI', 'Tools'],
    createdAt: '2025-04-10',
  },
  {
    id: '6',
    title: 'Zustand — Lightweight state management for React',
    url: 'https://zustand-demo.pmnd.rs',
    domain: 'zustand-demo.pmnd.rs',
    description:
      'A small, fast, and scalable bearbones state management solution. Uses simplified flux principles.',
    tags: ['React', 'Tools'],
    createdAt: '2025-04-05',
  },
];
