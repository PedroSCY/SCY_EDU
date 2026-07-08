import { Link } from '../entities/link'
import { LinkRepository } from '../repositories/link-repository'
import { assertValidUrl, sanitizeSlug } from '@/shared/utils/validation'
import type { LinkType } from '@/components/link-type-config'

interface UpdateLinkInput {
  title?: string
  description?: string | null
  url?: string
  slug?: string
  categoryId?: string | null
  active?: boolean
  type?: LinkType
}

export async function updateLink(
  repository: LinkRepository,
  id: string,
  input: UpdateLinkInput
): Promise<Link> {
  const link = await repository.findById(id)
  if (!link) {
    throw new Error('Link não encontrado')
  }

  if (input.title !== undefined && !input.title.trim()) {
    throw new Error('Título não pode ficar vazio')
  }

  if (input.url) {
    assertValidUrl(input.url, 'URL de destino')
  }

  const newSlug = input.slug ? sanitizeSlug(input.slug) : undefined
  if (newSlug && newSlug !== link.slug) {
    const existing = await repository.findBySlug(newSlug)
    if (existing) {
      throw new Error('Já existe um link com este slug')
    }
  }

  const updated = Link.restore({
    ...link.toJSON(),
    title: input.title?.trim() ?? link.title,
    description: input.description !== undefined ? input.description?.trim() ?? null : link.description,
    url: input.url ?? link.url,
    slug: newSlug ?? link.slug,
    categoryId: input.categoryId !== undefined ? input.categoryId : link.categoryId,
    active: input.active ?? link.active,
    type: input.type ?? link.type,
    updatedAt: new Date(),
  })

  await repository.update(updated)
  return updated
}
