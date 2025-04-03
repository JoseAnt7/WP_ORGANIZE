import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: null,
      user: null,
      plugins: [], // Añadimos plugins al store para almacenar la lista
      sites: [],   // Añadimos sites al store para los filtros
      error: null,
      message: null
    },
    actions: {
      login: async (username, password) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/login`,
            { username, password },
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            }
          );
          const store = getStore();
          setStore({ ...store, token: 'logged_in', user: username, error: null });
          return true;
        } catch (error) {
          setStore({ error: error.response?.data?.error || 'Error en el servidor' });
          return false;
        }
      },
      logout: () => {
        setStore({ token: null, user: null, error: null });
      },
      register: async (email, username, password) => {
        if (!email || !username || !password) {
          setStore({ error: 'Por favor, completa todos los campos' });
          return false;
        }
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/register`,
            { username, email, password },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
          setStore({ message: response.data.message });
          return true;
        } catch (error) {
          if (error.response) {
            setStore({ error: error.response.data.error || 'Error en el servidor' });
          } else if (error.request) {
            setStore({ error: 'No se pudo conectar al servidor' });
          } else {
            setStore({ error: 'Error inesperado' });
          }
          return false;
        }
      },
      // Nueva acción para obtener los plugins
      fetchPlugins: async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/plugins`, {
            headers: { 'Content-Type': 'application/json' },
          });
          const pluginsData = response.data; // Array de objetos con site, name, status, etc.
          
          // Extraer sitios únicos para el filtro
          const uniqueSites = [...new Set(pluginsData.map(item => item.site))];
          
          // Actualizar el store con los datos
          setStore({
            plugins: pluginsData,
            sites: uniqueSites,
            error: null
          });
        } catch (error) {
          if (error.response) {
            setStore({ error: error.response.data.error || 'Error al obtener los plugins' });
          } else if (error.request) {
            setStore({ error: 'No se pudo conectar al servidor' });
          } else {
            setStore({ error: 'Error inesperado' });
          }
        }
      }
    },
  };
};

export default getState;