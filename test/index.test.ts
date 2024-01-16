import { TonLink } from "../src";

// //Generate
test("returns valid TonLink", async () => {
  const ton = TonLink.create("https://t.me/tonspay_bot/cash?startapp=","hello tonlink");
  // console.log(ton.keypair.publicKey.toString())
  const a = (TonLink.getTonKeyPair(ton));
  if(a)
  {
    console.log(a.address.toString())
  }
  console.log(ton)

  return ton;
})


test("Decode from link", async () => {
  const link = 'https://t.me/tonspay_bot/cash?startapp=https://t.me/tonspay_bot/cash?startapp=GbShaw6kj5XdWnqpmDcoeXq6gUtXtqdYdnejW58aAeRSZUZYLpRnFZ8X8zyFic9wyd6meGSUQapUAVA55dp85h2fCU8nHg1E3158fMPe3M5tZAoQytcxdga73aquiAbAFPTEkzBCK3zC3h3FgMLzQ'
  const rawData = 'GbShaw6kj5XdWnqpmDcoeXq6gUtXtqdYdnejW58aAeRSZUZYLpRnFZ8X8zyFic9wyd6meGSUQapUAVA55dp85h2fCU8nHg1E3158fMPe3M5tZAoQytcxdga73aquiAbAFPTEkzBCK3zC3h3FgMLzQ'

  const ton = TonLink.fromRawData(rawData);
  console.log(ton)

  if(ton)
  {
    const a = (TonLink.getTonKeyPair(ton));
    if(a)
    {
      console.log(a.address.toString()) 
      const client = await TonLink.newClient("mainnet");
      const contract = client.open(a);
      const bal = await contract.getBalance()
        console.log(bal)

        console.log(await TonLink.getTonBal(a.address.toString()))

        //Send out txn
        // await TonLink.sendTon("",10000000,ton,"Tonlink Test")
    }
  }
})