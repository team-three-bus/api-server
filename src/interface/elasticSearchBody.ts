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
  isevent: number,
  createdat: Date,
  updatedat: Date,
  isLikeProduct?:string
}

export interface LoggingSearchBody {
  userId:number,
  productName: string,
  productId: number,
  price: number,
  clickDate: Date
}