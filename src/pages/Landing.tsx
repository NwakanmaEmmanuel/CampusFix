import { Link } from 'react-router-dom'
import Header from '../components/Header'
import MaterialIcon from '../components/MaterialIcon'

const feed = [
  {
    tag: 'Math 201',
    tagColor: 'bg-tertiary-container/20 text-tertiary',
    urgency: 'ASAP • 12m ago',
    title: 'Eigenvalue problem step-by-step',
    price: '₦1,500',
    by: 'TA Tolani A. • Library Block B',
  },
  {
    tag: 'CSC 304',
    tagColor: 'bg-primary-container/20 text-primary',
    urgency: 'Within 1hr',
    title: 'React useEffect infinite loop',
    price: '₦2,000',
    by: 'EM Emmanuel O. • Innovation Hub',
  },
  {
    tag: 'Careers',
    tagColor: 'bg-secondary-container/40 text-on-secondary-container',
    urgency: 'Due Tonight',
    title: 'CV review for Goldman Sachs app',
    price: '₦3,000',
    by: 'CH Chidinma K. • Hostel Hall 4',
  },
]

const steps = [
  {
    num: '1',
    title: 'Post Blockers & Budget',
    body: 'Set your micro-bounty (₦1,000–₦5,000) and deadline. No complicated hiring agreements.',
  },
  {
    num: '2',
    title: 'Instant AI Categorization',
    body: 'Our LLM parses problem complexity, tags course codes, and pings verified peers who\u2019ve aced that exact class.',
  },
  {
    num: '3',
    title: 'Solution Delivery + AI Verification',
    body: 'Chat 1-on-1, receive your code snippet or explanation, and unlock payout after automated quality check.',
  },
]

export default function Landing() {
  return (
    <>
      <Header title="CampusFix" eyebrow="Home" />

      <div className="px-gutter py-space-lg space-y-space-lg">
        <div className="bg-surface-container-low rounded-full px-space-md py-1.5 inline-flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          BINCOM HACKATHON 2026 EDITION
          <span className="ml-1 bg-surface-container-high px-2 py-0.5 rounded-full">24h Help</span>
        </div>

        <div>
          <p className="font-label-lg text-label-lg text-primary flex items-center gap-1 mb-space-sm">
            <MaterialIcon name="bolt" className="text-[16px]" />
            Peer Micro-Bounties
          </p>
          <h1 className="font-display-hero-mobile text-display-hero-mobile text-on-surface mb-space-sm">
            Students don&rsquo;t always need a course.{' '}
            <span className="text-primary">Just someone right now.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Turn urgent academic blockers into verified, 1-on-1 peer fixes backed by instant AI
            matching and quality verification.
          </p>
        </div>

        <Link
          to="/new"
          className="w-full bg-primary text-on-primary rounded-xl py-space-md flex items-center justify-center gap-space-sm font-label-lg text-label-lg shadow-md active:scale-[0.98] transition-transform"
        >
          <MaterialIcon name="bolt" className="text-[18px]" />
          Find Help Now
        </Link>

        <Link
          to="/matching"
          className="w-full p-space-md bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-secondary flex-shrink-0 shadow-sm">
              <MaterialIcon name="payments" className="text-[22px]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-lg text-label-lg font-bold truncate">Help Others &amp; Earn</span>
              <span className="font-body-sm text-body-sm text-on-secondary-container/80 truncate">
                Verified student solver squad
              </span>
            </div>
          </div>
          <span className="font-label-sm text-label-sm bg-surface/80 text-secondary px-space-xs py-1 rounded-full whitespace-nowrap font-bold">
            ₦1.5k–5k / fix
          </span>
        </Link>

        <div className="grid grid-cols-3 gap-space-xs p-space-sm rounded-xl bg-surface-container-low">
          <div className="flex flex-col items-center justify-center p-space-xs text-center">
            <span className="font-headline-sm text-headline-sm text-primary font-bold">450+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Active Peers</span>
          </div>
          <div className="flex flex-col items-center justify-center p-space-xs text-center border-x border-outline-variant/40">
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">14m</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Avg Match</span>
          </div>
          <div className="flex flex-col items-center justify-center p-space-xs text-center">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">₦1.2M+</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Paid to Peers</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-space-sm">
            <h2 className="font-headline-sm text-headline-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Urgent Campus Feed
            </h2>
            <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5">
              Live Ticker <MaterialIcon name="sync" className="text-[14px]" />
            </span>
          </div>
          <div className="space-y-space-sm">
            {feed.map((f) => (
              <Link
                key={f.title}
                to="/matching"
                className="block bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${f.tagColor}`}>
                    {f.tag}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{f.urgency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-label-lg text-label-lg text-on-surface pr-2">{f.title}</p>
                  <p className="font-headline-sm text-headline-sm text-primary whitespace-nowrap">{f.price}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{f.by}</span>
                  <span className="font-label-sm text-label-sm bg-surface-container-low text-primary px-space-sm py-1 rounded-full">
                    Accept Fix
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-primary-fixed/40 rounded-xl p-space-md space-y-space-sm">
          <div className="flex items-center justify-between">
            <p className="font-label-lg text-label-lg flex items-center gap-1">
              <MaterialIcon name="auto_awesome" className="text-[18px] text-primary" />
              Try AI Auto-Tagging
            </p>
            <Link to="/new" className="font-label-sm text-label-sm text-primary">
              Instant Preview
            </Link>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Describe your urgent academic blocker on the Post screen and CampusFix classifies it
            instantly — subject, difficulty, and time estimate.
          </p>
        </div>

        <div>
          <h2 className="font-headline-sm text-headline-sm mb-space-md">How CampusFix Works</h2>
          <div className="space-y-space-md">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-space-md">
                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-lg text-label-lg flex-shrink-0">
                  {s.num}
                </div>
                <div>
                  <p className="font-label-lg text-label-lg mb-0.5">{s.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MaterialIcon name="verified_user" className="text-primary" />
          </div>
          <div>
            <p className="font-label-lg text-label-lg">Verified Student Guarantee</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Only .edu email validated students from registered faculties can accept bounties.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
