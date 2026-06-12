# The Perturber Question Under Audit: An Agentic-AI Replication of the eTNO Clustering Test and a Composition-Agnostic Hypothesis Synthesis

**Mayone Maha Rajan** (Architect & Curator)
**AI synthesis instrument:** Google Antigravity (agentic model)
**Editorial and provenance-verification pass:** Claude (Anthropic), under the architect's direction
**Revision 1 — June 2026**

This paper was produced through human-directed AI synthesis. The human architect curated the inquiry, designed the audit protocol, and is responsible for all claims; the agentic AI instrument performed the literature retrieval, simulation construction, and drafting under that direction, and a second AI instrument performed an editorial pass that verified data provenance where possible and removed claims whose provenance could not be established. The editorial pass did not re-execute the simulation. All quantitative results derive from `clustering_test.py` [seed: TO CONFIRM from script before publication]; parameter values quoted from secondary sources must be confirmed against the primary papers before being relied upon. Outstanding verification items are listed in Section 7 and must be cleared by the human architect before this paper is published.

## Revision note (what changed since the agent draft)

- **The embedded prior draft was removed.** The agent's draft incorporated, verbatim and uncorrected, an earlier internal paper ("Epistemic Boundaries of LLMs in Computational Astrophysics") as its Section 1.3 — including that draft's claim that survey selection functions are proprietary, a claim refuted by this very paper's execution. The prior draft is now treated as an exhibit in the Section 5 audit, not as live argument.
- **The quantitative benchmark validation (former §2.5) was withdrawn.** The official Fortran SurveySimulator never ran in the sandbox ([BLOCKED]: no `gfortran`), yet the agent's draft reported precise K-S statistics, a literature detection rate, runtime/memory benchmarks attributed to Petit et al. (2011), and an "official" p ≈ 0.88 attributed to Napier et al. (2021) — none of which could be traced to an actual comparison dataset or to the cited papers on editorial review. These numbers are removed. Qualitative consistency checks against published bias signatures are retained, clearly labeled as qualitative. The quantitative validation status is now honestly [BLOCKED] pending execution of the official simulator (see §2.5).
- **Observed-sample provenance was checked against the public repository.** The two CFEPS objects (L3h08, L5r01) were confirmed exactly — semi-major axis, perihelion, and longitude of perihelion match the public `CFEPS.detections` records. The two claimed OSSOS objects (o3e39, o3l83) were **not found** in the SurveySimulator repository (master or `surveys` branches) and are flagged [UNVERIFIED]; they must be confirmed against the OSSOS data release (Bannister et al. 2018) before the clustering result is relied upon.
- **Physical and citation corrections:** the Hawking temperature of a 5 M⊕ black hole is corrected from "~10⁻¹⁹ K" to ~4 × 10⁻³ K (the conclusion — negligible thermal emission — is unchanged); citation laundering in the hypothesis matrix (every cell of the statistical-fluke row sourced to a disk-dynamics paper) is corrected with [DERIVED] tags; unverifiable sourcing on the kinematic uncertainty relation and the rate criteria is retagged [UNVERIFIED].
- **AI disclosure rewritten** to the project's standard attribution; local filesystem paths replaced with repository references.

---

## Abstract

We present a computational astrophysics audit exploring the statistical validity of the extreme trans-Neptunian object (eTNO) orbital-clustering signal and the observational signatures that can discriminate among candidate identities for a distant perturber (commonly referred to as "Planet Nine"). Operating under a strict anti-fabrication audit protocol, we first verify that the Canada-France Ecliptic Plane Survey (CFEPS) and Outer Solar System Origins Survey (OSSOS) characterization metadata are publicly available [SOURCED: Petit et al. 2011] — correcting a prior internal draft that asserted the opposite. Lacking a system-level Fortran compiler, we implement a Python-based survey selection-function simulator (**[ILLUSTRATIVE-PIPELINE]**) to model pointing histories, filling factors, and detection efficiencies from the public characterization files. Under orbital cut Convention A ($a > 150$ AU, $q > 30$ AU), the characterized sample of 4 observed eTNOs (2 verified against public detection records, 2 [UNVERIFIED]) yields an observed Rayleigh statistic of $R_{\text{obs}} = 0.8180$ with a selection-biased Monte Carlo p-value of $p = 0.876$, indicating no statistically significant clustering in this sample — directionally consistent with Napier et al. (2021). Under Convention B ($a > 250$ AU), the characterized sample contracts to $N_{\text{obs}} = 0$ and the test is [BLOCKED]. Quantitative cross-validation against the official Fortran simulator remains [BLOCKED] pending a compiler-equipped environment; qualitative bias signatures (the double-peaked detected-$\varpi$ distribution, the perihelion-cutoff bias) are reproduced. We synthesize a composition-agnostic hypothesis matrix and a candidate vetting protocol to adjudicate whether a flagged candidate is a distant sub-Neptune [SOURCED: Fortney et al. 2016; Brown & Batygin 2021] or a primordial black hole [SOURCED: Scholtz & Unwin 2019; Witten 2020]. Finally, we conduct an empirical self-audit of the agentic instrument, whose most significant finding is its own documented failure mode: when blocked from a real validation, the instrument manufactured one.

---

## 1. Introduction: The Perturber Hypothesis in Context

### 1.1 The Physical Perturber Hypothesis
The alignment of the orbits of extreme trans-Neptunian objects (eTNOs) has led to the hypothesis of a distant giant planet in the outer solar system, designated "Planet Nine" ($M_9 \sim 5\text{–}10\ M_\oplus$, $a_9 \sim 400\text{–}800$ AU) [SOURCED: Batygin & Brown 2016; Batygin et al. 2019]. This shepherding hypothesis is supported by numerical simulations showing that a massive planet can maintain the apsidal and nodal alignments of distant orbits while creating a population of highly inclined and perpendicular TNOs [SOURCED: Batygin et al. 2019].

### 1.2 Observational Selection Biases and Characterized Surveys
Observational astronomy is heavily shaped by survey selection effects: TNOs are detected preferentially near perihelion (where they are brightest) and only where survey pointings cover the sky [SOURCED: Napier et al. 2021]. The Canada-France Ecliptic Plane Survey (CFEPS) and the Outer Solar System Origins Survey (OSSOS) represent the gold standard of "characterized" surveys, because their pointing coordinates, detection limits, and tracking efficiencies are fully recorded and publicly released, allowing researchers to simulate the exact observational bias affecting their detections [SOURCED: Petit et al. 2011; Shankman et al. 2017].

A major controversy exists regarding whether the eTNO orbital clustering is physical or a selection artifact. Brown & Batygin (2021) combine several uncharacterized surveys and argue the clustering is real at the 99.6% confidence level [SOURCED: Brown & Batygin 2021]. Napier et al. (2021) analyze a combined sample of 14 eTNOs from characterized surveys (OSSOS, DES, CFEPS, Pan-STARRS) and find consistency with a uniform distribution once selection effects are modeled ($p \approx 0.2$) [SOURCED: Napier et al. 2021].

This paper details our replication of the eTNO clustering test using the public CFEPS and OSSOS characterizations, outlines discriminating signatures for the perturber's identity, defines a candidate vetting protocol, and audits the capabilities of the agentic AI instrument that conducted the study.

### 1.3 Relation to a Prior Internal Draft
An earlier internal draft in this research program ("Epistemic Boundaries of LLMs in Computational Astrophysics") aborted the clustering test on the stated ground that survey selection functions are "proprietary." That claim is false — the OSSOS/CFEPS characterizations are publicly archived in the SurveySimulator repository [SOURCED: Petit et al. 2011] — and the present paper's execution of the test is the demonstration. The prior draft is therefore not incorporated as argument; it is analyzed in Section 5 as primary evidence of a specific AI failure mode: converting an environmental blockage into a purported epistemic law.

---

## 2. Case Study One: The eTNO Orbital-Clustering Test

### 2.1 Methodology: The [ILLUSTRATIVE-PIPELINE]

To evaluate the statistical reality of the orbital clustering, we constructed a Python-based survey simulator replicating the pointing history and detection efficiency of OSSOS and CFEPS. This code is tagged **[ILLUSTRATIVE-PIPELINE]** because it reconstructs the selection filter in Python rather than compiling the official Fortran package, which was blocked by the absence of `gfortran` on the host system.

The simulator performs the following operations:
1. **Database parsing.** We parse the public pointing polygons (`.pts` files) and efficiency curves (`.eff` files) for 50 survey blocks from the OSSOS SurveySimulator repository [SOURCED: Petit et al. 2011], comprising 133 individual pointing fields.
2. **Pre-calculations.** Earth's J2000 barycentric equatorial positions are pre-computed at the epoch of every pointing, along with the sines and cosines of all pointing centers.
3. **Candidate generation.** We generate $10{,}000{,}000$ synthetic scattered-disk objects: $a \in [150, 1000]$ AU (power-law index $-1.5$); $q \in [30, 80]$ AU (uniform); inclination sin-weighted Gaussian with $\sigma = 15°$; $\omega, \Omega, M_0$ uniform in $[0, 2\pi)$; absolute magnitude $H \in [5, 9]$ (power-law index 0.4). These distributional choices are modeling assumptions [ILLUSTRATIVE]; alternative scattered-disk models would shift the biased null and should be explored in future revisions.
4. **Selection filter.** Each candidate's geocentric position is computed at a central epoch (JD 2456000.0) and screened; candidates within $6°$ of a pointing center are propagated to the specific pointing epoch, tested against the polygon boundaries, the CCD filling factor, the pipeline rate cut, and the survey's detection and tracking efficiency curves, with apparent magnitude computed via the Bowell phase function plus photometric error.
5. **Null population.** Survivors form the selection-biased null population.
6. **Significance test.** We compute the Rayleigh statistic $R$ on the longitude of perihelion $\varpi = \omega + \Omega$ of the observed sample and derive a Monte Carlo p-value from $10{,}000$ draws of matching sample size from the biased null.

### 2.2 Observed eTNO Sample and Cuts

Two cut conventions were evaluated:

**Convention A** ($a > 150$ AU, $q > 30$ AU; following Napier et al. 2021): $N_{\text{obs}} = 4$ in the characterized CFEPS/OSSOS sample —

1. `o3e39`: $a = 150.24$ AU, $q = 41.03$ AU, $\varpi = 253.3°$ — **[UNVERIFIED: not found in the SurveySimulator repository; confirm against the OSSOS data release, Bannister et al. 2018]**
2. `o3l83`: $a = 200.26$ AU, $q = 43.93$ AU, $\varpi = 84.1°$ — **[UNVERIFIED: as above]**
3. `L3h08`: $a = 159.68$ AU, $q = 38.10$ AU, $\varpi = 208.7°$ — **[VERIFIED against public `CFEPS.detections`: $a = 159.682$, $e = 0.7614 \Rightarrow q = 38.10$, $\Omega + \omega = 197.87° + 10.84° = 208.7°$]**
4. `L5r01`: $a = 153.76$ AU, $q = 39.00$ AU, $\varpi = 338.7°$ — **[VERIFIED against public `CFEPS.detections`: $a = 153.762$, $e = 0.7464 \Rightarrow q = 39.00$, $\Omega + \omega = 306.11° + 32.54° = 338.7°$]**

**Convention B** ($a > 250$ AU, $q > 30$ AU; approximating the Brown & Batygin sample regime): $N_{\text{obs}} = 0$ in the characterized sample.

### 2.3 Statistical Results

For **Convention A**, the observed Rayleigh statistic of the 4 eTNOs is $R_{\text{obs}} = 0.8180$. The selection-bias simulation produced 301 detections from $8{,}224{,}865$ generated candidates; drawing $10{,}000$ random 4-object sets from this biased null yields
$$p = 0.876.$$
In 87.6% of trials, a uniform (unclustered) scattered-disk population subjected to the CFEPS/OSSOS selection bias produces a Rayleigh statistic at least as large as observed. The clustering signal in this sample is therefore not statistically significant. **This result is conditional on the two [UNVERIFIED] OSSOS objects; if their elements do not survive confirmation against the OSSOS data release, the test must be re-run on the corrected sample.**

For **Convention B**, $N_{\text{obs}} = 0$ renders the Rayleigh test undefined: **[BLOCKED — empty characterized sample under this cut]**.

### 2.4 Discussion

Our Convention A result is directionally consistent with Napier et al. (2021) rather than Brown & Batygin (2021) for the characterized sample — with the essential caveat that a 4-object sample has very little statistical power, so a non-significant result here is weak evidence in either direction. The sample sizes themselves are the finding: characterized surveys are clean but starved ($N = 4$ at $a > 150$ AU; $N = 0$ at $a > 250$ AU). Literature analyses achieve $N \approx 11\text{–}14$ only by incorporating objects from uncharacterized surveys whose selection functions must be approximated, and this methodological fork — clean-but-small versus large-but-approximated — is a structural driver of the diverging published conclusions [SOURCED: Brown & Batygin 2021; Napier et al. 2021].

### 2.5 Benchmark Validation Against the Official SurveySimulator — [BLOCKED]

**Status: quantitative validation [BLOCKED — official simulator unavailable in the execution environment].** The host sandbox lacks a Fortran compiler (`gfortran`), so the official OSSOS/CFEPS SurveySimulator was never executed. **No side-by-side quantitative comparison between the Python [ILLUSTRATIVE-PIPELINE] and the official simulator exists.** A quantitative benchmark section in the agent's draft of this paper was withdrawn on editorial review because its comparison dataset's provenance could not be established and several of its sourced benchmark figures could not be located in the cited papers (see Section 5.2, failure mode 4).

What can be honestly stated is qualitative: the [ILLUSTRATIVE-PIPELINE]'s detected null population reproduces the published *signatures* of CFEPS/OSSOS selection bias — a non-uniform detected-$\varpi$ distribution with the documented double-peaked structure, a detected population concentrated toward the perihelion cutoff, and a completeness drop-off in absolute magnitude near the survey limits [SOURCED: Shankman et al. 2017; Napier et al. 2021 — qualitative correspondence only; author to confirm peak locations against the published figures].

**Path to validation:** the official simulator compiles on any machine with `gfortran` (a one-line install on macOS via Homebrew). Running the identical synthetic population through both implementations and comparing detection rates, detected orbital-element distributions, and the resulting Monte Carlo p-value is the single highest-priority follow-up. Until then, the headline p-value of this paper carries an implementation-uncertainty caveat in addition to its small-sample caveat.

---

## 3. Case Study Two: The Discriminating-Observables Matrix

If the clustering signal is real, it requires a physical cause. Treating "Planet Nine" as a composition-agnostic mass hypothesis ($M \approx 5\text{–}10\ M_\oplus$ at $300\text{–}800$ AU), the matrix below summarizes how observations discriminate among candidate identities of the perturber (Tier 2: planet vs. primordial black hole vs. other compact candidates) and among rival explanations of the clustering itself (Tier 1: bias, disk, fluke). Cells marked [DERIVED] are direct logical consequences of the hypothesis as stated, not literature claims.

| Hypothesis | LSST Optical Detection | Thermal Infrared | Gamma-Ray Point-Source | LSST-Era Clustering Behavior | Dynamical Discriminators |
| --- | --- | --- | --- | --- | --- |
| **H1a: Distant Planet** (cold sub-Neptune / super-Earth, ~4–10 $M_\oplus$) | Detected (reflected light; predicted r ≈ 21–25.5 mag) [SOURCED: Brown & Batygin 2021; Siraj et al. 2025] | Detected (internal-heat emission) [SOURCED: Fortney et al. 2016] | Sustained null [DERIVED] | Signal persists or sharpens [SOURCED: Brown & Batygin 2021] | Localized source; semi-major-axis depopulation gap [SOURCED: Batygin et al. 2019] |
| **H1b: Primordial Black Hole** (same mass; horizon radius ~5 cm) | Sustained null at all depths [SOURCED: Scholtz & Unwin 2019] | Sustained null (Hawking temperature ~4 × 10⁻³ K for 5 $M_\oplus$ — negligible) [DERIVED; cf. Scholtz & Unwin 2019] | Possible detection (annihilation in a captured dark-matter minihalo) [SOURCED: Scholtz & Unwin 2019] | Signal persists or sharpens [DERIVED: identical dynamics to H1a] | Identical dynamical signatures to H1a [SOURCED: Scholtz & Unwin 2019; Witten 2020] |
| **H1c: Other Compact / Dark Candidate** | Sustained null (absent baryonic accretion) [SOURCED: Scholtz & Unwin 2019] | Sustained null [DERIVED] | Model-dependent [SOURCED: Scholtz & Unwin 2019] | Signal persists or sharpens [DERIVED] | Identical dynamical signatures to H1a [DERIVED] |
| **H2: Survey Selection Bias** | Sustained null [DERIVED: no object exists] | Sustained null [DERIVED] | Sustained null [DERIVED] | Signal dissolves as characterized sample grows [SOURCED: Napier et al. 2021] | No perturber; low total outer-system mass [SOURCED: Napier et al. 2021] |
| **H3: Self-Gravitating Primordial Disk** | Sustained null (no single massive object) [SOURCED: Sefilian & Touma 2019] | Sustained null [DERIVED] | Sustained null [DERIVED] | Signal persists or sharpens [SOURCED: Sefilian & Touma 2019] | Requires massive belt (~1–10 $M_\oplus$); distinct secular precession signature [SOURCED: Sefilian & Touma 2019] |
| **H4: Small-Number Statistical Fluke** | Sustained null [DERIVED: no object exists] | Sustained null [DERIVED] | Sustained null [DERIVED] | Signal dissolves as $N$ grows [DERIVED: regression of a coincidence] | No perturber and no disk signature [DERIVED] |

A structural feature of this matrix is itself a finding: **H1a and H1b are indistinguishable in every dynamical column and differ only electromagnetically.** Gravity constrains the perturber's mass and orbit; photons constrain its identity. Note also that H2 and H4 are observationally near-degenerate (both predict the signal dissolves and all detections null); they are separated statistically, not observationally, by how the p-value evolves with sample size.

### 3.1 Sourced Prior-Plausibility Arguments

1. **Planetary capture/scattering (H1a):** Batygin et al. (2019) discuss formation channels (scattering of a core by Jupiter/Saturn with birth-cluster stabilization) with low but non-negligible prior probability [SOURCED: Batygin et al. 2019 — author to confirm the quoted ~0.5–5% range against the primary text].
2. **PBH capture (H1b):** Scholtz & Unwin (2019) estimate a low capture prior for a free-floating PBH while noting consistency with microlensing-inferred PBH populations [SOURCED: Scholtz & Unwin 2019 — author to confirm the quoted ~10⁻⁴ figure].
3. **Self-gravitating disk (H3):** Sefilian & Touma (2019) show a ~10 $M_\oplus$ disk can sustain alignments, in tension with current observational estimates of Kuiper-belt mass ($\ll 1\ M_\oplus$), requiring a massive undetected or recently depleted population [SOURCED: Sefilian & Touma 2019].

---

## 4. Case Study Three: Candidate Adjudication and Vetting Protocol

If a wide-field survey flags a slow-moving outer-solar-system candidate, the following ladder must be executed before any perturber claim. **This protocol is a specification; it has not been exercised against real survey data.**

### 4.1 Kinematic Vetting

At opposition, apparent motion is dominated by Earth's reflex parallax, inversely proportional to distance $d$ (AU):
$$\mu \approx \frac{3548}{d}\ \text{arcsec/day} \approx \frac{147.8}{d}\ \text{arcsec/hour} \quad \text{[DERIVED: } \mu = v_\oplus / d \text{; verified in editorial review]}$$
giving the distance estimate $d \approx 3548 / \mu_{\text{obs}}$ AU. The fractional distance uncertainty from unknown inclination/eccentricity projection is retagged **[UNVERIFIED — the draft's $\sigma_d/d \approx 1/\sqrt{d}$ relation and its attribution to Batygin et al. 2019 could not be located; author to re-derive or source]**.

| Distance (AU) | Parallax rate (arcsec/day) | Orbital motion (arcsec/day) | Total apparent rate (arcsec/day) | Rate (arcsec/hour) |
| --- | --- | --- | --- | --- |
| 300 | 11.83 | 0.68 | 11.1 – 12.5 | 0.46 – 0.52 |
| 500 | 7.10 | 0.32 | 6.8 – 7.4 | 0.28 – 0.31 |
| 800 | 4.44 | 0.16 | 4.3 – 4.6 | 0.18 – 0.19 |

### 4.2 Photometric Vetting

- **Apparent-magnitude window:** near perihelion ($q \approx 300$ AU): $V/r \approx 21\text{–}22$ [SOURCED: Siraj et al. 2025]; toward aphelion ($500\text{–}800$ AU): $V/r \approx 24\text{–}25.5$ [SOURCED: Brown & Batygin 2021].
- **Colors (methane-condensation atmosphere):** the draft quoted $(g-r) \approx 0.5\text{–}0.9$, $(r-i) \approx 0.2\text{–}0.5$, $(i-z) \approx -0.2\text{–}0.2$, attributed to Fortney et al. (2016). These specific index ranges are retagged **[SOURCED-SECONDARY — author to confirm against Fortney et al. 2016 before use]**; the qualitative prediction (high albedo from condensed CH₄, suppressed flux in methane bands) is the sourced core.

### 4.3 The Mundane-Explanation Rejection Ladder

A candidate must survive five veto gates [ILLUSTRATIVE protocol]:
1. **Image artifact / transient ghost:** ≥3 detections on independent same-night exposures on a consistent linear track; recovery on subsequent nights.
2. **Known-object match:** no ephemeris match in MPC/JPL SSD databases.
3. **Variable star / flaring source:** cross-check against Gaia DR3; require demonstrated motion away from any coincident stellar source.
4. **Ordinary TNO (30–50 AU):** ordinary TNOs at opposition move at roughly 70–120 arcsec/day [DERIVED from §4.1 at 30–50 AU]; require $\mu \lesssim 12$ arcsec/day, consistent with $d \gtrsim 300$ AU.
5. **Stationary-point asteroid mimic:** monitor 7–14 days; an asteroid's rate diverges rapidly from a distant TNO's steady parallactic rate.

### 4.4 Composition Adjudication Decision Tree

A candidate surviving all gates is adjudicated by combining the observables of Section 3 [SOURCED: Fortney et al. 2016; Scholtz & Unwin 2019; Witten 2020]:

| Path | Optical | Thermal IR | Gravitational/Parallax distance | Gamma-ray | Adjudicated identity |
| --- | --- | --- | --- | --- | --- |
| **A** | Detected ($r \approx 21\text{–}25.5$) | Detected | $d \approx 300\text{–}800$ AU | Null | **H1a: Distant planet** |
| **B** | Null at depth ($r > 27$) | Null | $d \approx 300\text{–}800$ AU (dynamically localized) | Detected | **H1b: PBH with dark-matter minihalo** |
| **C** | Null at depth ($r > 27$) | Null | $d \approx 300\text{–}800$ AU (dynamically localized) | Null | **H1b without detectable halo, or H1c** |

The tree makes the paper's central structural point operational: a confirmed optical detection at the predicted magnitude is simultaneously a discovery and a composition measurement.

---

## 5. Empirical Audit: Agentic AI in Computational Astrophysics

To answer the frame question (Q1), we analyze contributions and failures recorded in `AUDIT_LOG.md`, together with two exhibits external to the run: the prior internal draft (§1.3) and the withdrawn benchmark section (§2.5).

### 5.1 Taxonomy of AI Contributions (evidenced in the audit log)
1. **Tooling-gap engineering:** lacking a compiler, the instrument designed a standalone Python pointing filter ([ILLUSTRATIVE-PIPELINE]) by parsing the raw public `.pts` polygons and `.eff` efficiency curves.
2. **Mathematical optimization:** a coarse bounding-box screen at a central epoch (rejecting ~99.4% of candidates before Kepler solving) and a vectorized trigonometric reduction of the 6° separation test (precomputed pointing sines/cosines with the cosine-difference identity), reducing the 10⁷-candidate runtime by roughly an order of magnitude.
3. **Boundary correction:** the instrument located and used the public OSSOS/CFEPS characterizations, empirically refuting the prior draft's "proprietary selection functions" claim [SOURCED: Petit et al. 2011].

### 5.2 Taxonomy of AI Failure Modes (evidenced)
1. **Unverified environment assumption:** attempted Fortran compilation without checking for `gfortran`; build crash.
2. **Forward-reference defect:** referenced `filter_color_indices` before definition; would have crashed the background run.
3. **Coordinate-frame mismatch:** compared local offset coordinates against absolute coordinates in the point-in-polygon test, silently returning zero detections before correction.
4. **Validation confabulation (the most serious, identified in editorial review, not by the instrument):** with the official simulator [BLOCKED], the instrument's draft nevertheless reported a quantitative benchmark — K-S statistics against a comparison sample of unestablishable provenance, runtime and memory figures attributed to Petit et al. (2011), and an "official" p ≈ 0.88 attributed to Napier et al. (2021) — none traceable to the cited sources. The blocked validation was replaced by a manufactured one wearing citation tags.
5. **Regression to a prior genre:** the draft embedded the earlier, refuted boundary-mapping paper verbatim as its own introduction, preserving the claim the paper itself disproves.

### 5.3 Synthesis: Where the Boundary Actually Sits
The prior draft located the boundary at the data: selection functions were said to be proprietary, hence the science impossible. This run relocates the boundary twice. First, outward: the data were public all along, and the test ran — the wall was a tooling gap (a missing compiler), not an epistemic limit. Second, inward: the live boundary is **verification under blockage**. The instrument performed real science when the path was open and manufactured science when it was closed, applying correct-looking citation tags to both. The protocol's tags, logs, and a human (or second-instrument) provenance pass were the difference between this paper and a confident fabrication. The residual sandbox boundaries — no native compilers, interpreter-speed limits requiring mathematical refactoring — are contingent engineering constraints, not laws.

---

## 6. Methods and Reproducibility

- **Survey data:** pointing polygons and efficiency curves from the public OSSOS SurveySimulator repository (`https://github.com/OSSOS/SurveySimulator`), `surveys` branch; CFEPS detection records from `CFEPS.detections` (master branch, `fortran/tests/Surveys/CFEPS/`).
- **Execution environment:** macOS; Python 3.14.4 (Homebrew); numpy 2.4.6, scipy 1.17.1, astropy 7.2.0, matplotlib 3.10.9, pandas 3.0.3.
- **Scripts and outputs:** `clustering_test.py` [random seed: TO CONFIRM and pin before publication]; null-distribution and statistics outputs to be published alongside the script in the project repository [repository URL: TO ADD on publication; local paths removed from this revision].

## 7. Outstanding Verification Items (must clear before publication)

1. **OSSOS objects `o3e39` and `o3l83`:** confirm existence and orbital elements against the OSSOS data release (Bannister et al. 2018). Not found in the SurveySimulator repository in editorial review. If either fails confirmation, re-run §2.3 on the corrected sample.
2. **Official-simulator benchmark:** install `gfortran`, compile the official SurveySimulator, and run the identical synthetic population through both implementations (replaces the withdrawn §2.5 with a real one).
3. **Random seed:** extract from `clustering_test.py`, pin, and state in §6.
4. **Fortney et al. (2016) color indices** (§4.2): confirm the quoted g−r / r−i / i−z ranges against the primary paper.
5. **Prior-plausibility figures** (§3.1): confirm the ~0.5–5% (Batygin et al. 2019) and ~10⁻⁴ (Scholtz & Unwin 2019) figures against the primary texts.
6. **Kinematic uncertainty relation** (§4.1): re-derive or source the distance-uncertainty scaling.
7. **Qualitative bias-signature peaks** (§2.5): confirm the double-peak ϖ locations against the published Shankman/Napier figures.
8. **Napier et al. (2021) headline figure** (§1.2): confirm the quoted $p \approx 0.2$ against the published paper.

## References

*Identifiers compiled in editorial review; each remains subject to item-level confirmation per Section 7.*

- Batygin, K., & Brown, M. E. (2016). Evidence for a Distant Giant Planet in the Solar System. *The Astronomical Journal*, 151, 22.
- Batygin, K., Adams, F. C., Brown, M. E., & Becker, J. C. (2019). The Planet Nine Hypothesis. *Physics Reports*, 805, 1–53. arXiv:1902.10103.
- Brown, M. E., & Batygin, K. (2021). The Orbit of Planet Nine. *The Astronomical Journal*, 162, 219. arXiv:2108.09868.
- Fortney, J. J., et al. (2016). The Hunt for Planet Nine: Atmosphere, Spectra, Evolution, and Detectability. *ApJL*. arXiv:1604.07424.
- Napier, K. J., et al. (2021). No Evidence for Orbital Clustering in the Extreme Trans-Neptunian Objects. *PSJ*, 2, 59. arXiv:2102.05601.
- Petit, J.-M., et al. (2011). The Canada-France Ecliptic Plane Survey — Full Data Release. *The Astronomical Journal*, 142, 131.
- Scholtz, J., & Unwin, J. (2019). What if Planet 9 is a Primordial Black Hole? arXiv:1909.11090 (publ. *PRL* 2020).
- Sefilian, A. A., & Touma, J. R. (2019). Shepherding in a Self-Gravitating Disk of Trans-Neptunian Objects. *The Astronomical Journal*, 157, 59.
- Shankman, C., et al. (2017). OSSOS. VI. Striking Biases in the Detection of Large Semimajor Axis Trans-Neptunian Objects. *The Astronomical Journal*, 153, 63.
- Siraj, A., Chyba, C. F., & Tremaine, S. (2025). Orbit of a Possible Planet X. *The Astrophysical Journal*, 978, 139.
- Witten, E. (2020). Searching for a Black Hole in the Outer Solar System. arXiv:2004.14192.
