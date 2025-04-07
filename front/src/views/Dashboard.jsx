import React, { useState } from "react";
import { Plugins } from "./ListaPlugins";
import { Plugin_List_API } from "./ListaPlugins_API";

export const Dashboard = () => {
  // Estado para controlar qué sección está activa
  const [activeSection, setActiveSection] = useState("plugins");

  // Contenido dinámico basado en la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case "plugins":
        return (
          <div className="p-4">
            <h2>Comprobar Lista de Plugins</h2>
            <p>Aquí iría tu componente o lógica para mostrar la lista de plugins.</p>
            {/* Ejemplo de placeholder */}
            <ul className="list-group">
              <Plugin_List_API />
            </ul>
          </div>
        );
      case "stats":
        return (
          <div className="p-4">
            <h2>Estadísticas</h2>
            <p>Aquí podrías mostrar gráficos o datos estadísticos.</p>
            {/* Ejemplo de placeholder */}
            <div className="alert alert-info">Gráfico de uso: 75% completado</div>
          </div>
        );
      case "settings":
        return (
          <div className="p-4">
            <h2>Configuración</h2>
            <p>Aquí irían las opciones de configuración.</p>
            {/* Ejemplo de placeholder */}
            <button className="btn btn-secondary">Guardar Cambios</button>
          </div>
        );
      default:
        return <div className="p-4"><h2>Bienvenido</h2><p>Selecciona una opción del menú.</p></div>;
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", minWidth: "250px" }}
      >
        <div className="text-center mb-4">
          <h4>Tech Dashboard</h4>
          <small className="text-muted">v1.0.0</small>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className={`nav-link text-white btn btn-link text-start ${activeSection === "plugins" ? "active" : ""}`}
              onClick={() => setActiveSection("plugins")}
            >
              Comprobar Lista de Plugins
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white btn btn-link text-start ${activeSection === "stats" ? "active" : ""}`}
              onClick={() => setActiveSection("stats")}
            >
              Estadísticas
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link text-white btn btn-link text-start ${activeSection === "settings" ? "active" : ""}`}
              onClick={() => setActiveSection("settings")}
            >
              Configuración
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-grow-1 bg-light">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h3 className="mb-0">Panel de Control</h3>
            <button className="btn btn-outline-danger">Cerrar Sesión</button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};