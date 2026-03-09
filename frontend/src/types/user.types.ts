export interface User {
  id:               string
  username:         string
  resetToken?:      string | null
  resetTokenExpiry?: string | null
  createdAt:        string
  updatedAt:        string
}