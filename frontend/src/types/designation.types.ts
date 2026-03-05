export interface Designation {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  documentId: string
  createdAt: string
}

export interface CreateDesignationDto {
  description: string
  quantity: number
  unitPrice: number
  total: number
}