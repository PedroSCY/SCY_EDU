export interface CategoryProps {
  id: string
  name: string
  color: string
  createdAt: Date
  updatedAt: Date
}

export class Category {
  private constructor(private readonly props: CategoryProps) {}

  static create(props: Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt'>): Category {
    return new Category({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static restore(props: CategoryProps): Category {
    return new Category(props)
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get color(): string {
    return this.props.color
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  toJSON(): CategoryProps {
    return { ...this.props }
  }
}
