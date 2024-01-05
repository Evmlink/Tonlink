import { TonLink } from "../src";

//Encryption
test("returns valid TonLink", () => {
  const ton = TonLink.create("http://192.168.1.103:8080/");
  console.log(ton)
})