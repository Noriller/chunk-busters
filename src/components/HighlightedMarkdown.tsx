import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import Markdown from 'markdown-to-jsx';
import { useEffect, useRef } from 'react';
hljs.registerLanguage('typescript', typescript);

export function HighlightedMarkdown({ children }: { children: string }) {
  const rootRef = useRef<HTMLDivElement>();

  useEffect(() => {
    rootRef.current?.querySelectorAll('pre code').forEach((block) => {
      block.classList.add('not-prose', 'text-xl');
      // @ts-ignore
      hljs.highlightBlock(block);
    });
  }, [children]);

  return (
    // @ts-ignore
    <div ref={rootRef}>
      <Markdown key={children}>{children}</Markdown>
    </div>
  );
}
