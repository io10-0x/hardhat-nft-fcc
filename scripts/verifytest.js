const { verify } = require("../utils/verify");
const { uploadtoPinata } = require("../utils/uploadtopinata");

const entrancefee = ethers.parseEther("0.02");

async function main() {
  let tokenuris = [];
  if (tokenuris.length == 0) {
    let tokencids = [
      await uploadtoPinata(
        "PUG",
        "An Adorable Pug",
        "https://ipfs.io/ipfs/QmZ4uHLzh35ufjFHHNbc7vAjuWmL7MWTKeARVzKsZoaJjY",
        90
      ),
      await uploadtoPinata(
        "SHIBA INU",
        "An Adorable Shiba Inu",
        "https://ipfs.io/ipfs/QmdotT4u4Yq9UcgiWLZqoLPPnyn774Hsc2fqJtn6gWqHrw",
        80
      ),
      await uploadtoPinata(
        "ST BERNARD",
        "An Adorable St Bernard",
        "https://ipfs.io/ipfs/QmeaE4MTmQaomEXffrKKE2PaVZFuaT34DxVYyVn6xL7BsW",
        50
      ),
    ];

    for (i = 0; i < tokencids.length; i++) {
      tokenuris.push(`https://ipfs.io/ipfs/${tokencids[i]}`);
    }
  }
  await verify("0x1c1C602dEBe61f8DbF8A49087136a34fD8D89055", [
    entrancefee,
    "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    "0xab18414CD93297B0d12ac29E63Ca20f515b3DB46",
    tokenuris,
  ]);
  console.log(tokenuris);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
module.exports.tage = ["verify"];
