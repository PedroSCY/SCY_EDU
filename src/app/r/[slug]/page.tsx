import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { RedirectContent } from './redirect-content'

interface Props {
  params: Promise<{ slug: string }>
}

export default function RedirectPage({ params }: Props) {
  cookies()
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="rounded-lg border border-zinc-200 bg-white p-8">
            <div className="animate-pulse space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-zinc-200" />
              <div className="h-5 bg-zinc-200 rounded w-3/4 mx-auto" />
              <div className="h-3 bg-zinc-200 rounded w-1/2 mx-auto" />
              <div className="h-20 bg-zinc-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    }>
      <RedirectContent params={params} />
    </Suspense>
  )
}
