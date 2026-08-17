import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [converters, calculators, countries, regions, blogPosts, languages] = await Promise.all([
    prisma.converter.count(),
    prisma.calculator.count(),
    prisma.country.count(),
    prisma.region.count(),
    prisma.blogPost.count(),
    prisma.language.count(),
  ]);

  const stats = [
    { label: "Converters", value: converters },
    { label: "Calculators", value: calculators },
    { label: "Countries", value: countries },
    { label: "States / Regions", value: regions },
    { label: "Blog Posts", value: blogPosts },
    { label: "Languages", value: languages },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your platform&apos;s content.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
