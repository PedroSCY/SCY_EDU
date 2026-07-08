import { describe, it, expect, vi } from 'vitest'
import { listLinks } from '@/core/use-cases/list-links'
import { LinkRepository, FindManyParams } from '@/core/repositories/link-repository'

function createMockRepo(result: unknown[] = []): LinkRepository {
  return {
    findById: vi.fn(),
    findBySlug: vi.fn(),
    findMany: vi.fn().mockResolvedValue(result),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

describe('listLinks', () => {
  it('retorna todos os links sem filtros', async () => {
    const repo = createMockRepo(['link-1', 'link-2'])
    const links = await listLinks(repo)

    expect(links).toHaveLength(2)
    expect(repo.findMany).toHaveBeenCalledWith(undefined)
  })

  it('passa parâmetros de filtro para o repositório', async () => {
    const repo = createMockRepo()
    const params: FindManyParams = { categoryId: 'cat-1', search: 'test' }

    await listLinks(repo, params)

    expect(repo.findMany).toHaveBeenCalledWith(params)
  })

  it('filtra apenas por categoria', async () => {
    const repo = createMockRepo()
    const params: FindManyParams = { categoryId: 'cat-1' }

    await listLinks(repo, params)

    expect(repo.findMany).toHaveBeenCalledWith(params)
  })

  it('retorna array vazio quando não há links', async () => {
    const repo = createMockRepo([])
    const links = await listLinks(repo)

    expect(links).toHaveLength(0)
  })
})
