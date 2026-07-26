export type WorkingPaper = {
  slug: string;
  title: string;
  version: string;
  versionDate: string;
  status: string;
  statusDetail: string;
  reviewStatus: string;
  versionHistory: { version: string; date: string; note: string }[];
};

const nonPeerReviewed = 'Not peer reviewed';

export const WORKING_PAPERS: Record<string, WorkingPaper> = {
  'the-volcanic-engine-thesis': { slug: 'the-volcanic-engine-thesis', title: 'The Volcanic Engine: Eruption as a Precondition for Sustained Planetary Habitability', version: '1.0.0', versionDate: '2026-07-26', status: 'Working thesis', statusDetail: 'Structural synthesis and organizing hypothesis', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-07-26', note: 'First public research-site edition under the citable working-paper standard.' }] },
  'the-maha-framework': { slug: 'the-maha-framework', title: 'The M·A·H·A Framework: An Integrative Architecture for Resisting Systemic Metabolic, Attentional, and Relational Extraction', version: '1.3.0', versionDate: '2026-06-18', status: 'Working paper', statusDetail: 'Conceptual framework with testable propositions', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.3.0', date: '2026-06-18', note: 'Current public working-paper edition; reference corrections are documented in the manuscript.' }] },
  'planet-nine-forecast': { slug: 'planet-nine-forecast', title: 'A Monte Carlo Forecast for the Detection of Planet Nine', version: '3.0.0', versionDate: '2026-06-05', status: 'Working paper', statusDetail: 'Computational forecast contingent on stated model assumptions', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '3.0.0', date: '2026-06-05', note: 'Current public edition; the manuscript documents its northern-footprint correction.' }] },
  'the_perturber_question': { slug: 'the_perturber_question', title: 'The Perturber Question Under Audit: An Agentic-AI Replication of the eTNO Clustering Test and a Composition-Agnostic Hypothesis Synthesis', version: '1.0.0', versionDate: '2026-06-08', status: 'Working paper', statusDetail: 'Replication and methods audit', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-08', note: 'First public edition; corrections and withdrawn results are recorded in the manuscript.' }] },
  'readout_plasticity_paper': { slug: 'readout_plasticity_paper', title: 'Evolving Local Synaptic Plasticity Rules to Track Representational Drift', version: '1.0.0', versionDate: '2026-06-07', status: 'Working paper', statusDetail: 'Simulation study; not an empirical-recording result', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-07', note: 'First public edition with simulation-only boundary stated in the manuscript.' }] },
  'machine_learning_g2_betti': { slug: 'machine_learning_g2_betti', title: 'Machine Learning G2 Betti Numbers from Orientifold Calabi-Yau Data: A Leakage-Audited Predictive Test', version: '2.0.0', versionDate: '2026-06-10', status: 'Working paper', statusDetail: 'Leakage-audited methods study', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-10', note: 'Withdrawn circular-result edition; described, not silently replaced, in the manuscript.' }, { version: '2.0.0', date: '2026-06-10', note: 'Current public edition using real records, removed leakage, and a baseline comparison.' }] },
  'de_sitter_swampland_map': { slug: 'de_sitter_swampland_map', title: 'The de Sitter Problem in the String Swampland: A Verified Literature Map', version: '1.0.0', versionDate: '2026-06-10', status: 'Working paper', statusDetail: 'Literature map and orientation tool', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-10', note: 'Current public literature-map edition; provenance tags and open verification items appear in the manuscript.' }] },
  'retrograde_p9': { slug: 'retrograde_p9', title: 'A Reproducible N-Body Pipeline and Numerical Convergence Framework for Retrograde Planet Nine Configurations', version: '3.0.0', versionDate: '2026-06-09', status: 'Working paper', statusDetail: 'Methods and infrastructure specification', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '3.0.0', date: '2026-06-09', note: 'Current public edition; hard simulation boundaries are recorded in the manuscript.' }] },
  'thermodynamic-isomorphism': { slug: 'thermodynamic-isomorphism', title: 'A Unified Nonlinear Dynamical Model of Thermodynamic Runaway: Structural Analogy Between Planetary Greenhouse Effects and Mesolimbic Dopaminergic Addiction', version: '1.0.0', versionDate: '2026-06-03', status: 'Working paper', statusDetail: 'Theoretical model with a falsifiable cross-domain hypothesis', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-03', note: 'Current public edition; model corrections and confidence tiers are documented in the manuscript.' }] },
  'dissolving-self-ocean-planet': { slug: 'dissolving-self-ocean-planet', title: 'Why the Dissolving Self Is Imagined as an Ocean Planet: DMN Downregulation and the Cognitive Basis of the Neptune Metaphor', version: '1.0.0', versionDate: '2026-06-04', status: 'Working paper', statusDetail: 'Cognitive-science and metaphor synthesis', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-04', note: 'First public working-paper edition.' }] },
  'chronobiological-entrainment': { slug: 'chronobiological-entrainment', title: 'Chronobiological Entrainment as a Primary Modality for Endocrine Homeostasis', version: '1.0.0', versionDate: '2026-02-15', status: 'Working paper', statusDetail: 'Hypothesis and proposed trial; not clinical guidance', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-02-15', note: 'First public working-paper edition.' }] },
  'commercial-fusion-viability': { slug: 'commercial-fusion-viability', title: 'Bridging the Chasm: From Scientific Break-Even to Commercial Fusion Power', version: '1.0.0', versionDate: '2026-06-02', status: 'Technical synthesis', statusDetail: 'Engineering literature synthesis, not original research', reviewStatus: nonPeerReviewed, versionHistory: [{ version: '1.0.0', date: '2026-06-02', note: 'First public technical-synthesis edition.' }] },
};

export function getWorkingPaper(slug: string) {
  return WORKING_PAPERS[slug];
}

export function getBibtex(paper: WorkingPaper, siteUrl: string) {
  const key = `rajan${paper.versionDate.slice(0, 4)}${paper.slug.replace(/[-_]/g, '')}`;
  return `@article{${key},\n  author = {Rajan, Mayone Maha},\n  title = {${paper.title}},\n  journal = {Maha Strategies Research},\n  year = {${paper.versionDate.slice(0, 4)}},\n  version = {${paper.version}},\n  url = {${siteUrl}/papers/${paper.slug}},\n  note = {${paper.status}; ${paper.reviewStatus.toLowerCase()}}\n}`;
}

export function getCitationCff(paper: WorkingPaper, siteUrl: string) {
  return `cff-version: 1.2.0\nmessage: "If you use this working paper, please cite the version you consulted."\ntitle: "${paper.title.replace(/"/g, '\\\"')}"\ntype: article\nauthors:\n  - family-names: Rajan\n    given-names: Mayone Maha\n    orcid: https://orcid.org/0009-0006-8135-5306\nversion: ${paper.version}\ndate-released: ${paper.versionDate}\nurl: ${siteUrl}/papers/${paper.slug}\nlicense: CC-BY-4.0\nkeywords:\n  - working paper\n  - Maha Strategies Research\nabstract: "${paper.statusDetail.replace(/"/g, '\\\"')}"\n`;
}
