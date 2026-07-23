import { notFound } from "next/navigation";
import { DetailPage } from "../../components/DetailPage";
import { organizations, slugify } from "../../content";
import { organizationDetails } from "../../detail-content";

export function generateStaticParams() {
  return organizations.map(([title])=>({slug:slugify(title)}));
}

export default async function OrganizationDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const organization=organizations.find(([title])=>slugify(title)===slug);
  const info=organizationDetails[slug];
  if(!organization||!info) notFound();
  return <DetailPage active="organizations" kind="Organization" title={organization[0]} summary={organization[1]} tags={organization[2]} info={info} backHref="/organizations"/>;
}

