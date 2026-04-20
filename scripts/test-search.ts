import { searchAyahs } from "../src/app/actions/searchAyahs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    try {
        console.log("------------- Searching for 'merciful' -------------");
        const results = await searchAyahs("merciful");
        console.log(JSON.stringify(results, null, 2));

        console.log("\n------------- Searching for 'রহমান' -------------");
        const resultsBn = await searchAyahs("রহমান");
        console.log(JSON.stringify(resultsBn, null, 2));
        
        console.log("\nTest Completed Successfully.");
    } catch(e) {
        console.error("Test Failed:", e);
    }
    process.exit(0);
}
main();
