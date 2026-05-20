import { Helmet } from 'react-helmet-async';

interface PageHeadProps {
  title: string;
  description?: string;
}

export function PageHead({ title, description }: PageHeadProps) {
  return (
    <Helmet>
      <title>{title} | MyPOS</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
