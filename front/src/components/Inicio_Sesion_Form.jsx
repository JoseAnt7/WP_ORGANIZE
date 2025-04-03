import React, { useState } from "react";
import { useFlux } from "../context/FluxContext";
import { useNavigate } from "react-router-dom";

export const Session_Form = () => {

    const [usuario, SetUsuario] = useState('');
    const [passwd, SetPasswd] = useState('');
    const {store, actions} = useFlux();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.login(usuario, passwd)
        if(success) {
            navigate("/dashboard")
        }
    };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <img 
            src="https://via.placeholder.com/150x50?text=Logo+Empresa" 
            alt="Logo Empresa" 
            className="img-fluid" 
            style={{ maxHeight: "50px" }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Ingresa tu usuario"
              value={usuario} 
              required
              onChange={(e) => SetUsuario(e.target.value)} 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Ingresa tu contraseña" 
              value={passwd}
              required 
              onChange={(e) => SetPasswd(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};