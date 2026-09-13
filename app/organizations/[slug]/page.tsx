import { withPageSeo } from "../../../lib/seo";
import { notFound } from "next/navigation";
import { getCatalog } from "../../../lib/catalog";
import { OrganizationProfile } from "../../components/OrganizationProfile";
import type { Metadata } from "next";
export const revalidate = 60;
export async function generateStaticParams() { return (await getCatalog("organizations")).map(row => ({ slug: row.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug: string}> }): Promise<Metadata> {
  const { slug } = await params; const row = (await getCatalog("organizations")).find(item => item.slug === slug);
  return row ? withPageSeo({title: row.title, description: row.summary, alternates: {canonical: `/organizations/${row.slug}`}, openGraph: {type: "article"}}) : {};
}
export default async function Page({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params; const row = (await getCatalog("organizations")).find(item => item.slug === slug); if (!row) notFound();
  return <OrganizationProfile title={row.title} summary={row.summary} tags={row.tags} info={row.info} logoUrl={row.logoUrl}/>;
}
