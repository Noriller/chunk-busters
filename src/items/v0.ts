import { type NavItem } from '.';

const boardHook: NavItem['boardHook'] = () => {
  const base = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
  };

  return Object.fromEntries(
    Object.entries(base)
      .map(([k]) => [Number(k), base])
  ) as ReturnType<NavItem['boardHook']>;
};

export const v0 = {
  id: 'v0',
  title: 'v0',
  content: /*md*/`
## The Naive V0

You have the API's, you \`fetch\` each of them, you wait and you have the data.

\`\`\`typescript
await fetch1();
await fetch2();
await fetch3();
\`\`\`

Only then you start rendering.
`,
  boardHook,
} satisfies NavItem;
