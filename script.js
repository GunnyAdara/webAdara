// --- Constantes y Estado Global ---
// SE ELIMINARON: impactChartInstance, simulatedImpactData, TARGET_*, COST_PER_RESIDENT_*

// --- Funciones de Ayuda (Helpers) ---

/**
 * Formatea un número con comas como separadores de miles. (Se mantiene por si se usa en otras partes)
 * @param {number|string} number - El número a formatear.
 * @returns {string} El número formateado o '--' si la entrada no es válida.
 */
function formatNumberWithCommas(number) {
    const num = parseFloat(number);
    if (isNaN(num) || number === null) return '--';
    return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(num);
}

/**
 * Formatea un número como moneda (MXN) con comas y símbolo de peso. (Se mantiene por si se usa en otras partes)
 * @param {number|string} number - El número a formatear.
 * @returns {string} El número formateado como moneda o '$--' si la entrada no es válida.
 */
function formatCurrency(number) {
    const num = parseFloat(number);
    if (isNaN(num) || number === null) return '$--';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(num);
}

/**
 * Muestra un mensaje de estado (éxito o error) en un contenedor específico. (Se mantiene)
 * @param {string} containerId - El ID del elemento contenedor donde mostrar el mensaje.
 * @param {string} message - El mensaje a mostrar.
 * @param {'success' | 'error'} type - El tipo de mensaje ('success' o 'error').
 */
function showStatusMessage(containerId, message, type = 'success') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Status container #${containerId} not found.`);
        return;
    }
    const messageClass = type === 'success' ? 'text-adara-success' : 'text-adara-error';
    container.innerHTML = `<p class="${messageClass} text-sm font-medium">${message}</p>`;
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        if (container.innerHTML.includes(message)) { // Verificar si el mensaje sigue ahí
            container.innerHTML = '';
        }
    }, 5000);
}

// --- Popup Handling (General + Video + Imagen) --- (Se mantiene sin cambios)

/**
 * Abre un popup y maneja el foco.
 * @param {string} popupId - El ID del popup a abrir.
 * @param {string|null} [reason=null] - Motivo opcional para preseleccionar en formularios de ayuda.
 */
function openPopup(popupId, reason = null) {
    const popup = document.getElementById(popupId);
    if (!popup) {
        console.error(`Popup #${popupId} not found.`);
        return;
    }
    popup.style.display = 'flex';
    requestAnimationFrame(() => { // Asegura que el display flex se aplique antes de la transición
        popup.classList.add('active');
    });
    document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
    console.log(`Popup #${popupId} opened. Reason: ${reason}`);

    // Preseleccionar motivo en popup de ayuda si se proporciona
    if (popupId === 'helpPopup' && reason) {
        setTimeout(() => { // Dar tiempo a que se genere el form si es dinámico
            const reasonSelect = popup.querySelector('#popupHelpLeadReason'); // ID específico del select en popup
            if (reasonSelect) {
                 let foundOption = Array.from(reasonSelect.options).find(option =>
                    option.value === reason || option.textContent.includes(reason)
                 );
                 if (foundOption) {
                    reasonSelect.value = foundOption.value;
                 } else {
                    const defaultOption = reasonSelect.querySelector('option[value="Consulta General"]'); // Intentar preseleccionar esta si existe
                    const infoOption = reasonSelect.querySelector('option[value="info_programs"]');
                    if(defaultOption) {
                         reasonSelect.value = "Consulta General";
                    } else if (infoOption) {
                         reasonSelect.value = 'info_programs';
                    } else if (reasonSelect.options.length > 1) {
                         reasonSelect.value = reasonSelect.options[1].value; // Fallback a la segunda opción
                    } else {
                         reasonSelect.value = ''; // O dejar vacío si no hay opciones
                    }
                 }
            }
        }, 150);
    }

     // Mover foco al primer elemento interactivo o al botón de cierre
     setTimeout(() => {
         const firstFocusable = popup.querySelector('button:not(.popup-close), [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
         const closeButton = popup.querySelector('.popup-close');
         if (firstFocusable && firstFocusable !== closeButton) {
             try { firstFocusable.focus(); } catch(e) { closeButton?.focus(); }
         } else if (closeButton) {
             closeButton.focus();
         }
     }, 150);
}

/**
 * Cierra un popup.
 * @param {string} popupId - El ID del popup a cerrar.
 */
function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup && popup.classList.contains('active')) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            if (popupId === 'videoPopup') {
                const iframe = document.getElementById('videoPopupIframe');
                if (iframe) iframe.src = '';
            }
            if (popupId === 'imagePopup') {
                 const img = document.getElementById('imagePopupImg');
                 if (img) img.src = '';
            }
            if (!document.querySelector('.popup.active')) { document.body.style.overflow = 'auto'; }
        }, 300); // Duración de la transición de opacidad
        // console.log(`Popup #${popupId} closed.`);
    }
}

function openVideoPopup(youtubeId) {
    const popup = document.getElementById('videoPopup');
    const iframe = document.getElementById('videoPopupIframe');
    if (!popup || !iframe) { console.error("Video popup or iframe not found."); return; }
    // Usar el formato embed correcto para YouTube
    const videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    iframe.src = videoSrc;
    openPopup('videoPopup');
    setTimeout(() => { try { iframe.focus(); } catch(e){ console.warn("Could not focus video iframe"); } }, 150);
}
function closeVideoPopup() { closePopup('videoPopup'); }

function openImagePopup(imageSrc) {
    const popup = document.getElementById('imagePopup');
    const imgElement = document.getElementById('imagePopupImg');
    if (!popup || !imgElement) { console.error("Image popup or img element not found."); return; }
    imgElement.src = imageSrc;
    openPopup('imagePopup');
     setTimeout(() => {
         const closeButton = popup.querySelector('.popup-close');
         closeButton?.focus();
     }, 150);
}

function initializePopupClosers() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', (event) => {
            // Cerrar si se hace clic directamente en el fondo del popup
            if (event.target === popup) { closePopup(popup.id); }
        });
    });
    // Cerrar popups con la tecla Escape
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activePopup = document.querySelector('.popup.active');
            if (activePopup) { closePopup(activePopup.id); }
        }
    });
    // console.log("Global popup close listeners initialized.");
}


// --- Menú Móvil --- (Se mantiene sin cambios)
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenuButton || !mobileMenu) { return; }

    mobileMenuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        const icon = mobileMenuButton.querySelector('i');
        if (icon) { icon.classList.toggle('fa-bars', !isHidden); icon.classList.toggle('fa-times', isHidden); }
        mobileMenuButton.setAttribute('aria-label', isHidden ? 'Cerrar menú' : 'Abrir menú');
    });

    const helpButtonMobile = document.getElementById('openHelpPopupBtnMobile');
    const donateButtonMobile = document.getElementById('openDonatePopupBtnMobile');

    const closeMobileMenu = () => {
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
             mobileMenuButton.setAttribute('aria-label', 'Abrir menú');
        }
    };

    if(helpButtonMobile) {
        helpButtonMobile.addEventListener('click', () => {
            openPopup('helpPopup', 'Consulta General');
            closeMobileMenu();
        });
    }

    if(donateButtonMobile) {
        donateButtonMobile.addEventListener('click', () => {
            openPopup('donatePopup');
            closeMobileMenu();
        });
    }
    
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(item => {
        item.addEventListener('click', closeMobileMenu);
    });
    // console.log("Mobile menu initialized.");
}

// --- Animación Scroll Reveal --- (Se mantiene sin cambios)
function initializeScrollReveal() {
     const revealElements = document.querySelectorAll('.reveal-on-scroll');
     if ('IntersectionObserver' in window) {
         const observer = new IntersectionObserver((entries, observer) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     const delay = entry.target.style.getPropertyValue('--reveal-delay');
                     entry.target.style.transitionDelay = delay || '0s';
                     entry.target.classList.add('is-visible');
                     observer.unobserve(entry.target);
                 }
             });
         }, { threshold: 0.1 });
         revealElements.forEach(el => observer.observe(el));
     } else {
         revealElements.forEach(el => el.classList.add('is-visible'));
     }
     // console.log("Scroll reveal initialized.");
}

// --- Gráfico de Impacto y Slider (ANTERIOR - ELIMINADO) ---
// SE ELIMINARON: initializeImpactChart, simulateImpactData, renderImpactChart, updateSummaryStats, highlightChartPoint

// --- Animación Stats Grandes (ANTERIOR - ELIMINADO) ---
// SE ELIMINÓ: animateStats (La nueva sección no usa data-count para KPIs)

// --- Carrusel de Videos --- (Se mantiene sin cambios)
function initializeVideoCarousel() {
    const container = document.querySelector('.video-carousel-container');
    if (!container) { return; }

    const track = container.querySelector('.video-carousel-track');
    const slides = Array.from(track.querySelectorAll('.video-slide'));
    const prevButton = container.querySelector('.video-carousel-button.prev');
    const nextButton = container.querySelector('.video-carousel-button.next');

    if (slides.length === 0) {
        if(prevButton) prevButton.style.display = 'none';
        if(nextButton) nextButton.style.display = 'none';
        return;
    }

    let slidesToShow = 1;
    let currentGroupIndex = 0; 

    function calculateSlidesToShow() {
        if (window.innerWidth >= 1024) { slidesToShow = 3; }
        else if (window.innerWidth >= 640) { slidesToShow = 2; }
        else { slidesToShow = 1; }
        
        const maxGroupIndex = Math.max(0, Math.ceil(slides.length / slidesToShow) - 1);
        currentGroupIndex = Math.min(currentGroupIndex, maxGroupIndex);
        updateCarouselPosition(false); 
        updateButtonStates();
    }

    function updateCarouselPosition(animate = true) {
        const offsetPercentage = -currentGroupIndex * 100;
        track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(${offsetPercentage}%)`;
    }

    function updateButtonStates() {
        if (!prevButton || !nextButton) return;
        const maxGroupIndex = Math.max(0, Math.ceil(slides.length / slidesToShow) - 1);
        prevButton.disabled = currentGroupIndex === 0;
        nextButton.disabled = currentGroupIndex >= maxGroupIndex;
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const maxGroupIndex = Math.ceil(slides.length / slidesToShow) - 1;
            if (currentGroupIndex < maxGroupIndex) {
                currentGroupIndex++;
                updateCarouselPosition();
                updateButtonStates();
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentGroupIndex > 0) {
                currentGroupIndex--;
                updateCarouselPosition();
                updateButtonStates();
            }
        });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculateSlidesToShow, 250);
    });

    calculateSlidesToShow(); 
    // console.log("Video carousel initialized.");
}

// --- Lógica de Sucursales y Mapa (Sección Contacto) --- (Se mantiene sin cambios)
const sucursalesData = {
    cancun: { direccion: "Av. López Portillo Mza. 18 Lote. 11, Región 91. Cancún, Quintana Roo, C.P. 77516", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.338786611574!2d-86.84976368450511!3d21.13876298593874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2efe1ee75e4d%3A0x2d4e7fcb6ff61b91!2sFundacion%20Adara!5e0!3m2!1ses!2smx!4v1678886609634!5m2!1ses!2smx", nombre: "Cancún" },
    leona: { direccion: "Carretera Cancún-Mérida Km 298, Leona Vicario, Quintana Roo, C.P. 77590", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.007813602551!2d-87.20009968450689!3d21.07193698597377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4ea07b68428957%3A0x8b7f1f5eb5776a82!2sFundaci%C3%B3n%20Adara%20-%20Leona%20Vicario!5e0!3m2!1ses!2smx!4v1678886737684!5m2!1ses!2smx", nombre: "Leona Vicario" },
    cuernavaca: { direccion: "Privada Heliotropo #100, Col. Teopanzolco, Cuernavaca, Morelos, C.P. 62350", mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.01408642858!2d-99.2149696845794!3d18.97472798714614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cdde4d0c0e1f5f%3A0xb9d3c597a8e7f6f1!2sFundaci%C3%B3n%20Adara%20-%20Cuernavaca!5e0!3m2!1ses!2smx!4v1678886803235!5m2!1ses!2smx", nombre: "Cuernavaca" }
};
function showBranchInfo(branchKey) {
    const branch = sucursalesData[branchKey];
    const addressElement = document.getElementById('branchAddress');
    const mapIframe = document.getElementById('mapIframe');
    const mapLocationText = document.getElementById('mapLocationText');
    const buttons = document.querySelectorAll('.branch-buttons button');

    if (branch && addressElement && mapIframe && mapLocationText) {
        addressElement.textContent = branch.direccion;
        mapIframe.src = branch.mapUrl; 
        mapLocationText.textContent = `Ubicación: ${branch.nombre}`;

        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-branch') === branchKey) {
                button.classList.add('active');
            }
        });
    }
}

// --- Lógica de Formularios --- (Se mantiene sin cambios)
const donationImpacts = { /* ... Mismos datos ... */ };
function getImpactHtml(amount) { /* ... Misma función ... */ }
function createDonationForm(formIdPrefix) { /* ... Misma función ... */ }
function createHelpForm(formIdPrefix) { /* ... Misma función ... */ }
function setupFormEventListeners(formContainerSelector, formType) { /* ... Misma función ... */ }
function initializeForms() { /* ... Misma función ... */ }


// --- Inicialización al Cargar el DOM ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Adara Page - DOMContentLoaded");
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }

    // Listeners para botones del header (se mantienen)
    const openHelpPopupBtnHeader = document.getElementById('openHelpPopupBtnHeader');
    const openDonatePopupBtnHeader = document.getElementById('openDonatePopupBtnHeader');
    if (openHelpPopupBtnHeader) {
        openHelpPopupBtnHeader.addEventListener('click', () => {
            openPopup('helpPopup', 'Consulta General'); 
        });
    }
    if (openDonatePopupBtnHeader) {
        openDonatePopupBtnHeader.addEventListener('click', () => {
            openPopup('donatePopup');
        });
    }

    // Inicializaciones generales (se mantienen)
    initializeMobileMenu(); 
    initializeScrollReveal();
    initializeVideoCarousel();
    initializePopupClosers();
    initializeForms(); 

    // Configurar listeners para botones de sucursales (se mantienen)
    const branchButtons = document.querySelectorAll('.branch-buttons button');
    branchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const branchKey = button.getAttribute('data-branch');
            showBranchInfo(branchKey);
        });
    });
    if (document.getElementById('branchAddress')) {
         showBranchInfo('cancun'); // Mostrar Cancún por defecto
    }

    // SE ELIMINÓ: Llamada a initializeImpactChart();

    // --- NUEVO CÓDIGO PARA LA GRÁFICA (Extraído del PDF) ---
    try {
        const chartCanvas = document.getElementById('adaraChart'); // Asegurarse que el ID es correcto
        if (!chartCanvas) {
            console.error("Elemento canvas #adaraChart no encontrado. La nueva gráfica no se puede inicializar.");
            return; // Salir si no existe el canvas
        }
        
        // Datos extraídos directamente del PDF "Estadisticas Adara - Hoja 1 (1).pdf"
        const labels = ["2021-06", "2021-07", "2021-08", "2021-09", "2021-10", "2021-11", "2021-12", "2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06", "2023-07", "2023-08", "2023-09", "2023-10", "2023-11", "2023-12", "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05"];
        const monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        // Funciones helper para parsear números del PDF (evitar conflictos con las globales si tienen mismo nombre)
        const parseCurrencyPDF = (value) => parseFloat(String(value).replace(/[\$,]/g, '')) || 0;
        // const parseIntStrictPDF = (value) => parseInt(String(value).replace(/[\$,\.]/g, ''), 10) || 0; // El PDF no parece usar puntos como separadores

        // Data directly from the corrected PDF
        const datasetsFromPDF = {
            nuevosIngresosOrganicosMes: [3, 12, 19, 24, 20, 7, 3, 11, 12, 8, 5, 7, 6, 4, 4, 6, 4, 9, 5, 12, 7, 11, 9, 9, 8, 11, 4, 11, 8, 14, 11, 12, 9, 35, 20, 9, 12, 9, 9, 11, 11, 9, 18, 24, 26, 29, 23, 20],
            recaidasIngresosMes: [0, 0, 1, 3, 5, 2, 7, 4, 9, 7, 6, 4, 9, 3, 9, 4, 11, 2, 11, 2, 3, 4, 4, 4, 5, 3, 5, 4, 12, 12, 7, 7, 7, 18, 12, 5, 9, 8, 6, 10, 9, 11, 11, 12, 12, 13, 9, 9],
            salidasMes: [0, 1, 2, 5, 8, 6, 9, 14, 21, 18, 9, 14, 11, 9, 13, 15, 6, 14, 16, 12, 9, 14, 19, 9, 14, 12, 9, 14, 22, 25, 20, 15, 18, 19, 12, 20, 14, 16, 16, 21, 18, 22, 27, 52, 20, 25, 20, 22], // No se usa directamente en gráfica por defecto
            personasActivasMes: [3, 14, 32, 54, 71, 74, 75, 76, 76, 73, 75, 72, 76, 74, 74, 69, 78, 75, 75, 77, 78, 79, 73, 77, 76, 78, 78, 79, 77, 78, 76, 80, 78, 112, 132, 126, 133, 134, 133, 133, 135, 133, 135, 119, 137, 154, 166, 173],
            egresadosTotalAcum: [0, 0, 0, 2, 1, 2, 4, 7, 12, 20, 29, 39, 50, 62, 75, 88, 101, 115, 131, 147, 163, 179, 195, 211, 227, 243, 259, 275, 291, 308, 327, 346, 365, 384, 404, 424, 445, 466, 487, 508, 529, 552, 579, 605, 625, 645, 665, 685], // No se usa directamente en gráfica por defecto
            inversionMes: [53500, 103000, 184000, 283000, 359500, 373000, 377500, 382000, 382000, 368500, 377500, 364000, 382000, 373000, 373000, 350500, 391000, 377500, 377500, 386500, 391000, 395500, 368500, 386500, 382000, 391000, 391000, 395500, 386500, 391000, 382000, 400000, 375400, 432000, 502000, 481000, 505500, 509000, 505500, 505500, 512500, 505500, 607500, 397500, 442500, 485000, 515000, 532500].map(parseCurrencyPDF),
            inversionTotalAcum: [53500, 156500, 340500, 623500, 983000, 1356000, 1733500, 2115500, 2497500, 2866000, 3243500, 3607500, 3989500, 4362500, 4735500, 5086000, 5477000, 5854500, 6232000, 6618500, 7009500, 7405000, 7773500, 8160000, 8542000, 8933000, 9324000, 9719500, 10106000, 10497000, 10879000, 11279000, 11654400, 12086400, 12588400, 13069400, 13574900, 14083900, 14589400, 15094900, 15607400, 16112900, 16720400, 17117900, 17560400, 18045400, 18560400, 19092900].map(parseCurrencyPDF),
            c1Activos: [3, 14, 32, 54, 71, 74, 75, 76, 76, 73, 75, 72, 76, 74, 74, 69, 78, 75, 75, 77, 78, 79, 73, 77, 76, 78, 78, 79, 77, 78, 76, 80, 78, 75, 73, 70, 75, 72, 67, 73, 70, 74, 75, 74, 72, 70, 75, 73], // Usado en KPIs
            c2Activos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 59, 56, 58, 62, 66, 60, 65, 59, 53, 0, 0, 0, 0, 0], // Usado en KPIs - Cierre Cuerna en Ene 25?
            c3Activos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 45, 65, 84, 91, 100], // Usado en KPIs
            apoyosBrindadosAcum: [], // Se calculará a continuación
        };

        // Calcular Apoyos Brindados Acumulados (Nuevos + Recaídas)
        let currentApoyosSum = 0;
        for (let i = 0; i < labels.length; i++) {
            currentApoyosSum += (datasetsFromPDF.nuevosIngresosOrganicosMes[i] || 0) + (datasetsFromPDF.recaidasIngresosMes[i] || 0);
            datasetsFromPDF.apoyosBrindadosAcum.push(currentApoyosSum);
        }

        // Eventos importantes con fechas exactas del PDF "Conceptuales..."
        const clinicEvents = {
            "2021-06": "Apertura Clínica Cancún", // Dato inicial
            "2023-05": "Constitución Legal Fundación Adara",
            "2024-02": "Permiso Donataria Autorizada",
            "2024-03": "Apertura Clínica Cuernavaca", // Dato según PDF
            "2024-12": "Apertura Clínica Leona Vicario", // Dato según PDF
            "2025-01": "Cierre Clínica Cuernavaca" // Dato según PDF
        };

        // Colores Adara (los definidos en Tailwind config)
        const adaraPrimary = '#0077B6';
        const adaraSecondary = '#00B4D8';
        const adaraAccent = '#FFD60A';
        const adaraSuccess = '#2A9D8F';
        const adaraError = '#E76F51';
        const adaraPurple = '#6A0DAD'; // O usa 'rgb(106, 13, 173)'
        const adaraDark = '#333333';
        const adaraGray = '#6B7280'; // gray-500

        // Configuración de datasets para la gráfica, usando colores Adara
        const datasetsConfig = {
            apoyosBrindadosAcum: { label: 'Apoyos Brindados (Acum)', data: datasetsFromPDF.apoyosBrindadosAcum, borderColor: adaraPurple, backgroundColor: adaraPurple+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2},
            nuevosIngresosOrganicosMes: { label: 'Nuevos Ingresos', data: datasetsFromPDF.nuevosIngresosOrganicosMes, borderColor: adaraSecondary, backgroundColor: adaraSecondary+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2 },
            recaidasIngresosMes: { label: 'Ingresos por Recaída', data: datasetsFromPDF.recaidasIngresosMes, borderColor: adaraSuccess, backgroundColor: adaraSuccess+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2 },
            personasActivasMes: { label: 'Personas Activas', data: datasetsFromPDF.personasActivasMes, borderColor: adaraPrimary, backgroundColor: adaraPrimary+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2 },
            inversionMes: { label: 'Gasto Mensual', data: datasetsFromPDF.inversionMes, borderColor: adaraError, backgroundColor: adaraError+'33', yAxisID: 'yCurrency', tension: 0.1, borderWidth: 2 }, // Usando adaraError para el rosa/rojo
            inversionTotalAcum: { label: 'Gasto Acumulado', data: datasetsFromPDF.inversionTotalAcum, borderColor: adaraAccent, backgroundColor: adaraAccent+'33', yAxisID: 'yCurrency', tension: 0.1, borderWidth: 2 } // Usando adaraAccent para el naranja/amarillo
        };
        
        const ctx = chartCanvas.getContext('2d');
        // Crear instancia de Chart.js
        let adaraChart = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: [] }, // Inicialmente vacío, se llena con updateChartDisplay
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: { display: false }, // Sin título principal en la gráfica
                    legend: {
                        position: 'bottom', // Leyenda abajo
                        labels: {
                            color: adaraDark, // Color de texto leyenda
                            padding: 15,
                            font: { size: 11, family: "'Lato', sans-serif" } // Fuente leyenda
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(51, 51, 51, 0.9)', // adara-dark semi-transparente
                        titleColor: '#FFFFFF',
                        bodyColor: '#F8F9FA', // adara-light
                        borderColor: adaraGray,
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 4,
                        displayColors: true, // Mostrar cuadritos de color
                        boxPadding: 4,
                        titleFont: { family: "'Montserrat', sans-serif", weight: 'bold'},
                        bodyFont: { family: "'Lato', sans-serif", size: 12},
                        callbacks: {
                            label: function(context) { // Formatear números en tooltip
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.y !== null) {
                                    if (context.dataset.yAxisID === 'yCurrency') {
                                        // Usar función global si existe y es preferida, o Intl.NumberFormat
                                        label += typeof formatCurrency === 'function' ? formatCurrency(context.parsed.y) : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(context.parsed.y);
                                    } else {
                                         label += typeof formatNumberWithCommas === 'function' ? formatNumberWithCommas(context.parsed.y) : context.parsed.y.toLocaleString('es-MX');
                                    }
                                }
                                return label;
                            }
                        }
                    },
                },
                scales: {
                    x: { // Eje X (Tiempo)
                        title: { display: false },
                        ticks: { color: adaraGray, font: {size: 10, family: "'Lato', sans-serif"} },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' } // Rejilla muy tenue
                    },
                    yCounts: { // Eje Y Izquierdo (Cantidades)
                        type: 'linear',
                        display: true, // Se mostrará si algún dataset lo usa
                        position: 'left',
                        title: { display: true, text: 'Cantidad', color: adaraGray, font: {size: 11, weight: '500', family: "'Montserrat', sans-serif"} },
                        ticks: { color: adaraGray, font: {size: 10, family: "'Lato', sans-serif"} },
                        grid: { color: 'rgba(0, 0, 0, 0.08)' } // Rejilla un poco más visible
                    },
                    yCurrency: { // Eje Y Derecho (Montos)
                        type: 'linear',
                        display: true, // Se mostrará si algún dataset lo usa
                        position: 'right',
                        title: { display: true, text: 'Monto ($MXN)', color: adaraGray, font: {size: 11, weight: '500', family: "'Montserrat', sans-serif"} },
                        ticks: { color: adaraGray, font: {size: 10, family: "'Lato', sans-serif"}, callback: function (value) { return new Intl.NumberFormat('es-MX', { notation: 'compact', compactDisplay: 'short' }).format(value); } },
                        grid: { drawOnChartArea: false } // Sin rejilla para este eje
                    }
                }
            }
        });

        // Selección de Elementos DOM (IDs deben coincidir con el nuevo HTML)
        const timelineSlider = document.getElementById('timelineSlider');
        const selectedMonthLabel = document.getElementById('selectedMonthLabel');
        const kpiTitleMonth = document.getElementById('kpiTitleMonth');
        const timelineEventTextElement = document.getElementById('timelineEventText');
        const kpiNuevosOrganicosValor = document.getElementById('kpiNuevosOrganicosValor');
        const kpiRecaidasIngresosValor = document.getElementById('kpiRecaidasIngresosValor');
        const kpiPersonasActivas = document.getElementById('kpiPersonasActivas');
        const kpiActivosClinicas = document.getElementById('kpiActivosClinicas');
        const kpiGastoMensualValor = document.getElementById('kpiGastoMensualValor');
        const kpiApoyosBrindadosValor = document.getElementById('kpiApoyosBrindadosValor');
        // const kpiApoyosBrindadosSubtitle = document.getElementById('kpiApoyosBrindadosSubtitle'); // No se usa para actualizar texto
        const kpiTotalGastosAcumuladosValor = document.getElementById('kpiTotalGastosAcumuladosValor');

        // Función para actualizar las tarjetas KPI
        function updateKpiCards (monthIndex) {
            if (monthIndex < 0 || monthIndex >= labels.length) return; // Validación básica

            const fullMonthLabel = labels[monthIndex]; // e.g., "2024-03"
            const [year, monthNum] = fullMonthLabel.split('-');
            const monthName = monthNamesEs[parseInt(monthNum) - 1]; // "Marzo"

            if(selectedMonthLabel) selectedMonthLabel.textContent = `${monthName} ${year}`;
            if(kpiTitleMonth) kpiTitleMonth.textContent = `(${monthName} / ${year})`;

            if(kpiNuevosOrganicosValor) kpiNuevosOrganicosValor.textContent = (datasetsFromPDF.nuevosIngresosOrganicosMes[monthIndex] || 0).toLocaleString('es-MX');
            if(kpiRecaidasIngresosValor) kpiRecaidasIngresosValor.textContent = (datasetsFromPDF.recaidasIngresosMes[monthIndex] || 0).toLocaleString('es-MX');
            if(kpiPersonasActivas) kpiPersonasActivas.textContent = (datasetsFromPDF.personasActivasMes[monthIndex] || 0).toLocaleString('es-MX');
            
            // Actualizar desglose por clínica
            if(kpiActivosClinicas) {
                const c1 = (datasetsFromPDF.c1Activos[monthIndex] || 0).toLocaleString('es-MX');
                const c2 = (datasetsFromPDF.c2Activos[monthIndex] || 0).toLocaleString('es-MX');
                const c3 = (datasetsFromPDF.c3Activos[monthIndex] || 0).toLocaleString('es-MX');
                kpiActivosClinicas.textContent = `Cancún: ${c1}, Cuerna: ${c2}, Leona: ${c3}`;
            }

            if(kpiGastoMensualValor) kpiGastoMensualValor.textContent = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits:0 }).format(datasetsFromPDF.inversionMes[monthIndex] || 0);
            if(kpiApoyosBrindadosValor) kpiApoyosBrindadosValor.textContent = (datasetsFromPDF.apoyosBrindadosAcum[monthIndex] || 0).toLocaleString('es-MX');
            if(kpiTotalGastosAcumuladosValor) kpiTotalGastosAcumuladosValor.textContent = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits:0 }).format(datasetsFromPDF.inversionTotalAcum[monthIndex] || 0);

            // Actualizar texto de evento
            if(timelineEventTextElement) {
                const eventMessage = clinicEvents[fullMonthLabel] || ""; // Busca evento para "YYYY-MM"
                timelineEventTextElement.textContent = eventMessage;
            }
        }

        // Configuración inicial y listener para el slider
        if (timelineSlider) {
            timelineSlider.max = labels.length - 1;
            timelineSlider.value = labels.length - 1; // Empezar al final
            timelineSlider.addEventListener('input', (event) => {
                const monthIndex = parseInt(event.target.value);
                updateKpiCards(monthIndex);
            });
        } else {
             console.error("Elemento timelineSlider no encontrado.");
        }

        // Función para actualizar qué datasets se muestran en la gráfica
        function updateChartDisplay() {
            const selectedDatasets = [];
            document.querySelectorAll('#controls input[type="checkbox"]').forEach(checkbox => {
                const datasetKey = checkbox.dataset.dataset;
                if (checkbox.checked && datasetsConfig[datasetKey]) {
                    selectedDatasets.push(datasetsConfig[datasetKey]);
                }
            });

            adaraChart.data.datasets = selectedDatasets;

            // Mostrar/ocultar ejes Y según los datasets seleccionados
            let yCountsNeeded = selectedDatasets.some(ds => ds.yAxisID === 'yCounts');
            let yCurrencyNeeded = selectedDatasets.some(ds => ds.yAxisID === 'yCurrency');
            if (adaraChart.options.scales.yCounts) adaraChart.options.scales.yCounts.display = yCountsNeeded;
            if (adaraChart.options.scales.yCurrency) adaraChart.options.scales.yCurrency.display = yCurrencyNeeded;

            adaraChart.update();
        }

        // Listener para los checkboxes
        document.querySelectorAll('#controls input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateChartDisplay);
        });

        // Llamadas iniciales para mostrar estado por defecto
        updateChartDisplay(); // Muestra gráfica con datasets seleccionados por defecto
        updateKpiCards(labels.length - 1); // Muestra KPIs del último mes

        console.log("Nueva sección de impacto inicializada correctamente.");

    } catch (error) {
        console.error("Error inicializando la nueva sección de impacto:", error);
        // Opcional: Mostrar mensaje de error en la UI si falla la inicialización
        const chartWrapper = document.getElementById('chart-wrapper'); // O el contenedor principal de la nueva sección
        if (chartWrapper) {
            chartWrapper.innerHTML = '<p class="text-adara-error text-center p-4">Error al cargar las estadísticas. Intenta recargar la página.</p>';
        }
    }
    // --- FIN NUEVO CÓDIGO PARA LA GRÁFICA ---

}); // Fin de DOMContentLoaded