import { Link } from '../entities/link'
import { LinkRepository } from '../repositories/link-repository'
import { assertValidUrl, sanitizeSlug } from '@/shared/utils/validation'
import type { LinkType } from '@/components/link-type-config'

export interface CreateLinkInput {
  title: string
  description?: string
  url: string
  slug: string
  categoryId?: string
  type?: LinkType
  createdById: string
}

export async function createLink(
  repository: LinkRepository,
  input: CreateLinkInput
): Promise<Link> {
  if (!input.title?.trim()) throw new Error('Título é obrigatório')
  if (!input.slug?.trim()) throw new Error('Slug é obrigatório')

  assertValidUrl(input.url, 'URL de destino')

  const slug = sanitizeSlug(input.slug)
  if (!slug) throw new Error('Slug inválido após sanitização')

  const existing = await repository.findBySlug(slug)
  if (existing) {
    throw new Error('Já existe um link com este slug')
  }

  const link = Link.create({
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    url: input.url,
    slug,
    categoryId: input.categoryId ?? null,
    active: true,
    type: input.type ?? 'link',
    createdById: input.createdById,
  })

  await repository.create(link)
  return link
}
