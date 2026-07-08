import { describe, it, expect, vi } from 'vitest'
import { deleteLink } from '@/core/use-cases/delete-link'
import { LinkRepository } from '@/core/repositories/link-repository'

function createMockRepo(exists = true): LinkRepository {
  return {
    findById: vi.fn().mockResolvedValue(exists ? { id: 'link-1' } : null),
    findBySlug: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

describe('deleteLink', () => {
  it('exclui um link existente', async () => {
    const repo = createMockRepo(true)

    await deleteLink(repo, 'link-1')

    expect(repo.findById).toHaveBeenCalledWith('link-1')
    expect(repo.delete).toHaveBeenCalledWith('link-1')
  })

  it('lança erro se link não existir', async () => {
    const repo = createMockRepo(false)

    await expect(deleteLink(repo, 'not-found')).rejects.toThrow(
      'Link não encontrado'
    )
    expect(repo.delete).not.toHaveBeenCalled()
  })
})
