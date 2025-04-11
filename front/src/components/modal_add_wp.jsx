import React, { useContext, useState } from "react";
import { useFlux } from "../context/FluxContext";

export const Add_WP = () => {

    const {store, actions} = useFlux();

    const [url, SetUrl] = useState('');
    const [user, SetUser] = useState('')
    const [claveAPI, SetClaveAPI] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.add_wp(url, user, claveAPI);
        if (success) {
          alert("Se ha subido el site correctamente");
        } else {
          alert("Hubo un error al subir el site: " + store.error);
        }
      };

    return (
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Añadir Site Wordpress</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body w-100">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="URL del site" value={url} onChange={(e) => SetUrl(e.target.value)}/>
                            </div>
                            <div class="mb-3">
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Usuario de Wordpress" value={user} onChange={(e) => SetUser(e.target.value)}/>
                            </div>
                            <div class="mb-3">
                                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Clave API de del site del usuario" value={claveAPI} onChange={(e) => SetClaveAPI(e.target.value)}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    )

}