import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const FAILED_ATTEMPTS = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const BLOCK_DURATION_MS = 60_000
const BASE_DELAY_MS = 1_500

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const password = credentials.password as string

        const record = FAILED_ATTEMPTS.get(email)
        if (record && record.count >= MAX_ATTEMPTS) {
          const elapsed = Date.now() - record.lastAttempt
          if (elapsed < BLOCK_DURATION_MS) {
            await new Promise((r) => setTimeout(r, BASE_DELAY_MS))
            return null
          }
          FAILED_ATTEMPTS.delete(email)
        }

        const bcrypt = await import('bcryptjs')
        const { UserRepositoryImpl } = await import('../database/user-repository-impl')
        const userRepository = new UserRepositoryImpl()

        const user = await userRepository.findByEmail(email)

        const isValid = user && (await bcrypt.compare(password, user.password))

        if (!isValid) {
          const current = FAILED_ATTEMPTS.get(email) ?? { count: 0, lastAttempt: 0 }
          FAILED_ATTEMPTS.set(email, {
            count: current.count + 1,
            lastAttempt: Date.now(),
          })
          await new Promise((r) => setTimeout(r, BASE_DELAY_MS + Math.random() * 1000))
          return null
        }

        FAILED_ATTEMPTS.delete(email)

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
})
