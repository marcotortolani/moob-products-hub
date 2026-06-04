import { Separator } from '@/components/ui/separator'
import pkg from '@/package.json'

export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
      <Separator className="mb-6 bg-border/40" />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs text-muted-foreground/60">
          Media Moob — Product HUB
        </span>
        <span className="text-xs text-muted-foreground/40 font-mono">
          v{pkg.version}
        </span>
      </div>
    </footer>
  )
}
