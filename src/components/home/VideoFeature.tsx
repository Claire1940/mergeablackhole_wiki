"use client";

import { useEffect, useRef, useState } from "react";
import { Play, ExternalLink } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * VideoFeature
 *
 * 懒加载 + 进入视口自动播放：
 * - 初始只渲染缩略图占位 + 播放按钮（不加载 iframe，避免首屏请求与噪声音量）
 * - IntersectionObserver 监测进入视口后，自动以 autoplay=1&mute=1&loop=1 加载 iframe
 * - 同时保留点击播放按钮作为后备交互（用户主动点击同样触发播放）
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  // 进入视口即自动激活（autoplay + mute + loop）
  useEffect(() => {
    if (active) return;
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  // autoplay + mute + loop：满足浏览器自动播放策略（必须静音才能自动播放）
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {active ? (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-[hsl(var(--nav-theme)/0.25)] to-black/60"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 h-7 w-7" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
