'use server'

import { createServerClient } from '@/infra/supabase/server'
import { LinkRepositoryImpl } from '@/infra/supabase/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/supabase/category-repository-impl'
import type { LinkType } from '@/components/link-type-config'
import { createLink } from '@/core/use-cases/create-link'
import { updateLink } from '@/core/use-cases/update-link'
import { createCategory } from '@/core/use-cases/create-category'
import { redirect } from 'next/navigation'

async function getUserId(): Promise<string> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')
  return user.id
}

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

interface ActionResult {
  error: string | null
}

export async function createLinkAction(
  formData: FormData
): Promise<ActionResult> {
  const userId = await getUserId()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const url = formData.get('url') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string
  const type = formData.get('type') as string

  if (!title || !slug || !url) {
    return { error: 'Título, slug e URL são obrigatórios' }
  }

  try {
    await createLink(linkRepository, {
      title,
      slug,
      url,
      description: description || undefined,
      categoryId: categoryId || undefined,
      type: (type || 'link') as LinkType,
      createdById: userId,
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Erro ao criar link',
    }
  }

  redirect('/admin')
}

export async function updateLinkAction(
  linkId: string,
  formData: FormData
): Promise<ActionResult> {
  await getUserId()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const url = formData.get('url') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string
  const type = formData.get('type') as string

  try {
    await updateLink(linkRepository, linkId, {
      title: title || undefined,
      slug: slug || undefined,
      url: url || undefined,
      description: description || null,
      categoryId: categoryId || null,
      type: (type || undefined) as LinkType | undefined,
    })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Erro ao atualizar link',
    }
  }

  redirect('/admin')
}

export async function toggleLinkAction(linkId: string): Promise<ActionResult> {
  await getUserId()

  try {
    const link = await linkRepository.findById(linkId)
    if (!link) return { error: 'Link não encontrado' }
    await updateLink(linkRepository, linkId, { active: !link.active })
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Erro ao alternar link' }
  }

  return { error: null }
}

export async function createCategoryAction(
  formData: FormData
): Promise<ActionResult> {
  await getUserId()

  const name = formData.get('name') as string
  const color = formData.get('color') as string

  if (!name) return { error: 'Nome é obrigatório' }

  await createCategory(categoryRepository, { name, color: color || undefined })
  return { error: null }
}

export async function deleteCategoryAction(
  categoryId: string
): Promise<ActionResult> {
  await getUserId()
  await categoryRepository.delete(categoryId)
  return { error: null }
}
