'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { maskedWorkstationValue } from '@/content/workstation-preview';
import styles from './WorkstationPrivacy.module.css';

export type WorkstationMaskVariant = 'initial-stars' | 'blur';

const WorkstationPrivacyContext = createContext<WorkstationMaskVariant>('initial-stars');

export const WorkstationPrivacyProvider = ({
  variant,
  children,
}: {
  variant: WorkstationMaskVariant;
  children: ReactNode;
}) => (
  <WorkstationPrivacyContext.Provider value={variant}>
    {children}
  </WorkstationPrivacyContext.Provider>
);

export const MaskedWorkstationValue = ({ value }: { value: string }) => {
  const variant = useContext(WorkstationPrivacyContext);

  return (
    <span
      className={`${styles.value} ${variant === 'blur' ? styles.blurredText : ''}`}
      data-workstation-mask={variant}
    >
      {variant === 'initial-stars'
        ? `${value.trim().slice(0, 1)}${maskedWorkstationValue}`
        : value}
    </span>
  );
};
