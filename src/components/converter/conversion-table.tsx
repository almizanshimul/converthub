import { convert, formatResult } from "@/lib/converters/engine";

const SAMPLE_VALUES = [1, 5, 10, 25, 50, 100, 500, 1000];

interface ConversionTableProps {
  categorySlug: string;
  fromCode: string;
  toCode: string;
  fromFactor: number | null;
  toFactor: number | null;
  fromLabel: string;
  toLabel: string;
  precision: number;
  title: string;
}

export function ConversionTable({ categorySlug, fromCode, toCode, fromFactor, toFactor, fromLabel, toLabel, precision, title }: ConversionTableProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2 font-medium">{fromLabel}</th>
              <th className="px-4 py-2 font-medium">{toLabel}</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_VALUES.map((value) => (
              <tr key={value} className="border-t border-border">
                <td className="px-4 py-2">{value.toLocaleString("en-US")}</td>
                <td className="px-4 py-2">
                  {formatResult(convert({ value, fromCode, toCode, fromFactor, toFactor, categorySlug }), precision)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
