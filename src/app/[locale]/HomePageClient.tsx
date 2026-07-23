"use client";

import { useState, Suspense, lazy } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Crown,
  Expand,
  ExternalLink,
  Gem,
  Gift,
  GitMerge,
  Lightbulb,
  Map,
  PiggyBank,
  PlusCircle,
  Rocket,
  Scale,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Trophy,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// Tools Grid 导航卡 → section 锚点映射（与下方 8 个 <section id> 一一对应）
const SECTION_IDS = [
  "codes",
  "beginner-guide",
  "upgrade-guide",
  "pets-items",
  "rebirth-guide",
  "gameplay-tips",
  "updates",
  "leaderboard-guide",
] as const;

// 模块内卡片图标（每组内互不相同；通过 lucide-react 直连，不走注册表）
const UPGRADE_ICONS = [Expand, Zap, Gem, Rocket];
const PETS_TIER_ICONS = [Crown, Award, Star];
const TIPS_ICONS = [GitMerge, PiggyBank, Map, Timer, Lightbulb];
const UPDATES_ICONS = [PlusCircle, Scale, Calendar, Wrench];

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.mergeablackhole.wiki";

  // Roblox 官方游戏页（外部链接）
  const robloxUrl =
    "https://www.roblox.com/games/118605709428489/Merge-a-Black-Hole";
  const youtubeUrl = "https://www.youtube.com/watch?v=VAjEfeOlYuo";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Merge a Black Hole Wiki",
        description:
          "Complete Merge a Black Hole Wiki covering codes, upgrades, merges, progression, rebirth, rewards, and beginner tips for the Roblox black hole merge simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Merge a Black Hole - Roblox Black Hole Merge Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Merge a Black Hole Wiki",
        alternateName: "Merge a Black Hole",
        url: siteUrl,
        description:
          "Complete Merge a Black Hole Wiki resource hub for codes, upgrades, merges, progression, rebirth, rewards, and beginner guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Merge a Black Hole Wiki - Roblox Merge Simulator",
        },
        sameAs: [robloxUrl],
      },
      {
        "@type": "VideoGame",
        name: "Merge a Black Hole",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Simulation", "Casual", "Incremental"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: robloxUrl,
        },
      },
      {
        "@type": "VideoObject",
        name: "Merging THE PERFECT Black Hole",
        description:
          "Merge a Black Hole gameplay video showcasing how to merge objects, grow a powerful black hole, and progress faster in the Roblox merge simulator.",
        uploadDate: "2026-06-15",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/VAjEfeOlYuo",
        url: youtubeUrl,
      },
    ],
  };

  // Accordion 展开状态
  const [updatesExpanded, setUpdatesExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                          bg-[hsl(var(--nav-theme)/0.1)]
                          border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href={robloxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ===== Video Section（紧跟 Hero）===== */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="VAjEfeOlYuo"
              title="Merging THE PERFECT Black Hole"
            />
          </div>
        </div>
      </section>

      {/* ===== Tools Grid - 8 Navigation Cards（视频区之后）===== */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Latest Updates（保留模板模块，位于 Tools Grid 之后）===== */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* ===== Module 1: Codes ===== */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.codes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.codes.intro}
            </p>
          </div>

          {/* Code cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
            {t.modules.codes.codes.map((c: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                  <Gift className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                </div>
                <div className="min-w-0 flex-1">
                  <code className="block font-mono text-sm md:text-base font-semibold text-[hsl(var(--nav-theme-light))] break-all">
                    {c.code}
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">{c.reward}</p>
                  <span className="inline-flex mt-3 items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <Clock className="w-3 h-3" />
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* How to redeem */}
          <div className="scroll-reveal p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">How to Redeem Codes</h3>
            </div>
            <ol className="space-y-2.5">
              {t.modules.codes.howToRedeem.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ===== Module 2: Beginner Guide ===== */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.beginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.beginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== Module 3: Upgrade Guide ===== */}
      <section id="upgrade-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.upgradeGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.upgradeGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.upgradeGuide.cards.map((card: any, index: number) => {
              const Icon = UPGRADE_ICONS[index] ?? TrendingUp;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.12)]">
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{card.description}</p>
                </div>
              );
            })}
          </div>

          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.upgradeGuide.milestones.map((m: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm"
              >
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 4: Pets and Items ===== */}
      <section id="pets-items" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.petsAndItems.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.petsAndItems.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.petsAndItems.tiers.map((tier: any, index: number) => {
              const Icon = PETS_TIER_ICONS[index] ?? Star;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors text-center"
                >
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)]">
                    <Icon className="w-7 h-7 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] mb-2">
                    Tier {tier.tier}
                  </span>
                  <h3 className="font-bold text-lg mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ===== Module 5: Rebirth Guide ===== */}
      <section id="rebirth-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.rebirthGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.rebirthGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.rebirthGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 6: Gameplay Tips ===== */}
      <section id="gameplay-tips" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.gameplayTips.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.gameplayTips.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.gameplayTips.tips.map((tip: any, index: number) => {
              const Icon = TIPS_ICONS[index] ?? Lightbulb;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.12)] mb-3">
                    <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground text-sm">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Module 7: Updates（手风琴）===== */}
      <section id="updates" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.updates.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.updates.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.updates.items.map((item: any, index: number) => {
              const Icon = UPDATES_ICONS[index] ?? Clock;
              const isOpen = updatesExpanded === index;
              return (
                <div
                  key={index}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setUpdatesExpanded(isOpen ? null : index)}
                    className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.12)]">
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <span className="font-semibold flex-1">{item.title}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pl-[4.25rem] text-muted-foreground text-sm">
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Module 8: Leaderboard Guide（表格）===== */}
      <section id="leaderboard-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Trophy className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.leaderboardGuide.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.leaderboardGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.12)] border-b border-border">
                  <th className="px-4 md:px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wide">
                    Category
                  </th>
                  <th className="px-4 md:px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wide">
                    Strategy
                  </th>
                  <th className="px-4 md:px-6 py-3 text-xs md:text-sm font-semibold uppercase tracking-wide">
                    Importance
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.modules.leaderboardGuide.rows.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-b-0 ${index % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="px-4 md:px-6 py-4 font-semibold align-top">
                      {row.category}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-muted-foreground align-top">
                      {row.strategy}
                    </td>
                    <td className="px-4 md:px-6 py-4 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                          row.importance === "High"
                            ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                            : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]"
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        {row.importance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FAQ Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* ===== CTA Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Footer ===== */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={robloxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.discord}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.twitter}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/search?keyword=Merge%20a%20Black%20Hole"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.steamCommunity}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition inline-flex items-center gap-1.5"
                  >
                    {t.footer.steamStore}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={locale === "en" ? "/about" : `/${locale}/about`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/terms-of-service" : `/${locale}/terms-of-service`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/copyright" : `/${locale}/copyright`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
