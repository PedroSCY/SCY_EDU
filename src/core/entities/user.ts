export type Role = 'ADMIN'

export interface UserProps {
  id: string
  name: string
  email: string
  password: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static restore(props: UserProps): User {
    return new User(props)
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get password(): string {
    return this.props.password
  }

  get role(): Role {
    return this.props.role
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  toJSON(): Omit<UserProps, 'password'> {
    const { password: _, ...rest } = this.props
    return rest
  }
}
