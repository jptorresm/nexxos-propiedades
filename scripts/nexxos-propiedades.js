// ✅ nexos-propiedades.js (versión mejorada 2026)
// Obtiene propiedades verificadas desde el dataset oficial Nexxos (GitHub RAW)

async function obtenerPropiedadesNexxos(filtros = {}) {
  const url = "https://raw.githubusercontent.com/jptorresm/nexxos-propiedades/main/data/propiedades.json";
  
  // Reintento automático hasta 3 veces
  async function fetchConReintentos(maxIntentos = 3) {
    for (let intento = 1; intento <= maxIntentos; intento++) {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.json();
        else throw new Error(`Error HTTP ${res.status}`);
      } catch (err) {
        console.warn(`⚠️ Intento ${intento} fallido: ${err.message}`);
        if (intento === maxIntentos) throw err;
        await new Promise(r => setTimeout(r, 1000)); // espera 1s antes de reintentar
      }
    }
  }

  try {
    const propiedades = await fetchConReintentos();
    if (!Array.isArray(propiedades) || propiedades.length === 0) {
      console.log("⚠️ No se encontraron propiedades en el dataset oficial Nexxos.");
      return [];
    }

    // Aplicar filtros dinámicos
