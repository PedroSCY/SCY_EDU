import { describe, it, expect } from 'vitest'
import { isValidUrl, assertValidUrl, sanitizeSlug } from '@/shared/utils/validation'

describe('isValidUrl', () => {
  it('aceita URLs http válidas', () => {
    expect(isValidUrl('http://example.com')).toBe(true)
    expect(isValidUrl('http://example.com/path')).toBe(true)
    expect(isValidUrl('http://example.com?q=1')).toBe(true)
    expect(isValidUrl('http://localhost:3000')).toBe(true)
  })

  it('aceita URLs https válidas', () => {
    expect(isValidUrl('https://google.com')).toBe(true)
    expect(isValidUrl('https://www.google.com/search?q=test')).toBe(true)
    expect(isValidUrl('https://meusite.com.br')).toBe(true)
  })

  it('rejeita URLs sem protocolo', () => {
    expect(isValidUrl('example.com')).toBe(false)
    expect(isValidUrl('www.example.com')).toBe(false)
  })

  it('rejeita strings vazias', () => {
    expect(isValidUrl('')).toBe(false)
  })

  it('rejeita protocolos inválidos', () => {
    expect(isValidUrl('ftp://example.com')).toBe(false)
    expect(isValidUrl('file:///etc/passwd')).toBe(false)
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejeita URLs mal formatadas', () => {
    expect(isValidUrl('not a url')).toBe(false)
    expect(isValidUrl('http://')).toBe(false)
  })
})

describe('assertValidUrl', () => {
  it('não lança erro para URLs válidas', () => {
    expect(() => assertValidUrl('https://example.com')).not.toThrow()
    expect(() => assertValidUrl('http://localhost:3000/api')).not.toThrow()
  })

  it('lança erro para URLs inválidas', () => {
    expect(() => assertValidUrl('not-a-url')).toThrow('URL')
  })

  it('usa nome personalizado no campo da mensagem de erro', () => {
    expect(() => assertValidUrl('bad', 'Link')).toThrow('Link inválida')
  })
})

describe('sanitizeSlug', () => {
  it('remove espaços e converte para minúsculas', () => {
    expect(sanitizeSlug('Meu Link')).toBe('meu-link')
  })

  it('remove caracteres especiais', () => {
    expect(sanitizeSlug('google@forms?2024#')).toBe('googleforms2024')
  })

  it('remove acentos', () => {
    expect(sanitizeSlug('ação')).toBe('ao')
  })

  it('remove hífens duplicados', () => {
    expect(sanitizeSlug('meu   link')).toBe('meu-link')
  })

  it('remove hífens no início e fim', () => {
    expect(sanitizeSlug('-meu-link-')).toBe('meu-link')
  })

  it('aceita slug já limpo', () => {
    expect(sanitizeSlug('google-forms')).toBe('google-forms')
  })

  it('retorna string vazia se só caracteres especiais', () => {
    expect(sanitizeSlug('@#$%')).toBe('')
  })
})
