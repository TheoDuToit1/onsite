import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'

interface PageIntroProps {
  pageKey: string
  title: string
  intro?: string
  bullets?: string[]
  defaultOpen?: boolean // if true, opens when not seen
  className?: string
}

export default function PageIntro({ pageKey, title, intro, bullets = [], defaultOpen = true, className }: PageIntroProps) {
  const storageKey = `intro_seen_${pageKey}`
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(storageKey)
    if (!seen && defaultOpen) {
      setOpen(true)
    }
  }, [storageKey, defaultOpen])

  const closeAndRemember = () => {
    localStorage.setItem(storageKey, '1')
    setOpen(false)
  }

  return (
    <div className={className}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg border hover:bg-orange-50 hover:border-orange-200 text-neutral-700"
            aria-label={`About ${title}`}
          >
            <Info size={18} />
          </button>
        </TooltipTrigger>
        <TooltipContent>What is this page?</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">About {title}</h3>
            {intro ? (
              <p className="text-sm text-neutral-700">{intro}</p>
            ) : null}
            {bullets.length > 0 ? (
              <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                {bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : null}
            <div className="pt-2 flex justify-end">
              <Button onClick={closeAndRemember}>Got it</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
