import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LinkRepositoryImpl } from '@/infra/supabase/link-repository-impl'
import { Link } from '@/core/entities/link'

const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}))

vi.mock('@/infra/supabase/server', () => ({
  createServerClient: vi.fn().mockResolvedValue({
    from: mockFrom,
    auth: { getUser: vi.fn() },
  }),
}))

const makeDbLink = (overrides = {}) => ({
  id: 'link-1',
  title: 'Test Link',
  description: 'A test link',
  url: 'https://example.com',
  slug: 'test-link',
  category_id: null,
  active: true,
  type: 'link',
  created_by_id: 'user-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

const makeDomainLink = (overrides = {}) =>
  Link.restore({
    id: 'link-1',
    title: 'Test Link',
    description: 'A test link',
    url: 'https://example.com',
    slug: 'test-link',
    categoryId: null,
    active: true,
    type: 'link',
    createdById: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LinkRepositoryImpl', () => {
  describe('findById', () => {
    it('encontra link por id', async () => {
      const dbLink = makeDbLink()
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: dbLink, error: null }),
          }),
        }),
      })

      const repo = new LinkRepositoryImpl()
      const link = await repo.findById('link-1')

      expect(link).not.toBeNull()
      expect(link!.id).toBe('link-1')
    })

    it('retorna null quando não encontrado', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      const repo = new LinkRepositoryImpl()
      const link = await repo.findById('not-found')

      expect(link).toBeNull()
    })
  })

  describe('findBySlug', () => {
    it('encontra link por slug', async () => {
      const dbLink = makeDbLink()
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: dbLink, error: null }),
          }),
        }),
      })

      const repo = new LinkRepositoryImpl()
      const link = await repo.findBySlug('test-link')

      expect(link).not.toBeNull()
    })
  })

  describe('findMany', () => {
    function makeQueryBuilder(result: unknown[] = []) {
      const resolveValue = { data: result, error: null }
      const qb = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        then: vi.fn((onfulfilled: (v: typeof resolveValue) => unknown) =>
          Promise.resolve(onfulfilled(resolveValue))
        ),
      }
      return qb
    }

    it('retorna todos os links ordenados por created_at desc', async () => {
      const dbLinks = [makeDbLink({ id: '1' }), makeDbLink({ id: '2' })]
      const qb = makeQueryBuilder(dbLinks)
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      const links = await repo.findMany()

      expect(links).toHaveLength(2)
    })

    it('filtra por categoryId', async () => {
      const qb = makeQueryBuilder()
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await repo.findMany({ categoryId: 'cat-1' })

      expect(qb.eq).toHaveBeenCalledWith('category_id', 'cat-1')
    })

    it('busca por título e descrição', async () => {
      const qb = makeQueryBuilder()
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await repo.findMany({ search: 'test' })

      expect(qb.or).toHaveBeenCalledWith(
        'title.ilike.%test%,description.ilike.%test%'
      )
    })

    it('filtra apenas links ativos quando onlyActive=true', async () => {
      const qb = makeQueryBuilder()
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await repo.findMany({ onlyActive: true })

      expect(qb.eq).toHaveBeenCalledWith('active', true)
    })
  })

  describe('create', () => {
    it('insere um link', async () => {
      const link = makeDomainLink()
      const inserted = { error: null }
      const qb = { insert: vi.fn().mockResolvedValue(inserted) }
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await repo.create(link)

      expect(qb.insert).toHaveBeenCalledWith({
        id: 'link-1',
        title: 'Test Link',
        description: 'A test link',
        url: 'https://example.com',
        slug: 'test-link',
        category_id: null,
        active: true,
        type: 'link',
        created_by_id: 'user-1',
      })
    })

    it('lança erro ao inserir com falha', async () => {
      const link = makeDomainLink()
      const qb = { insert: vi.fn().mockResolvedValue({ error: new Error('DB error') }) }
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await expect(repo.create(link)).rejects.toThrow('DB error')
    })
  })

  describe('update', () => {
    it('atualiza um link', async () => {
      const link = makeDomainLink()
      const qb = { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await repo.update(link)

      expect(qb.update).toHaveBeenCalled()
      expect(qb.eq).toHaveBeenCalledWith('id', 'link-1')
    })
  })

  describe('delete', () => {
    it('exclui um link', async () => {
      const qb = { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) }
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await repo.delete('link-1')

      expect(qb.delete).toHaveBeenCalled()
      expect(qb.eq).toHaveBeenCalledWith('id', 'link-1')
    })

    it('lança erro ao excluir com falha', async () => {
      const qb = { delete: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: new Error('DB error') }) }
      mockFrom.mockReturnValue(qb)

      const repo = new LinkRepositoryImpl()
      await expect(repo.delete('link-1')).rejects.toThrow('DB error')
    })
  })
})
