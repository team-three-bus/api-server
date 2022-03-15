export interface ElasticAggResult {
  key: number,
  doc_count: number
}

export interface ElasticRecommendObject {
  productId: undefined | number,
  productName: string,
  updatedAt: Date,
  point: number
}