import type {
  DsPrincipalityCatalogSerializer,
  DsPrincipalityFeedSerializer,
  DsPrincipalitySerializer,
} from '../api/Api'

export interface Principality {
  principality_id: number
  principality_name: string
  principality_summary: string
  principality_status: string
  founding_date: string
  land_coefficient: number
  principality_image_url: string
  principality_video_url: string
  principality_like_count: number
  principality_liked: number
  created_by_current_archaeologist: number
}

type PrincipalitySerialized = DsPrincipalitySerializer &
  DsPrincipalityCatalogSerializer &
  DsPrincipalityFeedSerializer

export const mediaPath = (mediaUrl?: string): string =>
  mediaUrl ? mediaUrl.replace(/^https?:\/\/[^/]+/, '') : ''

export const toPrincipality = (serialized: PrincipalitySerialized): Principality => ({
  principality_id: serialized.principality_id ?? 0,
  principality_name: serialized.principality_name ?? '',
  principality_summary: serialized.principality_summary ?? '',
  principality_status: serialized.principality_status ?? '',
  founding_date: serialized.founding_date ?? '',
  land_coefficient: serialized.land_coefficient ?? 0,
  principality_image_url: mediaPath(serialized.principality_image_url),
  principality_video_url: mediaPath(serialized.principality_video_url),
  principality_like_count: serialized.principality_like_count ?? 0,
  principality_liked: serialized.principality_liked ?? 0,
  created_by_current_archaeologist: serialized.created_by_current_archaeologist ?? 0,
})
