import Directory from "./directory";
import { getCatalog } from "../../lib/catalog";
export const revalidate = 60;
export default async function Page() { return <Directory records={await getCatalog("careers")}/>; }
