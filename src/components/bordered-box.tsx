'use client';

interface BorderedBoxProps {
  name: string;
  description?: string;
  children: React.ReactNode;
}

export function BorderedBox({ name, description, children }: BorderedBoxProps) {
  return (
    <fieldset className="my-4 flex flex-col justify-around gap-2 rounded-md border border-gray-300 p-4">
      <legend className="-mb-2 px-2 text-base font-medium text-primary-foreground">
        {name}
      </legend>
      {Boolean(description) && (
        <span className="text-sm text-primary-foreground">{description}</span>
      )}
      <div className="flex gap-2">{children}</div>
    </fieldset>
  );
}
