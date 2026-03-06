import { TierRole } from './enums'
import { Document } from './document.types'

export interface Tier {
  id: string
  name: string
  mf?: string
  phone?: string
  address?: string
  role: TierRole
  createdAt: string
  updatedAt: string
  documents?: Document[]
}

export interface CreateTierDto {
  name: string
  mf?: string
  phone?: string
  address?: string
  role: TierRole
}
export interface PaginatedTiers {
  data:       Tier[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

export type UpdateTierDto = Partial<CreateTierDto>