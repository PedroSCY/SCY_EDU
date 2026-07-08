import { LinkRepositoryImpl } from '@/infra/supabase/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
import { listLinks } from '@/core/use-cases/list-links'
import { listCategories } from '@/core/use-cases/list-categories'
import { LinksClient } from './links-client'

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

export interface LinkCardData {
  id: string
  title: string
  description: string | null
  url: string
  slug: string
  categoryId: string | null
  type: string
  categoryName: string | null
  categoryColor: string | null
}

export interface CategoryFilterData {
  id: string
  name: string
  color: string
}

export async function PublicLinksContent() {
  const [links, categories] = await Promise.all([
    listLinks(linkRepository, { onlyActive: true }),
    listCategories(categoryRepository),
  ])

  const linksData: LinkCardData[] = links.map((link) => {
    const category = categories.find((c) => c.id === link.categoryId)
    const json = link.toJSON()
    return {
      id: json.id,
      title: json.title,
      description: json.description,
      url: json.url,
      slug: json.slug,
      categoryId: json.categoryId,
      type: json.type,
      categoryName: category?.name ?? null,
      categoryColor: category?.color ?? null,
    }
  })

  const categoriesData: CategoryFilterData[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
  }))

  return <LinksClient links={linksData} categories={categoriesData} />
}
