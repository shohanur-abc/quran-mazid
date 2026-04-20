// mongoose is not imported since we use MongoClient
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";

const MONGODB_URI = "mongodb+srv://al-quran:2WaJKKtaterHuVz5@cluster0.5xtqc6n.mongodb.net/quran?appName=Cluster0";

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db("quran");

  const bnData = JSON.parse(await fs.readFile(path.join(process.cwd(), "src/db/aba-bn-rawai-al-bayan-simple.json"), "utf8"));
  const enData = JSON.parse(await fs.readFile(path.join(process.cwd(), "src/db/aba-en-sahih-international-simple.json"), "utf8"));

  // Create documents keeping index 0 empty (as it is in the original json)
  // Assuming they want an array mapped to documents with an _id or index field
  const bnDocs = bnData.map((text: string | null, index: number) => ({
    _id: index,
    text: text
  }));

  const enDocs = enData.map((text: string | null, index: number) => ({
    _id: index,
    text: text
  }));

  await db.collection("bn_rawai_al_bayan").deleteMany({});
  await db.collection("bn_rawai_al_bayan").insertMany(bnDocs);

  await db.collection("en_sahih_international").deleteMany({});
  await db.collection("en_sahih_international").insertMany(enDocs);

  console.log("Seeding completed.");
  await client.close();
}

main().catch(console.error);
