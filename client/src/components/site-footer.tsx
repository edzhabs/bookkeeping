import { LucideBook } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-6 md:py-0 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex items-center gap-2">
          <LucideBook className="h-5 w-5" />
          <p className="text-sm text-muted-foreground">© {currentYear} Bright Future Academy. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>
          <p className="text-sm text-muted-foreground">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
