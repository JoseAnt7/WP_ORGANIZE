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

  return (
    <div className="container-fluid p-4">
      {/* Filtros en la parte superior */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Filtros</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Sitios Web</label>
              <select
                className="form-select"
                multiple={true}
                value={selectedSites === "all" ? ["all"] : selectedSites}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedSites(values.includes("all") ? "all" : values);
                }}
              >
                <option value="all">Todos</option>
                {(store.sites || []).map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Actualización</label>
              <select
                className="form-select"
                value={updateFilter}
                onChange={(e) => setUpdateFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="needs-update">Necesitan Actualizar</option>
                <option value="up-to-date">Actualizados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

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
                {filteredPlugins.length > 0 ? (
                  filteredPlugins.map((plugin, index) => (
                    <tr key={index}>
                      <td>{plugin.site}</td>
                      <td>{plugin.name}</td>
                      <td>{plugin.status === "active" ? "Activo" : "Inactivo"}</td>
                      <td>{plugin.version || "N/A"}</td>
                      <td>{plugin.latestVersion || "N/A"}</td>
                      <td>{plugin.needsUpdate ? "Sí" : "No"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No hay plugins que coincidan con los filtros.</td>
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