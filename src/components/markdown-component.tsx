import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

import { cn } from "@/lib/utils";

type MarkdownComponentProps = {
  code: string | null;
};

const MarkdownComponent = ({ code }: MarkdownComponentProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkParse, remarkRehype, rehypeStringify]}
      components={{
        pre: ({ node, ...props }) => (
          <div className="relative my-2 w-full overflow-auto rounded-sm border bg-black px-6 py-4">
            <pre className="prose text-sm text-white/80 dark:text-primary" {...props} />
          </div>
        ),
        h1: ({ node, ...props }) => (
          <h1 className={cn("mt-2 scroll-m-20 text-sm font-bold tracking-tight")} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className={cn(
              "mt-10 scroll-m-20 border-b pb-1 text-xs font-semibold tracking-tight first:mt-0"
            )}
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3 className={cn("mt-8 scroll-m-20 text-xs font-semibold tracking-tight")} {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className={cn("mt-8 scroll-m-20 text-xs font-semibold tracking-tight")} {...props} />
        ),
        h5: ({ node, ...props }) => (
          <h5 className={cn("mt-8 scroll-m-20 text-xs font-semibold tracking-tight")} {...props} />
        ),
        h6: ({ node, ...props }) => (
          <h6 className={cn("mt-8 scroll-m-20 text-xs font-semibold tracking-tight")} {...props} />
        ),
        a: ({ node, ...props }) => (
          <a className={cn("font-medium underline underline-offset-4")} {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className={cn("leading-7 [&:not(:first-child)]:mt-6")} {...props} />
        ),
        ul: ({ node, ...props }) => <ul className={cn("my-6 ml-6 list-disc")} {...props} />,
        ol: ({ node, ...props }) => <ol className={cn("my-6 ml-6 list-decimal")} {...props} />,
        li: ({ node, ...props }) => <li className={cn("mt-2")} {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className={cn("mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground")}
            {...props}
          />
        ),
        img: ({ node, alt, ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={cn("rounded-md border")} alt={alt} {...props} />
        ),
        hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
        table: ({ node, ...props }) => (
          <div className="my-6 w-full overflow-y-auto">
            <table className={cn("w-full")} {...props} />
          </div>
        ),
        tr: ({ node, ...props }) => (
          <tr className={cn("m-0 border-t p-0 even:bg-muted")} {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className={cn(
              "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
            )}
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td
            className={cn(
              "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
            )}
            {...props}
          />
        ),
        code: ({ node, ...props }) => (
          <code
            className={cn("relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm")}
            {...props}
          />
        ),
      }}
    >
      {code}
    </ReactMarkdown>
  );
};
export default MarkdownComponent;
