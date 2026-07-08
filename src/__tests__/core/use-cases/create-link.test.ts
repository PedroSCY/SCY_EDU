import { describe, it, expect, vi } from 'vitest'
import { createLink } from '@/core/use-cases/create-link'
import { LinkRepository } from '@/core/repositories/link-repository'

function createMockRepo(): LinkRepository {
  return {
    findById: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(null),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }
}

const validInput = {
  title: 'Meu Link',
  url: 'https://example.com',
  slug: 'meu-link',
  createdById: 'user-1',
}

describe('createLink', () => {
  it('cria um link com sucesso, active=true e type=link', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, validInput)

    expect(link.title).toBe('Meu Link')
    expect(link.slug).toBe('meu-link')
    expect(link.active).toBe(true)
    expect(link.type).toBe('link')
    expect(repo.create).toHaveBeenCalledOnce()
  })

  it('normaliza o slug (remove especiais, espaços viram hífen)', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, { ...validInput, slug: 'Google@Forms?2024' })

    expect(link.slug).toBe('googleforms2024')
  })

  it('lança erro se slug ficar vazio após sanitização', async () => {
    const repo = createMockRepo()
    await expect(
      createLink(repo, { ...validInput, slug: '@#$%' })
    ).rejects.toThrow('Slug inválido após sanitização')
  })

  it('lança erro se título estiver vazio', async () => {
    const repo = createMockRepo()
    await expect(
      createLink(repo, { ...validInput, title: '' })
    ).rejects.toThrow('Título é obrigatório')

    await expect(
      createLink(repo, { ...validInput, title: '   ' })
    ).rejects.toThrow('Título é obrigatório')
  })

  it('lança erro se slug estiver vazio', async () => {
    const repo = createMockRepo()
    await expect(
      createLink(repo, { ...validInput, slug: '' })
    ).rejects.toThrow('Slug é obrigatório')
  })

  it('lança erro se URL for inválida', async () => {
    const repo = createMockRepo()
    await expect(
      createLink(repo, { ...validInput, url: 'not-a-url' })
    ).rejects.toThrow('URL de destino inválida')

    await expect(
      createLink(repo, { ...validInput, url: '' })
    ).rejects.toThrow('URL de destino inválida')
  })

  it('lança erro se slug já existir', async () => {
    const repo = createMockRepo()
    repo.findBySlug = vi.fn().mockResolvedValue({ id: 'existing' })

    await expect(createLink(repo, validInput)).rejects.toThrow(
      'Já existe um link com este slug'
    )
  })

  it('remove espaços extras do título e descrição', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, {
      ...validInput,
      title: '  Link com Espaços  ',
      description: '  Descrição com espaços  ',
    })

    expect(link.title).toBe('Link com Espaços')
    expect(link.description).toBe('Descrição com espaços')
  })

  it('cria com descrição undefined como null', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, validInput)

    expect(link.description).toBeNull()
  })

  it('respeita o categoryId quando fornecido', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, { ...validInput, categoryId: 'cat-1' })

    expect(link.categoryId).toBe('cat-1')
  })

  it('cria link com tipo específico', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, { ...validInput, type: 'video' })

    expect(link.type).toBe('video')
  })

  it('usa type=link como padrão', async () => {
    const repo = createMockRepo()
    const link = await createLink(repo, validInput)

    expect(link.type).toBe('link')
  })
})
