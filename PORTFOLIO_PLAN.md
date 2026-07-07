# Portfolio Plan — honest analysis and roadmap

Written from the perspective of "would I hire this person into a mechanical /
manufacturing / aerospace role after reading their site for 90 seconds?"

---

## 1. Is this portfolio worth keeping?

**Yes — but for a specific reason.** You are one of the small percentage of
mechanical engineering candidates who has *both* an active aerospace
manufacturing internship (Verus, Lead Intern) *and* real hands-on R&D
projects. The portfolio is worth keeping because it is the only place you
can tell that story on one page.

But right now the site is closer to "impressive design student"
than "engineer we should interview." That's fixable. The rest of this
document is the roadmap.

### The candidate-market read

Recruiters and engineering managers looking at MechE interns / new grads
scan for four things in the first 30 seconds:

1. **Do you own physical hardware?** (machining, GD&T, real fabrication, real
   inspection — not just CAD screenshots)
2. **Can you defend a design in a review?** (calculations, tolerance
   stack-ups, engineering justification)
3. **Have you shipped inside a real production environment?** (an
   internship at a real company > 100 hobby projects)
4. **Can you communicate technically?** (write-ups, drawings, data)

You already have raw material for all four. The site's job is to make that
material immediately visible without a scavenger hunt.

---

## 2. What the current portfolio does well

- **AppShell + design tokens.** After the last pass, chrome is coherent and
  no longer screams "vibe-coded portfolio template." That was doing you
  more damage than any missing project.
- **Range of technical breadth.** Coastal PIV, PCM vibration, mechatronics
  turret, thermal R&D, urban-systems research — few undergrad portfolios
  hit that many disciplines.
- **Military service framing.** The Navy → engineering pivot is your
  strongest interview opener, and the About page treats it correctly:
  ownership, safety, systems thinking.
- **AAR sections.** Showing "what went wrong / what I learned" is unusual
  and signals real engineering maturity. Keep it.

---

## 3. What is actively hurting you

These are ordered by severity — fix top to bottom.

### 3.1 The strongest credential is buried

Verus Aerospace (aerospace manufacturing, AS9102 FAI, Gulfstream over-check,
Lead Intern, Ti/Inconel CNC exposure) is *the* thing an aerospace or
defense hiring manager cares about. Right now it lives inside a collapsed
Timeline card halfway down the page. **A recruiter should see the words
"Aerospace" and "AS9102" within one second of landing.**

Recommended fix (already scaffolded in this repo — see §5):

- Elevate Verus into the Hero as a status pill: **"Currently interning at
  Verus Aerospace · Aerospace Manufacturing & Quality."**
- Add a dedicated "Current internship" band above Projects on the Home
  page — one card, expanded by default, with the STAR-style bullets.
- Keep the collapsed Timeline entry for the rest of the story.

### 3.2 The Projects grid does not sell in the right order

Your projects range from "hands-on machining and GD&T" (multi-tool, gearbox)
to "speculative thermal materials framework" (BETH). For a job search, the
first three cards should map onto the highest-probability roles you'll
actually get hired into:

| Rank | Project              | Signals to a recruiter |
| ---- | -------------------- | ---------------------- |
| 1    | Verus Aerospace card | Production credentials |
| 2    | Multi-Tool           | GD&T + inspection + real machining |
| 3    | Reduction Gearbox    | Mechanical design + calcs + reviews |
| 4    | Turret               | Mechatronics + embedded |
| 5    | Vibration / PCM      | Experimental R&D + instrumentation |
| 6    | Coastal              | Fluid dynamics + PIV |
| 7    | BETH                 | R&D vision / theory |
| 8    | Micromobility        | Systems / policy translation |

This is now the default order. BETH is *not* a first-impression project —
it's a "how does this person think about the future" project. Right for
some interviews, wrong for the first card.

### 3.3 Case studies read like blog posts, not engineering write-ups

STAR format is now integrated (see §5) but this needs to become the
*load-bearing* structure on every page. Recruiters read the STAR block
and skim everything else. If STAR is thin, they leave.

Rule of thumb: **every case study opens with STAR, ends with AAR.** Body
in between = evidence.

### 3.4 There are missing "trust artifacts"

- **No PDF resume link is tested.** The Resume button exists but the file
  should be re-generated to match the site's ordering.
- **No GitHub link** on the site. Even if you don't push much, a link to
  your GitHub with a couple of pinned repos beats a black hole.
- **No downloadable engineering artifacts.** For the multi-tool and
  gearbox, plan to attach one PDF each: an inspection log for the
  multi-tool, a design-review deck (or annotated CAD PDF) for the
  gearbox. Recruiters love these because they prove the story.
- **No metric anchoring on the Home page.** The Hero stats (40+
  prototypes, 6+ years, 40% PIV, 10× damping) are good but generic.
  Add one aerospace-specific number: e.g. "AS9102 FAI activities
  supported · Multi-spindle Ti/Inconel exposure."

### 3.5 Two projects are still drafts

`fea-validation` and `beth` need more concrete evidence. See §7 for
priorities.

---

## 4. STAR method — how it's applied

**S — Situation.** The problem in one paragraph. Why does the project
exist? Who cares?

**T — Task.** Your specific slice of that problem. What were you
personally on the hook for?

**A — Action.** What YOU did. 3–6 bullets. Every bullet starts with a verb.
No passive voice. Concrete tools, methods, numbers.

**R — Result.** What actually changed. Numbers first. If the result is
"learned X" that's an AAR bullet, not a STAR result.

The site's `STARSection` primitive now renders this as a 2×2 grid near
the top of every project page. Multi-Tool and Gearbox are fully filled
in. The remaining projects have baseline STAR content that should be
refined once you have more time.

### STAR quality check — read every STAR block against this list

- [ ] **Situation** names a stakeholder and a real cost (dollars, safety,
      hours, defect rate). Not "this was a class project."
- [ ] **Task** is your slice, not the whole team's slice. Distinguish
      "the team designed X" from "I owned Y."
- [ ] **Action** bullets are ordered chronologically and use a
      consistent verb tense.
- [ ] **Action** bullets contain at least one tool name AND at least one
      number in each bullet where possible.
- [ ] **Result** bullets lead with a number or a state change. "Delivered
      X that hits Y at Z" beats "gained understanding of X."
- [ ] Nothing in STAR overlaps with the AAR block. AAR is reflection;
      STAR is claim.

---

## 5. Concrete changes already in this PR

- Ternary project fully removed (page, route, catalog, About reference).
- **Multi-Tool Fabrication** project added (`/projects/multitool`) with
  STAR, tolerance table, capability matrix, and media placeholders for
  two CNC videos + one final photo.
- **Reduction Gearbox** project added (`/projects/gearbox`) with STAR,
  design-calculation table, DFM band, and CAD-image placeholders.
- **Verus Aerospace internship** now leads the Timeline with the full
  bullet set from LinkedIn, Lead-Intern designation, and expanded
  metadata (AS9102, Infor VISUAL ERP, Ti/Inconel CNC, etc.).
- **STAR + AAR primitives** added to `src/shared/ui.jsx` and rendered
  on every project page.
- **STAR content backfilled** for Turret, Vibration, Coastal, BETH, and
  Micromobility so every case study opens with the same structure.
- **About page** rewritten to lead with the Verus internship story and
  reflects the new project mix.

---

## 6. Recommended next-cycle changes (not in this PR)

Ordered by impact.

### 6.1 Hero: aerospace-first framing (30 min)

- Replace `Available Summer 2026` status pill with:
  `Currently interning at Verus Aerospace · Aerospace Manufacturing & Quality`
- Add a second, smaller pill: `Available Summer 2026 · open to relocate`
- Swap `titleBottom` from `Mechanical Engineer / Builder` to
  `Mechanical Engineering · Aerospace-Focused`
- Update `site.hero.stats` to include one aerospace-anchored metric.

### 6.2 Home page: dedicated Internship band (1–2 h)

Add a section between `Manifesto` and `Projects` called `#internship`:

```
// Current Internship
Verus Aerospace — Lead Intern
[status pill] [dates]
[STAR-style summary card]
[Two callouts: AS9102 activities · Gulfstream over-check]
[CTA: View full timeline entry →]
```

This is the highest-ROI change on the entire site.

### 6.3 Trust artifacts

- **Add a GitHub link** to the Contact block and Footer socials.
- **Publish an updated resume PDF** whose section order matches the site
  (Internship → Projects → Education → Service).
- **Attach one downloadable artifact per project**:
  - Multi-Tool: inspection log (spreadsheet export → PDF).
  - Gearbox: annotated CAD PDF or design-review deck.
  - Coastal: PIV validation summary.
  - Vibration: bench notebook page or scope-trace export.

### 6.4 Media discipline

- Every project card should have a real cover image at 16:10, no text on
  it, no logo overlay. If a project doesn't have one yet, use a clean
  hero image of the finished object.
- Videos autoplay muted on hover only. Never on page load.
- Prefer photos of the finished object over CAD renders whenever both
  exist.

### 6.5 Content pipeline

- Move `TODO(alex)` comments in `src/content/projects.js` and
  `src/content/timeline.js` into a `PORTFOLIO_TODO.md` at the repo root
  so you can see all outstanding placeholders in one place.
- Add a `draft: true` filter to the Projects grid so DRAFT projects can
  be temporarily hidden from public view before an interview cycle.

### 6.6 Analytics + polish

- Add a lightweight analytics pixel (Plausible, Umami, or Vercel
  Analytics) so you can see which case studies recruiters actually read.
  Every follow-up decision should be data-driven.
- Add `og:image` meta tags per route so the site previews well when a
  recruiter shares your URL in Slack.
- Test on mobile Safari with reduced-motion enabled — this catches
  90% of production-only bugs.

---

## 7. Project-by-project honesty pass

### `multitool` — Multi-Tool Fabrication  🟢 keep, prioritize
Your strongest evidence for a manufacturing / quality role. This is
sitting first for a reason. Priority: drop the two CNC videos + final
photo + inspection spreadsheet as soon as possible.

### `gearbox` — Reduction Gearbox  🟢 keep
Your strongest evidence for a mechanical-design role. Team project, so
be honest about your specific contribution in the STAR "Task" field.
Priority: real CAD screenshots (assembly + exploded + section view).

### `turret` — 2-Axis Autonomous Turret  🟢 keep
Great mechatronics story with a real number (0.8° repeatability). No
changes needed short-term.

### `vibration` — PCM Vibration Rig  🟢 keep
Strong "novel material + custom instrumentation" story with a 10×
result. No changes needed short-term.

### `coastal` — Coastal Wave Dynamics  🟢 keep
Real published-ish work with a clear 40% number. Keep as-is.

### `beth` — BET-H  🟡 keep, reposition
This is the highest-ceiling *and* highest-risk project. It reads like a
theoretical framework, not a shipped thing. Two options:

- **Recommended:** reframe as "R&D vision" and move it to the second
  half of the Projects grid (done). Add one paragraph explicitly
  labeling it as a research proposal, not a claim.
- **Alternative:** run one bench experiment (a single instrumented
  PCM + graphite sample) and promote it back up. That's a semester of
  work, but it turns BETH from "theory" into "experiment."

### `micromobility` — Equity Study  🟢 keep, deemphasize
Great story, but doesn't map cleanly onto a MechE hire. Keep it — it
signals well-roundedness — but leave it toward the back.

### `fea-validation` — FEA vs. Ring-Down  🟡 keep as DRAFT
Right now this is a placeholder. Either:

- Run the ANSYS correlation and turn it into a real project, or
- Fold the "future work" note back into the Vibration page and remove
  this card until real data exists.

Don't leave `DRAFT` status projects on a public portfolio during an
active job hunt — they look like unfinished homework.

---

## 8. Interview / recruiter positioning

### 8.1 One-sentence positioning statement (use in every application)

> "Mechanical engineering student and Navy veteran currently interning
> at Verus Aerospace in aerospace manufacturing and quality — with
> hands-on machining, GD&T, and mechanical-design projects to match."

### 8.2 Which projects to lead with in which application

- **Aerospace / defense manufacturing intern**: lead with Verus + Multi-Tool.
- **Mechanical design intern**: lead with Gearbox + Turret.
- **R&D / advanced manufacturing intern**: lead with Vibration + Coastal.
- **Systems / policy / mission engineering**: lead with Micromobility +
  BETH.

Configure your resume per role. Do not send the same resume to all four.

### 8.3 What recruiters will ask about

Prepare a 90-second answer for each:

1. Walk me through the multi-tool — what tolerance was hardest to hold?
2. What did you personally own on the gearbox versus the team?
3. Describe one AS9102 FAI activity you supported at Verus.
4. Tell me about a time you found a non-conforming feature during an
   over-check inspection.
5. What was the biggest change you made to the Quality Clinic workflow?
6. Give me an example of applying GD&T outside of a class.

Every one of those maps onto content already on the site — the interview
is easier when the site did the heavy lifting.

---

## 9. Ship-list, in order

- [x] Remove ternary project (this PR).
- [x] Add Multi-Tool and Gearbox with STAR (this PR).
- [x] Add Verus Aerospace to Timeline (this PR).
- [x] Backfill STAR on existing projects (this PR).
- [x] Write this document (this PR).
- [ ] **Drop real assets** for Multi-Tool (`/public/projects/multitool-*`)
      and Gearbox (`/public/projects/gearbox-*`).
- [ ] **Add GitHub link** to Contact + Footer.
- [ ] **Regenerate resume PDF** to match site ordering.
- [ ] **Aerospace-first Hero rewrite** (§6.1).
- [ ] **Dedicated `#internship` band** on Home (§6.2).
- [ ] Downloadable engineering artifacts per project (§6.3).
- [ ] Analytics + og:image (§6.6).
- [ ] Decide on BETH repositioning; decide on FEA-Validation fate.

Working the top four items on the "not yet done" list will move this
portfolio from "well-designed student site" to "credible aerospace /
manufacturing candidate site." Everything below that is polish.
