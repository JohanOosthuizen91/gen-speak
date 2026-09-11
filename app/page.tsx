import { Translator } from "./translator";
import { Glossary } from "./glossary";
import { GENERATIONS } from "@/lib/generations";
import { SITE_NAME, SITE_DESCRIPTION, siteUrl } from "@/lib/site";

function StructuredData() {
  const url = siteUrl();
  const graph = [
    {
      "@type": "WebApplication",
      "@id": `${url}/#app`,
      name: SITE_NAME,
      url,
      description: SITE_DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: GENERATIONS.map((g) => `${g.label} slang translation`),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: [
        ["Is the generational translator free?", "Yes. There is no sign-up, no account and no payment."],
        [
          "Which generations can it translate between?",
          "Gen Alpha, Gen Z, Millennial, Gen X and Boomer. You write in plain English and pick the voice you want back.",
        ],
        [
          "Is the slang accurate?",
          "It is exaggerated on purpose. Treat the output as a joke rather than a phrasebook.",
        ],
        [
          "Does it work the other way round?",
          "Not yet. It translates plain English into slang, rather than decoding slang back into plain English.",
        ],
      ].map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <Translator>
        <Glossary />
      </Translator>
    </>
  );
}
