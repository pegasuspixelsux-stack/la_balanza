"use client";

import { useRef, useState, useTransition } from "react";
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react";
import { importMenuItems, type ImportResult } from "@/app/panel/actions";
import { formatPrice } from "@/lib/format";

interface ParsedRow {
  name: string;
  description: string;
  price: number;
  categoryName: string;
  featured: boolean;
  published: boolean;
  error?: string;
}

const HEADER_ALIASES: Record<keyof Omit<ParsedRow, "error">, string[]> = {
  name: ["nombre", "name", "plato", "item", "producto"],
  description: ["descripcion", "description", "detalle", "desc"],
  price: ["precio", "price", "valor", "importe", "costo"],
  categoryName: ["categoria", "category", "rubro", "seccion", "grupo", "tipo"],
  featured: ["destacado", "featured", "destacados"],
  published: ["publicado", "published", "activo", "visible"],
};

const TRUE_VALUES = new Set(["si", "sí", "true", "1", "x", "yes"]);

/** Handles "850", "$U 1.850,00", "1,850.50", "$ 850". */
function parsePrice(raw: string): number {
  let s = raw.replace(/[^\d.,]/g, "");
  if (s.includes(".") && s.includes(",")) {
    // last separator is the decimal one
    s = s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, ""); // thousands dots only
  }
  return Number(s);
}

function norm(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n");
}

function mapHeaders(headerRow: string[]) {
  const map: Partial<Record<keyof ParsedRow, number>> = {};
  headerRow.forEach((raw, index) => {
    // "Price ($U)" -> "price", "Nombre del plato" -> ["nombre","del","plato"]
    const cleaned = norm(String(raw))
      .replace(/\(.*?\)/g, " ")
      .replace(/[^a-z ]/g, " ")
      .trim();
    const words = cleaned.split(/\s+/).filter(Boolean);

    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      const key = field as keyof ParsedRow;
      if (map[key] !== undefined) continue;
      const hit = aliases.some(
        (a) => cleaned === a || words.includes(a) || cleaned.startsWith(`${a} `),
      );
      if (hit) map[key] = index;
    }
  });
  return map;
}

export function ImportManager() {
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [replaceMenu, setReplaceMenu] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setRows(null);
    setFileName("");
    setParseError(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  async function handleFile(file: File) {
    reset();
    setFileName(file.name);
    setParsing(true);
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const grid = XLSX.utils.sheet_to_json<string[]>(sheet, {
        header: 1,
        raw: false,
        defval: "",
      });

      if (grid.length < 2) {
        throw new Error("El archivo no tiene filas de datos.");
      }

      const headerRow = grid[0].map(String);
      const headerMap = mapHeaders(headerRow);
      const missing = (["name", "price", "categoryName"] as const).filter(
        (f) => headerMap[f] === undefined,
      );
      if (missing.length > 0) {
        const labels: Record<string, string> = {
          name: "nombre",
          price: "precio",
          categoryName: "categoría",
        };
        throw new Error(
          `No encontré la columna de ${missing.map((f) => labels[f]).join(", ")}. ` +
            `Encabezados del archivo: ${headerRow.filter(Boolean).join(", ") || "(vacío)"}.`,
        );
      }

      const parsed: ParsedRow[] = grid
        .slice(1)
        .filter((r) => r.some((cell) => String(cell).trim() !== ""))
        .map((r) => {
          const cell = (field: keyof ParsedRow) => {
            const i = headerMap[field];
            return i === undefined ? "" : String(r[i] ?? "").trim();
          };
          const name = cell("name");
          const price = parsePrice(cell("price"));
          const categoryName = cell("categoryName");
          const row: ParsedRow = {
            name,
            description: cell("description"),
            price,
            categoryName,
            featured: TRUE_VALUES.has(norm(cell("featured"))),
            published: cell("published") === "" ? true : TRUE_VALUES.has(norm(cell("published"))),
          };
          if (!name) row.error = "Falta el nombre";
          else if (!categoryName) row.error = "Falta la categoría";
          else if (!Number.isFinite(price) || price < 0) row.error = "Precio inválido";
          return row;
        });

      setRows(parsed);
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "No se pudo leer el archivo.",
      );
    } finally {
      setParsing(false);
    }
  }

  function downloadTemplate() {
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.aoa_to_sheet([
        ["nombre", "descripcion", "precio", "categoria", "destacado", "publicado"],
        ["Provoleta", "A la parrilla con orégano y aceite de oliva", 320, "Entradas", "si", "si"],
        ["Bife de chorizo", "300 grs. con guarnición", 850, "Parrilla", "", "si"],
      ]);
      ws["!cols"] = [{ wch: 24 }, { wch: 40 }, { wch: 10 }, { wch: 16 }, { wch: 10 }, { wch: 10 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Menú");
      XLSX.writeFile(wb, "plantilla-menu-la-balanza.xlsx");
    });
  }

  function confirmImport() {
    if (!rows) return;
    const valid = rows.filter((r) => !r.error);
    startTransition(async () => {
      const res = await importMenuItems(
        valid.map(({ error: _e, ...r }) => r),
        { replace: replaceMenu },
      );
      setResult(res);
      if (res.ok) {
        setRows(null);
        setReplaceMenu(false);
      }
    });
  }

  const validCount = rows?.filter((r) => !r.error).length ?? 0;
  const errorCount = (rows?.length ?? 0) - validCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-bone">Importar desde Excel</h2>
          <p className="mt-1 text-sm text-stone-400">
            Subí un archivo <code className="text-stone-300">.xlsx</code>,{" "}
            <code className="text-stone-300">.xls</code> o{" "}
            <code className="text-stone-300">.csv</code> con columnas{" "}
            <em>nombre, descripción, precio, categoría</em>. Las categorías nuevas
            se crean solas.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-4 py-2 text-sm text-bone hover:border-neon hover:text-neon"
        >
          <Download className="h-4 w-4" />
          Descargar plantilla
        </button>
      </div>

      {result?.ok ? (
        <div className="flex items-start gap-3 rounded-xl border border-neon/30 bg-neon/10 p-4 text-sm">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neon" />
          <div className="text-stone-200">
            <p className="font-medium text-bone">Importación completa</p>
            <p className="mt-0.5 text-stone-400">
              {result.itemsCreated} plato{result.itemsCreated === 1 ? "" : "s"}
              {result.categoriesCreated > 0
                ? ` y ${result.categoriesCreated} categoría${result.categoriesCreated === 1 ? "" : "s"} nueva${result.categoriesCreated === 1 ? "" : "s"}`
                : ""}{" "}
              agregados. Ya están en la carta.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 text-xs text-neon underline"
            >
              Importar otro archivo
            </button>
          </div>
        </div>
      ) : null}

      {!rows && !result?.ok ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void handleFile(file);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors ${
            dragging
              ? "border-neon bg-neon/10"
              : parseError
                ? "border-red-500/50 bg-red-500/5"
                : "border-stone-700 bg-stone-900/40 hover:border-stone-600"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          {parsing ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
              <p className="text-sm text-stone-400">Leyendo {fileName}…</p>
            </>
          ) : (
            <>
              <UploadCloud
                className={`h-8 w-8 ${dragging ? "text-neon" : "text-stone-500"}`}
              />
              <p className="text-sm text-stone-300">
                Arrastrá el archivo acá, o{" "}
                <span className="text-neon">elegí uno</span>
              </p>
              <p className="text-xs text-stone-500">.xlsx · .xls · .csv</p>
            </>
          )}
          {parseError ? (
            <p className="mt-1 text-sm text-red-300">{parseError}</p>
          ) : null}
        </label>
      ) : null}

      {result && !result.ok ? (
        <p className="text-sm text-red-300">{result.error}</p>
      ) : null}

      {rows ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm text-stone-300">
              <FileSpreadsheet className="h-4 w-4 text-stone-500" />
              {fileName} — <span className="text-neon">{validCount} válidas</span>
              {errorCount > 0 ? (
                <span className="text-red-300">, {errorCount} con error</span>
              ) : null}
            </p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-bone"
            >
              <X className="h-3.5 w-3.5" />
              Cancelar
            </button>
          </div>

          <div className="max-h-96 overflow-auto rounded-xl border border-stone-800">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-stone-900 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Categoría</th>
                  <th className="px-3 py-2 font-medium">Precio</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {rows.map((row, i) => (
                  <tr key={i} className={row.error ? "bg-red-500/5" : ""}>
                    <td className="px-3 py-2 text-bone">
                      {row.name || <span className="text-stone-600">—</span>}
                      {row.featured ? (
                        <span className="ml-2 text-xs text-amber-400">★</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-stone-300">
                      {row.categoryName || <span className="text-stone-600">—</span>}
                    </td>
                    <td className="px-3 py-2 font-mono text-stone-300">
                      {Number.isFinite(row.price) ? formatPrice(row.price) : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {row.error ? (
                        <span className="text-red-300">{row.error}</span>
                      ) : (
                        <span className="text-neon">Lista</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={replaceMenu}
              onChange={(e) => setReplaceMenu(e.target.checked)}
              className="h-4 w-4 accent-terracotta"
            />
            Reemplazar la carta actual (borra todos los platos y categorías antes
            de importar)
          </label>

          <button
            type="button"
            onClick={confirmImport}
            disabled={pending || validCount === 0}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-terracotta-deep disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {replaceMenu ? "Reemplazar carta con" : "Importar"} {validCount} plato
            {validCount === 1 ? "" : "s"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
