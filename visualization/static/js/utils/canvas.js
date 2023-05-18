export function plot_globe(global_node) {

    // Get the canvas element from the DOM
    const canvas = document.querySelector('#scene');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Store the 2D context
    const ctx = canvas.getContext('2d');

    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    }

    /* ====================== */
    /* ====== VARIABLES ===== */
    /* ====================== */
    let width = canvas.clientWidth; // Width of the canvas
    let height = canvas.clientHeight; // Height of the canvas
    let rotation = 0; // Rotation of the globe
    let dots = []; // Every dots in an array

    let min_x = Number(global_node.canvas.min_x);
    let min_y = Number(global_node.canvas.min_y);
    let max_x = Number(global_node.canvas.max_x);
    let max_y = Number(global_node.canvas.max_y);
    let min_size = Number(global_node.canvas.min_size);
    let max_size = Number(global_node.canvas.max_size);
    let nodes = global_node.nodes;

    /* ====================== */
    /* ====== CONSTANTS ===== */
    /* ====================== */
    /* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the variables */
    const DOTS_AMOUNT = nodes.length; // Amount of dots on the screen
    const DOT_RADIUS = 4; // Radius of the dots
    let GLOBE_RADIUS = width * 0.7; // Radius of the globe
    let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
    let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
    let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
    let FIELD_OF_VIEW = width * 0.8;

    let asn_color = [255, 111, 0]
    let domain_color = [70, 70,70]

    

    class Dot {
        constructor(x, y, z, sizeRatio, type, ratio) {
            this.x = x;
            this.y = y;
            this.z = z;

            this.xProject = 0;
            this.yProject = 0;
            this.sizeProjection = 0;
            this.type = type;
            if (this.type === "ASN")
                {
                    this.sizeRatio = sizeRatio*2.5;
                }
            else
            {
                this.sizeRatio = sizeRatio*1.2;
            }
            
            this.ratio = ratio
        }
        // Do some math to project the 3D position into the 2D canvas
        project(sin, cos) {
            const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
            const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
            this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
            this.xProject = (rotX * this.sizeProjection) + PROJECTION_CENTER_X;
            this.yProject = (this.y * this.sizeProjection) + PROJECTION_CENTER_Y;
        }
        // Draw the dot on the canvas
        draw(sin, cos) {
            this.project(sin, cos);
            if (this.rotZ < GLOBE_CENTER_Z) {
                return;
            }
            // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
            ctx.beginPath();
            ctx.arc(this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection * this.sizeRatio, 0, Math.PI * 2);
            ctx.closePath();
            ctx.lineWidth = 1;
            if (this.type === "ASN") {
                ctx.strokeStyle = "rgb(" + asn_color[0] + "," + asn_color[1] + "," + asn_color[2] + ")";
                ctx.fillStyle = "rgba(" + asn_color[0] + "," + asn_color[1] + "," + asn_color[2] + "," + "0.7" + ")"
            } else {
                
                ctx.strokeStyle = "rgb(" + domain_color[0] + "," + domain_color[1] + "," + domain_color[2] + ")"
                ctx.fillStyle = "rgba(" + domain_color[0] + "," + domain_color[1] + "," + domain_color[2] + ","  + this.ratio + ")"
            }
            ctx.stroke()
            ctx.fill();
        }
    }

    function createDots() {
        // Empty the array of dots
        dots.length = 0;
        nodes.map((item) => {
            const theta =((Number(item.x) - min_x) / (max_x - min_x)) * 3  * Math.PI;
            const phi = ((Number(item.y) - min_y) / (max_y - min_y) * 3 - 1) * Math.PI * 0.5 * 0.8;

            const x = GLOBE_RADIUS * Math.cos(phi) * Math.cos(theta);
            const z = GLOBE_RADIUS * Math.cos(phi) * Math.sin(theta) + GLOBE_CENTER_Z;
            const y = -(GLOBE_RADIUS * Math.sin(phi));
            dots.push(new Dot(x, y, z, Number(item.size) / min_size, item.type, Number(item.ratio)));
        })

        // Create a new dot based on the amount needed
        /*
        for (let i = 0; i < DOTS_AMOUNT; i++) {
            let node = nodes[i];

            
            const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
            const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]

            // Calculate the [x, y, z] coordinates of the dot along the globe
            const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
            const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
            const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
            dots.push(new Dot(x, y, z));
        }
        */
    }

    /* ====================== */
    /* ======== RENDER ====== */
    /* ====================== */
    function render(a) {
        // Clear the scene
        ctx.clearRect(0, 0, width, height);

        // Increase the globe rotation
        rotation = a * 0.0004;

        const sineRotation = Math.sin(rotation); // Sine of the rotation
        const cosineRotation = Math.cos(rotation); // Cosine of the rotation

        // Loop through the dots array and draw every dot
        for (var i = 0; i < dots.length; i++) {
            dots[i].draw(sineRotation, cosineRotation);
        }

        window.requestAnimationFrame(render);
    }


    // Function called after the user resized its screen
    function afterResize() {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        if (window.devicePixelRatio > 1) {
            canvas.width = canvas.clientWidth * 2;
            canvas.height = canvas.clientHeight * 2;
            ctx.scale(2, 2);
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        GLOBE_RADIUS = width * 0.3;
        GLOBE_CENTER_Z = -GLOBE_RADIUS;
        PROJECTION_CENTER_X = width;
        PROJECTION_CENTER_Y = height;
        FIELD_OF_VIEW = width * 0.8;

        createDots(); // Reset all dots
    }

    // Variable used to store a timeout when user resized its screen
    let resizeTimeout;
    // Function called right after user resized its screen
    function onResize() {
        // Clear the timeout variable
        resizeTimeout = window.clearTimeout(resizeTimeout);
        // Store a new timeout to avoid calling afterResize for every resize event
        resizeTimeout = window.setTimeout(afterResize, 500);
    }
    window.addEventListener('resize', onResize);

    // Populate the dots array with random dots
    createDots();

    // Render the scene
    window.requestAnimationFrame(render);
}
