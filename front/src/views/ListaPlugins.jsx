import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFlux } from "../context/FluxContext";

export const Plugins = () => {
  const { store = {}, actions } = useFlux(); // Valor por defecto para store

  // Estados locales para los filtros
  const [selectedSites, setSelectedSites] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updateFilter, setUpdateFilter] = useState("all");

  // Cargar datos al montar el componente
  useEffect(() => {
    if (!store.plugins?.length) { // Verificación segura con optional chaining
      actions.fetchPlugins();
    }
  }, [actions, store.plugins]);

  // Filtrar los datos según los filtros seleccionados
  const filteredPlugins = (store.plugins || []).filter(plugin => {
    const siteMatch = selectedSites === "all" || selectedSites.includes(plugin.site);
    const statusMatch = statusFilter === "all" || plugin.status === statusFilter;
    const updateMatch = updateFilter === "all" || (updateFilter === "needs-update" ? plugin.needsUpdate : !plugin.needsUpdate);
    return siteMatch && statusMatch && updateMatch;
  });

  // Generar y descargar CSV
  const downloadCSV = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const csvContent = [
      "Nombre del Site,Nombre del Plugin,Estado,Versión Actual,Versión Actualizada,Necesita Actualizar",
      ...filteredPlugins.map(plugin =>
        `${plugin.site},${plugin.name},${plugin.status},${plugin.version || "N/A"},${plugin.latestVersion || "N/A"},${plugin.needsUpdate ? "Sí" : "No"}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentDate}_plugins.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Mostrar "Cargando..." si no hay datos aún
  if (!store.plugins) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center">
          <h5>Cargando plugins...</h5>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          {store.error && <p className="text-danger mt-2">{store.error}</p>}
        </div>
      </div>
    );
  }

  const groupPluginsBySite = () => {
    const grouped = {};
    filteredPlugins.forEach((plugin) => {
      if (!grouped[plugin.site]) {
        grouped[plugin.site] = [];
      }
      grouped[plugin.site].push(plugin);
    });
    return grouped;
  };
  
  const groupedPlugins = groupPluginsBySite();

  return (
    <div className="container-fluid p-4">
      {/* ... (filtros y resto del código igual) */}
  
      {/* Tabla de Plugins */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Lista de Plugins</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre del Site</th>
                  <th>Nombre del Plugin</th>
                  <th>Estado</th>
                  <th>Versión Actual</th>
                  <th>Versión Actualizada</th>
                  <th>Necesita Actualizar</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(groupedPlugins).length > 0 ? (
                  Object.entries(groupedPlugins).map(([site, plugins], siteIndex) => (
                    <React.Fragment key={siteIndex}>
                      {/* Fila del nombre del sitio */}
                      <tr className="table-primary">
                        <td>{site}</td>
                        <td colSpan="5"></td> {/* Ocupa el resto de la fila */}
                      </tr>
                      {/* Filas de plugins */}
                      {plugins.map((plugin, pluginIndex) => (
                        <tr key={pluginIndex}>
                          <td></td> {/* Celda vacía bajo Nombre del Site */}
                          <td>{plugin.name}</td>
                          <td>{plugin.status === "active" ? "Activo" : "Inactivo"}</td>
                          <td>{plugin.version || "N/A"}</td>
                          <td>{plugin.latestVersion || "N/A"}</td>
                          <td>{plugin.needsUpdate ? "Sí" : "No"}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No hay plugins que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      {/* Botón de Descarga */}
      <div className="text-end mt-4">
        <button className="btn btn-primary" onClick={downloadCSV}>
          Descargar CSV
        </button>
      </div>
    </div>
  );
};