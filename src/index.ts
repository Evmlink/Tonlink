import * as TonWeb from "tonweb";

import * as tonc from "ton-crypto";

// import b58  from  "./tsb58"

import b58 from "b58";

import * as orbs from "@orbs-network/ton-access";

import * as ton from "ton"

const nacl = TonWeb.default.utils.nacl

/**
 * 
 * @returns string
 * Random a new ton account and encode it into b58
 */

const newSecretKey = () =>
{
  const keyPair = nacl.sign.keyPair();
  return b58.encode(keyPair.secretKey);
}

/**
 * 
 * @param secretKey 
 * @returns uint8Array
 * 
 * Decode base58 sec into uint8Arr
 */
const seedToKeypair= (secretKey : string) =>
{
    return tonc.keyPairFromSecretKey(
        b58.decode(
            secretKey
        )
    );
}
/**
 * 
 * @param data 
 * @returns {} OR false
 * 
 * To decode the base58 raw-data into readable json
 * 
 * The rules of Url :
 * {baseurl}/{Data}
 */
const decodeLink = (data : string) =>
{
  try{
    const raw = JSON.parse(
      b58.decode(
        data
      )
    )
    return raw
  }catch(e)
  {
    return false;
  }
}

const encodeLink = (baseUrl : string,s : string,c:string) =>
{
  return baseUrl + b58.encode(
    Buffer.from(
        JSON.stringify(
            {
                t : 0,
                s : s,
                c : c
            }
        )
    )
) 
}

// const signTxn = async (target : string,amount : number , t : TonLink) =>
// {
//     const key = t.keypair
//     const keyData = TonLink.getTonKeyPair(t)
    
//     if(keyData)
//     {
//       const endpoint = await orbs.getHttpEndpoint({ network: t.network as orbs.Network } );
//       const client = new ton.TonClient({ endpoint });
//       let walletContract = client.open(keyData);
//       let seqno = await walletContract.getSeqno();
  
//       var txs = {
//           secretKey: key.secretKey,
//           seqno: seqno,
//           messages: [
//           ]
//         }
//       // txs.messages.push(
//       //     ton.internal(
//       //     {
//       //       to: target, 
//       //       value: amount,
//       //       bounce: false,
//       //     }
//       //   )
//       // )
//       await walletContract.sendTransfer(txs);
//     }


// }



 /**
  * TONLINK Class 
  * 
  * - Create new wallet in link
  * - Recover wallet by link
  */
export class TonLink {
  baseurl: string;
  keypair: any;
  link:string;
  workchain:number;
  network:string;
  addressType:string;
  //Init this object 
  private constructor(baseurl: string, s: string ,link:string, workchain:number, network:string, addressType:string) {
    this.baseurl = (baseurl=="")?"http://localhost/":baseurl;
    this.keypair = (s=="")?newSecretKey():seedToKeypair(s);
    this.link = (link=="")?encodeLink(this.baseurl,this.keypair,""):link;
    this.workchain = workchain;
    this.network = (network=="")?"mainnet":network;
    this.addressType = (addressType == "")?"WalletContractV3R2":addressType;
  }

  /**
   * 
   * @param raw : The data that transfer
   * @returns 
   * 
   */

  public static create(baseurl: string)
  {
    return new TonLink(baseurl,"","",1,"testnet","");
  }

  public static fromRawData(raw:string)
  {
    const data = decodeLink(raw);
    if(data)
    {
      return new TonLink(
        "",
        data.s,
        "",
        1,
        "testnet",
        ""
      )
    }
    return false;
  }

  public static getTonKeyPair(t:TonLink){
    switch(t.addressType)
    {
      case "WalletContractV1R1":
        return ton.WalletContractV1R1.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV1R2":
        return ton.WalletContractV1R2.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV2R1":
        return ton.WalletContractV2R1.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV2R2":
        return ton.WalletContractV2R2.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV3R1":
        return ton.WalletContractV3R1.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV3R2":
        return ton.WalletContractV3R2.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      default :
        return false;
        break;
    }
  }

}
