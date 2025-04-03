import React, { createContext, useContext, useState } from 'react';
import getState from '../flux.js';

const FluxContext = createContext();

export const FluxProvider = ({ children }) => {
  // Estado inicial del store
  const initialStore = {
    token: null,
    user: null,
    error: null,
  };

  // Hooks de estado
  const [store, setStore] = useState(initialStore);

  // Funciones para pasar a getState
  const getStore = () => store;
  const getActions = () => actions;

  // Inicializar las acciones con las funciones ya definidas
  const actions = getState({ getStore, getActions, setStore }).actions;

  return (
    <FluxContext.Provider value={{ store, actions }}>
      {children}
    </FluxContext.Provider>
  );
};

export const useFlux = () => useContext(FluxContext);