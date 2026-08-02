import { notFound } from "next/navigation";
import { DetailPage } from "../../components/DetailPage";
import { careerPaths, slugify } from "../../content";
import { careerDetails } from "../../detail-content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return careerPaths.map(([,title])=>({slug:slugify(title)}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const career=careerPaths.find(([,title])=>slugify(title)===slug); const info=careerDetails[slug];
  if(!career||!info)return{};
  return {title:`${career[1]} Career Guide`,description:career[2],alternates:{canonical:`/careers/${slug}`},openGraph:{title:`${career[1]} Career Guide | Sky Riders Gateway`,description:career[2],url:`/careers/${slug}`,type:"article"}};
}

export default async function CareerDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const career=careerPaths.find(([,title])=>slugify(title)===slug);
  const info=careerDetails[slug];
  if(!career||!info) notFound();
  return <DetailPage active="careers" kind="Career" title={career[1]} summary={career[2]} info={info} backHref="/careers"/>;
}
