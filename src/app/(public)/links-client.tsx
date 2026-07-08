'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LINK_TYPE_CONFIG, type LinkType } from '@/components/link-type-config'
import type { LinkCardData, CategoryFilterData } from './public-links-content'

export function LinksClient({
  links,
  categories,
}: {
  links: LinkCardData[]
  categories: CategoryFilterData[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredLinks = useMemo(
    () =>
      selectedCategory
        ? links.filter((l) => l.categoryId === selectedCategory)
        : links,
    [links, selectedCategory]
  )

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="rounded-full text-xs"
        >
          Todas
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat.id ? null : cat.id
              )
            }
            className="rounded-full text-xs"
            style={{
              ...(selectedCategory !== cat.id
                ? {
                    borderColor: cat.color + '40',
                    color: cat.color,
                  }
                : {}),
            }}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {filteredLinks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-zinc-400">
            {selectedCategory
              ? 'Nenhum link nesta categoria.'
              : 'Nenhum link disponível no momento.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredLinks.map((link) => {
            const typeCfg = LINK_TYPE_CONFIG[link.type as LinkType] ?? LINK_TYPE_CONFIG.link
            const Icon = typeCfg.icon

            return (
              <Link key={link.id} href={`/r/${link.slug}`}>
                <Card
                  className="group hover:shadow-lg transition-all cursor-pointer h-full overflow-hidden"
                  style={{ borderColor: typeCfg.color + '30' }}
                >
                  <div style={{ height: 3, backgroundColor: typeCfg.color }} />
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mt-0.5"
                        style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-medium text-zinc-900 truncate text-sm group-hover:text-zinc-700 transition-colors">
                          {link.title}
                        </h2>
                        {link.description && (
                          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                            {link.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                            style={{ backgroundColor: typeCfg.bg, color: typeCfg.color }}
                          >
                            <Icon className="h-3 w-3" />
                            {typeCfg.label}
                          </span>
                          {link.categoryName && (
                            <Badge
                              className="cursor-default"
                              style={{
                                backgroundColor:
                                  (link.categoryColor ?? '#3B82F6') + '20',
                                color: link.categoryColor ?? '#3B82F6',
                              }}
                            >
                              {link.categoryName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
