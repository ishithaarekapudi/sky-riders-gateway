import { withPageSeo } from "../../../lib/seo";
import { notFound } from "next/navigation";
import { getCatalog } from "../../../lib/catalog";
import { DetailPage } from "../../components/DetailPage";
import type { Metadata } from "next";
export const revalidate = 60;
export async function generateStaticParams() { return (await getCatalog("scholarships")).map(row => ({ slug: row.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }): Promise<Metadata> {
  const { slug } = await params; const row = (await getCatalog("scholarships")).find(item => item.slug === slug);
  return row ? withPageSeo({title: row.title, description: row.summary, alternates: {canonical: `/scholarships/${row.slug}`}, openGraph: {type: "article"}}) : {};
}
export default async function Page({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params; const row = (await getCatalog("scholarships")).find(item => item.slug === slug); if (!row) notFound();
  return <DetailPage active="scholarships" kind="Scholarship" title={row.title} summary={row.summary} tags={[row.award, row.deadline && `Deadline: ${row.deadline}`, row.location, row.education, ...row.tags].filter(Boolean)} info={row.info} logoUrl={row.logoUrl} backHref="/scholarships"/>;
}
