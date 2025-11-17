// 1. Datos de Prueba

console.log('public/script.js loaded');

const videojuegos = [
  { id: 1, nombre: "Fortnite", descripcion: "Battle Royale · Acción · Multiplataforma", rating: 4.5, imagen: "https://via.placeholder.com/600x400?text=Fortnite" },
  { id: 2, nombre: "Among Us", descripcion: "Social · Multijugador · PC/Mobile", rating: 4.4, imagen: "https://via.placeholder.com/600x400?text=Among+Us" },
  { id: 3, nombre: "Roblox", descripcion: "Sandbox · Creativo · Multiplataforma", rating: 4.6, imagen: "https://via.placeholder.com/600x400?text=Roblox" },
  { id: 4, nombre: "Valorant", descripcion: "FPS Táctico · Acción · PC", rating: 4.7, imagen: "https://via.placeholder.com/600x400?text=Valorant" },
  { id: 5, nombre: "Minecraft", descripcion: "Sandbox · Creativo · Multiplataforma", rating: 4.8, imagen: "https://via.placeholder.com/600x400?text=Minecraft" },
  { id: 6, nombre: "Apex Legends", descripcion: "Battle Royale · FPS · Multiplataforma", rating: 4.5, imagen: "https://via.placeholder.com/600x400?text=Apex+Legends" },
  { id: 7, nombre: "Elden Ring", descripcion: "RPG · Acción · PC/PS5/Xbox", rating: 4.9, imagen: "https://via.placeholder.com/600x400?text=Elden+Ring" },
  { id: 8, nombre: "Genshin Impact", descripcion: "RPG · Acción · Multiplataforma", rating: 4.6, imagen: "https://via.placeholder.com/600x400?text=Genshin+Impact" },
  { id: 9, nombre: "The Witcher 3", descripcion: "RPG · Aventura · PC/Consolas", rating: 4.9, imagen: "https://via.placeholder.com/600x400?text=The+Witcher+3" },
  { id: 10, nombre: "Stardew Valley", descripcion: "Simulación · Casual · Multiplataforma", rating: 4.7, imagen: "https://via.placeholder.com/600x400?text=Stardew+Valley" },
  { id: 11, nombre: "Hollow Knight", descripcion: "Aventura · Indie · PC/Consolas", rating: 4.6, imagen: "https://via.placeholder.com/600x400?text=Hollow+Knight" },
  { id: 12, nombre: "Subway Surfers", descripcion: "Acción · Casual · Mobile", rating: 4.5, imagen: "https://via.placeholder.com/600x400?text=Subway+Surfers" },
  { id: 13, nombre: "League of Legends", descripcion: "MOBA · Multijugador · PC", rating: 4.6, imagen: "https://via.placeholder.com/600x400?text=LOL" },
  { id: 14, nombre: "Rocket League", descripcion: "Deporte · Multijugador · Multiplataforma", rating: 4.5, imagen: "https://via.placeholder.com/600x400?text=Rocket+League" },
  { id: 15, nombre: "Hades", descripcion: "Acción · Roguelike · Indie", rating: 4.7, imagen: "https://via.placeholder.com/600x400?text=Hades" },
  { id: 16, nombre: "Counter-Strike 2", descripcion: "FPS · Competitivo · PC", rating: 4.6, imagen: "https://via.placeholder.com/600x400?text=CS2" },
  { id: 17, nombre: "PUBG", descripcion: "Battle Royale · Acción · Multiplataforma", rating: 4.4, imagen: "https://via.placeholder.com/600x400?text=PUBG" },
  { id: 18, nombre: "Overwatch 2", descripcion: "FPS · Team · Multiplataforma", rating: 4.5, imagen: "https://via.placeholder.com/600x400?text=Overwatch" },
  { id: 19, nombre: "Persona 5", descripcion: "JRPG · Narrativa · PS4/PC", rating: 4.8, imagen: "https://via.placeholder.com/600x400?text=Persona+5" },
  { id: 20, nombre: "God of War", descripcion: "Acción · Aventura · PS4/PS5", rating: 4.8, imagen: "https://via.placeholder.com/600x400?text=God+of+War" },
];

document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos de la UI
  const grid = document.querySelector('#grid-videojuegos');
  const searchInput = document.querySelector('#search-input');
  const searchBtn = document.querySelector('#search-btn');
  const storeSelect = document.querySelector('#store-select');
  const sortSelect = document.querySelector('#sort-select');
  const loadMoreBtn = document.querySelector('#load-more');
  const loadingIndicator = document.querySelector('#loading-indicator');
  const errorIndicator = document.querySelector('#error-indicator');
  const progressBar = document.querySelector('#progress-bar');
  const resultsCount = document.querySelector('#results-count');
  const modal = document.querySelector('#modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalImage = document.querySelector('#modal-image');
  const modalDesc = document.querySelector('#modal-desc');
  const modalNormal = document.querySelector('#modal-normal');
  const modalSale = document.querySelector('#modal-sale');
  const modalLink = document.querySelector('#modal-link');
  const modalClose = document.querySelector('#modal-close');

  if (!grid) {
    console.error('No se encontró el elemento con id "grid-videojuegos".');
    return;
  }

  const API_BASE = 'https://www.cheapshark.com/api/1.0';

  function showLoading(show) {
    if (!loadingIndicator) return;
    loadingIndicator.classList.toggle('hidden', !show);
    
    // Animar barra de progreso
    if (show) {
      if (progressBar) {
        progressBar.classList.remove('hidden');
        progressBar.style.width = '10%';
        // Animación gradual mientras carga
        const interval = setInterval(() => {
          const currentWidth = parseFloat(progressBar.style.width);
          if (currentWidth < 90) {
            progressBar.style.width = (currentWidth + Math.random() * 30) + '%';
          }
        }, 500);
        // Guardar el interval en el elemento para poder limpiarlo después
        progressBar._loadingInterval = interval;
      }
    } else {
      // Completar la barra de progreso
      if (progressBar && progressBar._loadingInterval) {
        clearInterval(progressBar._loadingInterval);
        progressBar.style.width = '100%';
        // Ocultar despues de la animacion
        setTimeout(() => {
          progressBar.classList.add('hidden');
          progressBar.style.width = '0%';
        }, 500);
      }
    }
  }

  function showError(msg) {
    if (!errorIndicator) return;
    if (msg) {
      errorIndicator.textContent = msg;
      errorIndicator.classList.remove('hidden');
    } else {
      errorIndicator.classList.add('hidden');
    }
  }

  function normalizeJuego(juego) {
   // Normalizar tanto las estructuras de acuerdos locales como las de la API a campos comunes utilizados en la plantilla
    const title = juego.nombre || juego.title || juego.external || 'Sin título';
    const image = juego.imagen || juego.thumb || '';
    const description = juego.descripcion || juego.saleText || '';
    const salePrice = juego.salePrice || juego.sale || '0';
    const normalPrice = juego.normalPrice || juego.retailPrice || juego.retail || '0';
    const savings = juego.savings || juego.descuento || 0;
    const id = juego.id || juego.dealID || juego.gameID || '';
    const url = juego.dealID ? `https://www.cheapshark.com/redirect?dealID=${juego.dealID}` : (juego.url || '#');
    return { id, title, image, description, salePrice, normalPrice, savings, url };
  }

  // Funcion auxiliar para crear una tarjeta de juego
  function crearCard(juego) {
    const card = document.createElement('article');
    card.className = 'bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer';
    card.innerHTML = `
      <div class="relative overflow-hidden h-40">
        ${/* asegurar que nunca se deje src vacío y fijar tamaño para evitar icono gigante */''}
        <img src="${juego.image || 'https://via.placeholder.com/600x400?text=No+image'}" alt="${juego.title}" class="w-full h-40 sm:h-48 md:h-44 lg:h-48 object-cover hover:scale-110 transition-transform duration-300" loading="lazy" />
        <div class="absolute top-2 right-2 bg-gradient-to-r from-teal-500 to-sky-600 text-white px-3 py-1 rounded-full text-xs font-bold">${Math.round(juego.savings)}% OFF</div>
      </div>
      <div class="p-4 flex flex-col gap-2 flex-1">
        <h3 class="font-bold text-slate-900 leading-tight text-sm">${juego.title}</h3>
        <p class="text-xs text-slate-500">${juego.description}</p>
        <div class="mt-auto space-y-2">
          <p class="text-sm text-slate-700"><span class="font-black text-emerald-600">${juego.salePrice ? '$' + juego.salePrice : '—'}</span></p>
          ${juego.normalPrice ? `<p class="text-xs text-slate-400 line-through">$${juego.normalPrice}</p>` : ''}
        </div>
        <button class="mt-3 w-full bg-gradient-to-r from-sky-600 to-teal-600 text-white py-2 rounded-lg text-xs font-bold hover:shadow-lg transition transform hover:scale-105" data-url="${juego.url}" data-title="${encodeURIComponent(juego.title)}" data-image="${juego.image}" data-normal="${juego.normalPrice}" data-sale="${juego.salePrice}">🎮 Ver detalle</button>
      </div>
    `;

    const imgEl = card.querySelector('img');
    if (imgEl) {
      imgEl.addEventListener('error', () => {
        imgEl.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
        imgEl.alt = 'Imagen no disponible';
      });
    }

    const btn = card.querySelector('button');
    if (btn) {
      btn.addEventListener('click', () => {
        const title = decodeURIComponent(btn.dataset.title || '');
        const image = btn.dataset.image;
        const normal = btn.dataset.normal;
        const sale = btn.dataset.sale;
        const url = btn.dataset.url;

        modalTitle.textContent = title;
        modalImage.src = image || 'https://via.placeholder.com/600x400?text=No+image';
        modalDesc.textContent = '';
        modalNormal.textContent = normal ? '$' + normal : '—';
        modalSale.textContent = sale ? '$' + sale : '—';
        modalLink.href = url || '#';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });
    }

    return card;
  }

  // fallback para la imagen del modal en caso de error
  if (modalImage) {
    modalImage.addEventListener('error', () => {
      modalImage.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
      modalImage.alt = 'Imagen no disponible';
    });
  }

  function renderizarVideojuegos(lista) {
    // Limpia el grid antes de renderizar evita duplicados
    console.log('🧹 [Renderizar] Limpiando grid...');
    grid.innerHTML = '';

    if (!lista || !lista.length) {
      resultsCount.textContent = '0 resultados';
      console.warn('⚠️ [Renderizar] Lista vacía');
      return;
    }

    // Guardar juegos actuales para poder ordenar despues
    juegosActuales = lista.slice();
    
    resultsCount.textContent = `${lista.length} resultados`;

    lista.forEach((j) => {
      const juego = normalizeJuego(j);
      const card = crearCard(juego);
      grid.appendChild(card);
    });

    console.log(`✅ [Renderizar] ${lista.length} juegos renderizados sin duplicados`);
  }

  // API helpers
  async function fetchStores() {
    try {
      const res = await fetch(`${API_BASE}/stores`);
      if (!res.ok) {
        throw new Error(`Error al cargar tiendas: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Respuesta de tiendas inválida');
      }
      console.log(`✓ Tiendas cargadas: ${data.length}`);
      return data;
    } catch (e) {
      console.error('❌ Error en fetchStores:', e.message);
      showError(`No se pudieron cargar las tiendas: ${e.message}`);
      return [];
    }
  }

  async function fetchDeals({ storeID = '', pageSize = 20, pageNumber = 0, title = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (storeID) params.set('storeID', storeID);
      if (pageSize) params.set('pageSize', pageSize);
      if (pageNumber) params.set('pageNumber', pageNumber);
      if (title) params.set('title', title);
      const url = `${API_BASE}/deals?${params.toString()}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Error al cargar ofertas: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Respuesta de ofertas inválida');
      }
      console.log(`✓ Ofertas cargadas: ${data.length} (página ${pageNumber})`);
      return data;
    } catch (e) {
      console.error('❌ Error en fetchDeals:', e.message);
      throw e;
    }
  }

  async function fetchGamesByTitle(title) {
    try {
      if (!title || title.trim() === '') {
        throw new Error('Ingresa un término de búsqueda');
      }
      const params = new URLSearchParams();
      params.set('title', title);
      params.set('limit', 20);
      const res = await fetch(`${API_BASE}/games?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Error en búsqueda: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Respuesta de búsqueda inválida');
      }
      console.log(`✓ Búsqueda completada: ${data.length} juegos encontrados`);
      return data;
    } catch (e) {
      console.error('❌ Error en fetchGamesByTitle:', e.message);
      throw e;
    }
  }

  // State
  let pageNumber = 0;
  const pageSize = 20;
  let juegosActuales = []; // Guardar juegos actuales para poder ordenarlos

  // Cargar tiendas y poblar el selector
  async function cargarTiendas() {
    try {
      console.log('📥 Iniciando carga de tiendas...');
      const stores = await fetchStores();
      if (stores && stores.length) {
        // Limpiar opciones previas excepto "Todas las tiendas"
        const opcionesExistentes = storeSelect.querySelectorAll('option');
        opcionesExistentes.forEach((opt, idx) => {
          if (idx > 0) opt.remove(); // Mantener la primera opcion
        });

        // Añadir tiendas
        stores.forEach(store => {
          const opt = document.createElement('option');
          opt.value = store.storeID;
          opt.textContent = store.storeName;
          storeSelect.appendChild(opt);
        });
        console.log(`✓ ${stores.length} tiendas cargadas exitosamente`);
        return true;
      } else {
        console.warn('⚠️ No se cargaron tiendas, usando solo opción "Todas las tiendas"');
        return false;
      }
    } catch (e) {
      console.error('❌ Error al cargar tiendas:', e.message);
      showError(`Error cargando tiendas: ${e.message}`);
      return false;
    }
  }

  // Cargar inicial: intenta API y si falla usa los locales
  async function cargarVideojuegosInicial() {
    try {
      showError('');
      showLoading(true);
      console.log('🚀 Iniciando carga inicial de juegos...');

      // Cargar tiendas en paralelo
      const tiendasCargadas = await cargarTiendas();

      // Cargar deals iniciales (Steam = storeID 1)
      console.log('📥 Solicitando ofertas iniciales desde Steam (CheapShark API)...');
      const datos = await fetchDeals({ storeID: 1, pageSize, pageNumber: 0 });

      if (datos && datos.length > 0) {
        console.log(`✓ ${datos.length} juegos cargados exitosamente desde la API`);
        window._juegosCache = datos;
        renderizarVideojuegos(datos);
        showError(''); // Limpiar cualquier error previo
      } else {
        throw new Error('La API devolvió resultados vacíos');
      }
    } catch (e) {
      console.error('❌ Error al cargar desde API:', e.message);
      console.log('⚠️ Usando juegos locales como fallback...');
      
      // fallback: usa el array local `videojuegos` si existe
      if (typeof videojuegos !== 'undefined' && Array.isArray(videojuegos) && videojuegos.length > 0) {
        console.log(`✓ ${videojuegos.length} juegos locales cargados como fallback`);
        renderizarVideojuegos(videojuegos);
        showError(`⚠️ API no disponible. Mostrando ${videojuegos.length} juegos locales (algunos datos podrían no ser actuales)`);
      } else {
        console.error('❌ No hay datos disponibles (ni API ni datos locales)');
        showError(`❌ Error: No se pudieron cargar los juegos. ${e.message}`);
      }
    } finally {
      showLoading(false);
    }
  }

  // Busqueda usando /games?title=texto&limit=20 y luego obtener deals por title
  async function buscarPorTitulo(text) {
    try {
      if (!text || text.trim() === '') {
        showError('Por favor ingresa un término de búsqueda');
        return;
      }
      
      showError('');
      showLoading(true);
      pageNumber = 0;
      
      console.log(`🔍 Buscando: "${text}"`);
      const deals = await fetchDeals({ title: text, storeID: storeSelect.value, pageSize, pageNumber });
      
      if (deals && deals.length > 0) {
        console.log(`✓ Búsqueda exitosa: ${deals.length} resultados`);
        renderizarVideojuegos(deals);
        showError('');
      } else {
        console.warn('⚠️ No se encontraron resultados');
        showError(`No se encontraron juegos para "${text}". Intenta con otro término.`);
        grid.innerHTML = '';
        resultsCount.textContent = 'Sin resultados';
      }
    } catch (e) {
      console.error('❌ Error en búsqueda:', e.message);
      showError(`❌ Error en la búsqueda: ${e.message}`);
    } finally {
      showLoading(false);
    }
  }

  // Filtrar por tienda
  async function filtrarPorTienda() {
    try {
      showError('');
      showLoading(true);
      pageNumber = 0;
      const storeID = storeSelect.value || '';
      const storeName = storeSelect.options[storeSelect.selectedIndex].text;
      console.log(`🏪 Filtrando por: ${storeName || 'Todas las tiendas'}`);
      
      const deals = await fetchDeals({ storeID, pageSize, pageNumber });
      
      if (deals && deals.length > 0) {
        console.log(`✓ Se encontraron ${deals.length} juegos en ${storeName}`);
        renderizarVideojuegos(deals);
        showError('');
      } else {
        console.warn(`⚠️ No hay juegos disponibles en ${storeName}`);
        showError(`No hay juegos disponibles en ${storeName}`);
        grid.innerHTML = '';
        resultsCount.textContent = 'Sin resultados';
      }
    } catch (e) {
      console.error('❌ Error al filtrar por tienda:', e.message);
      showError(`Error al filtrar: ${e.message}`);
    } finally {
      showLoading(false);
    }
  }

  // Cargar mas resultados (mantiene el filtro de tienda si existe)
  async function cargarMas() {
    try {
      showError('');
      showLoading(true);
      pageNumber += 1;
      const storeID = storeSelect.value || '';
      console.log(`⬇️ Cargando página ${pageNumber}...`);
      
      const more = await fetchDeals({ storeID, pageNumber, pageSize });
      
      if (more && more.length > 0) {
        console.log(`✓ ${more.length} juegos cargados (página ${pageNumber})`);
        showError('');
        
        // Agregar juegos al estado y al grid (sin duplicados)
        more.forEach((deal) => {
          const juego = normalizeJuego(deal);
          const card = crearCard(juego);
          grid.appendChild(card);
        });
        
        // Actualizar estado y contador
        juegosActuales = juegosActuales.concat(more.map(normalizeJuego));
        resultsCount.textContent = `${juegosActuales.length} resultados`;
        console.log(`✅ Total de juegos en pantalla: ${juegosActuales.length}`);
      } else {
        console.warn('⚠️ No hay más juegos disponibles');
        showError('No hay más juegos disponibles');
        pageNumber -= 1; // Revertir incremento si no hay más resultados
      }
    } catch (e) {
      console.error('❌ Error al cargar más resultados:', e.message);
      showError(`Error cargando más: ${e.message}`);
      pageNumber -= 1; // Revertir incremento en caso de error
    } finally {
      showLoading(false);
    }
  }

  // Funcion para ordenar resultados
  function ordenarResultados() {
    const orden = sortSelect.value;
    let juegosOrdenados = juegosActuales.slice(); // Copia sin modificar original

    if (orden === 'precio_asc') {
      // Ordenar por precio de venta ascendente
      juegosOrdenados.sort((a, b) => {
        const precioA = parseFloat(a.salePrice || a.sale || a.normalPrice || a.retail || 999);
        const precioB = parseFloat(b.salePrice || b.sale || b.normalPrice || b.retail || 999);
        return precioA - precioB;
      });
      console.log('Ordenado por precio ascendente');
    } else if (orden === 'precio_desc') {
      // Ordenar por precio de venta descendente
      juegosOrdenados.sort((a, b) => {
        const precioA = parseFloat(a.salePrice || a.sale || a.normalPrice || a.retail || 0);
        const precioB = parseFloat(b.salePrice || b.sale || b.normalPrice || b.retail || 0);
        return precioB - precioA;
      });
      console.log('Ordenado por precio descendente');
    } else if (orden === 'descuento') {
      // Ordenar por mayor descuento
      juegosOrdenados.sort((a, b) => {
        const descA = parseFloat(a.savings || a.descuento || 0);
        const descB = parseFloat(b.savings || b.descuento || 0);
        return descB - descA; // Mayor descuento primero
      });
      console.log('Ordenado por mayor descuento');
    }
    // Si no hay orden especifica, mantener orden por defecto

    renderizarVideojuegos(juegosOrdenados);
  }

  // Eventos UI
  if (searchBtn) searchBtn.addEventListener('click', ()=>{ const q = searchInput.value.trim(); if(q) buscarPorTitulo(q); });
  if (searchInput) searchInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ const q=searchInput.value.trim(); if(q) buscarPorTitulo(q); }});
  if (storeSelect) storeSelect.addEventListener('change', filtrarPorTienda);
  if (sortSelect) sortSelect.addEventListener('change', ordenarResultados);
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', cargarMas);
  if (modalClose) modalClose.addEventListener('click', ()=>{ modal.classList.add('hidden'); modal.classList.remove('flex'); });
  if (modal) modal.addEventListener('click',(e)=>{ if(e.target===modal){ modal.classList.add('hidden'); modal.classList.remove('flex'); }});

  // Inicializar: render local mínimo y luego intentar cargar desde API
  // Mantengo tu render original como fallback
  try {
    // Mostrar los locales primero si existen
    if (typeof videojuegos !== 'undefined' && Array.isArray(videojuegos) && videojuegos.length) {
      renderizarVideojuegos(videojuegos);
    }
  } catch(e) {
    console.error(e);
  }

  // Cargar desde API y sobreescribir si hay datos
console.log('⏳ Mostrando juegos locales mientras carga la API...');
renderizarVideojuegos(videojuegos);
cargarVideojuegosInicial();

    // Cargar tiendas en segundo plano
    console.log('⏳ Intentando cargar tiendas desde API...');
    cargarTiendas().catch(e => {
      console.warn('⚠️ No se pudieron cargar las tiendas desde API:', e.message);
    });
});

