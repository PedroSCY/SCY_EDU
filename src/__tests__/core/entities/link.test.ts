import { describe, it, expect } from 'vitest'
import { Link } from '@/core/entities/link'

const validProps = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Google Forms',
  description: 'Formulário de atividades',
  url: 'https://forms.google.com',
  slug: 'google-forms',
  categoryId: null,
  active: true,
  type: 'link' as const,
  createdById: 'user-123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

describe('Link', () => {
  it('cria um link com id, timestamps, active=true e type=link', () => {
    const link = Link.create({
      title: 'Novo Link',
      description: 'Descrição',
      url: 'https://example.com',
      slug: 'novo-link',
      categoryId: null,
      active: true,
      type: 'link',
      createdById: 'user-1',
    })

    expect(link.id).toBeTruthy()
    expect(link.title).toBe('Novo Link')
    expect(link.description).toBe('Descrição')
    expect(link.url).toBe('https://example.com')
    expect(link.slug).toBe('novo-link')
    expect(link.categoryId).toBeNull()
    expect(link.active).toBe(true)
    expect(link.type).toBe('link')
    expect(link.createdById).toBe('user-1')
    expect(link.createdAt).toBeInstanceOf(Date)
    expect(link.updatedAt).toBeInstanceOf(Date)
  })

  it('cria um link com descrição nula, active=true e type=link', () => {
    const link = Link.create({
      title: 'Link sem descrição',
      description: null,
      url: 'https://example.com',
      slug: 'sem-descricao',
      categoryId: null,
      active: true,
      type: 'link',
      createdById: 'user-1',
    })

    expect(link.description).toBeNull()
    expect(link.active).toBe(true)
    expect(link.type).toBe('link')
  })

  it('restaura um link com props fornecidas', () => {
    const link = Link.restore(validProps)

    expect(link.id).toBe(validProps.id)
    expect(link.title).toBe(validProps.title)
    expect(link.description).toBe(validProps.description)
    expect(link.url).toBe(validProps.url)
    expect(link.slug).toBe(validProps.slug)
    expect(link.categoryId).toBeNull()
    expect(link.createdById).toBe(validProps.createdById)
    expect(link.createdAt).toBe(validProps.createdAt)
    expect(link.updatedAt).toBe(validProps.updatedAt)
  })

  it('serializa corretamente para JSON', () => {
    const link = Link.restore(validProps)
    const json = link.toJSON()

    expect(json.id).toBe(validProps.id)
    expect(json.title).toBe(validProps.title)
    expect(json.description).toBe(validProps.description)
    expect(json.url).toBe(validProps.url)
    expect(json.slug).toBe(validProps.slug)
    expect(json.active).toBe(true)
    expect(json.type).toBe('link')
    expect(json.createdById).toBe(validProps.createdById)
    expect(json.createdAt).toBe(validProps.createdAt)
    expect(json.updatedAt).toBe(validProps.updatedAt)
  })

  it('define categoria e tipo quando fornecidos', () => {
    const link = Link.restore({
      ...validProps,
      categoryId: 'cat-456',
      type: 'video',
    })

    expect(link.categoryId).toBe('cat-456')
    expect(link.type).toBe('video')
  })
})
