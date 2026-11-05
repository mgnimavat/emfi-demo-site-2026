import type { Metadata } from 'next';
import { researchSignup } from '@/content/research-signup';
import { ResearchSignupSection } from '@/containers/Sections/ResearchSignupSection';

export const metadata: Metadata = {
  title: 'Research Sign Up',
  description: researchSignup.description,
};

const ResearchSignupPage = () => <ResearchSignupSection />;

export default ResearchSignupPage;
