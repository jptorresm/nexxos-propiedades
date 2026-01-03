import fetch from "node-fetch";
import csv from "csvtojson";
import fs from "fs";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSwaHlgpd2EQh6-8ByH2-uBAnT6t3RAfrp5g92I4VlMiuKHuiTHOMWbTkSVh9DjT8bA_CBF9d6DtzyD/pub?output=csv";

const OUTPUT_FILE = "./data/propiedades.json";
const PAGES_DIR = "./data/pages";
const INDEX_FILE = "./data/index.json";
const PAGE_SIZE = 100; // puedes ajustar la cantidad de propiedades por página

async function main() {
  try {
    console.log("🏙️ Descargando CSV público de Nexxos...");

    const response = await fetch(CSV_URL);
    if (!response.ok) throw new Error("No se pudo descargar el CSV.");

    const csvText = await response.text();
    const jsonArray = await csv().fromString(csvText);

    console.log(`✅ ${jsonArray.length} filas leídas. Procesando...`);

    // Normalizar y limpiar los datos
    const propiedades = jsonArray
      .map((row) => ({
        comuna: (row.Comuna || row.comuna || "").trim(),
        tipo: (row.Tipo || row.tipo || "").trim(),
        operacion: (row.Operacion || row.operacion || "").trim(),
        precioUF: Number(row.PrecioUF || row.precioUF || 0),
        precioCLP: Number(row.PrecioCLP || row.precioCLP || 0),
        dormitorios: row.Dormitorios || row.dormitorios || null,
        banos: row.Banos || row.Baños || row.banos || null,
        superficie: row.Superficie || row.superficie || null,
        estacionamientos: row.Estacionamientos || row.estacionamientos || null,
        bodegas: row.Bodegas || row.bodegas || null,
        descripcion:
          row.Descripcion || row.descripción || row.descripcion || "",
        link: row.Link || row.link || "",
        source: "Nexxos",
        fechaActualizacion: new Date().toISOString(),
      }))
      .filter((p) => p.link && p.comuna);

    // Crear carpeta /data/pages si no existe
    fs.mkdirSync(PAGES_DIR, { recursive: true });

    // Guardar archivo completo
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(propiedades, null, 2));
    console.log(`💾 Archivo principal guardado en ${OUTPUT_FILE}`);

    // Dividir en páginas
    let totalPages = 0;
    for (let i = 0; i < propiedades.length; i += PAGE_SIZE) {
      totalPages++;
      const chunk = propiedades.slice(i, i + PAGE_SIZE);
      const pageFile = `${PAGES_DIR}/${totalPages}.json`;
      fs.writeFileSync(pageFile, JSON.stringify(chunk, null, 2));
    }

    // Crear archivo índice
    fs.writeFileSync(
      INDEX_FILE,
      JSON.stringify({ totalPages, pageSize: PAGE_SIZE }, null, 2)
    );

    console.log(`📑 Generadas ${totalPages} páginas en ${PAGES_DIR}`);
    console.log("✅ Proceso completado exitosamente.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();
