import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
import { Category } from '@/core/entities/category'

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}))

vi.mock('@/infra/supabase/server', () => ({
  createServerClient: vi.fn().mockResolvedValue({
    from: mockFrom,
    auth: { getUser: vi.fn() },
  }),
}))

const makeDbCategory = (overrides = {}) => ({
  id: 'cat-1',
  name: 'Formulários',
  color: '#3B82F6',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

const makeDomainCategory = (overrides = {}) =>
  Category.restore({
    id: 'cat-1',
    name: 'Formulários',
    color: '#3B82F6',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CategoryRepositoryImpl', () => {
  describe('findById', () => {
    it('encontra categoria por id', async () => {
      const dbCat = makeDbCategory()
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: dbCat, error: null }),
          }),
        }),
      })

      const repo = new CategoryRepositoryImpl()
      const cat = await repo.findById('cat-1')

      expect(cat).not.toBeNull()
      expect(cat!.name).toBe('Formulários')
    })

    it('retorna null quando não encontrada', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      const repo = new CategoryRepositoryImpl()
      const cat = await repo.findById('not-found')

      expect(cat).toBeNull()
    })
  })

  describe('findAll', () => {
    it('retorna todas as categorias ordenadas por nome', async () => {
      const dbCats = [makeDbCategory({ id: '1' }), makeDbCategory({ id: '2', name: 'Provas' })]
      const queryBuilder = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: dbCats, error: null }),
      }
      mockFrom.mockReturnValue(queryBuilder)

      const repo = new CategoryRepositoryImpl()
      const cats = await repo.findAll()

      expect(cats).toHaveLength(2)
      expect(queryBuilder.order).toHaveBeenCalledWith('name', { ascending: true })
    })

    it('retorna array vazio quando não há categorias', async () => {
      const queryBuilder = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockFrom.mockReturnValue(queryBuilder)

      const repo = new CategoryRepositoryImpl()
      const cats = await repo.findAll()

      expect(cats).toHaveLength(0)
    })
  })

  describe('create', () => {
    it('insere uma categoria', async () => {
      const cat = makeDomainCategory()
      const qb = { insert: vi.fn().mockResolvedValue({ error: null }) }
      mockFrom.mockReturnValue(qb)

      const repo = new CategoryRepositoryImpl()
      await repo.create(cat)

      expect(qb.insert).toHaveBeenCalledWith({
        id: 'cat-1',
        name: 'Formulários',
        color: '#3B82F6',
      })
    })

    it('lança erro ao inserir com falha', async () => {
      const cat = makeDomainCategory()
      mockFrom.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: new Error('DB error') }),
      })

      const repo = new CategoryRepositoryImpl()
      await expect(repo.create(cat)).rejects.toThrow('DB error')
    })
  })

  describe('update', () => {
    it('atualiza uma categoria', async () => {
      const cat = makeDomainCategory({ name: 'Novo Nome', color: '#EF4444' })
      const qb = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
      mockFrom.mockReturnValue(qb)

      const repo = new CategoryRepositoryImpl()
      await repo.update(cat)

      expect(qb.update).toHaveBeenCalledWith({
        name: 'Novo Nome',
        color: '#EF4444',
        updated_at: expect.any(String),
      })
      expect(qb.eq).toHaveBeenCalledWith('id', 'cat-1')
    })
  })

  describe('delete', () => {
    it('exclui uma categoria', async () => {
      const qb = { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
      mockFrom.mockReturnValue(qb)

      const repo = new CategoryRepositoryImpl()
      await repo.delete('cat-1')

      expect(qb.delete).toHaveBeenCalled()
      expect(qb.eq).toHaveBeenCalledWith('id', 'cat-1')
    })
  })
})
