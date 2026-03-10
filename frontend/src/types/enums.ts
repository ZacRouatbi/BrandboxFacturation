export const TierRole = { CLIENT: 'CLIENT', FOURNISSEUR: 'FOURNISSEUR', BOTH: 'BOTH' } as const;
export type TierRole = typeof TierRole[keyof typeof TierRole];

export const DocumentType = { DEVIS: 'DEVIS', FACTURE: 'FACTURE' } as const;
export type DocumentType = typeof DocumentType[keyof typeof DocumentType];

export const DevisStatus = { ON_HOLD: 'ON_HOLD', ACCEPTED: 'ACCEPTED', CANCELLED: 'CANCELLED' } as const;
export type DevisStatus = typeof DevisStatus[keyof typeof DevisStatus];

export const FactureStatus = { NOT_PAID: 'NOT_PAID', PAID: 'PAID' } as const;
export type FactureStatus = typeof FactureStatus[keyof typeof FactureStatus];

export const Currency = { EUR: 'EUR', TND: 'TND', USD: 'USD' } as const;
export type Currency = typeof Currency[keyof typeof Currency];