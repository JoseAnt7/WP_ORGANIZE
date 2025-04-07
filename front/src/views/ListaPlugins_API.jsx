import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useFlux } from "../context/FluxContext";

export const Plugin_List_API = () => {
  const { store = {}, actions } = useFlux();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlugins = async () => {
      if (!store.apiPlugins?.length) {
        await actions.fetchApiPlugins();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadPlugins();
  }, [actions, store.apiPlugins]);

  const groupPluginsBySite = () => {
    const grouped = {};
    (store.apiPlugins || []).forEach((plugin) => {
      if (!grouped[plugin.site]) {
        grouped[plugin.site] = [];
      }
      grouped[plugin.site].push(plugin);
    });
    return grouped;
  };

  const groupedPlugins = groupPluginsBySite();

  const downloadCSV = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const csvContent = [
      "Nombre del Site,Nombre del Plugin,Estado,Versión Actual,Versión Actualizada,Necesita Actualizar",
      ...(store.apiPlugins || []).map((plugin) =>
        `${plugin.site},${plugin.name},${plugin.status},${plugin.version || "N/A"},${plugin.latestVersion || "N/A"},${plugin.needsUpdate ? "Sí" : "No"}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentDate}_api_plugins.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  console.log("store.apiPlugins:", store.apiPlugins); // Depuración

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center">
          <h5>Cargando plugins desde API...</h5>
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
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Lista de Plugins (API REST)</h5>
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
                      <tr className="table-primary">
                        <td>{site}</td>
                        <td colSpan="5"></td>
                      </tr>
                      {plugins.map((plugin, pluginIndex) => (
                        <tr key={pluginIndex}>
                          <td></td>
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
                      No hay plugins disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-end mt-4">
        <button className="btn btn-primary" onClick={downloadCSV}>
          Descargar CSV
        </button>
      </div>
    </div>
  );
};