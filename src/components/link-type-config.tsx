import {
  Play,
  FileText,
  ClipboardCheck,
  Link,
  Image,
  Headphones,
  type LucideIcon,
} from 'lucide-react'

export type LinkType = 'video' | 'document' | 'quiz' | 'link' | 'image' | 'audio'

export interface LinkTypeConfig {
  icon: LucideIcon
  color: string
  bg: string
  label: string
}

export const LINK_TYPE_CONFIG: Record<LinkType, LinkTypeConfig> = {
  video: { icon: Play, color: '#DC2626', bg: '#FEF2F2', label: 'Vídeo' },
  document: { icon: FileText, color: '#2563EB', bg: '#EFF6FF', label: 'Documento' },
  quiz: { icon: ClipboardCheck, color: '#16A34A', bg: '#F0FDF4', label: 'Questionário' },
  link: { icon: Link, color: '#52525B', bg: '#FAFAFA', label: 'Link' },
  image: { icon: Image, color: '#9333EA', bg: '#FAF5FF', label: 'Imagem' },
  audio: { icon: Headphones, color: '#EA580C', bg: '#FFF7ED', label: 'Áudio' },
}

export const LINK_TYPES: LinkType[] = ['video', 'document', 'quiz', 'link', 'image', 'audio']
