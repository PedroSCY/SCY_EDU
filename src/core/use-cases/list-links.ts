import { Link } from '../entities/link'
import { LinkRepository } from '../repositories/link-repository'
import { FindManyParams } from '../repositories/link-repository'

export async function listLinks(
  repository: LinkRepository,
  params?: FindManyParams
): Promise<Link[]> {
  return repository.findMany(params)
}
