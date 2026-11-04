import type { ResearchSignupPayload } from '@/types/research-signup';

export const buildResearchSignupPayload = (data: FormData): ResearchSignupPayload | null => {
  const text = (key: string) => {
    const value = data.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };
  const type = text('type');
  const firstName = text('first_name');
  const lastName = text('last_name');
  const email = text('email');
  const jurisdiction = text('jurisdiction');

  if ((type !== 'individual' && type !== 'entity') || !firstName || !lastName || !email || !jurisdiction) {
    return null;
  }

  const distributionList = text('distribution_list').split(',').map((address) => address.trim()).filter(Boolean);
  if (type === 'entity' && distributionList.length === 0) return null;

  return {
    type,
    first_name: firstName,
    last_name: lastName,
    email,
    jurisdiction,
    ...(type === 'entity' ? { distribution_list: distributionList } : {}),
  };
};
