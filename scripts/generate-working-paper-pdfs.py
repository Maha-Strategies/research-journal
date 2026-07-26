#!/usr/bin/env python3
"""Generate stable, text-first PDF editions from the canonical MDX manuscripts.

This intentionally does not convert interactive charts into static evidence. PDFs identify
the web manuscript as canonical where an interactive component or live code is involved.
"""

from pathlib import Path
from html import escape
import re
import unicodedata

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content' / 'papers'
OUTPUT = ROOT / 'public' / 'papers'
SITE_URL = 'https://research.mahastrategies.com'

VERSIONS = {
    'the-volcanic-engine-thesis': ('1.0.0', '2026-07-26', 'Working thesis'),
    'the-maha-framework': ('1.3.0', '2026-06-18', 'Working paper'),
    'planet-nine-forecast': ('3.0.0', '2026-06-05', 'Working paper'),
    'the_perturber_question': ('1.0.0', '2026-06-08', 'Working paper'),
    'readout_plasticity_paper': ('1.0.0', '2026-06-07', 'Working paper'),
    'machine_learning_g2_betti': ('2.0.0', '2026-06-10', 'Working paper'),
    'de_sitter_swampland_map': ('1.0.0', '2026-06-10', 'Working paper'),
    'retrograde_p9': ('3.0.0', '2026-06-09', 'Working paper'),
    'thermodynamic-isomorphism': ('1.0.0', '2026-06-03', 'Working paper'),
    'dissolving-self-ocean-planet': ('1.0.0', '2026-06-04', 'Working paper'),
    'chronobiological-entrainment': ('1.0.0', '2026-02-15', 'Working paper'),
    'commercial-fusion-viability': ('1.0.0', '2026-06-02', 'Technical synthesis'),
}


def clean(text: str) -> str:
    text = re.sub(r'<[^>]+>', '', text)
    text = text.replace('**', '').replace('*', '').replace('__', '').replace('`', '')
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', '[figure available in web edition]', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'\1 (\2)', text)
    text = re.sub(r'\$\$([\s\S]*?)\$\$', r'\1', text)
    text = text.replace('$', '')
    text = re.sub(r'\s+', ' ', text).strip()
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    return escape(text)


def page_number(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(HexColor('#5f6470'))
    canvas.setFont('Helvetica', 8)
    canvas.drawString(0.72 * inch, 0.45 * inch, 'Maha Strategies Research · Working-paper edition')
    canvas.drawRightString(7.78 * inch, 0.45 * inch, f'Page {doc.page}')
    canvas.restoreState()


def story_for(slug: str, source: str):
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('paper-title', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=22, leading=27, textColor=HexColor('#171923'), spaceAfter=12)
    subtitle_style = ParagraphStyle('paper-subtitle', parent=styles['BodyText'], fontSize=10, leading=14, textColor=HexColor('#4c5566'), spaceAfter=16)
    heading_style = ParagraphStyle('paper-heading', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=HexColor('#20293a'), spaceBefore=16, spaceAfter=8)
    body_style = ParagraphStyle('paper-body', parent=styles['BodyText'], fontSize=9.3, leading=14, alignment=TA_LEFT, spaceAfter=8, textColor=HexColor('#252a35'))
    note_style = ParagraphStyle('paper-note', parent=styles['BodyText'], fontSize=8.3, leading=12, leftIndent=10, borderColor=HexColor('#b98a2d'), borderWidth=1, borderPadding=8, spaceAfter=14, textColor=HexColor('#3d3524'))
    story = []
    title_match = re.search(r'^#\s+(.+)$', source, re.M)
    title = clean(title_match.group(1) if title_match else slug.replace('-', ' ').title())
    version, date, status = VERSIONS[slug]
    story += [Paragraph(title, title_style), Paragraph(f'{status} · Version {version} · {date} · Not peer reviewed', subtitle_style)]
    story.append(Paragraph('Citation and status boundary: this PDF is a stable public working-paper edition. It is not a peer-reviewed journal article. Consult the canonical web edition for interactive material, linked resources, corrections, and the current machine-readable citation record.', note_style))
    body_lines = source.splitlines()
    paragraph = []

    def flush():
        nonlocal paragraph
        if paragraph:
            text = clean(' '.join(paragraph))
            if text:
                story.append(Paragraph(text, body_style))
            paragraph = []

    for raw in body_lines:
        line = raw.strip()
        if not line or line in ('---', '* * *'):
            flush()
            continue
        if re.match(r'^#\s+', line):
            continue
        heading = re.match(r'^#{2,4}\s+(.+)$', line)
        if heading:
            flush()
            story.append(Paragraph(clean(heading.group(1)), heading_style))
            continue
        if re.match(r'^(?:[-*]|\d+\.)\s+', line):
            flush()
            story.append(Paragraph('&ndash; ' + clean(re.sub(r'^(?:[-*]|\d+\.)\s+', '', line)), body_style))
            continue
        if line.startswith('```'):
            flush()
            story.append(Paragraph('[Code block available in canonical web edition.]', note_style))
            continue
        paragraph.append(line)
    flush()
    story.append(Spacer(1, 14))
    story.append(Paragraph(f'Canonical web edition and structured metadata: {SITE_URL}/papers/{slug}', note_style))
    return story


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source_path in sorted(SOURCE.glob('*.mdx')):
        slug = source_path.stem
        if slug not in VERSIONS:
            raise ValueError(f'Missing version metadata for {slug}')
        destination = OUTPUT / f'{slug}.pdf'
        doc = SimpleDocTemplate(str(destination), pagesize=letter, leftMargin=0.72 * inch, rightMargin=0.72 * inch, topMargin=0.7 * inch, bottomMargin=0.7 * inch, title=slug)
        doc.build(story_for(slug, source_path.read_text()), onFirstPage=page_number, onLaterPages=page_number)
        print(destination.relative_to(ROOT))


if __name__ == '__main__':
    main()
