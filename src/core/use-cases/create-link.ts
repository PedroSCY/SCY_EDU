import { Link } from '../entities/link'
import { LinkRepository } from '../repositories/link-repository'
import { assertValidUrl } from '@/shared/utils/validation'

interface CreateLinkInput {
  title: string
  description?: string
  url: string
  slug: string
  categoryId?: string
  createdById: string
}

export async function createLink(
  repository: LinkRepository,
  input: CreateLinkInput
): Promise<Link> {
  if (!input.title?.trim()) throw new Error('Título é obrigatório')
  if (!input.slug?.trim()) throw new Error('Slug é obrigatório')

  assertValidUrl(input.url, 'URL de destino')

  const existing = await repository.findBySlug(input.slug)
  if (existing) {
    throw new Error('Já existe um link com este slug')
  }

  const link = Link.create({
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    url: input.url,
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    categoryId: input.categoryId ?? null,
    createdById: input.createdById,
  })

  await repository.create(link)
  return link
}
