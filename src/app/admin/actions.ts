'use server'

import { auth } from '@/infra/auth/auth'
import { LinkRepositoryImpl } from '@/infra/database/link-repository-impl'
import { CategoryRepositoryImpl } from '@/infra/database/category-repository-impl'
import { createLink } from '@/core/use-cases/create-link'
import { updateLink } from '@/core/use-cases/update-link'
import { createCategory } from '@/core/use-cases/create-category'
import { redirect } from 'next/navigation'

const linkRepository = new LinkRepositoryImpl()
const categoryRepository = new CategoryRepositoryImpl()

export async function createLinkAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Não autenticado')
  }

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const url = formData.get('url') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string

  if (!title || !slug || !url) {
    throw new Error('Título, slug e URL são obrigatórios')
  }

  try {
    await createLink(linkRepository, {
      title,
      slug,
      url,
      description: description || undefined,
      categoryId: categoryId || undefined,
      createdById: session.user.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao criar link')
  }

  redirect('/admin')
}

export async function createCategoryAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Não autenticado')
  }

  const name = formData.get('name') as string
  const color = formData.get('color') as string

  if (!name) {
    throw new Error('Nome é obrigatório')
  }

  await createCategory(categoryRepository, { name, color: color || undefined })
  redirect('/admin/categories')
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Não autenticado')
  }

  const { CategoryRepositoryImpl } = await import('@/infra/database/category-repository-impl')
  const repo = new CategoryRepositoryImpl()
  await repo.delete(categoryId)
  redirect('/admin/categories')
}

export async function updateLinkAction(linkId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Não autenticado')
  }

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const url = formData.get('url') as string
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') as string

  try {
    await updateLink(linkRepository, linkId, {
      title: title || undefined,
      slug: slug || undefined,
      url: url || undefined,
      description: description || null,
      categoryId: categoryId || null,
    })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erro ao atualizar link')
  }

  redirect('/admin')
}
