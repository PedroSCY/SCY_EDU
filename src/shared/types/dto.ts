export interface LinkDTO {
  id: string
  title: string
  description: string | null
  url: string
  slug: string
  categoryId: string | null
  categoryName: string | null
  categoryColor: string | null
  createdAt: Date
}

export interface CategoryDTO {
  id: string
  name: string
  color: string
}
