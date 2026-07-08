import { Category } from '@/core/entities/category'
import { CategoryRepository } from '@/core/repositories/category-repository'
import { createServerClient } from './server'

export class CategoryRepositoryImpl implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('categories')
      .select()
      .eq('id', id)
      .single()

    return data ? this.toDomain(data) : null
  }

  async findAll(): Promise<Category[]> {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('categories')
      .select()
      .order('name', { ascending: true })

    return (data ?? []).map((raw) => this.toDomain(raw))
  }

  async create(category: Category): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase.from('categories').insert({
      id: category.id,
      name: category.name,
      color: category.color,
    })

    if (error) throw new Error(error.message)
  }

  async update(category: Category): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase
      .from('categories')
      .update({
        name: category.name,
        color: category.color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', category.id)

    if (error) throw new Error(error.message)
  }

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) throw new Error(error.message)
  }

  private toDomain(raw: Record<string, unknown>): Category {
    return Category.restore({
      id: raw.id as string,
      name: raw.name as string,
      color: raw.color as string,
      createdAt: new Date(raw.created_at as string),
      updatedAt: new Date(raw.updated_at as string),
    })
  }
}
