import { describe, it, expect } from 'vitest'
import { User } from '@/core/entities/user'

describe('User', () => {
  const validProps = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Admin',
    email: 'admin@escola.com',
    password: 'hashed-password',
    role: 'ADMIN' as const,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  it('cria um novo usuário', () => {
    const user = User.create({
      name: 'Professor',
      email: 'prof@escola.com',
      password: 'secret123',
      role: 'ADMIN',
    })

    expect(user.id).toBeTruthy()
    expect(user.name).toBe('Professor')
    expect(user.email).toBe('prof@escola.com')
    expect(user.password).toBe('secret123')
    expect(user.role).toBe('ADMIN')
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })

  it('restaura um usuário', () => {
    const user = User.restore(validProps)

    expect(user.id).toBe(validProps.id)
    expect(user.name).toBe(validProps.name)
    expect(user.email).toBe(validProps.email)
    expect(user.password).toBe(validProps.password)
    expect(user.role).toBe(validProps.role)
  })

  it('exclui a senha no toJSON', () => {
    const user = User.restore(validProps)
    const json = user.toJSON()

    expect(json.id).toBe(validProps.id)
    expect(json.email).toBe(validProps.email)
    expect(json.name).toBe(validProps.name)
    expect(json.role).toBe(validProps.role)
    expect((json as Record<string, unknown>).password).toBeUndefined()
  })
})
