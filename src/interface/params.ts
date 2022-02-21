export interface searchParams {
  text?:string,
  brand?: string,
  eventtype: string,
  category?: string,
  sort?: string,
}

export interface loggingParams {
  id: number,
  name: string,
  price?: number,
  userId: string
}