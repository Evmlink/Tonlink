import { TonLink } from "../src";

import * as tons from "ton"

const orbs = require("@orbs-network/ton-access");

//Encryption
test("returns valid TonLink", async () => {
  const ton = TonLink.create("https://t.me/tonspay_bot/cash?startapp=");
  // console.log(ton.keypair.publicKey.toString())
  const a = (TonLink.getTonKeyPair(ton));
  if(a)
  {
    console.log(a.address.toString())
    // console.log(
    //   await TonLink.getTonBal(
    //     a.address.toString()
    //   )
    // )
    const endpoint = await orbs.getHttpEndpoint({ network: "mainnet" });
    const client = new tons.TonClient({ endpoint });
    const w = client.open(a);
    console.log(await w.getBalance())
  }

  return ton;
})