export type ResearchSignupType = 'individual' | 'entity';

export type ResearchSignupPayload = {
  type: ResearchSignupType;
  first_name: string;
  last_name: string;
  email: string;
  jurisdiction: string;
  distribution_list?: string[];
};
