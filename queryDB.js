import { Client } from "@notionhq/client";
import { config } from "dotenv";
import fs from "fs";

config();

const pageID = process.env.NOTION_PAGE_ID;
const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: apiKey });

/* 
---------------------------------------------------------------------------
*/

/**
 * Source:
 * https://github.com/makenotion/notion-sdk-js/blob/main/examples/intro-to-notion-api/intermediate/3-query-database.js
 * Resources:
 * - Create a database endpoint (notion.databases.create(): https://developers.notion.com/reference/create-a-database)
 * - Create a page endpoint (notion.pages.create(): https://developers.notion.com/reference/post-page)
 * - Working with databases guide: https://developers.notion.com/docs/working-with-databases
 * Query a database: https://developers.notion.com/reference/post-database-query
 * Filter database entries: https://developers.notion.com/reference/post-database-query-filter
 */

// https://developers.notion.com/reference/post-database-query-filter
async function queryDatabase(databaseId) {
  // grab all db items with status "Approved"
  const statusIsApproved = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Status",
      status: {
        equals: "Approved"
      },
    },
  });

  const results = [];
  for (const item of statusIsApproved.results) {
    // clean up properties of each queried db item
    const prop = { ...item.properties };
    delete prop.Status;
    prop["ID"] = item.id;
    if (prop["Vacation Title"] && prop["Vacation Title"].title) {
      prop["Vacation Title"] = prop["Vacation Title"].title.map(title => title.plain_text).join(", ");
    }
    if (prop["Staff Member"] && prop["Staff Member"].people) {
      prop["Staff Member"] = prop["Staff Member"].people.map(person => person.name).join(", ");
    }
    if (prop["Date Range"] && prop["Date Range"].date) {
      const { start, end } = prop["Date Range"].date;
      prop["Date Range"] = end ? `${start} to ${end}` : start;
    }
    // output to .txt
    results.push(JSON.stringify(prop, null, 2));
    // console.log("Item written to output.txt:")
    // console.log(prop);
  }
  // write results to txt
  fs.writeFileSync("output.txt", results.join("\n\n"), "utf-8");
}

async function main() {
  // generate output.txt
  queryDatabase(pageID);
}

main();
