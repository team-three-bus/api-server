const xlsx = require( "xlsx" );
const mysql = require("mysql2/promise");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: ""
});

const insertProduct = async (brand, eventType, productName, productPrice, productCategory, firsyAttr, secondAttr, imageUrl) => {
  
  const isEvent = false;
  var sql = `INSERT INTO products (name, brand, price, isEvent, imageUrl) VALUES ('${productName}', '${brand}', ${productPrice}, ${isEvent}, '${imageUrl}')`;
  
  const [rows, fields] = await (await connection).query(sql);
  
  const sqlAttr = `INSERT INTO product_attr (productId, category, firstAttr, secondAttr) VALUES ('${rows.insertId}', '${productCategory}', '${firsyAttr}', '${secondAttr}')`;
  const sqlEvent = `INSERT INTO events (productId, eventType, eventYear, eventMonth) VALUES ('${rows.insertId}', '${eventType}', '2021', '12')`;
  const [secondRows, secontFields] = await (await connection).query(sqlAttr);
  const [thirdRows, thirdFields] = await (await connection).query(sqlEvent);
  
}



const excelFile = xlsx.readFile("test/이마트24(12월) 카테고리, 속성 작업 (1).xlsx" );

const sheetName = excelFile.SheetNames[0];
const firstSheet = excelFile.Sheets[sheetName];

const jsonData = xlsx.utils.sheet_to_json( firstSheet, { defval : "" } );

console.log(jsonData[0]);
console.log(jsonData.length);

async function insertAllProduct() {
  for (let i=0; i< jsonData.length; i++) {
    const productPrice = Number(jsonData[i]["가격"]);
    try {

    } catch (e) {
      console.log("insert error ", jsonData[i]["상품명"],  e.message);
    }
    await insertProduct(jsonData[i]["편의점"], jsonData[i]["행사"], jsonData[i]["상품명"], productPrice, jsonData[i]["카테고리"], jsonData[i]["속성1"], jsonData[i]["속성2"], jsonData[i]["이미지URL"]);
    
  }  
}

insertAllProduct();