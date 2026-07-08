export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function assertValidUrl(url: string, field = 'URL'): void {
  if (!isValidUrl(url)) {
    throw new Error(`${field} inválida. Use uma URL que comece com http:// ou https://`)
  }
}
