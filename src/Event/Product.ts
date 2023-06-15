import EventEmitter from "events";

const productEvent = new EventEmitter();

const product = [{ name: "Apple" }, { name: "Orange" }, { name: "Banana" }];

productEvent.on("getProduct", (resolve, reject, data) => {
  const p = product[data];
  if (p) return resolve(p);
  else return reject("Not Found");
});

export default productEvent;
