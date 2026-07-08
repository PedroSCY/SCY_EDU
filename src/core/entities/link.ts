export interface LinkProps {
  id: string
  title: string
  description: string | null
  url: string
  slug: string
  categoryId: string | null
  createdById: string
  createdAt: Date
  updatedAt: Date
}

export class Link {
  private constructor(private readonly props: LinkProps) {}

  static create(props: Omit<LinkProps, 'id' | 'createdAt' | 'updatedAt'>): Link {
    return new Link({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static restore(props: LinkProps): Link {
    return new Link(props)
  }

  get id(): string {
    return this.props.id
  }

  get title(): string {
    return this.props.title
  }

  get description(): string | null {
    return this.props.description
  }

  get url(): string {
    return this.props.url
  }

  get slug(): string {
    return this.props.slug
  }

  get categoryId(): string | null {
    return this.props.categoryId
  }

  get createdById(): string {
    return this.props.createdById
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  toJSON(): LinkProps {
    return { ...this.props }
  }
}
