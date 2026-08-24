import { notFound } from "next/navigation";
import { DetailPage } from "../../components/DetailPage";
import { scholarships, slugify } from "../../content";
import { scholarshipDetails } from "../../detail-content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return scholarships.map(([,title])=>({slug:slugify(title)}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const scholarship=scholarships.find(([,title])=>slugify(title)===slug); const info=scholarshipDetails[slug];
  if(!scholarship||!info)return{};
  const description=`${scholarship[1]}: ${scholarship[2]}. Review eligibility, key details, application steps, and the official source.`;
  return {title:scholarship[1],description,alternates:{canonical:`/scholarships/${slug}`},openGraph:{title:`${scholarship[1]} | Sky Riders Gateway`,description:info.overview,url:`/scholarships/${slug}`,type:"article",images:[]},twitter:{card:"summary",title:scholarship[1],description,images:[]}};
}

export default async function ScholarshipDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const scholarship=scholarships.find(([,title])=>slugify(title)===slug);
  const info=scholarshipDetails[slug];
  if(!scholarship||!info) notFound();
  return <DetailPage active="scholarships" kind="Scholarship" title={scholarship[1]} summary={`${scholarship[2]} · ${scholarship[3]}`} tags={[scholarship[2],scholarship[3]]} info={info} backHref="/scholarships"/>;
}
