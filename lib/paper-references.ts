import fs from 'fs';
import path from 'path';

export type StructuredReference = {
  id: string;
  text: string;
  verification: 'verified' | 'sourced' | 'foundational' | 'unclassified';
  identifier?: string;
};

export function getPaperReferences(slug: string): StructuredReference[] {
  const sourcePath = path.join(process.cwd(), 'content', 'papers', `${slug}.mdx`);
  if (!fs.existsSync(sourcePath)) return [];
  const source = fs.readFileSync(sourcePath, 'utf8');
  const section = source.match(/^#{1,3}\s+(?:\d+\.\s+)?(?:References(?:\s*&\s*Verification Sources)?|Sources consulted in this pass|Verification Ledger)\s*$/im);
  if (!section?.index) return [];
  const tail = source.slice(section.index + section[0].length);
  const nextHeading = tail.search(/^#{1,2}\s+/m);
  const referenceText = nextHeading === -1 ? tail : tail.slice(0, nextHeading);
  return referenceText.split('\n').map((line) => line.trim()).filter((line) => /^(?:[-*]|\d+\.)\s+/.test(line)).map((line, index) => {
    const text = line.replace(/^(?:[-*]|\d+\.)\s+/, '');
    const identifier = text.match(/(?:arXiv:)?\b\d{4}\.\d{4,5}\b|\b(?:hep-th|astro-ph|hep-ph)\/\d{7}\b|\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0];
    const verification = /\[VERIFIED\]/i.test(text) ? 'verified' : /\[SOURCED\]/i.test(text) ? 'sourced' : /\[FOUNDATIONAL\]/i.test(text) ? 'foundational' : 'unclassified';
    return { id: `${slug}-ref-${index + 1}`, text, verification, ...(identifier ? { identifier } : {}) };
  });
}
