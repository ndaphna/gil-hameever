# gil-hameever — Project Context

## What This Is
A digital brand for Hebrew-speaking women 50+ in Israel, built around the perimenopause/menopause experience. Core product: a SaaS platform where subscribers log symptoms and receive personalized AI-driven insights.

**Market:** Women in Israel, 50+, Hebrew-speaking.
**Model:** [FILL IN — subscription / freemium / etc.]

---

## Brand Personas

### Inbal / הגיבורה (The Heroine)
The core brand voice. Empowering, practical, "fellow explorer" — never a guru or all-knowing expert. Speaks directly to the lived experience of women in their 50s. Used across content, newsletters, and the main product interface.

### Aliza / עליזה
The comedic alter-ego. Chronically overwhelmed by life and technology (visually depicted lying on the floor in a "starfish" pose). She is also the AI Agent inside the SaaS product.

**Aliza Agent — System Skills:**
- Reads subscriber symptom data from Supabase (logged via the SaaS).
- Analyzes patterns and reflects back a personalized perimenopause/menopause status summary.
- Responds as a peer ("a friend who already went through it") — NOT as a medical professional.
- **Hard constraint:** NEVER frames output as medical advice, diagnosis, or treatment.
- Must include appropriate disclaimer language in all health-related responses.
- Always recommends consulting a doctor for medical decisions.

---

## Tech Stack
| Layer | Tools |
|---|---|
| Backend / AI | Node.js, Supabase (DB + Auth), OpenAI API (Agents + Function Calling) |
| Frontend | Next.js (React), Custom CSS / CSS Modules — no Tailwind |
| DevOps | GitHub, Vercel |
| Automation | Make.com, Airtable, Notion, Manus |
| Marketing | Meta Campaigns, Brevo (newsletters), ManyChat (Messenger/IG flows), CapCut, Descript |

**Key constraints:**
- All UI must be RTL (`dir="rtl"`) and mobile-first.
- Supabase RLS is mandatory on all tables touching user data.
- GDPR + Israeli Privacy Law compliance required.
- No PII exposure; secure API key management throughout.

---

## Active Workstreams
| Workstream | Status | Notes |
|---|---|---|
| SaaS Platform | Active | Symptom tracker with Aliza AI Agent |
| Aliza Agent Training | Active | OpenAI agent — symptom analysis + persona |
| Meta Ad Campaigns | Active | Paid acquisition |
| Email System (Brevo) | Active | Newsletter + automated flows |
| ManyChat Flows | Active | Messenger/Instagram automations |

---

## Key Decisions & Architecture Notes
- **CSS approach:** Custom CSS Modules only. Tailwind explicitly excluded unless requested.
- **Agent persona / medical advice:** Aliza must remain distinct from medical advice at all times — legal risk.
- **Manus** is part of the automation layer for multi-step agent tasks.
