import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de importarlo en index.js o aquí
import { useFlux } from "../context/FluxContext";
import { useNavigate } from "react-router-dom";

export const Register_Form = () => {

    const [email, SetEmail] = useState('');
    const [usuario, SetUsuario] = useState('');
    const [passwd, SetPasswd] = useState('');
    const {store, actions} = useFlux();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const success = await actions.register(usuario, email, passwd);
        if(success){
            navigate('/')
        }
    }

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
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="Ingresa tu correo" 
              required
              value={email}
              onChange={(e) => SetEmail(e.target.value)} 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              placeholder="Ingresa tu usuario" 
              required
              value={usuario}
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
              required 
              value={passwd}
              onChange={(e) => SetPasswd(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrarse</button>
        </form>
      </div>
    </div>
  );
};