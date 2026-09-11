import { withPageSeo } from "../../lib/seo";
import type { Metadata } from "next";
export const metadata:Metadata=withPageSeo({title:"Aviation and Aerospace Resources",description:"Find clear, accessible guidance for beginning an aviation or aerospace journey, including training, funding, organizations, mentorship, and next steps.",alternates:{canonical:"/resources"}});
export default function Layout({children}:{children:React.ReactNode}){return children;}
