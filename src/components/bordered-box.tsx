'use client';

import { cn } from '@/lib/utils';

interface BorderedBoxProps {
  name: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function BorderedBox({
  name,
  description,
  children,
  className,
}: BorderedBoxProps) {
  return (
    <fieldset className="my-4 flex flex-col justify-around gap-2 rounded-md border border-gray-300 p-4">
      <legend className="-mb-2 px-2 text-base font-medium text-primary-foreground">
        {name}
      </legend>
      {Boolean(description) && (
        <span className="text-sm text-primary-foreground">{description}</span>
      )}
      <div className={cn('flex gap-2', className)}>{children}</div>
    </fieldset>
  );
}
