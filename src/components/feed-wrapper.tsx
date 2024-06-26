import { ReactNode } from 'react'

export interface FeedWrapperProps {
  children: ReactNode
}

export function FeedWrapper({ children }: FeedWrapperProps) {
  return <div className="relative top-0 flex-1 pb-10">{children}</div>
}
