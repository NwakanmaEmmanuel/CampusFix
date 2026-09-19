interface Props {
  name: string
  className?: string
}

export default function MaterialIcon({ name, className = '' }: Props) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}
