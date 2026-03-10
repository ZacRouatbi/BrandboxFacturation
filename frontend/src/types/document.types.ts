import { DocumentType, DevisStatus, FactureStatus, Currency } from './enums'
import { Designation, CreateDesignationDto } from './designation.types'

export interface Document {
  id: string
  type: DocumentType
  devisStatus?: DevisStatus
  factureStatus?: FactureStatus
  date: string
  dueDate?: string
  totalHT: number
  totalTTC: number
  currency: Currency
  tva: number
  tierId: string
  designations?: Designation[]
  createdAt: string
  updatedAt: string
}

export interface CreateDocumentDto {
  type: DocumentType
  devisStatus?: DevisStatus
  factureStatus?: FactureStatus
  dueDate?: string
  hasTva: boolean
  totalHT: number
  totalTTC: number
  currency: Currency
  tva: number
  tierId: string
  designations: CreateDesignationDto[]
}

export type UpdateDocumentDto = Partial<CreateDocumentDto>