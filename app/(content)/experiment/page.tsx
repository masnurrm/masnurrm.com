// app/(content)/experiment/page.tsx
import type { Metadata } from 'next';
import ExperimentClient from './ExperimentClient';

export const metadata: Metadata = {
  title: 'Experiment',
  description: 'Embedded Power BI report demo.',
};

export default function ExperimentPage() {
  return <ExperimentClient />;
}
