import * as web3 from "@solana/web3.js";

export const getProvider = async () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      console.log("Is Phantom installed?  ", provider.isPhantom);
      return provider;
    }
  } else {
    window.open("https://www.phantom.app/", "_blank");
  }
};

export async function transferSOL() {
  // Detecting and storing the phantom wallet of the user (creator in this case)
  var provider = await getProvider();
  console.log("Public key of the emitter: ", provider.publicKey.toString());

  // Establishing connection
  var connection = new web3.Connection(web3.clusterApiUrl("devnet"));

  // I have hardcoded my secondary wallet address here. You can take this address either from user input or your DB or wherever
  var receiverWallet = new web3.PublicKey(
    "9fuYBoRvgptU4fVZ8ZqvWTTc6oC68P4tjuSA2ySzn6Nv"
  );

  // Airdrop some SOL to the sender's wallet, so that it can handle the txn fee
  var airdropSignature = await connection.requestAirdrop(
    provider.publicKey,
    web3.LAMPORTS_PER_SOL
  );

  // Confirming that the airdrop went through
  await connection.confirmTransaction(airdropSignature);
  console.log("Airdropped");

  var transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: provider.publicKey,
      toPubkey: receiverWallet,
      lamports: web3.LAMPORTS_PER_SOL, //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
    })
  );

  // Setting the variables for the transaction
  transaction.feePayer = await provider.publicKey;
  let blockhashObj = await connection.getRecentBlockhash();
  transaction.recentBlockhash = await blockhashObj.blockhash;

  // Transaction constructor initialized successfully
  if (transaction) {
    console.log("Txn created successfully");
  }

  // Request creator to sign the transaction (allow the transaction)
  let signed = await provider.signTransaction(transaction);
  // The signature is generated
  let signature = await connection.sendRawTransaction(signed.serialize());
  // Confirm whether the transaction went through or not
  await connection.confirmTransaction(signature);

  //Print the signature here
  console.log("Signature: ", signature);
}

export const sendTransaction = async (to, amt) => {
  const r = await getProvider();
  const res = await r.connect();

  let connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  let receiver = new web3.PublicKey(to);

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: res.publicKey,
      toPubkey: receiver,
      lamports: web3.LAMPORTS_PER_SOL * amt,
    })
  );

  transaction.feePayer = res.publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  const signed = await r.signTransaction(transaction);

  const txid = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction(txid);

  console.log("txid", txid);
};
