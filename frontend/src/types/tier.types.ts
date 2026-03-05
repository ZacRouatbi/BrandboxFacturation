import { TierRole } from './enums'
import { Document } from './document.types'

export interface Tier {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  role: TierRole
  createdAt: string
  updatedAt: string
  documents?: Document[]
}

export interface CreateTierDto {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  role: TierRole
}

export type UpdateTierDto = Partial<CreateTierDto>