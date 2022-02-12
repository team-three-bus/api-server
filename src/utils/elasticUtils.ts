const mustTermsQuery = (text: string, brand?: string, eventtype?: string, category?: string,isevent?:string) => {
  const must = [];

  text ? must.push({
    "simple_query_string": {
      "query": text,
      "fields": ["name.nori"]
    }
  }) : "";

  brand ? must.push({
    terms: {
      brand: brand.split(",")
    }
  }) : "";

  eventtype ? must.push({
    terms: {
      eventtype: eventtype.split(",")
    }
  }) : "";

  category ? must.push({
    terms: {
      category: category.split(",")
    }
  }) : "";

  isevent ? must.push({
    match: {
      isevent: isevent
    }
  }) : must.push({
    match: {
      isevent: 1
    }
  });

  return must;
};

const sortQuery = (inputSort: string) => {
  const sort = [];
  const field = inputSort;
  switch (field) {
    case("priceDesc"):
      sort.push({
        "price": {
          "order": "desc"
        }
      });
      break;
    case("priceAsc"):
      sort.push({
        "price": {
          "order": "asc"
        }
      });
      break;
    case("likecnt"):
      sort.push({
        "likecnt": {
          "order": "desc"
        }
      });
      break;
    default:
      sort.push({
        "firstattr": {
          "order": "desc"
        }
      });
  }
  return sort;
};
export { mustTermsQuery };
export { sortQuery };
