// --- Constantes y Estado Global ---
// SE ELIMINARON: impactChartInstance, simulatedImpactData, TARGET_*, COST_PER_RESIDENT_*

const programDetails = {
    'internamiento': {
        title: 'Programa de Internamiento Completo',
        icon: 'fas fa-house-user',
        description: 'Modalidad residencial intensiva (24/7) diseñada para personas con adicciones severas que requieren un ambiente controlado y seguro para iniciar su recuperación. Los participantes se sumergen en una comunidad terapéutica con estructura y apoyo constantes.',
        features: [
            { icon: 'fas fa-shield-alt', text: '<strong>Ambiente Seguro:</strong> Entorno estrictamente libre de sustancias, con normas claras.' },
            { icon: 'fas fa-bed', text: '<strong>Alojamiento y Nutrición:</strong> Residencia confortable y alimentación balanceada.' },
            { icon: 'fas fa-user-md', text: '<strong>Atención Médica y Desintoxicación:</strong> Supervisión médica, manejo de medicamentos y fase inicial de desintoxicación (3-7 días).' },
            { icon: 'fas fa-brain', text: '<strong>Terapia Psicológica Individual:</strong> Abordaje de causas subyacentes, traumas y desarrollo de habilidades de afrontamiento.' },
            { icon: 'fas fa-users', text: '<strong>Terapias Grupales Intensivas:</strong> Grupos de proceso, psicoeducativos y basados en los 12 Pasos.' },
            { icon: 'fas fa-tasks', text: '<strong>Actividades Terapéuticas y Formativas:</strong> Talleres de habilidades para la vida, manejo emocional, prevención de recaídas, recreación.' },
            { icon: 'fas fa-user-clock', text: '<strong>Supervisión Constante:</strong> Acompañamiento del personal y apoyo de pares.' }
        ],
        duration: 'Mínimo 4 meses continuos (recomendado), extensible según evaluación terapéutica individual.',
        idealFor: 'Quienes necesitan máxima estructura y apoyo para interrumpir el consumo y construir bases sólidas de recuperación.'
    },
    'mediaLuz': {
        title: 'Programa de Media Luz',
        icon: 'fas fa-key',
        description: 'Etapa de transición flexible que facilita la reintegración gradual a la vida autónoma. Permite a los participantes con mayor estabilidad manejar responsabilidades externas (trabajo, estudio) mientras pernoctan en la Fundación y continúan recibiendo apoyo.',
        features: [
            { icon: 'fas fa-briefcase', text: '<strong>Actividades Externas:</strong> Permiso para trabajar, estudiar, voluntariado o contacto familiar supervisado.' },
            { icon: 'fas fa-home', text: '<strong>Residencia Estructurada:</strong> Alojamiento y apoyo nocturno/fines de semana en la Fundación.' },
            { icon: 'fas fa-comments', text: '<strong>Apoyo Continuo:</strong> Acceso a terapias individuales/grupales, orientación y contención.' },
            { icon: 'fas fa-user-friends', text: '<strong>Comunidad y Servicio:</strong> Fomenta la participación comunitaria y el apoyo a nuevos ingresos.' },
            { icon: 'fas fa-route', text: '<strong>Reintegración Supervisada:</strong> Permite practicar habilidades en entorno real con red de seguridad.' }
        ],
        duration: 'Variable, adaptada al progreso individual en objetivos de reinserción y evaluación terapéutica.',
        idealFor: 'Quienes han completado el internamiento inicial y están listos para una reintegración gradual, o quienes necesitan apoyo residencial pero pueden manejar responsabilidades externas.'
    },
    'grupales': {
        title: 'Terapias Grupales (Tipo AA y otras)',
        icon: 'fas fa-users',
        description: 'Pilar fundamental y transversal en todos los programas, reconociendo el poder de la experiencia compartida y el apoyo mutuo. Disponibles también de forma ambulatoria para seguimiento post-tratamiento o apoyo comunitario.',
        features: [
            { icon: 'fas fa-handshake', text: '<strong>Apoyo Mutuo:</strong> Basadas en principios de 12 Pasos (AA/NA) y otros enfoques, enfatizando honestidad y respeto.' },
            { icon: 'fas fa-book-open', text: '<strong>Aprendizaje Compartido:</strong> Espacio seguro para compartir luchas/éxitos, identificar patrones y aprender estrategias.' },
            { icon: 'fas fa-comment-dots', text: '<strong>Romper Aislamiento:</strong> Ayuda a disminuir la vergüenza y soledad asociadas a la adicción.' },
            { icon: 'fas fa-heart', text: '<strong>Pertenencia y Comunidad:</strong> Fortalece el sentido de comunidad, vital para la recuperación a largo plazo.' },
            { icon: 'fas fa-chalkboard-teacher', text: '<strong>Grupos Profesionales:</strong> Pueden incluir sesiones psicoeducativas dirigidas por terapeutas (manejo emociones, etc.).' }
        ],
        duration: 'Participación continua y flexible según la necesidad individual en diferentes etapas de la recuperación.',
        idealFor: 'Todos los participantes de programas residenciales, ex-beneficiarios en seguimiento, y personas de la comunidad buscando apoyo grupal para su recuperación.'
    }
};


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
        if (container && container.innerHTML.includes(message)) { // Verificar si el contenedor y el mensaje siguen ahí
            container.innerHTML = '';
        }
    }, 5000);
}

// --- Popup Handling (General + Video + Imagen) ---

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
        // Scroll al inicio del contenido del popup por si es largo
        const popupContent = popup.querySelector('.popup-content');
        if (popupContent) {
            popupContent.scrollTop = 0;
        }
    });
    document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
    // console.log(`Popup #${popupId} opened. Reason: ${reason}`);

    // Preseleccionar motivo en popup de ayuda si se proporciona
    if (popupId === 'helpPopup' && reason) {
        setTimeout(() => { // Dar tiempo a que se genere el form si es dinámico
            const reasonSelect = popup.querySelector('#leadReason'); // <--- ID del select del nuevo formulario
            if (reasonSelect) {
                 let foundOption = Array.from(reasonSelect.options).find(option =>
                    option.value === reason || option.textContent.includes(reason)
                 );
                 if (foundOption) {
                    reasonSelect.value = foundOption.value;
                 } else {
                    // Lógica de fallback mejorada
                    const defaultOption = reasonSelect.querySelector('option[value="Consulta General"]');
                    const infoOption = reasonSelect.querySelector('option[value="Información sobre programas"]'); // Corregido valor
                    if(defaultOption && reason === 'Consulta General') {
                         reasonSelect.value = "Consulta General";
                    } else if (infoOption && reason.toLowerCase().includes("programa")) {
                         reasonSelect.value = 'Información sobre programas'; // Usar el valor correcto
                    } else if (reasonSelect.querySelector(`option[value="${reason}"]`)) {
                         reasonSelect.value = reason;
                    } else if (defaultOption) {
                         reasonSelect.value = "Consulta General";
                    } else if (reasonSelect.options.length > 0) {
                        reasonSelect.value = reasonSelect.options[0].value;
                    } else {
                         reasonSelect.value = '';
                    }
                 }
            } else {
                console.warn("Elemento select #leadReason no encontrado en #helpPopup.");
            }
        }, 150);
    }

     // Mover foco al primer elemento interactivo o al botón de cierre
     setTimeout(() => {
         const firstFocusable = popup.querySelector('button:not(.popup-close), [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
         const closeButton = popup.querySelector('.popup-close');
         if (firstFocusable && firstFocusable !== closeButton) {
             try { firstFocusable.focus(); } catch(e) { console.warn("Focus failed on first focusable:", e); closeButton?.focus(); }
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
                if (iframe) iframe.src = ''; // Detiene el video de YouTube
            }
            if (popupId === 'imagePopup') {
                 const img = document.getElementById('imagePopupImg');
                 if (img) img.src = ''; // Limpia la imagen
            }
            // Si es el popup de programas, podríamos limpiar el contenido por si acaso
            if (popupId === 'programPopup') {
                 const contentArea = document.getElementById('programPopupContentArea');
                 // Podrías limpiar aquí si prefieres, aunque se sobreescribe al abrir
                 // contentArea.innerHTML = '<p>Cargando...</p>';
            }
            // Solo restaurar el scroll si no hay OTRO popup activo
            const anyPopupActive = document.querySelector('.popup.active');
            if (!anyPopupActive) {
                document.body.style.overflow = 'auto';
            }
        }, 300); // Duración de la transición de opacidad
        // console.log(`Popup #${popupId} closed.`);
    }
}

function openVideoPopup(youtubeId) {
    const popup = document.getElementById('videoPopup');
    const iframe = document.getElementById('videoPopupIframe');
    if (!popup || !iframe) { console.error("Video popup or iframe not found."); return; }
    // Usar el formato embed correcto para YouTube
    const videoSrc = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`; // CORREGIDO
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

/**
 * Abre el popup genérico de programas y carga el contenido específico.
 * @param {string} programId - Identificador del programa ('internamiento', 'mediaLuz', 'grupales').
 */
function openProgramPopup(programId) {
    const details = programDetails[programId];
    const popup = document.getElementById('programPopup');

    if (!details || !popup) {
        console.error(`Detalles para el programa "${programId}" o popup #programPopup no encontrado.`);
        return;
    }

    // Poblar el contenido del popup (Elementos del DOM)
    const titleEl = document.getElementById('programPopupTitle');
    const iconEl = document.getElementById('programPopupIcon');
    const descEl = document.getElementById('programPopupDescription');
    const featuresListEl = document.getElementById('programPopupFeaturesList');
    const durationTextEl = document.getElementById('programPopupDurationText');
    const idealForTextEl = document.getElementById('programPopupIdealForText');
    const featuresContainer = document.getElementById('programPopupFeatures');
    const durationContainer = document.getElementById('programPopupDuration');
    const idealForContainer = document.getElementById('programPopupIdealFor');

    // Validar que todos los elementos existan antes de intentar usarlos
    if (!titleEl || !iconEl || !descEl || !featuresListEl || !durationTextEl || !idealForTextEl || !featuresContainer || !durationContainer || !idealForContainer) {
        console.error("Uno o más elementos internos del popup #programPopup no fueron encontrados.");
        return;
    }

    // Asignar contenido
    titleEl.textContent = details.title;
    iconEl.className = `mr-3 text-3xl ${details.icon}`; // Asegúrate que la clase base de FontAwesome (e.g., 'fas') esté incluida
    descEl.innerHTML = details.description; // innerHTML permite usar <strong> u otras etiquetas si las pones en la descripción

    // Limpiar y poblar lista de características
    featuresListEl.innerHTML = ''; // Limpiar lista anterior
    if (details.features && details.features.length > 0) {
         details.features.forEach(feature => {
             const li = document.createElement('li');
             li.className = 'flex items-start text-sm text-gray-600';
             // Usar 'fa-fw' para ancho fijo y mejorar alineación de iconos
             li.innerHTML = `<i class="${feature.icon} fa-fw text-adara-secondary mr-2 mt-1" aria-hidden="true"></i> <span>${feature.text}</span>`; // innerHTML permite <strong>
             featuresListEl.appendChild(li);
         });
        featuresContainer.style.display = 'block'; // Mostrar contenedor de características
    } else {
        featuresContainer.style.display = 'none'; // Ocultar si no hay características
    }

    // Mostrar/ocultar y poblar duración
    if (details.duration) {
        durationTextEl.textContent = details.duration;
        durationContainer.style.display = 'block';
    } else {
        durationContainer.style.display = 'none';
    }

    // Mostrar/ocultar y poblar 'ideal para'
     if (details.idealFor) {
        idealForTextEl.textContent = details.idealFor;
        idealForContainer.style.display = 'block';
    } else {
        idealForContainer.style.display = 'none';
    }


    // Abrir el popup genérico
    openPopup('programPopup');
}

// --- FIN PARTE 1 NUEVO CÓDIGO ---

// --- Menú Móvil ---
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
    // El botón de donar móvil ahora será un widget, su trigger es 'mobileDonateTrigger'
    // y se inicializa en initializeNewDonationWidget. No necesita un listener aquí.

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

    // Cerrar menú al hacer clic en enlaces de navegación o botones que no sean triggers de dropdowns
    mobileMenu.querySelectorAll('a[href^="#"], button:not([aria-haspopup="true"])').forEach(item => {
        item.addEventListener('click', () => {
           closeMobileMenu();
        });
    });
    // Asegurar que los triggers de dropdown no cierren el menú inmediatamente
     mobileMenu.querySelectorAll('button[aria-haspopup="true"]').forEach(item => {
        item.addEventListener('click', (e) => {
            // No cerrar el menú aquí, la lógica del dropdown se encarga
        });
    });

    // console.log("Mobile menu initialized.");
}

// --- Animación Scroll Reveal ---
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
         // Fallback para navegadores sin IntersectionObserver
         revealElements.forEach(el => el.classList.add('is-visible'));
     }
     // console.log("Scroll reveal initialized.");
}

// --- Carrusel de Videos ---
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
    let currentGroupIndex = 0; // Índice del *grupo* de slides visibles

    function calculateSlidesToShow() {
        // Determinar cuántos slides mostrar basado en el ancho de la ventana
        if (window.innerWidth >= 1024) { slidesToShow = 3; }
        else if (window.innerWidth >= 640) { slidesToShow = 2; }
        else { slidesToShow = 1; }

        // Ajustar el índice actual si cambia el número de slides visibles
        const maxGroupIndex = Math.max(0, Math.ceil(slides.length / slidesToShow) - 1);
        currentGroupIndex = Math.min(currentGroupIndex, maxGroupIndex); // No exceder el nuevo máximo

        // Actualizar la posición sin animación al redimensionar
        updateCarouselPosition(false);
        updateButtonStates();
    }

    function updateCarouselPosition(animate = true) {
        // Calcular el desplazamiento basado en el índice del grupo actual
        // Cada grupo tiene 'slidesToShow' slides. El track se mueve 100% por grupo.
        const offsetPercentage = -currentGroupIndex * 100;
        track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(${offsetPercentage}%)`;
    }

    function updateButtonStates() {
        if (!prevButton || !nextButton) return;
        const maxGroupIndex = Math.max(0, Math.ceil(slides.length / slidesToShow) - 1);
        prevButton.disabled = currentGroupIndex === 0;
        nextButton.disabled = currentGroupIndex >= maxGroupIndex || slides.length <= slidesToShow; // Deshabilitar si no hay suficientes slides para scroll

        // Opcional: Ocultar botones si no hay suficientes slides para hacer scroll
        const shouldShowButtons = slides.length > slidesToShow;
         prevButton.style.display = shouldShowButtons ? 'flex' : 'none';
         nextButton.style.display = shouldShowButtons ? 'flex' : 'none';
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

    // Recalcular en redimensionamiento (con debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculateSlidesToShow, 250);
    });

    // Inicialización
    calculateSlidesToShow();
    // console.log("Video carousel initialized.");
}

// --- Lógica de Sucursales y Mapa (Sección Contacto) ---
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
    } else {
         console.warn("Elementos para mostrar información de sucursal no encontrados.");
    }
}

// --- FIN PARTE 2a ---

// --- Lógica de Formularios ---
const donationImpacts = {
    500: [ { icon: 'fa-utensils', text: 'Alimentación completa para 2 días.' },{ icon: 'fa-pills', text: 'Medicamentos básicos iniciales.' },{ icon: 'fa-tshirt', text: 'Ropa y artículos de higiene básicos.' }, ],
    1000: [ { icon: 'fa-utensils', text: 'Alimentación completa para 4 días.' },{ icon: 'fa-pills', text: 'Medicamentos para desintoxicación (parcial).' },{ icon: 'fa-tshirt', text: 'Ropa y artículos de higiene completos.' },{ icon: 'fa-user-md', text: '1 sesión de terapia psicológica.' }, ],
    2500: [ { icon: 'fa-utensils', text: 'Alimentación completa para 1 semana.' },{ icon: 'fa-pills', text: 'Medicamentos completos para desintoxicación.' },{ icon: 'fa-house-user', text: 'Apoyo para renta/alojamiento (parcial).' },{ icon: 'fa-user-md', text: 'Varias sesiones de terapia psicológica.' },{ icon: 'fa-book-open', text: 'Materiales para talleres educativos.' }, ],
    5000: [ { icon: 'fa-utensils', text: 'Alimentación completa para 2 semanas.' },{ icon: 'fa-pills', text: 'Medicamentos y seguimiento médico.' },{ icon: 'fa-house-user', text: 'Apoyo completo para renta/alojamiento.' },{ icon: 'fa-user-md', text: 'Paquete de sesiones terapéuticas.' },{ icon: 'fa-book-open', text: 'Kit completo para talleres y reinserción.' },{ icon: 'fa-briefcase', text: 'Apoyo para búsqueda de empleo.' }, ]
};

function getImpactHtml(amount) {
    let numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount < 50) return '<p class="impact-placeholder text-xs text-center italic text-emerald-700 p-2">Ingresa un monto válido (mín $50 MXN).</p>';
    let applicableImpacts = [];
    const tiers = Object.keys(donationImpacts).map(Number).sort((a, b) => b - a);
    let selectedTier = tiers.find(tier => numericAmount >= tier) || null;
    if (selectedTier) { applicableImpacts = donationImpacts[selectedTier]; }
    else { applicableImpacts = [ { icon: 'fa-hand-holding-heart', text: 'Contribución valiosa para gastos operativos.' } ]; }
    if (applicableImpacts.length === 0) return '<p class="impact-placeholder text-xs text-center italic text-emerald-700 p-2">¡Cada donación cuenta!</p>';
    let html = '<ul class="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">';
    applicableImpacts.forEach(impact => { html += `<li class="flex items-center text-xs text-emerald-800"><i class="fas ${impact.icon} fa-fw text-adara-success mr-2 text-sm"></i> ${impact.text}</li>`; });
    html += '</ul>';
    return html;
}

function createDonationForm(formIdPrefix) {
    // HTML del formulario de donación
    return `
        <form id="${formIdPrefix}Form" action="#" method="POST" class="space-y-4 donation-form-instance">
             <input type="hidden" name="donation_type" value="monthly" id="${formIdPrefix}DonationType">
            <div class="donate_tabs"> <button type="button" class="donate_tab active" data-type="monthly">Mensual</button> <button type="button" class="donate_tab" data-type="onetime">Una Vez</button> </div>
            <div class="form-group"> <label class="form-label block text-sm font-medium text-gray-700 mb-1">1. Selecciona tu donación:</label> <div class="amount-options"> <button type="button" class="amount-option active" data-amount="500">$500</button> <button type="button" class="amount-option" data-amount="1000">$1,000</button> <button type="button" class="amount-option" data-amount="2500">$2,500</button> <button type="button" class="amount-option" data-amount="5000">$5,000</button> <button type="button" class="amount-option" data-amount="custom">Otro</button> </div> <div class="custom-amount relative mt-2" style="display: none;"> <span class="currency-symbol absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span> <input type="number" id="${formIdPrefix}CustomAmount" class="customAmountInput block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-success focus:border-adara-success sm:text-sm" placeholder="Ingresa monto (min $50)" min="50"> </div> <input type="hidden" name="amount" value="500" id="${formIdPrefix}Amount"> </div>
            <div class="form-group"> <label class="form-label block text-sm font-medium text-gray-700 mb-1">2. Así ayudas con tu donación:</label> <div class="donation-impact-display bg-emerald-50 border border-emerald-200 rounded-md p-3 min-h-[70px] flex items-center justify-center"> <p class="impact-placeholder text-xs text-center italic text-emerald-700 p-2">Selecciona un monto para ver.</p> </div> </div>
            <h4 class="text-sm font-medium text-gray-700 pt-1 mb-1">3. Completa tus datos:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"> <div class="form-group !mb-0"> <label for="${formIdPrefix}FullName" class="sr-only">Nombre completo:</label> <input type="text" id="${formIdPrefix}FullName" name="full_name" placeholder="Nombre completo" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-success focus:border-adara-success sm:text-sm" required> </div> <div class="form-group !mb-0"> <label for="${formIdPrefix}Email" class="sr-only">Correo electrónico:</label> <input type="email" id="${formIdPrefix}Email" name="email" placeholder="Correo electrónico" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-success focus:border-adara-success sm:text-sm" required> </div> </div>
            <div class="form-group !mb-2"> <label for="${formIdPrefix}Phone" class="sr-only">Teléfono (opcional):</label> <input type="tel" id="${formIdPrefix}Phone" name="phone" placeholder="Teléfono (opcional)" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-success focus:border-adara-success sm:text-sm"> </div>
            <div class="form-group !mb-2"> <label class="form-label block text-sm font-medium text-gray-700 mb-1">4. Elige tu método de pago:</label> <div class="payment-methods flex flex-wrap gap-2"> <label class="payment-method flex-1 min-w-[90px] flex items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-emerald-50 has-[:checked]:border-adara-success has-[:checked]:ring-1 has-[:checked]:ring-adara-success"> <input type="radio" name="payment_method" value="card" class="mr-2 h-4 w-4 text-adara-success border-gray-300 focus:ring-adara-success" checked> <span class="payment-icon text-lg text-blue-500 mr-1"><i class="fas fa-credit-card"></i></span> <span class="text-xs font-medium text-gray-700">Tarjeta</span> </label> <label class="payment-method flex-1 min-w-[90px] flex items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-emerald-50 has-[:checked]:border-adara-success has-[:checked]:ring-1 has-[:checked]:ring-adara-success"> <input type="radio" name="payment_method" value="paypal" class="mr-2 h-4 w-4 text-adara-success border-gray-300 focus:ring-adara-success"> <span class="payment-icon text-lg text-blue-600 mr-1"><i class="fab fa-paypal"></i></span> <span class="text-xs font-medium text-gray-700">PayPal</span> </label> <label class="payment-method flex-1 min-w-[90px] flex items-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 has-[:checked]:bg-emerald-50 has-[:checked]:border-adara-success has-[:checked]:ring-1 has-[:checked]:ring-adara-success"> <input type="radio" name="payment_method" value="transfer" class="mr-2 h-4 w-4 text-adara-success border-gray-300 focus:ring-adara-success"> <span class="payment-icon text-lg text-gray-600 mr-1"><i class="fas fa-university"></i></span> <span class="text-xs font-medium text-gray-700">Transf.</span> </label> </div> </div>
            <div class="form-group form-privacy !mt-3 !mb-3"> <label class="checkbox-container flex items-center text-xs text-gray-600 cursor-pointer"> <input type="checkbox" id="${formIdPrefix}PrivacyConsent" name="privacy_consent" class="h-4 w-4 text-adara-success border-gray-300 rounded focus:ring-adara-success mr-2" required> <span>Acepto la <a href="/politica-privacidad" target="_blank" class="text-adara-success hover:underline">política de privacidad</a></span> </label> </div>
            <div class="form-group pt-1"> <button type="submit" class="btn btn-accent btn-lg w-full"> Donar <span class="donation-amount-display font-bold">$500</span> <span class="donation-type-text">Mensual</span> <span class="spinner !ml-2 w-4 h-4 border-2"></span> </button> </div>
        </form>
    `;
}

function createHelpForm(formIdPrefix) {
    // HTML del formulario de Ayuda
    return `
    <form id="leadForm" action="#" method="post" class="space-y-3 lead-form-instance">
        <input type="hidden" name="_subject" value="Nuevo Contacto desde Página Web Adara"> <input type="hidden" name="_captcha" value="false"> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"> <div class="form-group !mb-0"> <label for="leadName" class="form-label block text-sm font-medium text-gray-700 mb-1">Nombre completo:</label> <input type="text" id="leadName" name="lead_name" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-primary focus:border-adara-primary sm:text-sm" required> </div> <div class="form-group !mb-0"> <label for="leadPhone" class="form-label block text-sm font-medium text-gray-700 mb-1">Teléfono:</label> <input type="tel" id="leadPhone" name="lead_phone" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-primary focus:border-adara-primary sm:text-sm" required> </div> </div>
        <div class="form-group !mb-2"> <label for="leadEmail" class="form-label block text-sm font-medium text-gray-700 mb-1">Correo electrónico:</label> <input type="email" id="leadEmail" name="lead_email" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-primary focus:border-adara-primary sm:text-sm" required> </div>
        <div class="form-group !mb-2"> <label for="leadReason" class="form-label block text-sm font-medium text-gray-700 mb-1">Motivo de contacto:</label> <select id="leadReason" name="lead_reason" class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-adara-primary focus:border-adara-primary sm:text-sm" required> <option value="">Selecciona una opción</option> <option value="Necesito ayuda personal">Necesito ayuda personal</option> <option value="Necesito ayuda para un familiar">Necesito ayuda para un familiar</option> <option value="Información sobre programas">Información sobre programas</option> <option value="Info: Internamiento Completo">Info: Internamiento Completo</option> <option value="Info: Programa Media Luz">Info: Programa Media Luz</option> <option value="Info: Terapias Grupales">Info: Terapias Grupales</option> <option value="Quiero ser voluntario">Quiero ser voluntario</option> <option value="Quiero donar en especie">Quiero donar en especie</option> <option value="Alianza Corporativa">Alianza Corporativa</option> <option value="Consulta General">Consulta General</option> <option value="Otro motivo">Otro motivo</option> </select> </div>
        <div class="form-group !mb-2"> <label for="leadMessage" class="form-label block text-sm font-medium text-gray-700 mb-1">Mensaje (opcional):</label> <textarea id="leadMessage" name="lead_message" rows="2" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adara-primary focus:border-adara-primary sm:text-sm"></textarea> </div>
        <div class="form-group form-privacy !mt-3 !mb-3"> <label class="checkbox-container flex items-center text-xs text-gray-600 cursor-pointer"> <input type="checkbox" id="leadPrivacyConsent" name="lead_privacy_consent" class="h-4 w-4 text-adara-primary border-gray-300 rounded focus:ring-adara-primary mr-2" required> <span>Acepto la <a href="/politica-privacidad" target="_blank" class="text-adara-primary hover:underline">política de privacidad</a></span> </label> </div>
        <div class="form-group pt-1"> <button type="submit" class="btn btn-primary-solid w-full"> Enviar Mensaje <span class="spinner !ml-2 w-4 h-4 border-2"></span> </button> </div>
    </form>
    `;
}


// Función setupFormEventListeners MODIFICADA con lógica FormSubmit y manejo de errores mejorado
function setupFormEventListeners(formContainerSelector, formType) {
    const container = document.querySelector(formContainerSelector);
    if (!container) { return; }
    const form = container.querySelector('form');
    if (!form) { return; }

    // --- Event Listeners específicos para formularios de DONACIÓN ---
    if (formType === 'donation') {
        // (Toda la lógica para los botones de monto, tabs mensual/única, etc., como en la versión anterior)
        const donationTypeInput = form.querySelector('input[name="donation_type"]');
        const donationAmountInput = form.querySelector('input[name="amount"]');
        const customAmountDiv = form.querySelector('.custom-amount');
        const customAmountInput = customAmountDiv ? customAmountDiv.querySelector('.customAmountInput') : null;
        const amountOptions = form.querySelectorAll('.amount-option');
        const donateTabs = form.querySelectorAll('.donate_tab');
        const submitButton = form.querySelector('button[type="submit"]');
        const submitButtonAmountSpan = submitButton ? submitButton.querySelector('.donation-amount-display') : null;
        const submitButtonTypeTextSpan = submitButton ? submitButton.querySelector('.donation-type-text') : null;
        const impactDisplayArea = form.querySelector('.donation-impact-display');

        const updateDonationDetails = () => {
            if (!donationAmountInput || !donationTypeInput) return;
            let currentAmount = donationAmountInput.value;
             if (isNaN(parseFloat(currentAmount))) { currentAmount = ''; }
            const currentType = donationTypeInput.value;
            if (impactDisplayArea) impactDisplayArea.innerHTML = getImpactHtml(currentAmount);
            if (submitButtonAmountSpan) submitButtonAmountSpan.textContent = currentAmount ? formatCurrency(currentAmount) : '$--';
            if (submitButtonTypeTextSpan) submitButtonTypeTextSpan.textContent = currentType === 'monthly' ? 'Mensual' : 'Única';
        };

        if (donateTabs.length > 0 && donationTypeInput) {
            donateTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    donateTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    donationTypeInput.value = tab.dataset.type;
                    updateDonationDetails();
                });
            });
        }
        if (amountOptions.length > 0 && donationAmountInput && customAmountDiv && customAmountInput) {
            amountOptions.forEach(option => {
                option.addEventListener('click', () => {
                    amountOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    const amount = option.dataset.amount;
                    if (amount === 'custom') {
                        customAmountDiv.style.display = 'flex'; customAmountInput.value = ''; customAmountInput.focus(); donationAmountInput.value = '';
                    } else {
                        customAmountDiv.style.display = 'none'; customAmountInput.value = ''; donationAmountInput.value = amount;
                    }
                    updateDonationDetails();
                });
            });
            customAmountInput.addEventListener('input', (e) => {
                const customButton = form.querySelector('.amount-option[data-amount="custom"]');
                if (customButton && customButton.classList.contains('active')) { donationAmountInput.value = e.target.value; updateDonationDetails(); }
            });
             const initialAmount = form.querySelector('input[name="amount"]').value;
             const initialActiveOption = form.querySelector(`.amount-option[data-amount="${initialAmount}"]`);
             if(initialActiveOption) { initialActiveOption.classList.add('active'); }
             else { const firstOption = form.querySelector('.amount-option'); if(firstOption) { firstOption.click(); } }
        }
        updateDonationDetails(); // Initial call
    } // Fin de listeners específicos de donación

    // --- Event Listener para SUBMIT (Común, con lógica diferenciada) ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const spinner = submitButton ? submitButton.querySelector('.spinner') : null;
        let isHelpForm = form.id === 'leadForm';
        let submissionUrl = isHelpForm ? 'https://formsubmit.co/info@somosadara.org' : '#'; // Usa tu email de FormSubmit

        if (submitButton) {
            submitButton.classList.add('is-loading');
            if (spinner) spinner.style.display = 'inline-block';
            submitButton.disabled = true;
        }
        const formData = new FormData(form);

        if (isHelpForm) {
            // Enviar a FormSubmit usando Fetch con FormData (Corrección)
            fetch(submissionUrl, {
                method: 'POST',
                body: formData, // Enviar FormData directamente
                // No establecer 'Content-Type', el navegador lo hará con 'boundary'
                // Quitar 'Accept: application/json' para evitar error si la respuesta no es JSON
            })
            .then(response => {
                 if (response.ok) {
                     // Asumir éxito si la respuesta HTTP es 2xx
                     return { success: true }; // Simular objeto de éxito
                 } else {
                     // Intentar obtener texto de error
                     return response.text().then(text => {
                         throw new Error(text || `Error HTTP: ${response.status}`);
                     });
                 }
            })
            .then(data => {
                console.log('FormSubmit Success (assumed from response.ok)');
                handleFormSuccess(form, 'help'); // Usar 'help' como formType
            })
            .catch(error => {
                console.error('FormSubmit Fetch Error:', error);
                handleFormError(form, `Error al enviar: ${error.message || 'Error desconocido. Inténtalo de nuevo.'}`);
            })
            .finally(() => {
                if (submitButton) {
                    submitButton.classList.remove('is-loading');
                    if (spinner) spinner.style.display = 'none';
                    submitButton.disabled = false;
                }
            });
        } else {
            // Simulación para otros formularios (Donación popup)
            // AQUÍ DEBERÍA IR LA LÓGICA REAL DE PROCESAMIENTO DE PAGO (STRIPE, PAYPAL, ETC.)
            // Por ahora, simulamos éxito.
            console.log(`Simulating submission for form (${form.id || 'N/A'}), type: ${formType}`);
            console.log('Form Data (Simulated):', Object.fromEntries(formData.entries()));
            setTimeout(() => {
                handleFormSuccess(form, formType);
                if (submitButton) {
                    submitButton.classList.remove('is-loading');
                    if (spinner) spinner.style.display = 'none';
                    submitButton.disabled = false;
                }
            }, 1500);
        }
    }); // Fin del listener 'submit'

    // --- Funciones auxiliares (definidas dentro de setupFormEventListeners para encapsulación) ---
    function handleFormSuccess(formElement, formType) {
        let statusContainerId = null;
        let successMessage = '¡Formulario enviado con éxito!';
        // Busca el contenedor de estado DENTRO del popup padre del formulario
        const parentPopup = formElement.closest('.popup');
        const statusContainer = parentPopup ? parentPopup.querySelector('[id$="FormStatus"]') : null;

        if (formType === 'help') successMessage = '¡Mensaje enviado! Nos pondremos en contacto pronto.';
        else if (formType === 'donation') successMessage = '¡Donación procesada! (Simulación) ¡Gracias!';

        if (statusContainer) { showStatusMessage(statusContainer.id, successMessage, 'success'); }
        else { alert(successMessage); } // Fallback si no hay contenedor de estado

        if (parentPopup) { setTimeout(() => { if (parentPopup.classList.contains('active')) { closePopup(parentPopup.id); } }, 2500); }
        formElement.reset();
        if (formType === 'donation') resetDonationFormUI(formElement);
        else if (formType === 'help') { const reasonSelect = formElement.querySelector('#leadReason'); if (reasonSelect) reasonSelect.value = ''; }
    }

    function handleFormError(formElement, errorMessage) {
         const parentPopup = formElement.closest('.popup');
         const statusContainer = parentPopup ? parentPopup.querySelector('[id$="FormStatus"]') : null;

         if (statusContainer) { showStatusMessage(statusContainer.id, errorMessage, 'error'); }
         else { alert(errorMessage); }
    }

    function resetDonationFormUI(formElement) {
        // Resetea el formulario de donación a su estado inicial
        const defaultAmountOption = formElement.querySelector('.amount-option[data-amount="500"]');
        const monthlyTab = formElement.querySelector('.donate_tab[data-type="monthly"]');
        const customAmountDiv = formElement.querySelector('.custom-amount');
        formElement.querySelectorAll('.amount-option.active').forEach(el => el.classList.remove('active'));
        if (defaultAmountOption) defaultAmountOption.classList.add('active');
        formElement.querySelectorAll('.donate_tab.active').forEach(el => el.classList.remove('active'));
        if (monthlyTab) monthlyTab.classList.add('active');
        if(formElement.querySelector('input[name="amount"]')) formElement.querySelector('input[name="amount"]').value = '500';
        if(formElement.querySelector('input[name="donation_type"]')) formElement.querySelector('input[name="donation_type"]').value = 'monthly';
        if (customAmountDiv) customAmountDiv.style.display = 'none';
        const customInput = customAmountDiv ? customAmountDiv.querySelector('input') : null;
        if (customInput) customInput.value = '';
        const impactDisplayArea = formElement.querySelector('.donation-impact-display');
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const submitBtnAmountSpan = submitBtn ? submitBtn.querySelector('.donation-amount-display') : null;
        const submitBtnTypeTextSpan = submitBtn ? submitBtn.querySelector('.donation-type-text') : null;
        if (impactDisplayArea) impactDisplayArea.innerHTML = getImpactHtml('500');
        if (submitBtnAmountSpan) submitBtnAmountSpan.textContent = formatCurrency('500');
        if (submitBtnTypeTextSpan) submitBtnTypeTextSpan.textContent = 'Mensual';
        // Restablecer la selección del método de pago al predeterminado (tarjeta)
        const cardRadio = formElement.querySelector('input[name="payment_method"][value="card"]');
        if (cardRadio) cardRadio.checked = true;
         // Actualizar visualmente los métodos de pago
         formElement.querySelectorAll('.payment-method').forEach(label => {
            const input = label.querySelector('input[type="radio"]');
            if (input && input.value === 'card') {
                label.classList.add('has-[:checked]'); // Simular el estado checked si CSS depende de ello
            } else {
                label.classList.remove('has-[:checked]');
            }
        });
    }
} // Fin de setupFormEventListeners


function initializeForms() {
    // Contenedores para los formularios en los popups
    const popupDonateFormContainer = document.getElementById('popupDonateFormContainer');
    const popupHelpFormContainer = document.getElementById('popupHelpFormContainer');

    // Generar y configurar formulario de Donación en su popup
    if (popupDonateFormContainer && !popupDonateFormContainer.querySelector('form')) {
        popupDonateFormContainer.innerHTML = createDonationForm('popupDonation'); // Usar prefijo 'popupDonation'
        setupFormEventListeners('#popupDonateFormContainer', 'donation');
    } else if (!popupDonateFormContainer) {
         console.warn("#popupDonateFormContainer not found. Donation popup form not initialized.");
    }

    // Generar y configurar formulario de Ayuda en su popup
    if (popupHelpFormContainer && !popupHelpFormContainer.querySelector('form')) {
        popupHelpFormContainer.innerHTML = createHelpForm('popupHelp'); // No necesita prefijo, ya usa IDs 'lead...'
        setupFormEventListeners('#popupHelpFormContainer', 'help'); // Tipo 'help' activa FormSubmit
    } else if (!popupHelpFormContainer) {
        console.warn("#popupHelpFormContainer not found. Help popup form not initialized.");
    }
}

// --- Inicio: Nuevo Widget de Donación PayPal/Stripe ---
function initializeNewDonationWidget(triggerId, dropdownId) {
    const mainDonateButton = document.getElementById(triggerId);
    const paymentOptionsDropdown = document.getElementById(dropdownId);
    if (!mainDonateButton || !paymentOptionsDropdown) return;
    const paymentOptionLinks = paymentOptionsDropdown.querySelectorAll('.payment-option');
    mainDonateButton.addEventListener('click', function (event) {
        event.stopPropagation();
        // Ocultar otros dropdowns abiertos del mismo tipo
        document.querySelectorAll('.donaciones-widget-container .origin-top-right:not(.hidden), .donaciones-widget-container .origin-top-center:not(.hidden)').forEach(openDropdown => {
             if (openDropdown.id !== dropdownId) {
                 openDropdown.classList.add('hidden');
                 const otherTriggerId = openDropdown.getAttribute('aria-labelledby');
                 if (otherTriggerId) {
                     const otherTrigger = document.getElementById(otherTriggerId);
                     if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                 }
             }
         });
        const isHidden = paymentOptionsDropdown.classList.contains('hidden'); paymentOptionsDropdown.classList.toggle('hidden', !isHidden); mainDonateButton.setAttribute('aria-expanded', String(!isHidden));
        if (!isHidden) { const firstLink = paymentOptionsDropdown.querySelector('a[role="menuitem"]'); if (firstLink) firstLink.focus(); else paymentOptionsDropdown.focus(); }
    });
    // Cerrar dropdown si se hace clic fuera
    document.addEventListener('click', function (event) { if (!paymentOptionsDropdown.classList.contains('hidden') && !mainDonateButton.contains(event.target) && !paymentOptionsDropdown.contains(event.target)) { paymentOptionsDropdown.classList.add('hidden'); mainDonateButton.setAttribute('aria-expanded', 'false'); } });
    // Navegación con teclado y cierre con Escape
    paymentOptionsDropdown.addEventListener('keydown', function(event) { if (event.key === 'Escape') { paymentOptionsDropdown.classList.add('hidden'); mainDonateButton.setAttribute('aria-expanded', 'false'); mainDonateButton.focus(); } if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); const items = Array.from(paymentOptionsDropdown.querySelectorAll('a[role="menuitem"]')); let currentIndex = items.indexOf(document.activeElement); if (event.key === 'ArrowDown') currentIndex = (currentIndex + 1) % items.length; else currentIndex = (currentIndex - 1 + items.length) % items.length; if (items[currentIndex]) items[currentIndex].focus(); } });
    // Función para abrir enlaces externos en un popup centrado
    function openExternalLinkPopup(url) { const popupWidth = 800, popupHeight = 650; const left = (window.screen.width / 2) - (popupWidth / 2); const top = (window.screen.height / 2) - (popupHeight / 2); const safeWidth = Math.min(popupWidth, window.screen.availWidth); const safeHeight = Math.min(popupHeight, window.screen.availHeight); const safeLeft = Math.max(0, left); const safeTop = Math.max(0, top); window.open(url, 'DonationPopup', `width=${safeWidth},height=${safeHeight},top=${safeTop},left=${safeLeft},scrollbars=yes,resizable=yes,status=yes,toolbar=no,menubar=no,location=yes`); }
    // Acción al hacer clic en las opciones de pago
    paymentOptionLinks.forEach(option => { option.addEventListener('click', function (event) { event.preventDefault(); const paymentMethod = this.dataset.paymentMethod; paymentOptionsDropdown.classList.add('hidden'); mainDonateButton.setAttribute('aria-expanded', 'false'); mainDonateButton.focus(); if (paymentMethod === 'paypal') openExternalLinkPopup('https://www.paypal.com/donate/?hosted_button_id=E44UUTB6DFN2A'); else if (paymentMethod === 'stripe') openExternalLinkPopup('https://donate.stripe.com/6oEcP55JweTTdZCfYY'); }); });
}
// --- Fin: Nuevo Widget de Donación PayPal/Stripe ---

// --- Inicialización al Cargar el DOM ---
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('currentYear'); if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
    const openHelpPopupBtnHeader = document.getElementById('openHelpPopupBtnHeader'); if (openHelpPopupBtnHeader) { openHelpPopupBtnHeader.addEventListener('click', () => openPopup('helpPopup', 'Consulta General')); }

    // Inicializar todas las funcionalidades
    initializeMobileMenu();
    initializeScrollReveal();
    initializeVideoCarousel();
    initializePopupClosers(); // Configura cierres globales para todos los popups
    initializeForms(); // Genera y configura formularios en popups

    // Inicializar todos los widgets de donación
    initializeNewDonationWidget('headerDonateTrigger', 'headerDonateDropdown');
    initializeNewDonationWidget('mobileDonateTrigger', 'mobileDonateDropdown');
    initializeNewDonationWidget('heroDonateTrigger', 'heroDonateDropdown');
    initializeNewDonationWidget('howToHelpDonateTrigger', 'howToHelpDonateDropdown');

    // Inicializar lógica de sucursales
    const branchButtons = document.querySelectorAll('.branch-buttons button');
    branchButtons.forEach(button => button.addEventListener('click', () => showBranchInfo(button.dataset.branch)));
    if (document.getElementById('branchAddress')) {
         showBranchInfo('cancun'); // Mostrar Cancún por defecto
     }

    // --- Código Gráfica de Impacto ---
    try {
        const chartCanvas = document.getElementById('adaraChart');
        if (!chartCanvas) { console.warn("Elemento canvas #adaraChart no encontrado. Gráfica no inicializada.") }
        else {
            // (Inicio Código Gráfica - Mantenido como antes)
            const labels = ["2021-06", "2021-07", "2021-08", "2021-09", "2021-10", "2021-11", "2021-12", "2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06", "2023-07", "2023-08", "2023-09", "2023-10", "2023-11", "2023-12", "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05"]; const monthNamesEs = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; const parseCurrencyPDF = (value) => parseFloat(String(value).replace(/[\$,]/g, '')) || 0; const datasetsFromPDF = { nuevosIngresosOrganicosMes: [3, 12, 19, 24, 20, 7, 3, 11, 12, 8, 5, 7, 6, 4, 4, 6, 4, 9, 5, 12, 7, 11, 9, 9, 8, 11, 4, 11, 8, 14, 11, 12, 9, 35, 20, 9, 12, 9, 9, 11, 11, 9, 18, 24, 26, 29, 23, 20], recaidasIngresosMes: [0, 0, 1, 3, 5, 2, 7, 4, 9, 7, 6, 4, 9, 3, 9, 4, 11, 2, 11, 2, 3, 4, 4, 4, 5, 3, 5, 4, 12, 12, 7, 7, 7, 18, 12, 5, 9, 8, 6, 10, 9, 11, 11, 12, 12, 13, 9, 9], personasActivasMes: [3, 14, 32, 54, 71, 74, 75, 76, 76, 73, 75, 72, 76, 74, 74, 69, 78, 75, 75, 77, 78, 79, 73, 77, 76, 78, 78, 79, 77, 78, 76, 80, 78, 112, 132, 126, 133, 134, 133, 133, 135, 133, 135, 119, 137, 154, 166, 173], inversionMes: [53500, 103000, 184000, 283000, 359500, 373000, 377500, 382000, 382000, 368500, 377500, 364000, 382000, 373000, 373000, 350500, 391000, 377500, 377500, 386500, 391000, 395500, 368500, 386500, 382000, 391000, 391000, 395500, 386500, 391000, 382000, 400000, 375400, 432000, 502000, 481000, 505500, 509000, 505500, 505500, 512500, 505500, 607500, 397500, 442500, 485000, 515000, 532500].map(parseCurrencyPDF), inversionTotalAcum: [53500, 156500, 340500, 623500, 983000, 1356000, 1733500, 2115500, 2497500, 2866000, 3243500, 3607500, 3989500, 4362500, 4735500, 5086000, 5477000, 5854500, 6232000, 6618500, 7009500, 7405000, 7773500, 8160000, 8542000, 8933000, 9324000, 9719500, 10106000, 10497000, 10879000, 11279000, 11654400, 12086400, 12588400, 13069400, 13574900, 14083900, 14589400, 15094900, 15607400, 16112900, 16720400, 17117900, 17560400, 18045400, 18560400, 19092900].map(parseCurrencyPDF), c1Activos: [3, 14, 32, 54, 71, 74, 75, 76, 76, 73, 75, 72, 76, 74, 74, 69, 78, 75, 75, 77, 78, 79, 73, 77, 76, 78, 78, 79, 77, 78, 76, 80, 78, 75, 73, 70, 75, 72, 67, 73, 70, 74, 75, 74, 72, 70, 75, 73], c2Activos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 59, 56, 58, 62, 66, 60, 65, 59, 53, 0, 0, 0, 0, 0], c3Activos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 10, 45, 65, 84, 91, 100], apoyosBrindadosAcum: [], };
            let currentApoyosSum = 0; for (let i = 0; i < labels.length; i++) { currentApoyosSum += (datasetsFromPDF.nuevosIngresosOrganicosMes[i] || 0) + (datasetsFromPDF.recaidasIngresosMes[i] || 0); datasetsFromPDF.apoyosBrindadosAcum.push(currentApoyosSum); }
            const clinicEvents = { "2021-06": "Apertura Clínica Cancún", "2023-05": "Constitución Legal Fundación Adara", "2024-02": "Permiso Donataria Autorizada", "2024-03": "Apertura Clínica Cuernavaca", "2024-12": "Apertura Clínica Leona Vicario", "2025-01": "Cierre Clínica Cuernavaca" };
            const adaraPrimary = '#0077B6', adaraSecondary = '#00B4D8', adaraAccent = '#FFD60A', adaraSuccess = '#2A9D8F', adaraError = '#E76F51', adaraPurple = '#6A0DAD', adaraDark = '#333333', adaraGray = '#6B7280';
            const datasetsConfig = { apoyosBrindadosAcum: { label: 'Apoyos Brindados (Acum)', data: datasetsFromPDF.apoyosBrindadosAcum, borderColor: adaraPurple, backgroundColor: adaraPurple+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2}, nuevosIngresosOrganicosMes: { label: 'Nuevos Ingresos', data: datasetsFromPDF.nuevosIngresosOrganicosMes, borderColor: adaraSecondary, backgroundColor: adaraSecondary+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2 }, recaidasIngresosMes: { label: 'Ingresos por Recaída', data: datasetsFromPDF.recaidasIngresosMes, borderColor: adaraSuccess, backgroundColor: adaraSuccess+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2 }, personasActivasMes: { label: 'Personas Activas', data: datasetsFromPDF.personasActivasMes, borderColor: adaraPrimary, backgroundColor: adaraPrimary+'33', yAxisID: 'yCounts', tension: 0.1, borderWidth: 2 }, inversionMes: { label: 'Gasto Mensual', data: datasetsFromPDF.inversionMes, borderColor: adaraError, backgroundColor: adaraError+'33', yAxisID: 'yCurrency', tension: 0.1, borderWidth: 2 }, inversionTotalAcum: { label: 'Gasto Acumulado', data: datasetsFromPDF.inversionTotalAcum, borderColor: adaraAccent, backgroundColor: adaraAccent+'33', yAxisID: 'yCurrency', tension: 0.1, borderWidth: 2 } };
            const ctx = chartCanvas.getContext('2d'); let adaraChart = new Chart(ctx, { type: 'line', data: { labels: labels, datasets: [] }, options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom', labels: { color: adaraDark, padding: 15, font: { size: 11, family: "'Lato', sans-serif" }}}, tooltip: { backgroundColor: 'rgba(51, 51, 51, 0.9)', titleColor: '#FFFFFF', bodyColor: '#F8F9FA', borderColor: adaraGray, borderWidth: 1, padding: 10, cornerRadius: 4, displayColors: true, boxPadding: 4, titleFont: { family: "'Montserrat', sans-serif", weight: 'bold'}, bodyFont: { family: "'Lato', sans-serif", size: 12}, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) { label += ': '; } if (context.parsed.y !== null) { if (context.dataset.yAxisID === 'yCurrency') { label += formatCurrency(context.parsed.y); } else { label += formatNumberWithCommas(context.parsed.y); } } return label; } } } }, scales: { x: { ticks: { color: adaraGray, font: {size: 10, family: "'Lato', sans-serif"} }, grid: { color: 'rgba(0, 0, 0, 0.05)' } }, yCounts: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Cantidad', color: adaraGray, font: {size: 11, weight: '500', family: "'Montserrat', sans-serif"} }, ticks: { color: adaraGray, font: {size: 10, family: "'Lato', sans-serif"} }, grid: { color: 'rgba(0, 0, 0, 0.08)' } }, yCurrency: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Monto ($MXN)', color: adaraGray, font: {size: 11, weight: '500', family: "'Montserrat', sans-serif"} }, ticks: { color: adaraGray, font: {size: 10, family: "'Lato', sans-serif"}, callback: function (value) { return new Intl.NumberFormat('es-MX', { notation: 'compact', compactDisplay: 'short' }).format(value); } }, grid: { drawOnChartArea: false } } } } });
            const timelineSlider = document.getElementById('timelineSlider'); const selectedMonthLabel = document.getElementById('selectedMonthLabel'); const kpiTitleMonth = document.getElementById('kpiTitleMonth'); const timelineEventTextElement = document.getElementById('timelineEventText'); const kpiNuevosOrganicosValor = document.getElementById('kpiNuevosOrganicosValor'); const kpiRecaidasIngresosValor = document.getElementById('kpiRecaidasIngresosValor'); const kpiPersonasActivas = document.getElementById('kpiPersonasActivas'); const kpiActivosClinicas = document.getElementById('kpiActivosClinicas'); const kpiGastoMensualValor = document.getElementById('kpiGastoMensualValor'); const kpiApoyosBrindadosValor = document.getElementById('kpiApoyosBrindadosValor'); const kpiTotalGastosAcumuladosValor = document.getElementById('kpiTotalGastosAcumuladosValor');
            function updateKpiCards (monthIndex) { if (monthIndex < 0 || monthIndex >= labels.length) return; const fullMonthLabel = labels[monthIndex]; const [year, monthNum] = fullMonthLabel.split('-'); const monthName = monthNamesEs[parseInt(monthNum) - 1]; if(selectedMonthLabel) selectedMonthLabel.textContent = `${monthName} ${year}`; if(kpiTitleMonth) kpiTitleMonth.textContent = `(${monthName} / ${year})`; if(kpiNuevosOrganicosValor) kpiNuevosOrganicosValor.textContent = formatNumberWithCommas(datasetsFromPDF.nuevosIngresosOrganicosMes[monthIndex] || 0); if(kpiRecaidasIngresosValor) kpiRecaidasIngresosValor.textContent = formatNumberWithCommas(datasetsFromPDF.recaidasIngresosMes[monthIndex] || 0); if(kpiPersonasActivas) kpiPersonasActivas.textContent = formatNumberWithCommas(datasetsFromPDF.personasActivasMes[monthIndex] || 0); if(kpiActivosClinicas) { const c1 = formatNumberWithCommas(datasetsFromPDF.c1Activos[monthIndex] || 0); const c2 = formatNumberWithCommas(datasetsFromPDF.c2Activos[monthIndex] || 0); const c3 = formatNumberWithCommas(datasetsFromPDF.c3Activos[monthIndex] || 0); kpiActivosClinicas.textContent = `Cancún: ${c1}, Cuerna: ${c2}, Leona: ${c3}`; } if(kpiGastoMensualValor) kpiGastoMensualValor.textContent = formatCurrency(datasetsFromPDF.inversionMes[monthIndex] || 0); if(kpiApoyosBrindadosValor) kpiApoyosBrindadosValor.textContent = formatNumberWithCommas(datasetsFromPDF.apoyosBrindadosAcum[monthIndex] || 0); if(kpiTotalGastosAcumuladosValor) kpiTotalGastosAcumuladosValor.textContent = formatCurrency(datasetsFromPDF.inversionTotalAcum[monthIndex] || 0); if(timelineEventTextElement) timelineEventTextElement.textContent = clinicEvents[fullMonthLabel] || ""; }
            if (timelineSlider) { timelineSlider.max = labels.length - 1; timelineSlider.value = labels.length - 1; timelineSlider.addEventListener('input', (event) => { updateKpiCards(parseInt(event.target.value)); }); } else { console.error("Elemento timelineSlider no encontrado."); }
            function updateChartDisplay() { const selectedDatasets = []; document.querySelectorAll('#controls input[type="checkbox"]').forEach(checkbox => { const datasetKey = checkbox.dataset.dataset; if (checkbox.checked && datasetsConfig[datasetKey]) selectedDatasets.push(datasetsConfig[datasetKey]); }); adaraChart.data.datasets = selectedDatasets; let yCountsNeeded = selectedDatasets.some(ds => ds.yAxisID === 'yCounts'); let yCurrencyNeeded = selectedDatasets.some(ds => ds.yAxisID === 'yCurrency'); if (adaraChart.options.scales.yCounts) adaraChart.options.scales.yCounts.display = yCountsNeeded; if (adaraChart.options.scales.yCurrency) adaraChart.options.scales.yCurrency.display = yCurrencyNeeded; adaraChart.update(); }
            document.querySelectorAll('#controls input[type="checkbox"]').forEach(checkbox => checkbox.addEventListener('change', updateChartDisplay));
            updateChartDisplay(); updateKpiCards(labels.length - 1);
            // (Fin Código Gráfica)
        }
    } catch (error) {
        console.error("Error inicializando la nueva sección de impacto:", error);
        const chartWrapper = document.getElementById('chart-wrapper'); // Asume que existe un div con este ID
        if (chartWrapper) { chartWrapper.innerHTML = '<p class="text-adara-error text-center p-4">Error al cargar las estadísticas. Intenta recargar la página.</p>'; }
    }
    // --- FIN CÓDIGO GRÁFICA ---

}); // Fin de DOMContentLoaded
