import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getMethodologie } from "@/lib/data";

export const metadata = { title: "Méthodologie — Africa Dev Data Mart" };

export default function MethodologiePage() {
  return (
    <article className="prose prose-gray max-w-none prose-code:before:content-none prose-code:after:content-none bg-white rounded-lg border p-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{getMethodologie()}</ReactMarkdown>
    </article>
  );
}
