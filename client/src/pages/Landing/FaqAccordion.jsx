import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Momentum est-il gratuit ?",
    answer: "Oui, Momentum est gratuit et pensé pour un usage personnel mono-utilisateur.",
  },
  {
    question: "Puis-je partager mes projets avec d'autres personnes ?",
    answer: "Non, Momentum est volontairement mono-utilisateur : chaque compte gère ses propres données, sans collaboration.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Vos données sont hébergées sur Supabase (PostgreSQL) avec authentification sécurisée et isolation stricte par utilisateur.",
  },
  {
    question: "Y a-t-il une application mobile ?",
    answer: "Momentum est une application web responsive, utilisable sur mobile, tablette et desktop directement depuis votre navigateur.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div id="faq" className="mx-auto max-w-2xl divide-y divide-text-secondary/10">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <h3>
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-text"
              >
                {faq.question}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isOpen && (
              <p id={`faq-panel-${index}`} className="pb-4 text-sm text-text-secondary">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
