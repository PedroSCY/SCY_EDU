import { LinkRepository } from '../repositories/link-repository'

export async function deleteLink(
  repository: LinkRepository,
  id: string
): Promise<void> {
  const link = await repository.findById(id)
  if (!link) {
    throw new Error('Link não encontrado')
  }

  await repository.delete(id)
}
