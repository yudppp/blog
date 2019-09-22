import fs from "fs";
import path from "path";
import {
  createClient
} from "contentful";
import marked from "marked";

require("dotenv").config();

const SPACE = process.env.CONTENTFUL_SPACE;
const TOKEN = process.env.CONTENTFUL_TOKEN;

const client = createClient({
  space: SPACE,
  accessToken: TOKEN
});

const types = ["posts"];

const renderer = new marked.Renderer();

export const getcontent = async () => {
  console.log("> Starting import...");
  for (const type of types) {
    console.log("> Getting content for", type);
    const entries = await client.getEntries({
      content_type: type,
      include: 3
    })
    const formattedEntries = entries.items
      .map(v => v.fields)
      .map(v => ({
        ...v,
        contents: marked(v.contents || "", {
          renderer
        })
      })).sort((a, b) => {
        return a.date < b.date ? 1 : -1
      })
    fs.writeFileSync(
      path.join(__dirname, "..", "data", `${type}.json`),
      JSON.stringify(
        formattedEntries
      )
    );
    console.log("> Content gotten and written for", type);

    // TODO: I want to remove this code
    const defaultEntry = `./pages/${type}/_default.tsx`
    formattedEntries.forEach(entry => {
      fs.copyFileSync(defaultEntry, `./pages/${type}/${entry.slug}.tsx`);
    })
    // TODO: end
  }
  return true;
};

if (process.argv[2] === "install") {
  getcontent();
}