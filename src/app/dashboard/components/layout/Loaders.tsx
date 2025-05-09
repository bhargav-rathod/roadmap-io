'use client'

import CreatingRoadmapLoader from '@/components/roadmap/CreatingRoadmapLoader'
import ClassicLoader from '@/components/ui/ClassicLoader'

interface LoadersProps {
  showRoadmapLoader: boolean
  showClassicLoader: boolean
}

export default function Loaders({ showRoadmapLoader, showClassicLoader }: LoadersProps) {
  return (
    <>
      {showRoadmapLoader && <CreatingRoadmapLoader />}
      {showClassicLoader && <ClassicLoader />}
    </>
  )
}