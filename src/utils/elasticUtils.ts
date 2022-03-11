const mustTermsQuery = (text?: string, brand?: string, eventtype?: string, category?: string) => {
  const must = [];
  let eventtypeArr:any;
  if(eventtype && eventtype.split(",").length === 2) {
    eventtypeArr = eventtype.split(",");
    for(let val in eventtypeArr) {
      eventtypeArr[val] = eventtypeArr[val].replace(" ", "+");
    }
  } else if(eventtype && eventtype.length === 3){
    let tempArray = [];
    const fixValue = eventtype.replace(" ", "+");
    tempArray.push(fixValue)
    eventtypeArr = tempArray;
  }
  text ? must.push({
    "simple_query_string": {
      "query": text,
      "fields": ["name.nori^3","name.ngram"]
    }
  }) : "";

  brand ? must.push({
    terms: {
      brand: brand.split(",")
    }
  }) : "";

  eventtypeArr ? must.push({
    terms: {
      "eventtype": eventtypeArr
    }
  }) : "";

  category ? must.push({
    terms: {
      category: category.split(",")
    }
  }) : "";

  must.push({
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
    case("viewcnt"):
      sort.push({
        "viewcnt": {
          "order": "desc",
        },
      });
      break;
    default:
  }
  return sort;
};
export { mustTermsQuery, sortQuery };