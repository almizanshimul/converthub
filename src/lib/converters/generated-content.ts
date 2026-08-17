import { convert, formatResult } from "./engine";
import { getFormulaDisplay } from "./formula-display";

export interface GeneratedFaqItem {
  question: string;
  answer: string;
}

export interface GeneratedContent {
  content: string;
  faq: GeneratedFaqItem[];
}

interface GenerateContentParams {
  categorySlug: string;
  categoryName: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  fromFactor: number | null;
  toFactor: number | null;
  precision: number;
}

// Every unit pair gets a real URL (see the converter page's synthetic-pair
// fallback), but only curated pairs get a hand-written article. This fills
// the gap with a short, genuinely-computed (not hallucinated) paragraph and
// FAQ built from the same conversion engine the widget itself uses, so an
// uncurated pair still reads as a real page instead of an empty shell.
export function generateConverterContent({
  categorySlug,
  categoryName,
  fromCode,
  fromName,
  toCode,
  toName,
  fromFactor,
  toFactor,
  precision,
}: GenerateContentParams): GeneratedContent {
  function convertValue(value: number): string {
    try {
      const raw = convert({ value, fromCode, toCode, fromFactor, toFactor, categorySlug });
      return formatResult(raw, precision);
    } catch {
      return "";
    }
  }

  const oneResult = convertValue(1);
  const tenResult = convertValue(10);
  const hundredResult = convertValue(100);
  const formula = getFormulaDisplay(categorySlug, fromCode, fromName, toCode, toName, fromFactor, toFactor);

  const paragraphs: string[] = [];
  paragraphs.push(
    `This page converts ${fromName} to ${toName}, two units of ${categoryName.toLowerCase()}.${
      oneResult ? ` 1 ${fromName} equals ${oneResult} ${toName}.` : ""
    } Enter any amount in the calculator above for an instant result, and use the swap button to convert the other direction.`,
  );
  if (tenResult && hundredResult) {
    paragraphs.push(
      `For quick reference: 10 ${fromName} equals ${tenResult} ${toName}, and 100 ${fromName} equals ${hundredResult} ${toName}. The underlying formula is ${formula}.`,
    );
  }

  const faq: GeneratedFaqItem[] = [
    {
      question: `How do you convert ${fromName} to ${toName}?`,
      answer: `Use the formula ${formula}.${oneResult ? ` For example, 1 ${fromName} equals ${oneResult} ${toName}.` : ""}`,
    },
    {
      question: `How many ${toName} are in 1 ${fromName}?`,
      answer: oneResult ? `1 ${fromName} equals ${oneResult} ${toName}.` : `Enter 1 into the calculator above to see the exact result.`,
    },
    {
      question: `Is this ${fromName} to ${toName} conversion accurate?`,
      answer: `Yes — this calculator uses standard, precise conversion factors. Results above are rounded to ${precision} decimal places for readability; for applications that need more precision, use the exact formula: ${formula}.`,
    },
  ];

  return { content: paragraphs.join("\n\n"), faq };
}
