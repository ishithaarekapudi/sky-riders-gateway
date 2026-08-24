import { notFound } from "next/navigation";
import { OrganizationProfile } from "../../components/OrganizationProfile";
import { organizations, slugify } from "../../content";
import { organizationDetails } from "../../detail-content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return organizations.map(([title])=>({slug:slugify(title)}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const organization=organizations.find(([title])=>slugify(title)===slug); const info=organizationDetails[slug];
  if(!organization||!info)return{};
  return {title:organization[0],description:organization[1],alternates:{canonical:`/organizations/${slug}`},openGraph:{title:`${organization[0]} | Sky Riders Gateway`,description:organization[1],url:`/organizations/${slug}`,type:"article",images:[]},twitter:{card:"summary",title:organization[0],description:organization[1],images:[]}};
}

export default async function OrganizationDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const organization=organizations.find(([title])=>slugify(title)===slug);
  const info=organizationDetails[slug];
  if(!organization||!info) notFound();
  return <OrganizationProfile title={organization[0]} summary={organization[1]} tags={organization[2]} info={info}/>;
}
