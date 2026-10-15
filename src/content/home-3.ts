export const home3 = {
  title: "EMFI · Settle for less. Expect more.",
  hero: {
    headline: "Settle",
    headlineAccent: "For Less.",
    accentPrefix: "Less",
    accentWords: ["handovers.", "complexity.", "hassle."] as const,
    body: "Execute and custody for less, too.",
    primaryCta: "Discuss your requirements",
    secondaryCta: "Explore services",
  },
  expect: {
    title: "Expect more.",
  },
  direct: {
    title: "More direct.",
    body: "Client reaches Depository through Settlement agent, Sub-custodian and Custodian. EMFI then replaces those intermediaries, leaving Client, EMFI and Depository.",
    via: ["Settlement agent", "Sub-custodian", "Custodian"] as const,
    nodes: [
      { label: "Client", sub: "Instructions" },
      { label: "EMFI", sub: "One relationship" },
      { label: "Depository", sub: "Settlement" },
    ] as const,
  },
  responsive: {
    title: "More responsive.",
    cards: [
      {
        title: "Technology where it helps",
        body: "Technology provides the structure, visibility and control needed to handle established processes efficiently.",
      },
      {
        title: "People where judgement matters",
        body: "Experienced teams remain involved where a requirement needs context, coordination or human judgement.",
      },
    ] as const,
  },
  accountable: {
    title: "More accountable.",
    statements: ["One owner.", "Authorised & Regulated.", "Auditable."] as const,
    beliefs: [
      {
        title: "One relationship",
        body: "A clear relationship sits at the centre of the work, helping coordinate the relevant teams and services.",
      },
      {
        title: "Clear responsibility",
        body: "Defined responsibilities make it clear who is involved and who is responsible for progressing the work.",
      },
      {
        title: "Connected delivery",
        body: "The relationship continues across the relevant stages of the investment process, from instruction through to outcome.",
      },
    ] as const,
  },
  contact: {
    title: "Discuss your requirements.",
    fields: ["Name", "Company", "Work email"] as const,
    message: "What do you need help with?",
    submit: "Submit",
    success: "Thank you. The EMFI team will be in touch.",
  },
};
