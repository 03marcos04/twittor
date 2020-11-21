// imports
importScripts('js/sw-utils.js');
// imports

// cache estatico que son los archivos necesarios
const STATIC_CACHE = 'static-v3';
// cache dinamico archivos no tan necesarios como imagenes
const DYNAMIC_CACHE = 'dynamic-v1';
// cache con archivos de librerias 
const INMUTABLE_CACHE = 'inmutable-v1';

// corazon de la aplicacion
// app shell normal es un arreglo de direcciones de archivos para que funcione mi aplicacion 
const APP_SHELL = [
        // '/',
        'index.html',
        'css/style.css',
        'img/favicon.ico',
        'img/avatars/hulk.jpg',
        'img/avatars/ironman.jpg',
        'img/avatars/spiderman.jpg',
        'img/avatars/thor.jpg',
        'img/avatars/wolverine.jpg',
        'js/app.js',
        'js/sw-utils.js'
    ]
    // app shell inmutable es un arreglo de direcciones de archivos que no son mios, librerias etc.
const APP_SHELL_INMUTABLE = [
        'https://fonts.googleapis.com/css?family=Quicksand:300,400',
        'https://fonts.googleapis.com/css?family=Lato:400,300',
        'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
        'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-brands-400.woff2',
        'css/animate.css',
        'js/libs/jquery.js'
    ]
    // instalacion de service worker
self.addEventListener('install', e => {
    // en una constante estamos grabando la instruccion de registrar los arreglos de caches en el cache del navegador
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    // los 2 caches los meto a una promesa all para recibir un arreglo de promesas
    const promesas = Promise.all([cacheStatic, cacheInmutable]);

    //espera a que terminen de ejecutarse las promesas
    e.waitUntil(promesas);
});

// instruccion para que cada que se haga un cambio en el service worker se borre el cache viejo
self.addEventListener('activate', e => {
    // si el cache es diferente lo borramos si no no
    const respuesta = caches.keys().then(keys => { // asi obtengo todos los caches
        keys.forEach(key => { // vamos a recorrer todos los keys del cache
            if ((key != STATIC_CACHE) && (key != DYNAMIC_CACHE) && (key != INMUTABLE_CACHE)) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
    // si el cache es diferente lo borramos si no no
});


// implementacion de estrategia de cache
// estrategia cache only
self.addEventListener('fetch', e => {
    // buscaremos en el cache algo que coincida con la peticion que se esta realizando para verificar si tenemos el archivo en el cache
    const respuesta = caches.match(e.request).then(res => { // el resultado de la busqueda del recurso en cache guardalo en la constante respuesta
        // una vez que ejecute la funcion vamos entrar en condiciones
        if (res) return res; // si la respuesta al archivo o la peticion existe regresala al navegador
        else {
            // console.error(e.request); // si el recurso solicitado no se encuentra en los caches retorta la peticion en un console.error para mostrar la pecicion en la pantalla
            return fetch(e.request).then(newRes => { // solicitamos el recurso que no tenemos en cache
                // llamos al service worker auxiliar
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            });
        }
    });
    // retorna la respuesta
    e.respondWith(respuesta);
})