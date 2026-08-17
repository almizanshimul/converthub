import { convertCurrency, type CurrencyOption } from "@/lib/currency";

const SAMPLE_VALUES = [1, 5, 10, 25, 50, 100, 500, 1000];

interface CurrencyConversionTableProps {
  from: CurrencyOption;
  to: CurrencyOption;
  title: string;
}

export function CurrencyConversionTable({ from, to, title }: CurrencyConversionTableProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div dir="ltr" className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2 font-medium">
                {from.code} ({from.symbol})
              </th>
              <th className="px-4 py-2 font-medium">
                {to.code} ({to.symbol})
              </th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_VALUES.map((value) => (
              <tr key={value} className="border-t border-border">
                <td className="px-4 py-2">{value.toLocaleString("en-US")}</td>
                <td className="px-4 py-2">{convertCurrency(value, from, to).toLocaleString("en-US", { maximumFractionDigits: 4 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
