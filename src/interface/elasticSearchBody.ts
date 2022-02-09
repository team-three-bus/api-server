import { integer } from "@elastic/elasticsearch/api/types";

export interface PostSearchBody {
  eventtype:string,
  name: string,
  brand: string,
  firstattr?: string,
  eventyear: string,
  secondattr?: string,
  likecnt: number,
  viewcnt: number,
  id: number
  category: string,
  isevent: number
}