import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

function readSchema(): string {
  return readFileSync(
    resolve(process.cwd(), 'supabase-schema.sql'),
    'utf-8'
  )
}

function extractTableNames(sql: string): string[] {
  const regex = /create\s+table\s+if\s+not\s+exists\s+public\.(\w+)/gi
  const tables: string[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(sql)) !== null) {
    tables.push(match[1])
  }
  return tables
}

function extractColumns(sql: string, tableName: string): string[] {
  const tableRegex = new RegExp(
    `create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${tableName}\\s*\\(([\\s\\S]*?)\\);`,
    'i'
  )
  const match = sql.match(tableRegex)
  if (!match) return []

  const body = match[1]
  const colRegex = /^\s+(\w+)\s+/gm
  const columns: string[] = []
  let m: RegExpExecArray | null
  while ((m = colRegex.exec(body)) !== null) {
    if (
      !m[1].startsWith('--') &&
      !['primary', 'foreign', 'constraint', 'unique'].includes(m[1])
    ) {
      columns.push(m[1])
    }
  }
  return columns
}

function extractPolicies(sql: string): { table: string; name: string }[] {
  const policyRegex =
    /create\s+policy\s+"([^"]+)"\s+on\s+public\.(\w+)\s+for\s+(\w+)/gi
  const policies: { table: string; name: string }[] = []
  let match: RegExpExecArray | null
  while ((match = policyRegex.exec(sql)) !== null) {
    policies.push({ name: match[1], table: match[2] })
  }
  return policies
}

describe('Schema Supabase', () => {
  const sql = readSchema()

  describe('Tabelas', () => {
    it('deve ter tabela categories', () => {
      const tables = extractTableNames(sql)
      expect(tables).toContain('categories')
    })

    it('deve ter tabela links', () => {
      const tables = extractTableNames(sql)
      expect(tables).toContain('links')
    })

    it('deve ter exatamente 2 tabelas', () => {
      const tables = extractTableNames(sql)
      expect(tables).toHaveLength(2)
    })
  })

  describe('Tabela categories', () => {
    const cols = extractColumns(sql, 'categories')

    it('deve ter coluna id (uuid, chave primária)', () => {
      expect(cols).toContain('id')
    })

    it('deve ter coluna name (not null)', () => {
      expect(sql).toMatch(/name\s+text\s+not\s+null/i)
    })

    it('deve ter coluna color (not null, default)', () => {
      expect(sql).toMatch(/color\s+text\s+not\s+null/i)
    })

    it('deve ter created_at e updated_at', () => {
      expect(cols).toContain('created_at')
      expect(cols).toContain('updated_at')
    })
  })

  describe('Tabela links', () => {
    const cols = extractColumns(sql, 'links')

    it('deve ter coluna id (uuid, chave primária)', () => {
      expect(cols).toContain('id')
    })

    it('deve ter coluna title (not null)', () => {
      expect(sql).toMatch(/title\s+text\s+not\s+null/i)
    })

    it('deve ter coluna description (nullable)', () => {
      expect(sql).toMatch(/description\s+text/i)
    })

    it('deve ter coluna url (not null)', () => {
      expect(sql).toMatch(/url\s+text\s+not\s+null/i)
    })

    it('deve ter coluna slug (unique, not null)', () => {
      expect(sql).toMatch(/slug\s+text\s+not\s+null/i)
      expect(sql).toMatch(/unique/i)
    })

    it('deve ter chave estrangeira category_id para categories', () => {
      expect(sql).toMatch(/category_id\s+uuid/i)
      expect(sql).toMatch(/references\s+public\.categories\(id\)/i)
      expect(sql).toMatch(/on\s+delete\s+set\s+null/i)
    })

    it('deve ter created_by_id referenciando auth.users', () => {
      expect(sql).toMatch(/created_by_id\s+uuid\s+not\s+null/i)
      expect(sql).toMatch(/references\s+auth\.users\(id\)/i)
    })

    it('deve ter created_at e updated_at', () => {
      expect(cols).toContain('created_at')
      expect(cols).toContain('updated_at')
    })

    it('deve ter coluna active (boolean, not null, default true)', () => {
      expect(sql).toMatch(/active\s+boolean\s+not\s+null\s+default\s+true/i)
    })

    it('deve ter coluna type (text, not null, default link)', () => {
      expect(sql).toMatch(/type\s+text\s+not\s+null\s+default\s+'link'/i)
    })
  })

  describe('Row Level Security', () => {
    it('deve habilitar RLS em categories', () => {
      expect(sql).toMatch(/alter\s+table\s+public\.categories\s+enable\s+row\s+level\s+security/i)
    })

    it('deve habilitar RLS em links', () => {
      expect(sql).toMatch(/alter\s+table\s+public\.links\s+enable\s+row\s+level\s+security/i)
    })
  })

  describe('Policies', () => {
    const policies = extractPolicies(sql)

    it('deve ter 4 policies no total', () => {
      expect(policies).toHaveLength(4)
    })

    it('deve ter policy SELECT para categories para todos os usuários', () => {
      expect(sql).toMatch(
        /create\s+policy\s+"Categorias visiveis para todos"\s+on\s+public\.categories\s+for\s+select/i
      )
      expect(sql).toMatch(/using\s*\(\s*true\s*\)/)
    })

    it('deve ter policy ALL para categories para usuários autenticados', () => {
      expect(sql).toMatch(
        /create\s+policy\s+"Categorias editaveis por admins"\s+on\s+public\.categories\s+for\s+all/i
      )
      expect(sql).toMatch(/auth\.role\(\)\s*=\s*'authenticated'/i)
    })

    it('deve ter policy SELECT para links para todos os usuários', () => {
      expect(sql).toMatch(
        /create\s+policy\s+"Links visiveis para todos"\s+on\s+public\.links\s+for\s+select/i
      )
      expect(sql).toMatch(/using\s*\(\s*true\s*\)/)
    })

    it('deve ter policy ALL para links para usuários autenticados', () => {
      expect(sql).toMatch(
        /create\s+policy\s+"Links editaveis por admins"\s+on\s+public\.links\s+for\s+all/i
      )
      expect(sql).toMatch(/auth\.role\(\)\s*=\s*'authenticated'/i)
    })
  })
})
