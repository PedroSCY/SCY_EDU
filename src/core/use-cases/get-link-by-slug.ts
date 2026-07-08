import { Link } from '../entities/link'
import { LinkRepository } from '../repositories/link-repository'

export async function getLinkBySlug(
  repository: LinkRepository,
  slug: string
): Promise<Link | null> {
  return repository.findBySlug(slug)
}
