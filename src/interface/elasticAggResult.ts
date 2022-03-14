export interface ElasticAggResult {
  key: number,
  doc_count: number
}

export interface ElasticRecommendObject {
  productId: undefined | number,
  updatedAt: Date,
  point: number
}