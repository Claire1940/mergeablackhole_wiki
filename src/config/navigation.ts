import { Gift, BookOpen, Zap, TrendingUp, Trophy, Lightbulb, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置 - Merge a Black Hole（7 个内容分类，community 已剔除）
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'codes', path: '/codes', icon: Gift, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'merging', path: '/merging', icon: Zap, isContentType: true },
	{ key: 'levels', path: '/levels', icon: TrendingUp, isContentType: true },
	{ key: 'rewards', path: '/rewards', icon: Trophy, isContentType: true },
	{ key: 'facts', path: '/facts', icon: Lightbulb, isContentType: true },
	{ key: 'videos', path: '/videos', icon: Video, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // -> ['codes', 'guide', 'merging', 'levels', 'rewards', 'facts', 'videos']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
