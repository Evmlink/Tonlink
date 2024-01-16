const TonWeb = require('tonweb');
const tonweb = new TonWeb();

import b58 from "b58";

import * as orbs from "@orbs-network/ton-access";

import { TonClient, WalletContractV4 , WalletContractV1R1 , WalletContractV1R2 , WalletContractV1R3 , WalletContractV2R1 , WalletContractV2R2 , WalletContractV3R1 , WalletContractV3R2, internal ,fromNano} from "@ton/ton"

import { keyPairFromSecretKey  } from "@ton/crypto"

import * as nacl from "tweetnacl"
/**
 * 
 * @returns string
 * Random a new ton account and encode it into b58
 */

const newSecretKey =() =>
{
  const kp = nacl.sign.keyPair();
  return b58.encode(
    kp.secretKey
  );
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
    return keyPairFromSecretKey(
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

const sendTx = async (target : string,amount : number , t : TonLink ,body?:string) =>
{
    const key = t.keypair
    const keyData = TonLink.getTonKeyPair(t)
    
    if(keyData)
    {
      const endpoint = await orbs.getHttpEndpoint({ network: t.network as orbs.Network } );
      const client = new TonClient({ endpoint });
      let contract = client.open(keyData);
      let seqno = await contract.getSeqno();
      var msg = {
        value: fromNano(amount),
        to: target,
        body: '',
      }
      if(body)
      {
        msg['body']=body;
      }

      let transfer = contract.createTransfer({
        seqno,
        secretKey: key.secretKey,
        messages: [internal(msg)]
      });
      return await contract.send(transfer);
    }
    return false;
}

const tonBalance = async (address : string) =>
{
  return await tonweb.getBalance(address);
}



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
    this.keypair = (s=="")?seedToKeypair(newSecretKey()):seedToKeypair(s);
    this.link = (link=="")?encodeLink(this.baseurl,b58.encode(this.keypair.secretKey),""):link;
    this.workchain = workchain;
    this.network = (network=="")?"mainnet":network;
    this.addressType = (addressType == "")?"WalletContractV4":addressType;
  }

  /**
   * 
   * @param raw : The data that transfer
   * @returns 
   * 
   */

  public static create(baseurl: string)
  {
    return new TonLink(baseurl,"","",0,"mainnet","");
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
        0,
        "mainnet",
        ""
      )
    }
    return false;
  }

  public static getTonKeyPair(t:TonLink){
    switch(t.addressType)
    {
      case "WalletContractV1R1":
        return WalletContractV1R1.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV1R2":
        return WalletContractV1R2.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV2R1":
        return WalletContractV2R1.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV2R2":
        return WalletContractV2R2.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV3R1":
        return WalletContractV3R1.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV3R2":
        return WalletContractV3R2.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      case "WalletContractV4":
        return WalletContractV4.create({ publicKey: t.keypair.publicKey, workchain: t.workchain });
      default :
        return false;
        break;
    }
  }

  public static async getTonBal(a:string)
  {
    return await tonBalance(a);
  }

  public static async sendTon(target : string,amount : number , t : TonLink ,body?:string)
  {
    return await sendTx(target,amount, t ,body);
  }
  /**
   * Some utils 
   */
  public static async newClient(network:string)
  {
    return new TonClient({
      endpoint: await orbs.getHttpEndpoint({ network: network as orbs.Network}),
    });
  }

}
