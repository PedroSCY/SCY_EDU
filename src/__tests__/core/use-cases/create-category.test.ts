import { describe, it, expect, vi } from 'vitest'
import { createCategory } from '@/core/use-cases/create-category'
import { CategoryRepository } from '@/core/repositories/category-repository'

function createMockRepo(): CategoryRepository {
  return {
    findById: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

describe('createCategory', () => {
  it('cria uma categoria com cor padrão', async () => {
    const repo = createMockRepo()
    const cat = await createCategory(repo, { name: 'Provas' })

    expect(cat.name).toBe('Provas')
    expect(cat.color).toBe('#3B82F6')
    expect(repo.create).toHaveBeenCalledOnce()
  })

  it('cria uma categoria com cor personalizada', async () => {
    const repo = createMockRepo()
    const cat = await createCategory(repo, { name: 'Avisos', color: '#EF4444' })

    expect(cat.color).toBe('#EF4444')
  })
})
