import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name:"Sky Riders Gateway", short_name:"Sky Riders", description:"Aviation and aerospace pathways, scholarships, organizations, mentors, and opportunities.", start_url:"/", display:"standalone", background_color:"#ffffff", theme_color:"#041f40", icons:[{src:"/brand/sky-riders-mark-v3.png",sizes:"any",type:"image/png"}] };
}
