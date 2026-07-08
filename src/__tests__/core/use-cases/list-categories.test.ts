import { describe, it, expect, vi } from 'vitest'
import { listCategories } from '@/core/use-cases/list-categories'
import { CategoryRepository } from '@/core/repositories/category-repository'

function createMockRepo(result: unknown[] = []): CategoryRepository {
  return {
    findById: vi.fn(),
    findAll: vi.fn().mockResolvedValue(result),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

describe('listCategories', () => {
  it('retorna todas as categorias', async () => {
    const repo = createMockRepo(['cat-1', 'cat-2'])
    const cats = await listCategories(repo)

    expect(cats).toHaveLength(2)
    expect(repo.findAll).toHaveBeenCalledOnce()
  })

  it('retorna array vazio quando não há categorias', async () => {
    const repo = createMockRepo([])
    const cats = await listCategories(repo)

    expect(cats).toHaveLength(0)
  })
})
