import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// CRITICAL: This CSS file is required to render the LaTeX equations properly
import 'katex/dist/katex.min.css'; 

function getPaperContent(slug: string) {
    const papersDirectory = path.join(process.cwd(), 'content/papers');
    const fullPath = path.join(papersDirectory, `${slug}.md`);
    
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      return fileContents;
    } catch (error) {
      // THIS LINE WILL REVEAL THE ISSUE:
      console.log("❌ FAILED TO FIND FILE AT: ", fullPath);
      console.error(error); 
      return null; 
    }
  }

// 1. Make the component async and type params as a Promise
export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  // 2. Await the params before accessing the slug
  const resolvedParams = await params;
  const content = getPaperContent(resolvedParams.slug);

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center font-mono">
        <h1>404 - Paper Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 font-sans selection:bg-indigo-500 selection:text-white p-8 md:p-24">
      <div className="max-w-3xl w-full mx-auto">
        
        {/* BACK NAVIGATION */}
        <nav className="mb-16 border-b border-zinc-800 pb-4">
          <Link href="/" className="font-mono text-[10px] tracking-widest text-zinc-500 hover:text-indigo-400 uppercase transition-colors">
            &#8592; Return to Index
          </Link>
        </nav>

        {/* MARKDOWN RENDERER */}
        <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-light prose-headings:tracking-wide prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-pre:bg-[#121214] prose-pre:border prose-pre:border-zinc-800">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* HUMAN-IN-THE-LOOP DISCLAIMER */}
        <div className="mt-24 pt-8 border-t border-zinc-800 text-xs text-zinc-500 font-mono leading-relaxed">
          <strong className="text-zinc-400 uppercase tracking-widest">Architect's Note:</strong> This manuscript was synthesized by an AI agent (Antigravity) and architected by a human curator. The mathematical models and isomorphisms presented herein are intended to spark empirical cross-disciplinary research and should not be treated as peer-reviewed scientific fact without further independent verification.
        </div>

      </div>
    </div>
  );
}