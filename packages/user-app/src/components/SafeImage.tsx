import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
}

export default function SafeImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div className={`bg-gradient-to-br from-primary-container/40 to-primary-fixed/30 flex items-center justify-center ${className}`}>
        <span className="material-symbols-outlined text-4xl text-primary/40">checkroom</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
