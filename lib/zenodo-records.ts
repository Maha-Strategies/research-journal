export type ZenodoRecord = {
  doi: string;
  conceptDoi: string;
  recordUrl: string;
  doiUrl: string;
  archiveLabel: string;
};

// These are published Zenodo records. Keep the version-specific DOI here so a
// reader can reach the exact archived object; the concept DOI remains available
// for a citation that should always resolve to the newest Zenodo version.
export const ZENODO_RECORDS: Record<string, ZenodoRecord> = {
  'the_perturber_question': {
    doi: '10.5281/zenodo.20719485',
    conceptDoi: '10.5281/zenodo.20719484',
    recordUrl: 'https://zenodo.org/records/20719485',
    doiUrl: 'https://doi.org/10.5281/zenodo.20719485',
    archiveLabel: 'Zenodo preprint archive',
  },
  'retrograde_p9': {
    doi: '10.5281/zenodo.20756443',
    conceptDoi: '10.5281/zenodo.20756442',
    recordUrl: 'https://zenodo.org/records/20756443',
    doiUrl: 'https://doi.org/10.5281/zenodo.20756443',
    archiveLabel: 'Zenodo preprint archive',
  },
  'planet-nine-forecast': {
    doi: '10.5281/zenodo.20689349',
    conceptDoi: '10.5281/zenodo.20621055',
    recordUrl: 'https://zenodo.org/records/20689349',
    doiUrl: 'https://doi.org/10.5281/zenodo.20689349',
    archiveLabel: 'Zenodo preprint archive',
  },
  'the-maha-framework': {
    doi: '10.5281/zenodo.20746123',
    conceptDoi: '10.5281/zenodo.20746122',
    recordUrl: 'https://zenodo.org/records/20746123',
    doiUrl: 'https://doi.org/10.5281/zenodo.20746123',
    archiveLabel: 'Zenodo working-paper archive',
  },
};

export function getZenodoRecord(slug: string) {
  return ZENODO_RECORDS[slug];
}
