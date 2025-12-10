// Variables globales
let scene, camera, renderer, currentMesh;
let selectedFigure = null;
let isThreeJSInitialized = false;

// Inicializar la escena 3D
function initThreeJS() {
    if (isThreeJSInitialized) return;
    
    const container = document.getElementById('three-canvas');
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Crear cámara
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);
    
    // Crear renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-10, -10, -5);
    scene.add(directionalLight2);
    
    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);
    
    // Ejes
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
    
    isThreeJSInitialized = true;
    
    // Animar
    animate();
    
    // Responsive
    window.addEventListener('resize', onWindowResize, false);
    
    console.log('Three.js inicializado correctamente');
}

function onWindowResize() {
    const container = document.getElementById('three-canvas');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotar la figura automáticamente
    if (currentMesh) {
        currentMesh.rotation.y += 0.005;
        currentMesh.rotation.x += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Event listeners para las tarjetas de figuras
document.querySelectorAll('.figure-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remover clase active de todas las tarjetas
        document.querySelectorAll('.figure-card').forEach(c => c.classList.remove('active'));
        
        // Agregar clase active a la tarjeta seleccionada
        this.classList.add('active');
        
        // Ocultar todos los inputs
        document.querySelectorAll('.input-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar el input correspondiente
        const figure = this.getAttribute('data-figure');
        selectedFigure = figure;
        document.getElementById(`input-${figure}`).classList.add('active');
        
        // Ocultar resultado y canvas
        document.getElementById('result-container').classList.remove('active');
        document.getElementById('canvas-container').classList.remove('active');
    });
});

// Funciones de cálculo de volumen
function calcularVolumenEsfera(radio) {
    return (4/3) * Math.PI * Math.pow(radio, 3);
}

function calcularVolumenCubo(lado) {
    return Math.pow(lado, 3);
}

function calcularVolumenCilindro(radio, altura) {
    return Math.PI * Math.pow(radio, 2) * altura;
}

function calcularVolumenCono(radio, altura) {
    return (1/3) * Math.PI * Math.pow(radio, 2) * altura;
}

function calcularVolumenPiramide(base, altura) {
    return (1/3) * Math.pow(base, 2) * altura;
}

// Función principal de cálculo
function calcularVolumen(figura) {
    // Ocultar mensajes de error
    document.getElementById(`error-${figura}`).classList.remove('active');
    
    let volumen, dimensiones;
    let valido = true;
    
    try {
        switch(figura) {
            case 'esfera':
                const radioEsfera = parseFloat(document.getElementById('radio-esfera').value);
                if (!radioEsfera || radioEsfera <= 0) {
                    mostrarError(figura, 'Por favor, ingrese un radio válido mayor que 0');
                    return;
                }
                volumen = calcularVolumenEsfera(radioEsfera);
                dimensiones = { radio: radioEsfera };
                break;
                
            case 'cubo':
                const ladoCubo = parseFloat(document.getElementById('lado-cubo').value);
                if (!ladoCubo || ladoCubo <= 0) {
                    mostrarError(figura, 'Por favor, ingrese un lado válido mayor que 0');
                    return;
                }
                volumen = calcularVolumenCubo(ladoCubo);
                dimensiones = { lado: ladoCubo };
                break;
                
            case 'cilindro':
                const radioCilindro = parseFloat(document.getElementById('radio-cilindro').value);
                const alturaCilindro = parseFloat(document.getElementById('altura-cilindro').value);
                if (!radioCilindro || radioCilindro <= 0 || !alturaCilindro || alturaCilindro <= 0) {
                    mostrarError(figura, 'Por favor, ingrese valores válidos mayores que 0');
                    return;
                }
                volumen = calcularVolumenCilindro(radioCilindro, alturaCilindro);
                dimensiones = { radio: radioCilindro, altura: alturaCilindro };
                break;
                
            case 'cono':
                const radioCono = parseFloat(document.getElementById('radio-cono').value);
                const alturaCono = parseFloat(document.getElementById('altura-cono').value);
                if (!radioCono || radioCono <= 0 || !alturaCono || alturaCono <= 0) {
                    mostrarError(figura, 'Por favor, ingrese valores válidos mayores que 0');
                    return;
                }
                volumen = calcularVolumenCono(radioCono, alturaCono);
                dimensiones = { radio: radioCono, altura: alturaCono };
                break;
                
            case 'piramide':
                const basePiramide = parseFloat(document.getElementById('base-piramide').value);
                const alturaPiramide = parseFloat(document.getElementById('altura-piramide').value);
                if (!basePiramide || basePiramide <= 0 || !alturaPiramide || alturaPiramide <= 0) {
                    mostrarError(figura, 'Por favor, ingrese valores válidos mayores que 0');
                    return;
                }
                volumen = calcularVolumenPiramide(basePiramide, alturaPiramide);
                dimensiones = { base: basePiramide, altura: alturaPiramide };
                break;
        }
        
        // Mostrar resultado
        mostrarResultado(volumen, figura, dimensiones);
        
        // Mostrar contenedor de canvas ANTES de inicializar
        document.getElementById('canvas-container').classList.add('active');
        
        // Esperar un momento para que el contenedor se muestre
        setTimeout(() => {
            // Inicializar Three.js si no está inicializado
            if (!isThreeJSInitialized) {
                initThreeJS();
            }
            
            // Dibujar la figura después de que Three.js esté listo
            setTimeout(() => {
                dibujarFigura3D(figura, dimensiones, volumen);
            }, 100);
        }, 100);
        
    } catch (error) {
        console.error('Error:', error);
        mostrarError(figura, 'Error al calcular el volumen. Verifique los datos ingresados.');
    }
}

function mostrarError(figura, mensaje) {
    const errorDiv = document.getElementById(`error-${figura}`);
    errorDiv.textContent = mensaje;
    errorDiv.classList.add('active');
}

function mostrarResultado(volumen, figura, dimensiones) {
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    
    let figuraTexto = {
        'esfera': 'Esfera',
        'cubo': 'Cubo',
        'cilindro': 'Cilindro',
        'cono': 'Cono',
        'piramide': 'Pirámide'
    };
    
    resultText.innerHTML = `
        ✅ <strong>${figuraTexto[figura]}</strong><br>
        Volumen: <span style="color: #1565c0; font-size: 1.4em;">${volumen.toFixed(4)}</span> unidades³
    `;
    
    resultContainer.classList.add('active');
}

// Funciones para dibujar figuras 3D
function dibujarFigura3D(figura, dimensiones, volumen) {
    console.log('Dibujando figura:', figura, dimensiones);
    
    // Limpiar la escena de objetos mesh anteriores
    if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh.geometry.dispose();
        currentMesh.material.dispose();
    }
    
    let geometry, material, mesh;
    
    try {
        switch(figura) {
            case 'esfera':
                geometry = new THREE.SphereGeometry(dimensiones.radio, 32, 32);
                material = new THREE.MeshPhongMaterial({ 
                    color: 0x00bcd4, 
                    transparent: true, 
                    opacity: 0.8,
                    shininess: 100
                });
                mesh = new THREE.Mesh(geometry, material);
                break;
                
            case 'cubo':
                geometry = new THREE.BoxGeometry(dimensiones.lado, dimensiones.lado, dimensiones.lado);
                material = new THREE.MeshPhongMaterial({ 
                    color: 0xff9800, 
                    transparent: true, 
                    opacity: 0.8,
                    shininess: 100
                });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = dimensiones.lado / 2;
                break;
                
            case 'cilindro':
                geometry = new THREE.CylinderGeometry(
                    dimensiones.radio, 
                    dimensiones.radio, 
                    dimensiones.altura, 
                    32
                );
                material = new THREE.MeshPhongMaterial({ 
                    color: 0x4caf50, 
                    transparent: true, 
                    opacity: 0.8,
                    shininess: 100
                });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = dimensiones.altura / 2;
                break;
                
            case 'cono':
                geometry = new THREE.ConeGeometry(dimensiones.radio, dimensiones.altura, 32);
                material = new THREE.MeshPhongMaterial({ 
                    color: 0x9c27b0, 
                    transparent: true, 
                    opacity: 0.8,
                    shininess: 100
                });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = dimensiones.altura / 2;
                break;
                
            case 'piramide':
                geometry = new THREE.ConeGeometry(
                    dimensiones.base / Math.sqrt(2), 
                    dimensiones.altura, 
                    4
                );
                material = new THREE.MeshPhongMaterial({ 
                    color: 0xffeb3b, 
                    transparent: true, 
                    opacity: 0.8,
                    shininess: 100
                });
                mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = dimensiones.altura / 2;
                mesh.rotation.y = Math.PI / 4;
                break;
        }
        
        // Agregar wireframe
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color.setHex(0x000000);
        line.material.opacity = 0.3;
        line.material.transparent = true;
        mesh.add(line);
        
        currentMesh = mesh;
        scene.add(mesh);
        
        console.log('Figura agregada a la escena');
        
        // Actualizar display de volumen
        const figuraTexto = {
            'esfera': 'Esfera',
            'cubo': 'Cubo',
            'cilindro': 'Cilindro',
            'cono': 'Cono',
            'piramide': 'Pirámide'
        };
        
        let dimensionesTexto = '';
        if (dimensiones.radio && dimensiones.altura) {
            dimensionesTexto = `Radio: ${dimensiones.radio}, Altura: ${dimensiones.altura}`;
        } else if (dimensiones.radio) {
            dimensionesTexto = `Radio: ${dimensiones.radio}`;
        } else if (dimensiones.lado) {
            dimensionesTexto = `Lado: ${dimensiones.lado}`;
        } else if (dimensiones.base && dimensiones.altura) {
            dimensionesTexto = `Base: ${dimensiones.base}, Altura: ${dimensiones.altura}`;
        }
        
        document.getElementById('volume-display').innerHTML = `
            <strong>${figuraTexto[figura]}</strong><br>
            ${dimensionesTexto}<br>
            <span style="color: #1565c0; font-size: 1.2em;">Volumen: ${volumen.toFixed(4)} unidades³</span>
        `;
        
        // Ajustar cámara según el tamaño de la figura
        let maxDimension = Math.max(...Object.values(dimensiones));
        camera.position.z = maxDimension * 3;
        camera.position.y = maxDimension * 1.5;
        camera.lookAt(0, maxDimension / 2, 0);
        
        console.log('Figura 3D completada');
        
    } catch (error) {
        console.error('Error al dibujar figura 3D:', error);
    }
}

// Inicializar cuando se carga la página
window.addEventListener('load', () => {
    console.log('Calculadora de Volúmenes 3D cargada correctamente');
});
