import { Wallet } from "ethers";
import { PrivateKey } from "xmtp-js";

const newWallet = (): Wallet => {
  const key = PrivateKey.generate();
  if (!key.secp256k1) {
    throw new Error("invalid key");
  }
  return new Wallet(key.secp256k1.bytes);
};

export default newWallet;
