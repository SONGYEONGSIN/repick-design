import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogWorks, type Work } from "@/lib/works";
import { getSpec } from "@/lib/specimen-specs";
import DetailClient from "./detail-client";

export function generateStaticParams(): { id: string }[] {
  return catalogWorks().map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = catalogWorks().find((w) => w.id === id);
  if (!work) return { title: "Specimen" };
  return { title: `${work.brand} — Specimen`, description: work.desc.en };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = catalogWorks();
  const work = all.find((w) => w.id === id);
  if (!work) notFound();
  const spec = getSpec(id) ?? null;
  const similar: Work[] = all
    .filter((w) => w.category === work.category && w.id !== work.id)
    .slice(0, 4);
  return <DetailClient work={work} spec={spec} similar={similar} />;
}
