import { TonLink } from "../src";

//Encryption
test("returns valid TonLink", () => {
  const ton = TonLink.create("https://t.me/tonspay_bot/cash?startapp=");
  console.log(ton)
})