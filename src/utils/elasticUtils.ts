const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
let month = moment().format("MM");
month = month.slice(0,1) === "0" ? month.slice(1,2) : month;

const mustTermsQuery = (text: string, brand?: string, eventtype?: string, category?: string, isevent?: string) => {
  const must = [];
  let eventtypeArr;
  if(eventtype && eventtype.split(",").length === 2) {
    eventtypeArr = eventtype.split(",");
    for(let val in eventtypeArr) {
      eventtypeArr[val] = eventtypeArr[val].replace(" ", "+");
    }
  } else if(eventtype && eventtype.split(",").length === 1){
    eventtypeArr = eventtype.split(",")
    eventtypeArr = eventtypeArr[0].replace(" ", "+");
  }
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
      eventtype: eventtypeArr
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

  must.push({
    match: {
      eventmonth: month
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
