import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import path from "node:path";
import XLSX from "xlsx";
import { seedMenu } from "../lib/menu-seed.ts";

const [, , xlsxPath] = process.argv;
if (!xlsxPath) {
  console.error("usage: node scripts/restore-menu.mjs <path-to-xlsx-or-csv>");
  process.exit(1);
}
const OUT = path.join(process.cwd(), "data", "menu.json");

const norm = (s) =>
  String(s).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const wb = XLSX.readFile(xlsxPath);
const grid = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
  header: 1,
  raw: false,
  defval: "",
});

const header = grid[0].map((h) =>
  norm(h).replace(/\(.*?\)/g, " ").replace(/[^a-z ]/g, " ").trim(),
);
const col = (aliases) =>
  header.findIndex((h) => aliases.some((a) => h === a || h.split(/\s+/).includes(a)));

const iName = col(["nombre", "name", "plato"]);
const iDesc = col(["descripcion", "description", "detalle"]);
const iPrice = col(["precio", "price", "valor"]);
const iCat = col(["categoria", "category", "rubro", "seccion"]);

const data = structuredClone(seedMenu);
const catByName = new Map(data.categories.map((c) => [norm(c.name), c]));
let nextCatOrder = data.categories.length + 1;
let nextItemOrder = data.items.length + 1;
let itemsAdded = 0;
let catsAdded = 0;

for (const row of grid.slice(1)) {
  const name = String(row[iName] ?? "").trim();
  const categoryName = String(row[iCat] ?? "").trim();
  const price = Number(String(row[iPrice] ?? "").replace(/[^\d.]/g, ""));
  if (!name || !categoryName || !Number.isFinite(price)) continue;

  let cat = catByName.get(norm(categoryName));
  if (!cat) {
    cat = { id: randomUUID(), name: categoryName, published: true, order: nextCatOrder++ };
    data.categories.push(cat);
    catByName.set(norm(categoryName), cat);
    catsAdded++;
  }
  data.items.push({
    id: randomUUID(),
    name,
    description: String(row[iDesc] ?? "").trim(),
    price,
    categoryId: cat.id,
    featured: false,
    published: true,
    order: nextItemOrder++,
  });
  itemsAdded++;
}

writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(
  `wrote ${OUT}: ${data.categories.length} categories (+${catsAdded}), ${data.items.length} items (+${itemsAdded})`,
);
