import { Link } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

interface Props {
  title: string
  eyebrow?: string
  showBack?: boolean
  onBack?: () => void
}

export default function Header({ title, eyebrow, showBack }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-outline-variant/40">
      <div className="flex items-center justify-between px-gutter py-space-md">
        <div className="flex items-center gap-space-sm min-w-0">
          {showBack ? (
            <Link to="/dashboard" className="text-on-surface">
              <MaterialIcon name="arrow_back" />
            </Link>
          ) : (
            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <MaterialIcon name="bolt" className="text-white text-[13px]" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-headline-sm text-headline-sm truncate leading-tight">{title}</p>
            {eyebrow && (
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide truncate">
                {eyebrow}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-space-md flex-shrink-0">
          <MaterialIcon name="notifications" className="text-on-surface-variant text-[22px]" />
          <img
            src="/avatar-placeholder.png"
            alt="Your profile"
            className="w-8 h-8 rounded-full object-cover border border-outline-variant"
          />
        </div>
      </div>
    </header>
  )
}
