import { describe, it, expect } from 'vitest'
import { Category } from '@/core/entities/category'

const validProps = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Formulários',
  color: '#3B82F6',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

describe('Category', () => {
  it('cria uma nova categoria', () => {
    const cat = Category.create({ name: 'Provas', color: '#3B82F6' })

    expect(cat.id).toBeTruthy()
    expect(cat.name).toBe('Provas')
    expect(cat.color).toBe('#3B82F6')
    expect(cat.createdAt).toBeInstanceOf(Date)
    expect(cat.updatedAt).toBeInstanceOf(Date)
  })

  it('cria uma categoria com cor personalizada', () => {
    const cat = Category.create({ name: 'Recados', color: '#EF4444' })

    expect(cat.color).toBe('#EF4444')
  })

  it('restaura uma categoria com props fornecidas', () => {
    const cat = Category.restore(validProps)

    expect(cat.id).toBe(validProps.id)
    expect(cat.name).toBe(validProps.name)
    expect(cat.color).toBe(validProps.color)
    expect(cat.createdAt).toBe(validProps.createdAt)
    expect(cat.updatedAt).toBe(validProps.updatedAt)
  })

  it('serializa corretamente para JSON', () => {
    const cat = Category.restore(validProps)
    const json = cat.toJSON()

    expect(json.id).toBe(validProps.id)
    expect(json.name).toBe(validProps.name)
    expect(json.color).toBe(validProps.color)
    expect(json.createdAt).toBe(validProps.createdAt)
    expect(json.updatedAt).toBe(validProps.updatedAt)
  })
})
