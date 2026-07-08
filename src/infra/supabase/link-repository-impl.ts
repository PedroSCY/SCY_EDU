import { Link } from '@/core/entities/link'
import type { LinkType } from '@/components/link-type-config'
import { LinkRepository, FindManyParams } from '@/core/repositories/link-repository'
import { createServerClient } from './server'

export class LinkRepositoryImpl implements LinkRepository {
  async findById(id: string): Promise<Link | null> {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('links')
      .select()
      .eq('id', id)
      .single()

    return data ? this.toDomain(data) : null
  }

  async findBySlug(slug: string): Promise<Link | null> {
    const supabase = await createServerClient()
    const { data } = await supabase
      .from('links')
      .select()
      .eq('slug', slug)
      .single()

    return data ? this.toDomain(data) : null
  }

  async findMany(params?: FindManyParams): Promise<Link[]> {
    const supabase = await createServerClient()
    let query = supabase.from('links').select().order('created_at', { ascending: false })

    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId)
    }

    if (params?.search) {
      query = query.or(
        `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
      )
    }

    if (params?.onlyActive) {
      query = query.eq('active', true)
    }

    const { data } = await query

    return (data ?? []).map((raw) => this.toDomain(raw))
  }

  async create(link: Link): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase.from('links').insert({
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      slug: link.slug,
      category_id: link.categoryId,
      active: link.active,
      type: link.type,
      created_by_id: link.createdById,
    })

    if (error) throw new Error(error.message)
  }

  async update(link: Link): Promise<void> {
    const supabase = await createServerClient()
    const data = link.toJSON()
    const { error } = await supabase
      .from('links')
      .update({
        title: data.title,
        description: data.description,
        url: data.url,
        slug: data.slug,
        category_id: data.categoryId,
        active: data.active,
        type: data.type,
        updated_at: data.updatedAt.toISOString(),
      })
      .eq('id', data.id)

    if (error) throw new Error(error.message)
  }

  async delete(id: string): Promise<void> {
    const supabase = await createServerClient()
    const { error } = await supabase.from('links').delete().eq('id', id)

    if (error) throw new Error(error.message)
  }

  private toDomain(raw: Record<string, unknown>): Link {
    return Link.restore({
      id: raw.id as string,
      title: raw.title as string,
      description: raw.description as string | null,
      url: raw.url as string,
      slug: raw.slug as string,
      categoryId: (raw.category_id as string) ?? null,
      active: (raw.active as boolean) ?? true,
      type: (raw.type as LinkType) ?? 'link',
      createdById: raw.created_by_id as string,
      createdAt: new Date(raw.created_at as string),
      updatedAt: new Date(raw.updated_at as string),
    })
  }
}
