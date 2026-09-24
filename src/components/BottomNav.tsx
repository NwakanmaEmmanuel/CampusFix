import { Link, useLocation } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

const items = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/dashboard', icon: 'assignment', label: 'My Requests' },
  { to: '/new', icon: 'add', label: 'Post', isCenter: true },
  { to: '/matching', icon: 'volunteer_activism', label: 'Helpers' },
  { to: '/dashboard', icon: 'bolt', label: 'Activity' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="sticky bottom-0 z-10 bg-surface-container-lowest border-t border-outline-variant/40 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex items-center justify-around px-space-xs py-space-sm">
        {items.map((item) => {
          const active = location.pathname === item.to
          if (item.isCenter) {
            return (
              <Link
                key={item.label}
                to={item.to}
                className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center -mt-6 shadow-lg"
              >
                <MaterialIcon name={item.icon} />
              </Link>
            )
          }
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-space-sm py-1 ${
                active ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <MaterialIcon name={item.icon} className="text-[22px]" />
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>

            //Libraries yet to be added
          )
        })}
      </div>
    </nav>
  )
}
