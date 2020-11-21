// archivo auxiliar de logica

// actualizaCache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
    // si la peticion se hizo correctamente significa que tenemos datos
    if (res.ok) {
        // regresamos la respuesta
        // abrimos el cache dinamico y si abre el cache
        return caches.open(dynamicCache).then(cache => {
            // vamos a almacenar la peticion y la respuesta la clonamos
            cache.put(req, res.clone());
            // ahora tenemos que regresar algo por que si no no hizo nada y retornamos un clone de la respuesta
            return res.clone();
        })
    } else { // si la peticion fallo 
        console.error(res); // imprimimos en consola el error para verificar 
        return res; // regresamos la respuesta de la peticion
    }
}