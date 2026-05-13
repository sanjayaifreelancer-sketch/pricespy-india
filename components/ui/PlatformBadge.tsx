import { Platform, platformConfig } from '@/types'

export default function PlatformBadge({ platform }: { platform: Platform }) {
  const cfg = platformConfig[platform]
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}
