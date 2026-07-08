import { describe, it, expect, vi } from 'vitest'
import { updateLink } from '@/core/use-cases/update-link'
import { LinkRepository } from '@/core/repositories/link-repository'
import { Link } from '@/core/entities/link'

function createMockRepo(existingLink?: Link): LinkRepository {
  return {
    findById: vi.fn().mockResolvedValue(existingLink ?? null),
    findBySlug: vi.fn().mockResolvedValue(null),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

function makeLink(overrides = {}): Link {
  return Link.restore({
    id: 'link-1',
    title: 'Título Original',
    description: 'Descrição original',
    url: 'https://original.com',
    slug: 'slug-original',
    categoryId: null,
    active: true,
    type: 'link',
    createdById: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  })
}

describe('updateLink', () => {
  it('atualiza todos os campos', async () => {
    const link = makeLink()
    const repo = createMockRepo(link)

    const updated = await updateLink(repo, 'link-1', {
      title: 'Novo Título',
      description: 'Nova descrição',
      url: 'https://novo.com',
      slug: 'novo-slug',
      categoryId: 'cat-1',
    })

    expect(updated.title).toBe('Novo Título')
    expect(updated.description).toBe('Nova descrição')
    expect(updated.url).toBe('https://novo.com')
    expect(updated.slug).toBe('novo-slug')
    expect(updated.categoryId).toBe('cat-1')
    expect(updated.updatedAt.getTime()).toBeGreaterThan(link.updatedAt.getTime())
    expect(repo.update).toHaveBeenCalledOnce()
  })

  it('lança erro se link não existir', async () => {
    const repo = createMockRepo()

    await expect(
      updateLink(repo, 'not-found', { title: 'Novo' })
    ).rejects.toThrow('Link não encontrado')
  })

  it('lança erro se título ficar vazio', async () => {
    const repo = createMockRepo(makeLink())

    await expect(
      updateLink(repo, 'link-1', { title: '' })
    ).rejects.toThrow('Título não pode ficar vazio')

    await expect(
      updateLink(repo, 'link-1', { title: '   ' })
    ).rejects.toThrow('Título não pode ficar vazio')
  })

  it('lança erro se nova URL for inválida', async () => {
    const repo = createMockRepo(makeLink())

    await expect(
      updateLink(repo, 'link-1', { url: 'bad-url' })
    ).rejects.toThrow('URL de destino inválida')
  })

  it('pula validação de URL quando não fornecida', async () => {
    const repo = createMockRepo(makeLink())

    await expect(
      updateLink(repo, 'link-1', { title: 'Só título' })
    ).resolves.toBeDefined()
  })

  it('lança erro se novo slug já existir', async () => {
    const repo = createMockRepo(makeLink())
    repo.findBySlug = vi.fn().mockResolvedValue(makeLink({ id: 'other-link', slug: 'slug-ocupado' }))

    await expect(
      updateLink(repo, 'link-1', { slug: 'slug-ocupado' })
    ).rejects.toThrow('Já existe um link com este slug')
  })

  it('permite mesmo slug quando inalterado', async () => {
    const link = makeLink()
    const repo = createMockRepo(link)

    const updated = await updateLink(repo, 'link-1', { title: 'Só título' })

    expect(updated.title).toBe('Só título')
    expect(updated.slug).toBe('slug-original')
  })

  it('limpa descrição quando explicitamente nula', async () => {
    const repo = createMockRepo(makeLink())
    const updated = await updateLink(repo, 'link-1', { description: null })

    expect(updated.description).toBeNull()
  })

  it('mantém descrição quando não fornecida', async () => {
    const repo = createMockRepo(makeLink())
    const updated = await updateLink(repo, 'link-1', { title: 'Novo' })

    expect(updated.description).toBe('Descrição original')
  })

  it('limpa categoria quando explicitamente nula', async () => {
    const repo = createMockRepo(makeLink({ categoryId: 'cat-1' }))
    const updated = await updateLink(repo, 'link-1', { categoryId: null })

    expect(updated.categoryId).toBeNull()
  })

  it('desativa um link', async () => {
    const repo = createMockRepo(makeLink())
    const updated = await updateLink(repo, 'link-1', { active: false })

    expect(updated.active).toBe(false)
  })

  it('reativa um link', async () => {
    const repo = createMockRepo(makeLink({ active: false }))
    const updated = await updateLink(repo, 'link-1', { active: true })

    expect(updated.active).toBe(true)
  })

  it('mantém active quando não fornecido', async () => {
    const repo = createMockRepo(makeLink())
    const updated = await updateLink(repo, 'link-1', { title: 'Novo' })

    expect(updated.active).toBe(true)
  })

  it('altera o tipo do link', async () => {
    const repo = createMockRepo(makeLink())
    const updated = await updateLink(repo, 'link-1', { type: 'video' })

    expect(updated.type).toBe('video')
  })

  it('mantém o tipo quando não fornecido', async () => {
    const repo = createMockRepo(makeLink({ type: 'quiz' }))
    const updated = await updateLink(repo, 'link-1', { title: 'Novo' })

    expect(updated.type).toBe('quiz')
  })
})
