export const PERSON_TYPES = ['customer', 'staff', 'supplier'] as const;
export type PersonType = (typeof PERSON_TYPES)[number];

export interface PersonRow {
  id: string;
  company_id: string;
  person_type: PersonType;
  name: string;
  details: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  companyId: string;
  personType: PersonType;
  name: string;
  details: string;
  email: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonInput {
  companyId: string;
  personType: PersonType;
  name: string;
  details: string;
  email: string | null;
  phone: string | null;
}

export type UpdatePersonInput = Partial<Omit<CreatePersonInput, 'companyId'>>;
