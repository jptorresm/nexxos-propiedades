// nexos-propiedades.js
async function obtenerPropiedadesNexxos(filtros = {}) {
const url = "../data/propiedades.json";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No se pudo conectar al dataset Nexxos");
    const propiedades = await res.json();

    // Filtros dinámicos
    const resultado = propiedades.filter(p => {
      const comunaOk = !filtros.Comuna || p.Comuna?.toLowerCase() === filtros.Comuna.toLowerCase();
      const tipoOk = !filtros.Tipo || p.Tipo?.toLowerCase() === filtros.Tipo.toLowerCase();
      const operacionOk = !filtros.Operacion || p.Operación?.toLowerCase() === filtros.Operacion.toLowerCase();
      return comunaOk && tipoOk && operacionOk;
    });

    if (resultado.length === 0) {
      console.log("No hay propiedades Nexxos con esos filtros.");
      return;
    }

    console.log("🏠 Propiedades Nexxos verificadas:\n");
    resultado.forEach(p => {
      console.log(`Comuna: ${p.Comuna}`);
      console.log(`Tipo: ${p.Tipo}`);
      console.log(`Operación: ${p.Operación}`);
      console.log(`Precio: ${p.Precio}`);
      console.log(`Dormitorios: ${p.Dormitorios}`);
      console.log(`Baños: ${p.Baños}`);
      console.log(`Superficie: ${p.Superficie}`);
      console.log(`Estacionamientos: ${p.Estacionamientos}`);
      console.log(`Bodegas: ${p.Bodegas}`);
      console.log(`Descripción: ${p.Descripción}`);
      console.log(`Link: ${p.link}`);
      console.log("📡 Fuente: Dataset oficial Nexxos (GitHub RAW)\n---\n");
    });

  } catch (err) {
    console.error("⚠️ Error al obtener datos Nexxos:", err.message);
    console.log("Intentando mostrar propiedades externas…");
    // Aquí podrías llamar a otra función para portales externos si lo deseas
  }
}

// 🔍 Ejemplo de uso:
obtenerPropiedadesNexxos({
  Comuna: "La Reina",
  Tipo: "Casa",
  Operacion: "Arriendo"
});
