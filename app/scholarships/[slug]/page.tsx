import { notFound } from "next/navigation";
import { DetailPage } from "../../components/DetailPage";
import { scholarships, slugify } from "../../content";
import { scholarshipDetails } from "../../detail-content";

export function generateStaticParams() {
  return scholarships.map(([,title])=>({slug:slugify(title)}));
}

export default async function ScholarshipDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const scholarship=scholarships.find(([,title])=>slugify(title)===slug);
  const info=scholarshipDetails[slug];
  if(!scholarship||!info) notFound();
  return <DetailPage active="scholarships" kind="Scholarship" title={scholarship[1]} summary={`${scholarship[2]} · ${scholarship[3]}`} tags={[scholarship[2],scholarship[3]]} info={info} backHref="/scholarships"/>;
}
