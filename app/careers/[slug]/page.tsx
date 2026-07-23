import { notFound } from "next/navigation";
import { DetailPage } from "../../components/DetailPage";
import { careerPaths, slugify } from "../../content";
import { careerDetails } from "../../detail-content";

export function generateStaticParams() {
  return careerPaths.map(([,title])=>({slug:slugify(title)}));
}

export default async function CareerDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const career=careerPaths.find(([,title])=>slugify(title)===slug);
  const info=careerDetails[slug];
  if(!career||!info) notFound();
  return <DetailPage active="careers" kind="Career" title={career[1]} summary={career[2]} info={info} backHref="/careers"/>;
}

