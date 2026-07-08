import { auth } from '@/infra/auth/auth'
import { LinkRepositoryImpl } from '@/infra/database/link-repository-impl'
import { deleteLink } from '@/core/use-cases/delete-link'
import { NextResponse } from 'next/server'

const linkRepository = new LinkRepositoryImpl()

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { id } = await params

  try {
    await deleteLink(linkRepository, id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao excluir' },
      { status: 400 }
    )
  }
}
