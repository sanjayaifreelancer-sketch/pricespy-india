import { Suspense } from 'react'
import SearchContent from './SearchContent'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-28 px-margin-mobile max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-14 bg-surface-container-low rounded-2xl" />
          <div className="h-8 bg-surface-container-low rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-surface-container-low rounded-2xl" />)}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
