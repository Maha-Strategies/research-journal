// The Mayon Learning Library registry: the static content store.
//
// This file is the database. Modules and lessons are declared here as data,
// validated against the Zod schemas at load, and read through the accessor
// functions below. There is no runtime data source and no CMS: content is
// version-controlled alongside the code that renders it, so a change to a
// lesson is a reviewable diff rather than an invisible edit.
//
// SEED CONTENT NOTICE: this is Phase 2 seed curriculum. It is structurally
// complete — every lesson carries objectives, an ordered field procedure, an
// audience, a level, and at least one named source — but it has NOT been
// reviewed by a hazard authority and is not a substitute for the guidance of
// the agency responsible for warnings in a reader's area. Each lesson page
// states this.
//
// SOURCE PROVENANCE: every entry in `verifiedSources` is tagged
// `authority-named-not-resolved`. That tag is honest and load-bearing: the
// issuing authority and document are named from general knowledge, and the URL
// has NOT been re-resolved for this artifact. Under clause P1 of the Maha
// Provenance Standard a citation must state the basis on which it is cited, and
// under P3 a derived artifact must state a citation gap rather than fill it.
// Promoting any of these to `url-resolved` requires actually resolving the URL
// and recording the date — see SOURCE_RESOLUTION_TODO below.
//
// No DOIs appear anywhere in this file. A DOI written from memory is the exact
// failure P3 exists to prevent: plausible, well-formed, and unchecked.
//
// INVARIANTS enforced at module load, so a bad edit fails the build:
//   1. Every module and lesson satisfies its schema.
//   2. Lesson ids are unique across the entire library, not just per module.
//   3. Every lesson's `moduleSlug` matches the module that contains it.

import {
  type AudienceRole,
  type LearningLesson,
  type LearningModule,
  type VerifiedSource,
  parseLearningModule,
} from '@/lib/library/schema';

/**
 * Standing task: resolve each source URL against the live site, then flip its
 * `verification` to `url-resolved` and record `checkedOn`. Until then the
 * library must not describe these as verified.
 */
export const SOURCE_RESOLUTION_TODO =
  'All seed sources are tagged authority-named-not-resolved. Resolve each URL and record checkedOn before describing any of them as verified.';

// --- Named authorities -----------------------------------------------------
// Reused across lessons so a URL is written once. Each is an issuing body's
// canonical entry point rather than a deep link to a document, because a
// homepage is the claim least likely to be wrong when it has not been checked.

const named = (label: string, publisher: string, url: string): VerifiedSource => ({
  label,
  publisher,
  url,
  verification: 'authority-named-not-resolved',
});

const PHIVOLCS = named(
  'Volcano and earthquake bulletins, alert-level schemes, and hazard maps',
  'Philippine Institute of Volcanology and Seismology (PHIVOLCS), DOST',
  'https://www.phivolcs.dost.gov.ph',
);

const PAGASA = named(
  'Tropical cyclone wind signals, rainfall warnings, and flood bulletins',
  'Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA), DOST',
  'https://www.pagasa.dost.gov.ph',
);

const NDRRMC = named(
  'National disaster risk reduction and management plans and advisories',
  'National Disaster Risk Reduction and Management Council (NDRRMC), Philippines',
  'https://ndrrmc.gov.ph',
);

const USGS = named(
  'Earthquake and volcano hazard programs and public preparedness guidance',
  'United States Geological Survey (USGS)',
  'https://www.usgs.gov',
);

const WHO = named(
  'Guidance on outbreak response, water, sanitation, and health in emergencies',
  'World Health Organization (WHO)',
  'https://www.who.int',
);

const SENDAI = named(
  'Sendai Framework for Disaster Risk Reduction 2015–2030',
  'United Nations Office for Disaster Risk Reduction (UNDRR)',
  'https://www.undrr.org/publication/sendai-framework-disaster-risk-reduction-2015-2030',
);

const IOC_TSUNAMI = named(
  'Tsunami preparedness, natural warning signs, and evacuation guidance',
  'IOC/UNESCO Intergovernmental Oceanographic Commission — Tsunami Programme',
  'https://www.ioc-tsunami.org',
);

const MGB = named(
  'Geohazard assessment and landslide susceptibility mapping',
  'Mines and Geosciences Bureau (MGB), DENR Philippines',
  'https://www.mgb.gov.ph',
);

const DPWH = named(
  'National Structural Code and public infrastructure standards',
  'Department of Public Works and Highways (DPWH), Philippines',
  'https://www.dpwh.gov.ph',
);

const DEPED = named(
  'School disaster preparedness and learning continuity policy',
  'Department of Education (DepEd), Philippines',
  'https://www.deped.gov.ph',
);

const SPHERE = named(
  'Sphere Handbook: humanitarian charter and minimum standards in humanitarian response',
  'Sphere Association',
  'https://spherestandards.org',
);

const IFRC = named(
  'Community-based disaster preparedness and early warning guidance',
  'International Federation of Red Cross and Red Crescent Societies (IFRC)',
  'https://www.ifrc.org',
);

const WMO = named(
  'Multi-hazard early warning system guidance and impact-based forecasting',
  'World Meteorological Organization (WMO)',
  'https://wmo.int',
);

const CDC = named(
  'Public health preparedness, outbreak communication, and post-disaster health guidance',
  'United States Centers for Disease Control and Prevention (CDC)',
  'https://www.cdc.gov',
);

const EXHIBIT_URL = 'https://www.mayonrajan.com';

// --- Modules ---------------------------------------------------------------

const VOLCANIC_HAZARDS: LearningModule = parseLearningModule({
  slug: 'volcanic-hazards',
  title: 'Volcanic Hazard Literacy & Alert Dynamics',
  description:
    'How a volcano is monitored, what an alert level does and does not promise, and how the ground itself decides where the danger sits. Paired with a true-scale 3D exhibit so the geometry can be seen rather than imagined.',
  lessons: [
    {
      id: 'volc-alert-levels',
      moduleSlug: 'volcanic-hazards',
      title: 'Reading Volcanic Alert Levels',
      description:
        'How a volcanic alert level is constructed, what evidence moves it up or down, and why the number describes the state of the volcano rather than the safety of any particular place.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      educationalLevel: 'General Public',
      interactiveLabUrl: EXHIBIT_URL,
      learningResourceType: ['LessonPlan', '3DSimulation'],
      learningObjectives: [
        'Describe what each step on an alert-level scale asserts about observed activity.',
        'Distinguish an alert level, which describes the volcano, from a danger zone, which describes a place.',
        'Explain why an alert level can stay unchanged while local risk changes.',
        'Identify the authority responsible for issuing the alert level in a given jurisdiction.',
      ],
      fieldActionableSteps: [
        'Find the current alert level from the issuing agency directly, not from a repost.',
        'Note the timestamp on the bulletin and treat anything older than the latest issuance as superseded.',
        'Locate your position relative to the declared permanent and extended danger zones.',
        'Confirm the evacuation route and assembly point for your zone before conditions change.',
        'Write down the agency bulletin channel so it can be rechecked without a search.',
      ],
      verifiedSources: [PHIVOLCS, USGS],
    },
    {
      id: 'volc-pyroclastic-lahar',
      moduleSlug: 'volcanic-hazards',
      title: 'Pyroclastic Density Currents and Lahar Pathways',
      description:
        'Why the deadliest volcanic hazards follow terrain rather than distance, how channels and valleys concentrate them, and why a lahar can arrive on a clear day long after an eruption has stopped.',
      audience: ['teacher', 'student', 'institution', 'responder'],
      educationalLevel: 'Undergraduate',
      interactiveLabUrl: EXHIBIT_URL,
      learningResourceType: ['LessonPlan', '3DSimulation'],
      learningObjectives: [
        'Explain why pyroclastic density currents are governed by slope and channel geometry rather than radial distance.',
        'Identify the drainage channels that concentrate lahars around a stratovolcano.',
        'Describe why rainfall can trigger a lahar months or years after the eruption that supplied the material.',
        'Read a volcanic hazard map as a statement about pathways rather than a ring of equal risk.',
      ],
      fieldActionableSteps: [
        'Trace the drainage channels between your location and the summit on a hazard map.',
        'Identify whether your route to safety crosses any of those channels, and find one that does not.',
        'Treat heavy rainfall on recent ash deposits as a lahar warning even with no eruption underway.',
        'Move perpendicular to a channel and upslope, never downstream along it.',
        'Agree a family rule that channel crossings stop once rainfall begins, before anyone needs to decide in the moment.',
      ],
      verifiedSources: [PHIVOLCS, USGS, MGB],
    },
  ],
});

const SEISMIC_RISK: LearningModule = parseLearningModule({
  slug: 'seismic-risk',
  title: 'Seismic Risk & Structural Safety',
  description:
    'What actually injures people in an earthquake, how to act in the seconds available, and how to read a building for the vulnerabilities that decide whether it stands.',
  lessons: [
    {
      id: 'seismic-cover-protocol',
      moduleSlug: 'seismic-risk',
      title: 'Drop, Cover, Hold On: Why the Protocol Is What It Is',
      description:
        'The reasoning behind the standard earthquake response, what it is protecting against, and the specific situations in which the default advice changes.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      educationalLevel: 'K-12',
      learningObjectives: [
        'State what the drop-cover-hold protocol is protecting against, and what it is not.',
        'Explain why moving between rooms or outdoors during shaking increases injury risk.',
        'Identify the safest available cover in a room within a few seconds.',
        'Describe how the protocol changes for a wheelchair user, a bedbound person, and someone in a vehicle.',
      ],
      fieldActionableSteps: [
        'Identify, in the room you are in now, the sturdy object you would get under.',
        'Clear the space above beds and desks of anything heavy that could fall onto a person.',
        'Practise the protocol once with everyone who uses the room, including the wheelchair and bed variants.',
        'Anchor tall furniture and appliances to the wall before you need them to stay put.',
        'Agree that nobody runs outside during shaking, and that the meeting point is used only after it stops.',
      ],
      verifiedSources: [PHIVOLCS, USGS, NDRRMC],
    },
    {
      id: 'seismic-building-vulnerability',
      moduleSlug: 'seismic-risk',
      title: 'Recognizing Structural Vulnerability in Everyday Buildings',
      description:
        'How to read a building for the configurations that concentrate earthquake damage — soft storeys, unreinforced masonry, short columns — and what a non-engineer can and cannot conclude from a walk-around.',
      audience: ['teacher', 'institution', 'responder'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'Identify a soft-storey configuration and explain why it concentrates deformation.',
        'Recognize unreinforced masonry and describe how it fails under lateral load.',
        'Explain the short-column effect and where partial infill walls create it.',
        'State clearly the boundary between a visual walk-around and an engineering assessment.',
      ],
      fieldActionableSteps: [
        'Walk the ground floor and note whether it has markedly fewer walls than the floors above.',
        'Check whether infill walls stop partway up columns, leaving a short exposed segment.',
        'Photograph and date any diagonal cracking at wall and column joints for comparison over time.',
        'Record which exits remain usable if the ground floor deforms, and mark an alternative.',
        'Refer anything you find to a licensed structural engineer rather than acting on your own reading.',
      ],
      verifiedSources: [DPWH, PHIVOLCS, SENDAI],
    },
  ],
});

const HYDROMET_EXTREMES: LearningModule = parseLearningModule({
  slug: 'hydromet-extremes',
  title: 'Hydrometeorological Extremes & Flood Resilience',
  description:
    'Reading the warning systems for cyclones and rainfall, understanding why wind category and flood risk are different questions, and deciding to move while the decision is still free.',
  lessons: [
    {
      id: 'hydromet-warning-signals',
      moduleSlug: 'hydromet-extremes',
      title: 'Reading Tropical Cyclone and Rainfall Warning Signals',
      description:
        'What a wind signal and a colour-coded rainfall warning each measure, why the two can disagree, and how to convert an official bulletin into a decision about your own location.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'Distinguish what a tropical cyclone wind signal measures from what a rainfall warning measures.',
        'Explain why a low wind signal can accompany life-threatening flooding.',
        'Convert a regional bulletin into a statement about your own barangay or district.',
        'Identify the lead time each warning type realistically provides.',
      ],
      fieldActionableSteps: [
        'Read the current wind signal and the current rainfall warning as two separate facts.',
        'Check the rainfall warning for your specific locality, not only the provincial headline.',
        'Set a personal trigger — a signal level or rainfall colour — that commits you to move.',
        'Charge devices and fill water containers at the first advisory, not the last.',
        'Note the next bulletin issuance time so you are not refreshing a static page.',
      ],
      verifiedSources: [PAGASA, WMO, NDRRMC],
    },
    {
      id: 'hydromet-flood-evacuation',
      moduleSlug: 'hydromet-extremes',
      title: 'Flood Onset and the Decision to Move',
      description:
        'Why flood deaths cluster around late decisions and vehicle crossings, how to set a departure trigger in advance, and what makes a route survivable rather than merely shorter.',
      audience: ['teacher', 'student', 'institution', 'responder'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'Explain why moving water of modest depth can carry a person or a vehicle.',
        'Set an observable departure trigger that does not depend on judgement under stress.',
        'Evaluate a route for crossings that become impassable first.',
        'Describe why returning for possessions is the most common fatal decision.',
      ],
      fieldActionableSteps: [
        'Choose a fixed water mark near your home that means leave now, and tell everyone what it is.',
        'Walk your evacuation route and note every point where it crosses a channel or low ground.',
        'Move documents, medication, and a change of clothes into one grab bag kept high and by the door.',
        'Never drive or wade through moving water of unknown depth; turn around and use the alternate route.',
        'Once you have left, do not return until the responsible authority says the area is clear.',
      ],
      verifiedSources: [PAGASA, NDRRMC, IFRC],
    },
  ],
});

const SLOPE_STABILITY: LearningModule = parseLearningModule({
  slug: 'slope-stability',
  title: 'Geotechnical & Slope Stability',
  description:
    'How slopes fail, the precursors that precede failure by minutes to weeks, and how to assess the ground a home or school actually sits on.',
  lessons: [
    {
      id: 'slope-landslide-precursors',
      moduleSlug: 'slope-stability',
      title: 'Recognizing Landslide Precursors',
      description:
        'The observable signs that a slope is moving — tilted trees, new springs, cracking ground, changed stream turbidity — and how to act on them before the failure itself.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'List the observable precursors that indicate slope movement is underway.',
        'Explain why sudden changes in spring or stream behaviour signal subsurface movement.',
        'Describe the relationship between antecedent rainfall and slope failure timing.',
        'State what to do when precursors appear but no official warning has been issued.',
      ],
      fieldActionableSteps: [
        'Walk the slope above your home after heavy rain and look for new cracks, bulges, or tilted trees.',
        'Note any spring that appears where there was none, or any stream that suddenly runs muddy.',
        'Photograph and date cracks so movement between visits is measurable rather than remembered.',
        'Leave and report to local authorities when precursors appear — do not wait for an official warning.',
        'Sleep on the side of the house away from the slope during periods of sustained rainfall.',
      ],
      verifiedSources: [MGB, USGS, PHIVOLCS],
    },
    {
      id: 'slope-siting-assessment',
      moduleSlug: 'slope-stability',
      title: 'Assessing Slope Risk Where You Live',
      description:
        'How to read a geohazard susceptibility map against your own address, what the categories mean in practice, and the limits of a map drawn at regional scale.',
      audience: ['teacher', 'institution', 'responder'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'Locate an address on a geohazard susceptibility map and read its assigned category.',
        'Explain what susceptibility means and why it is not a prediction of when.',
        'Describe why regional-scale mapping can miss site-specific hazards.',
        'Identify which land-use changes raise susceptibility on an already marginal slope.',
      ],
      fieldActionableSteps: [
        'Obtain the geohazard map covering your locality from the issuing bureau rather than a third-party copy.',
        'Mark your building, your school, and your evacuation route on it.',
        'Note the map scale and treat anything smaller than its resolution as unassessed.',
        'Document cut-and-fill, vegetation removal, or drainage changes near the slope since the map was drawn.',
        'Escalate a site-specific assessment through local government where the map and what you see disagree.',
      ],
      verifiedSources: [MGB, SENDAI, NDRRMC],
    },
  ],
});

const COASTAL_HAZARDS: LearningModule = parseLearningModule({
  slug: 'coastal-hazards',
  title: 'Coastal & Marine Hazard Dynamics',
  description:
    'Tsunami and storm surge: two coastal hazards with different physics, different warning times, and one shared lesson — that the coast gives very little notice.',
  lessons: [
    {
      id: 'coastal-tsunami-response',
      moduleSlug: 'coastal-hazards',
      title: 'Natural Tsunami Warnings and Immediate Response',
      description:
        'Why a near-field tsunami arrives before any official warning can, which natural signs constitute the warning themselves, and why the first wave is rarely the largest.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'Identify the three natural tsunami warnings: strong shaking, sudden sea withdrawal, and a loud roar.',
        'Explain why a near-field tsunami leaves no time for an official bulletin.',
        'Describe why the first wave is often not the largest and why the sequence lasts hours.',
        'State the vertical and horizontal evacuation targets for your own stretch of coast.',
      ],
      fieldActionableSteps: [
        'Treat strong or long shaking near the coast as the warning itself and move immediately.',
        'Move inland and upslope on foot; roads jam and vehicles become traps.',
        'Aim for high ground rather than a fixed distance, and keep going past the first rise.',
        'Do not return to the shore for at least several hours, and only when authorities declare it clear.',
        'Walk the evacuation route to high ground once, in daylight, before you ever need it.',
      ],
      verifiedSources: [IOC_TSUNAMI, PHIVOLCS, USGS],
    },
    {
      id: 'coastal-storm-surge',
      moduleSlug: 'coastal-hazards',
      title: 'Storm Surge: Why Wind Category Is Not the Whole Story',
      description:
        'How surge height is driven by bathymetry, coastal shape, and storm size rather than wind speed alone, and why a lower-category storm can produce a higher surge.',
      audience: ['teacher', 'student', 'institution', 'responder'],
      educationalLevel: 'Undergraduate',
      learningObjectives: [
        'Explain how shallow bathymetry and funnelling coastlines amplify surge height.',
        'Describe why storm size and forward speed matter alongside maximum wind.',
        'Distinguish surge height from total inundation depth at a given elevation.',
        'Read a storm surge advisory as a statement about a specific coastal segment.',
      ],
      fieldActionableSteps: [
        'Find the ground elevation of your building relative to the advertised surge height.',
        'Identify the nearest structure or ground that sits clearly above the forecast inundation.',
        'Leave low-lying coastal ground on the surge advisory, not on the wind signal.',
        'Assume the surge arrives before the storm centre and close your departure window early.',
        'Confirm the evacuation centre is itself outside the surge zone before relying on it.',
      ],
      verifiedSources: [PAGASA, WMO, NDRRMC],
    },
  ],
});

const BIOLOGICAL_HAZARDS: LearningModule = parseLearningModule({
  slug: 'biological-hazards',
  title: 'Biological & Public Health Hazard Literacy',
  description:
    'How outbreaks propagate, which interventions actually break transmission chains, and why water and sanitation dominate health outcomes after a disaster.',
  lessons: [
    {
      id: 'bio-outbreak-transmission',
      moduleSlug: 'biological-hazards',
      title: 'How an Outbreak Spreads and What Breaks the Chain',
      description:
        'The chain of infection as a practical model, where each link can be broken, and why interventions are judged on which link they target rather than on how dramatic they look.',
      audience: ['teacher', 'student', 'institution', 'responder'],
      educationalLevel: 'Undergraduate',
      learningObjectives: [
        'Describe the chain of infection and name the link each common intervention targets.',
        'Explain why transmission route determines which precautions are effective.',
        'Distinguish isolation from quarantine and state when each applies.',
        'Evaluate a proposed measure by asking which link it breaks.',
      ],
      fieldActionableSteps: [
        'Identify the transmission route being reported before choosing any precaution.',
        'Apply the precaution that matches that route rather than the one that is most visible.',
        'Separate people who are ill from shared sleeping and eating space as early as possible.',
        'Report suspected cases through the local health unit so contact tracing can begin.',
        'Record who was in contact with whom and when, while memories are still accurate.',
      ],
      verifiedSources: [WHO, CDC],
    },
    {
      id: 'bio-water-sanitation',
      moduleSlug: 'biological-hazards',
      title: 'Safe Water and Sanitation After a Disaster',
      description:
        'Why waterborne disease causes more post-disaster illness than the event itself, how to make water safe with what is available, and how sanitation siting protects a whole shelter.',
      audience: ['teacher', 'student', 'institution', 'responder'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'Explain why water sources become contaminated after flooding and structural damage.',
        'Describe boiling, chlorination, and filtration, and state the limits of each.',
        'Site a latrine relative to a water source so that contamination is prevented.',
        'Recognize the early signs of waterborne illness and know when to escalate.',
      ],
      fieldActionableSteps: [
        'Treat all flood-contacted water as unsafe until it has been boiled or properly chlorinated.',
        'Bring water to a rolling boil, or chlorinate at the dose the health authority specifies.',
        'Site latrines downhill and well away from any well or water point, never upstream of one.',
        'Set up a handwashing point with soap at the latrine and at the eating area.',
        'Escalate any cluster of diarrhoeal illness to the local health unit the same day.',
      ],
      verifiedSources: [WHO, SPHERE, CDC],
    },
  ],
});

const INFRASTRUCTURE_VULNERABILITY: LearningModule = parseLearningModule({
  slug: 'infrastructure-vulnerability',
  title: 'Built Environment & Infrastructure Vulnerability',
  description:
    'Why systems fail together rather than separately, how dependency chains propagate a single outage, and how to judge whether a building can serve as shelter.',
  lessons: [
    {
      id: 'infra-lifeline-dependencies',
      moduleSlug: 'infrastructure-vulnerability',
      title: 'Lifeline Dependencies and Cascading Failure',
      description:
        'How power, water, telecoms, and transport depend on one another, why the second-order failure often exceeds the first, and how to map the dependencies that matter locally.',
      audience: ['teacher', 'institution', 'responder'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'Map the dependency chain from electrical power to water, telecoms, and health services.',
        'Explain why restoration sequence determines how long a community is without services.',
        'Identify the single points of failure that carry disproportionate local consequence.',
        'Describe how fuel supply constrains the duration of backup power.',
      ],
      fieldActionableSteps: [
        'List the services your household or institution depends on, then list what each of those depends on.',
        'Identify which of them stop working within hours of a power outage.',
        'Establish how long any backup generator can run on fuel actually held on site.',
        'Arrange one communication method that does not depend on the local mobile network.',
        'Store water independently of the pumped supply, sized to the outage you consider plausible.',
      ],
      verifiedSources: [SENDAI, NDRRMC, DPWH],
    },
    {
      id: 'infra-shelter-assessment',
      moduleSlug: 'infrastructure-vulnerability',
      title: 'Assessing a Building as an Emergency Shelter',
      description:
        'What makes a structure suitable for sheltering people — location relative to hazard, structural condition, capacity, water, sanitation, and exits — and what disqualifies one regardless of its size.',
      audience: ['teacher', 'institution', 'responder'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'Evaluate a candidate shelter against the hazard it is meant to protect against.',
        'Apply minimum space, water, and sanitation figures to a realistic occupancy.',
        'Identify the conditions that disqualify a building outright.',
        'Describe why a shelter inside the hazard zone is worse than no designated shelter.',
      ],
      fieldActionableSteps: [
        'Confirm the building sits outside the hazard zone it is intended to shelter from.',
        'Count usable exits and check that each is unobstructed and can be opened from inside.',
        'Calculate realistic capacity from floor area, water supply, and latrine count, not from optimism.',
        'Check for the structural vulnerabilities that would matter for the hazard in question.',
        'Publish the assessment, including what disqualified any rejected building, so it can be challenged.',
      ],
      verifiedSources: [SPHERE, DPWH, IFRC],
    },
  ],
});

const INFORMATION_RESILIENCE: LearningModule = parseLearningModule({
  slug: 'information-resilience',
  title: 'Algorithmic & Information Resilience',
  description:
    'How hazard information degrades as it travels, why engagement-ranked feeds systematically distort it, and how to hold a decision open under uncertainty without becoming paralysed.',
  lessons: [
    {
      id: 'info-rumor-triage',
      moduleSlug: 'information-resilience',
      title: 'Triaging Hazard Information Under Uncertainty',
      description:
        'A working procedure for deciding what to act on when reports conflict: establishing provenance, checking timestamps, and distinguishing an absence of information from an all-clear.',
      audience: ['teacher', 'student', 'visitor', 'responder'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'Trace a hazard claim back to its issuing authority or establish that it has none.',
        'Explain why a timestamp and an issuance channel matter more than the wording of a claim.',
        'Distinguish no information from an all-clear.',
        'Act proportionately on an unverified report without either dismissing or amplifying it.',
      ],
      fieldActionableSteps: [
        'Before acting or resharing, find the original issuing authority for the claim.',
        'Check the timestamp and discard anything superseded by a later official bulletin.',
        'Treat screenshots as unverified until located on the issuer’s own channel.',
        'Take precautionary action that is cheap to reverse while verification is still pending.',
        'Say plainly that something is unconfirmed when you pass it on, rather than dropping the caveat.',
      ],
      verifiedSources: [WMO, NDRRMC, IFRC],
    },
    {
      id: 'info-algorithmic-amplification',
      moduleSlug: 'information-resilience',
      title: 'How Feeds Distort Hazard Signal',
      description:
        'Why engagement ranking systematically favours dramatic and early claims over corrected ones, what that does to a community during an unfolding event, and how to build an information path that does not depend on a feed.',
      audience: ['teacher', 'student', 'institution'],
      educationalLevel: 'Undergraduate',
      learningObjectives: [
        'Explain how engagement-based ranking selects for emotional intensity over accuracy.',
        'Describe why corrections propagate more slowly than the claims they correct.',
        'Identify the conditions under which a feed is actively harmful during an event.',
        'Construct an information path that does not depend on algorithmic ranking.',
      ],
      fieldActionableSteps: [
        'Subscribe directly to the issuing agency’s own channel before an event, not during one.',
        'Set up one non-algorithmic alert path such as SMS, radio, or email from the authority.',
        'Agree with your household which single source settles a disagreement.',
        'When you find a correction, send it directly to whoever you shared the original with.',
        'Keep a battery radio and know the frequency, for when the network itself is down.',
      ],
      verifiedSources: [WMO, SENDAI, IFRC],
    },
  ],
});

const CRISIS_COMMUNICATION: LearningModule = parseLearningModule({
  slug: 'crisis-communication',
  title: 'Hazard Communication & Crisis Mobilization',
  description:
    'What separates a warning people act on from one they discount, and how a community converts a warning into coordinated movement before impact.',
  lessons: [
    {
      id: 'comms-warning-message-design',
      moduleSlug: 'crisis-communication',
      title: 'Designing a Warning Message People Act On',
      description:
        'The components a warning needs — hazard, location, timing, consequence, and a specific instruction — and why vagueness and repeated non-events both suppress response.',
      audience: ['teacher', 'institution', 'responder'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'List the components a warning message needs to produce action.',
        'Explain why a specific instruction outperforms a description of severity.',
        'Describe how milling and confirmation-seeking consume the available lead time.',
        'Explain how repeated warnings without consequence erode future response.',
      ],
      fieldActionableSteps: [
        'State the hazard, the exact area, the timing, the consequence, and the required action in that order.',
        'Give one specific instruction rather than a menu of options.',
        'Name the issuing authority in the message so recipients can verify without searching.',
        'Send the same message on every channel simultaneously to shorten confirmation-seeking.',
        'Issue an explicit all-clear afterwards, so the next warning is still believed.',
      ],
      verifiedSources: [WMO, NDRRMC, IFRC],
    },
    {
      id: 'comms-community-mobilization',
      moduleSlug: 'crisis-communication',
      title: 'Mobilizing a Community Before Impact',
      description:
        'How pre-assigned roles, a named decision-maker, and a rehearsed sequence turn a warning into movement, and why the people least likely to self-evacuate need to be identified in advance.',
      audience: ['teacher', 'institution', 'responder'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'Assign the roles a community evacuation requires before an event occurs.',
        'Explain why a single named decision-maker outperforms consensus under time pressure.',
        'Identify in advance the households that will need assistance to move.',
        'Describe how rehearsal converts a written plan into an executable one.',
      ],
      fieldActionableSteps: [
        'Name one person authorised to call the evacuation, and one alternate.',
        'Build a list of households needing transport or assistance, and assign each a named helper.',
        'Pre-assign roles for route marshalling, headcount, and shelter reception.',
        'Rehearse the full sequence once a year and time it end to end.',
        'Revise the plan against what actually went wrong in the rehearsal, then publish the revision.',
      ],
      verifiedSources: [IFRC, NDRRMC, SENDAI],
    },
  ],
});

const EDUCATIONAL_SOVEREIGNTY: LearningModule = parseLearningModule({
  slug: 'educational-sovereignty',
  title: 'Educational & Physical Sovereignty in Crisis',
  description:
    'How a community keeps teaching, deciding, and remembering on its own terms when institutions are disrupted — and why local hazard knowledge is a record worth keeping.',
  lessons: [
    {
      id: 'sovereignty-learning-continuity',
      moduleSlug: 'educational-sovereignty',
      title: 'Keeping Learning Going When Schools Close',
      description:
        'Why prolonged educational interruption compounds disaster harm, and how to build a continuity plan that does not assume electricity, connectivity, or an intact school building.',
      audience: ['teacher', 'student', 'institution'],
      educationalLevel: 'Professional',
      learningObjectives: [
        'Explain why educational interruption is a disaster impact rather than an inconvenience.',
        'Design a continuity approach that works without power or connectivity.',
        'Identify which learners are most likely never to return, and why.',
        'Describe the competing demands when a school is also the evacuation centre.',
      ],
      fieldActionableSteps: [
        'Prepare printed learning packets ahead of the season and store them somewhere dry and reachable.',
        'Agree a meeting point and schedule for teaching that does not depend on the school building.',
        'Keep a contact list for every learner, held by more than one person.',
        'Track who has not returned within two weeks and follow up individually.',
        'Plan in advance for the school serving as both shelter and classroom, including the timeline for handing it back.',
      ],
      verifiedSources: [DEPED, SENDAI, SPHERE],
    },
    {
      id: 'sovereignty-local-knowledge',
      moduleSlug: 'educational-sovereignty',
      title: 'Local Knowledge as a Hazard Record',
      description:
        'How community memory of past events preserves information that instrumental records miss, how to document it without distorting it, and how to hold it alongside official mapping rather than against it.',
      audience: ['teacher', 'student', 'institution', 'visitor'],
      educationalLevel: 'General Public',
      learningObjectives: [
        'Explain what community hazard memory records that instrumental monitoring does not.',
        'Document an oral account without flattening its uncertainty.',
        'Reconcile local knowledge with official hazard mapping where the two disagree.',
        'Describe how place names and landscape features encode past events.',
      ],
      fieldActionableSteps: [
        'Interview the longest-resident neighbours about the highest water or furthest flow they witnessed.',
        'Record where they say it reached, and mark those points physically where you can.',
        'Write down what each person actually saw separately from what they were told.',
        'Compare the account against the official hazard map and record the disagreement rather than resolving it.',
        'Deposit the record with the school or barangay so it outlasts the people who hold it.',
      ],
      verifiedSources: [SENDAI, IFRC, PHIVOLCS],
    },
  ],
});

/**
 * Every module in the library, in curriculum order.
 */
export const LEARNING_MODULES: LearningModule[] = [
  VOLCANIC_HAZARDS,
  SEISMIC_RISK,
  HYDROMET_EXTREMES,
  SLOPE_STABILITY,
  COASTAL_HAZARDS,
  BIOLOGICAL_HAZARDS,
  INFRASTRUCTURE_VULNERABILITY,
  INFORMATION_RESILIENCE,
  CRISIS_COMMUNICATION,
  EDUCATIONAL_SOVEREIGNTY,
];

// --- Load-time invariant checks -------------------------------------------

const seenLessonIds = new Set<string>();
const seenModuleSlugs = new Set<string>();
for (const learningModule of LEARNING_MODULES) {
  if (seenModuleSlugs.has(learningModule.slug)) {
    throw new Error(`Library registry: duplicate module slug "${learningModule.slug}".`);
  }
  seenModuleSlugs.add(learningModule.slug);

  for (const lesson of learningModule.lessons) {
    if (lesson.moduleSlug !== learningModule.slug) {
      throw new Error(
        `Library registry: lesson "${lesson.id}" declares moduleSlug "${lesson.moduleSlug}" but is listed under module "${learningModule.slug}".`,
      );
    }
    if (seenLessonIds.has(lesson.id)) {
      throw new Error(
        `Library registry: duplicate lesson id "${lesson.id}". Lesson ids must be unique across the whole library because they appear in URLs.`,
      );
    }
    seenLessonIds.add(lesson.id);
  }
}

// --- Accessors -------------------------------------------------------------

/** Every lesson in the library, flattened, in module then lesson order. */
export function getAllLessons(): LearningLesson[] {
  return LEARNING_MODULES.flatMap((learningModule) => learningModule.lessons);
}

/**
 * Lessons written for a given audience role.
 *
 * A lesson may address several audiences at once, so this filters on
 * membership rather than partitioning the library. A role with no lessons
 * returns an empty array — that is a content gap to be reported, not an error.
 */
export function getLessonsByAudience(role: AudienceRole): LearningLesson[] {
  return getAllLessons().filter((lesson) => lesson.audience.includes(role));
}

/** A single lesson by id, or undefined if no such lesson is registered. */
export function getLessonById(id: string): LearningLesson | undefined {
  return getAllLessons().find((lesson) => lesson.id === id);
}

/** A single module by slug, or undefined if no such module is registered. */
export function getModuleBySlug(slug: string): LearningModule | undefined {
  return LEARNING_MODULES.find((learningModule) => learningModule.slug === slug);
}

/** The module a lesson belongs to, or undefined if the lesson is unknown. */
export function getModuleForLesson(lessonId: string): LearningModule | undefined {
  return LEARNING_MODULES.find((learningModule) =>
    learningModule.lessons.some((lesson) => lesson.id === lessonId),
  );
}
