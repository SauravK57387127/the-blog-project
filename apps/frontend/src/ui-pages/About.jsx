'use client';

import { Code, Target, PenTool, Mail, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DESIGN_CONSTANTS } from '@/lib/design-constants';
import { useActiveAuthor } from '@/hooks/api/public/useAuthor';

// Category cards are UI constants — they just route to search
const categoryCards = [
  {
    label: '[ tech ]',
    title: 'Tech Deep-Dives',
    description: 'Code, learning, technical writing',
    category: 'tech-deep-dive',
  },
  {
    label: '[ life ]',
    title: 'Life & Growth',
    description: 'Wellness, balance, real life',
    category: 'life-growth',
  },
  {
    label: '[ career ]',
    title: 'Career & Learning',
    description: 'Self-taught journey, lessons',
    category: 'career-learning',
  },
];

// Map social link keys to icons
const SOCIAL_ICONS = {
  twitter:  { icon: Twitter,  name: 'Twitter' },
  github:   { icon: Github,   name: 'GitHub' },
  linkedin: { icon: Linkedin, name: 'LinkedIn' },
  website:  { icon: Code,     name: 'Website' },
  leetcode: { icon: Code,     name: 'LeetCode' },
};

export default function About() {
  const router = useRouter();
  const { data: author, isLoading } = useActiveAuthor();

  const handleCategoryClick = (category) => {
    router.push(`/search?category=${category}`);
  };

  // Build social links array from author data
  const socialLinks = author?.socialLinks
    ? Object.entries(author.socialLinks)
        .filter(([, url]) => url)
        .map(([key, url]) => ({
          name: SOCIAL_ICONS[key]?.name ?? key,
          icon: SOCIAL_ICONS[key]?.icon ?? Mail,
          url,
        }))
    : [];

  const learningAreas  = author?.learningAreas  ?? [];
  const currentFocus   = author?.currentFocus   ?? [];
  const writingTopics  = author?.writingTopics  ?? [];

  return (
    <div className="w-full min-h-screen">
      <div className={`${DESIGN_CONSTANTS.containers.standard} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        <div className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto`}>

          {/* Hero — Profile + Quote */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full flex-shrink-0 overflow-hidden bg-muted ring-2 ring-border">
                {author?.profileImage && (
                  <img
                    src={author.profileImage}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Quote */}
              <div className="flex-1">
                <blockquote className="border-l-4 border-foreground pl-6 py-2">
                  <p className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-4 text-foreground">
                    {isLoading
                      ? <span className="block h-8 bg-muted animate-pulse rounded w-3/4" />
                      : author?.tagline}
                  </p>
                  <cite className="block text-right font-mono text-sm text-muted-foreground not-italic tracking-widest uppercase">
                    ꕤ {author?.name ?? 'Saurav Kumar Yadav'}
                  </cite>
                </blockquote>
              </div>
            </div>
          </section>

          {/* My Journey */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                My Journey
              </span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>
            <p className="font-reading text-lg leading-relaxed text-foreground/80">
              {author?.bio}
            </p>
          </section>

          {/* Quick Info */}
          <section className="mb-16">
            <div className="grid md:grid-cols-3 gap-10">

              {/* Learning */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Learning
                  </span>
                </div>
                <ul className="space-y-4">
                  {learningAreas.map((item) => (
                    <li key={item.label} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="font-sans font-semibold text-foreground">{item.label}</p>
                      <p className="font-reading text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Current Focus */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    Current Focus
                  </span>
                </div>
                <ul className="space-y-4">
                  {currentFocus.map((item) => (
                    <li key={item.label} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="font-sans font-semibold text-foreground">{item.label}</p>
                      <p className="font-reading text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* I Write About */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <PenTool className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                    I Write About
                  </span>
                </div>
                <ul className="space-y-4">
                  {writingTopics.map((item) => (
                    <li key={item.label} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <p className="font-sans font-semibold text-foreground">{item.label}</p>
                      <p className="font-reading text-sm text-muted-foreground mt-0.5">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* What You'll Find Here */}
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
                What you'll find here
              </span>
              <div className="flex-1 h-[1px] bg-border" />
            </div>

            <div className="flex flex-col gap-px">
              {categoryCards.map((card) => (
                <div
                  key={card.category}
                  onClick={() => handleCategoryClick(card.category)}
                  className={`group cursor-pointer flex items-center justify-between p-5 border border-border hover:border-foreground/30 hover:bg-muted/30 ${DESIGN_CONSTANTS.transitions.fast}`}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs font-mono font-medium tracking-widest text-muted-foreground w-16 flex-shrink-0 whitespace-nowrap">
                      {card.label}
                    </span>
                    <div>
                      <h3 className={`font-sans font-bold text-base group-hover:text-accent ${DESIGN_CONSTANTS.transitions.fast}`}>
                        {card.title}
                      </h3>
                      <p className="font-reading text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 ${DESIGN_CONSTANTS.transitions.fast} flex-shrink-0`} />
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Let's Connect — full width */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background" id="connect">
        <div className={`${DESIGN_CONSTANTS.containers.narrow} mx-auto px-4 sm:px-6 lg:px-8`}>

          <div className="flex items-center gap-2 mb-10">
            <span className="text-xs font-mono font-medium uppercase tracking-widest text-muted-foreground">
              — let's connect
            </span>
            <div className="flex-1 h-[1px] bg-border" />
          </div>

          <p className="font-reading text-base text-foreground/70 mb-8 max-w-md">
            Whether it's feedback, a collab idea, or just a hello — I'm always around.
          </p>

          {/* Social Links — dynamic from author */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <button
                  key={social.name}
                  onClick={() => window.open(social.url, '_blank')}
                  className={`w-full h-16 flex flex-col items-center justify-center gap-1.5 border-4 border-foreground bg-background hover:bg-foreground hover:text-background ${DESIGN_CONSTANTS.transitions.fast} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-mono font-medium uppercase tracking-wide">{social.name}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
