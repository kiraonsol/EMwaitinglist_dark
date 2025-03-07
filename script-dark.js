class WaitlistApp {
    constructor() {
        this.initFirebase();
        this.initWebGL();
        this.initLogoAnimation();
        this.initForm();
    }

    initFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyDGFuDNLDIgAuXxfH0ZjkxR09q53yfhTag",
            authDomain: "evil-model-waitlist.firebaseapp.com",
            projectId: "evil-model-waitlist",
            storageBucket: "evil-model-waitlist.firebasestorage.app",
            messagingSenderId: "20545536094",
            appId: "1:20545536094:web:f0612c08f6cb4b749cb4cf",
            measurementId: "G-14YYDS69BW"
        };

        try {
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            console.log("Firebase initialized successfully.");
        } catch (error) {
            console.error("Failed to initialize Firebase:", error);
        }
    }

    initWebGL() {
        const params = {
            enableWebGL: true,
            particleCount: window.innerWidth > 1200 ? 120 : window.innerWidth > 768 ? 80 : 40,
            animationSpeed: 0.0015
        };

        if (!params.enableWebGL) {
            console.log("WebGL is disabled.");
            return;
        }

        const canvas = document.querySelector('#webgl-background');
        const heroContent = document.querySelector('.hero-content');
        const webglFallback = document.querySelector('#webgl-fallback');

        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }

        if (!heroContent) {
            console.error("Hero content element not found!");
            return;
        }

        if (!webglFallback) {
            console.error("WebGL fallback element not found!");
        }

        console.log("Window innerWidth:", window.innerWidth);
        console.log("Moving canvas for mobile check...");

        if (window.innerWidth <= 1024) {
            heroContent.appendChild(canvas);
            console.log("Moved canvas to .hero-content for mobile.");
            console.log("Canvas parent after move:", canvas.parentNode);
        } else {
            console.log("Canvas remains at top level for desktop.");
        }

        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error("WebGL is not supported on this device. Please ensure your browser supports WebGL and it is enabled.");
            if (webglFallback) {
                webglFallback.style.display = 'flex';
                console.log("Showing WebGL fallback message.");
            }
            return;
        }

        console.log("Initializing WebGL animation...");

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const geometry = new THREE.PlaneGeometry(30, 30, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xE25747,
            wireframe: true,
            transparent: true,
            opacity: 0.75
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI * 0.5;
        scene.add(mesh);

        camera.position.set(0, 5, 7);

        let lastTime = 0;
        const animate = (currentTime = 0) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            if (deltaTime < 32) {
                const positions = geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 2] = Math.sin((currentTime * params.animationSpeed) + positions[i]) * 0.5;
                }
                geometry.attributes.position.needsUpdate = true;
                renderer.render(scene, camera);
            } else {
                console.log("Frame skipped due to large deltaTime:", deltaTime);
            }
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

            console.log("Window resized, new innerWidth:", window.innerWidth);
            if (window.innerWidth <= 1024) {
                if (canvas.parentNode !== heroContent) {
                    heroContent.appendChild(canvas);
                    console.log("Moved canvas to .hero-content on resize (mobile).");
                    console.log("Canvas parent after resize move:", canvas.parentNode);
                }
            } else {
                if (canvas.parentNode !== document.body) {
                    document.body.insertBefore(canvas, document.body.firstChild);
                    console.log("Moved canvas to body on resize (desktop).");
                    console.log("Canvas parent after resize move:", canvas.parentNode);
                }
            }
        };

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
            mesh.rotation.x = -Math.PI * 0.5 + mouseY * 0.1;
            mesh.rotation.y = mouseX * 0.1;
        });

        document.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
            mouseY = (touch.clientY / window.innerHeight) * 2 - 1;
            mesh.rotation.x = -Math.PI * 0.5 + mouseY * 0.1;
            mesh.rotation.y = mouseX * 0.1;
        });

        console.log("Starting WebGL animation...");
        console.log("Video autoplay with sound attempted. Check console for autoplay status.");
        animate();
    }

    initLogoAnimation() {
        const canvas = document.querySelector('#logo-animation');
        if (!canvas) {
            console.error("Logo animation canvas not found!");
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        // Set canvas size based on CSS dimensions
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Adjust camera to fit the canvas
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
        camera.position.z = 1;

        // Create a plane to render the iridescent effect
        const geometry = new THREE.PlaneGeometry(width, height);

        // Custom shader for iridescent effect
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float time;
            uniform vec2 resolution;
            varying vec2 vUv;

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
                vec2 uv = vUv;
                vec2 center = vec2(0.5, 0.5);
                vec2 pos = uv - center;
                float dist = length(pos);
                float angle = atan(pos.y, pos.x) + time * 0.5;
                float hue = sin(dist * 10.0 - time) * 0.5 + 0.5 + angle * 0.1;
                hue = fract(hue);
                vec3 color = hsv2rgb(vec3(hue, 0.8, 1.0));
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0.0 },
                resolution: { value: new THREE.Vector2(width, height) }
            },
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animation loop
        let time = 0;
        const animate = () => {
            time += 0.05;
            material.uniforms.time.value = time;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        // Handle resize
        const handleResize = () => {
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            renderer.setSize(width, height);
            material.uniforms.resolution.value.set(width, height);

            camera.left = -width / 2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = -height / 2;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        console.log("Starting WebGL logo animation...");
        animate();
    }

    initForm() {
        const form = document.querySelector('.waitlist-form');
        const button = form.querySelector('.submit-btn');
        const input = document.querySelector('.input-field');

        if (!form || !button || !input) {
            console.error("Form elements not found:", { form, button, input });
            return;
        }

        console.log("Form elements found, setting up event listener...");

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = input.value.trim();

            console.log("Form submitted, email:", email);

            if (!email || !email.includes('@')) {
                console.log("Invalid email, adding error class...");
                input.classList.add('error');
                input.focus();
                setTimeout(() => input.classList.remove('error'), 1000);
                return;
            }

            try {
                button.disabled = true;
                button.style.opacity = '0.7';
                console.log("Submitting email to Firebase:", email);

                if (!this.db) {
                    throw new Error("Firestore database not initialized. Check Firebase configuration.");
                }

                await this.db.collection('waitlist_emails').add({
                    email: email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });

                console.log("Email successfully logged to Firebase.");

                button.innerHTML = 'Added ✓';
                button.style.background = '#4CAF50';
                input.value = '';

                setTimeout(() => {
                    button.innerHTML = 'Join Waitlist';
                    button.style.background = '';
                    button.style.opacity = '1';
                    button.disabled = false;
                }, 2000);
            } catch (error) {
                console.error("Error logging email to Firebase:", error);
                button.innerHTML = 'Error!';
                button.style.background = '#FF4444';
                setTimeout(() => {
                    button.innerHTML = 'Join Waitlist';
                    button.style.background = '';
                    button.style.opacity = '1';
                    button.disabled = false;
                }, 2000);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new WaitlistApp());
