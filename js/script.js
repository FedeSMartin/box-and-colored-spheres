(function() {
    
    const GAME_WIDTH = 1280;
    const GAME_HEIGHT = 720;

    const canvas = document.getElementById('universoProbabilistico');
    const ctx = canvas.getContext('2d');

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    const miCaja = { x: 100, y: 300, width: 202, height: 164 };
    const mouse = { x: 0, y: 0 };
    
    const reloadButton = {

        x: GAME_WIDTH - 650,
        y: 20,
        width: 230,
        height: 40,
        text: "Volver a Empezar"
    };

    const sphereGroups = [

        { color: 'red',    label: 'Rojas',    singularLabel: 'Roja',    count: 20, isSelected: false, plusButton: {}, minusButton: {}, checkbox: {} },
        { color: 'white',  label: 'Blancas',  singularLabel: 'Blanca',  count: 15, isSelected: false, plusButton: {}, minusButton: {}, checkbox: {} },
        { color: 'blue',   label: 'Azules',   singularLabel: 'Azul',    count: 30, isSelected: false, plusButton: {}, minusButton: {}, checkbox: {} },
        { color: 'orange', label: 'Naranjas', singularLabel: 'Naranja', count: 10, isSelected: false, plusButton: {}, minusButton: {}, checkbox: {} }
    
    ];

    let totalSpheres = [];
    const drawResults = { red: 0, white: 0, blue: 0, orange: 0, total: 0, lastDraw: 'ninguna' };

    function updateMousePos(event) {

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouse.x = (event.clientX - rect.left) * scaleX;
        mouse.y = (event.clientY - rect.top) * scaleY;
    }

    canvas.addEventListener('mousemove', updateMousePos);
    
    canvas.addEventListener('click', function(event) {

        updateMousePos(event);

        const clickX = mouse.x;
        const clickY = mouse.y;

        if (clickX > miCaja.x && clickX < miCaja.x + miCaja.width && clickY > miCaja.y && clickY < miCaja.y + miCaja.height) {

            funcionAleatoria();
        }

        if (drawResults.total === 0) {

            sphereGroups.forEach(group => {

                if (clickX > group.minusButton.x && clickX < group.minusButton.x + group.minusButton.width && clickY > group.minusButton.y && clickY < group.minusButton.y + group.minusButton.height) {
                    
                    if (group.count > 0) group.count--;
                    updateAndResetSimulation();
                }
                
                if (clickX > group.plusButton.x && clickX < group.plusButton.x + group.plusButton.width && clickY > group.plusButton.y && clickY < group.plusButton.y + group.plusButton.height) {
                    
                    group.count++;
                    updateAndResetSimulation();
                }
            });
        }
        
        sphereGroups.forEach(group => {

            if (clickX > group.checkbox.x && clickX < group.checkbox.x + group.checkbox.width && clickY > group.checkbox.y && clickY < group.checkbox.y + group.checkbox.height) {
                
                group.isSelected = !group.isSelected;
            }
        });

        if (clickX > reloadButton.x && clickX < reloadButton.x + reloadButton.width && clickY > reloadButton.y && clickY < reloadButton.y + reloadButton.height) {
            
            location.reload();
        }
    });

    function updateAndResetSimulation() {

        totalSpheres = [];

        sphereGroups.forEach(group => {

            for (let i = 0; i < group.count; i++) totalSpheres.push(group.color);
        });

        Object.assign(drawResults, { red: 0, white: 0, blue: 0, orange: 0, total: 0, lastDraw: 'ninguna' });
    }

    function funcionAleatoria() {

        if (totalSpheres.length === 0) {

            alert("La caja está vacía. Modifique las cantidades y reinicie.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * totalSpheres.length);
        const chosenColor = totalSpheres[randomIndex];

        drawResults[chosenColor]++;
        drawResults.total++;
        drawResults.lastDraw = chosenColor;
    }

    function calculateTheoreticalProbability() {

        let favorableOutcomes = 0;

        sphereGroups.forEach(group => { if (group.isSelected) favorableOutcomes += group.count; });

        if (totalSpheres.length === 0) return 0;

        return favorableOutcomes / totalSpheres.length;
    }

    function calculateEmpiricalProbability() {

        let favorableDraws = 0;

        sphereGroups.forEach(group => { if (group.isSelected) favorableDraws += drawResults[group.color]; });

        if (drawResults.total === 0) return 0;

        return favorableDraws / drawResults.total;
    }

    function drawSelectors(groups) {

        const startX = 100, startY = 100, radius = 25, spacing = 120;
        const buttonSize = 22;
        const isLocked = drawResults.total > 0;

        groups.forEach((group, index) => {

            const x = startX + (index * spacing);

            ctx.beginPath();
            ctx.fillStyle = group.color;
            ctx.arc(x, startY, radius, 0, 2 * Math.PI);
            ctx.fill();

            const controlsY = startY + radius + 25;
            
            group.minusButton = { x: x - 45, y: controlsY - buttonSize/2, width: buttonSize, height: buttonSize };

            ctx.fillStyle = isLocked ? '#e9ecef' : '#fde0e0';
            ctx.fillRect(group.minusButton.x, group.minusButton.y, buttonSize, buttonSize);
            ctx.fillStyle = isLocked ? '#adb5bd' : '#c82333';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('-', x - 34, controlsY);
            
            ctx.fillStyle = 'black';
            ctx.font = '18px Arial';
            ctx.fillText(group.count, x, controlsY);

            group.plusButton = { x: x + 23, y: controlsY - buttonSize/2, width: buttonSize, height: buttonSize };

            ctx.fillStyle = isLocked ? '#e9ecef' : '#d4edda';
            ctx.fillRect(group.plusButton.x, group.plusButton.y, buttonSize, buttonSize);
            ctx.fillStyle = isLocked ? '#adb5bd' : '#218838';
            ctx.fillText('+', x + 34, controlsY);
            
            const checkboxY = controlsY + 30;
            const checkboxSize = 30;
            const checkboxX = x - checkboxSize / 2;

            group.checkbox = { x: checkboxX, y: checkboxY, width: checkboxSize, height: checkboxSize };
            
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize);

            if (group.isSelected) {

                ctx.strokeStyle = '#08ac36ff';
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(checkboxX + 5, checkboxY + 5);
                ctx.lineTo(checkboxX + checkboxSize - 5, checkboxY + checkboxSize - 5);
                ctx.moveTo(checkboxX + checkboxSize - 5, checkboxY + 5);
                ctx.lineTo(checkboxX + 5, checkboxY + checkboxSize - 5);
                ctx.stroke();
            }
        });
    }

    function drawReloadButton() {

        const isMouseOver = mouse.x > reloadButton.x && mouse.x < reloadButton.x + reloadButton.width && mouse.y > reloadButton.y && mouse.y < reloadButton.y + reloadButton.height;
        
        ctx.fillStyle = isMouseOver ? '#a81d2a' : '#c82333';
        ctx.fillRect(reloadButton.x, reloadButton.y, reloadButton.width, reloadButton.height);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(reloadButton.text, reloadButton.x + reloadButton.width / 2, reloadButton.y + reloadButton.height / 2);
    }
    
    function drawResultsInfo() {

        const startX = GAME_WIDTH - 600, startY = 100, lineHeight = 25;

        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Extracciones totales: ${drawResults.total}`, startX, startY);

        if (drawResults.total > 0) {

            const lastDrawGroup = sphereGroups.find(group => group.color === drawResults.lastDraw);
            const singularLabel = lastDrawGroup ? lastDrawGroup.singularLabel : drawResults.lastDraw;
            ctx.fillText(`Última extraída: ${singularLabel}`, startX, startY + lineHeight);
        }

        sphereGroups.forEach((group, index) => {

            const y = startY + lineHeight * (3 + index);
            const colorName = group.label;
            const count = drawResults[group.color];

            ctx.fillText(`${colorName}: ${count}`, startX, y);
        });
    }

    function drawProbabilityInfo() {

        if (!sphereGroups.some(g => g.isSelected)) return;

        const theoreticalProb = calculateTheoreticalProbability();
        const empiricalProb = calculateEmpiricalProbability();
        const theoreticalPercent = (theoreticalProb * 100).toFixed(2);
        const empiricalPercent = (empiricalProb * 100).toFixed(2);
        const text1 = `Probabilidad Matemática (Teórica): ${theoreticalPercent}%`;
        const text2 = `Probabilidad Práctica (Empírica): ${empiricalPercent}%`;
        const x = GAME_WIDTH - 400;
        const y = GAME_HEIGHT - 350;

        ctx.fillStyle = 'darkblue';
        ctx.font = '20px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(text2, x, y);
        ctx.fillText(text1, x, y - 30);
    }

    function gameLoop() {

        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        drawSelectors(sphereGroups);

        ctx.drawImage(imagenCaja, miCaja.x, miCaja.y, miCaja.width, miCaja.height);

        drawResultsInfo();
        drawProbabilityInfo();
        drawReloadButton();
        
        let isMouseOver = mouse.x > miCaja.x && mouse.x < miCaja.x + miCaja.width && mouse.y > miCaja.y && mouse.y < miCaja.y + miCaja.height;
        
        if (isMouseOver) {

            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("Sacar Esfera", miCaja.x + miCaja.width / 2, miCaja.y - 40);

        }

        requestAnimationFrame(gameLoop);
    }
    
    const imagenCaja = new Image();

    imagenCaja.src = 'img/caja.png';

    imagenCaja.onload = function() {

        updateAndResetSimulation();
        gameLoop();
    };

    imagenCaja.onerror = function() {

        console.error("Error al cargar la imagen de la caja. Asegúrate que la ruta 'img/caja.png' es correcta.");

        alert("No se pudo cargar la imagen 'img/caja.png'. La simulación no puede continuar.");
    };

})();










































// window.onload = function() {
    
//     const espacioProbabilistico = document.getElementById('universoProbabilistico');
//     const cajaDeEsferas = espacioProbabilistico.getContext('2d');

//     espacioProbabilistico.width = window.innerWidth;
//     espacioProbabilistico.height = window.innerHeight;

//     const miCaja = { x: 100, y: 300, width: 202, height: 164 };
//     const mouse = { x: 0, y: 0 };

//     // =========================================================================
//     // MODELO DE DATOS Y OBJETOS DE UI
//     // =========================================================================
//     const sphereGroups = [
//         { color: 'red',    label: 'Rojas',    singularLabel: 'Roja',    count: 10, isSelected: false, plusButton: {}, minusButton: {} },
//         { color: 'white',  label: 'Blancas',  singularLabel: 'Blanca',  count: 30, isSelected: false, plusButton: {}, minusButton: {} },
//         { color: 'blue',   label: 'Azules',   singularLabel: 'Azul',    count: 20, isSelected: false, plusButton: {}, minusButton: {} },
//         { color: 'orange', label: 'Naranjas', singularLabel: 'Naranja', count: 15, isSelected: false, plusButton: {}, minusButton: {} }
//     ];
    
//     // El botón de recarga (F5) se mantiene
//     const reloadButton = {
//         x: espacioProbabilistico.width - 650, y: 20, width: 230, height: 40, text: "Volver a Empezar"
//     };

//     let totalSpheres = [];

//     const drawResults = {

//         red: 0, white: 0, blue: 0, orange: 0,
//         total: 0, lastDraw: 'ninguna'
//     };

//     espacioProbabilistico.addEventListener('mousemove', function(event) {

//         const rect = espacioProbabilistico.getBoundingClientRect();
//         mouse.x = event.clientX - rect.left;
//         mouse.y = event.clientY - rect.top;
//     });

//     espacioProbabilistico.addEventListener('click', function(event) {

//         const rect = espacioProbabilistico.getBoundingClientRect();
//         const clickX = event.clientX - rect.left;
//         const clickY = event.clientY - rect.top;

//         if (clickX > miCaja.x && clickX < miCaja.x + miCaja.width && clickY > miCaja.y && clickY < miCaja.y + miCaja.height) {

//             funcionAleatoria();
//         }

//         sphereGroups.forEach(group => {

//             if (clickX > group.checkbox.x && clickX < group.checkbox.x + group.checkbox.width && clickY > group.checkbox.y && clickY < group.checkbox.y + group.checkbox.height) {
//                 group.isSelected = !group.isSelected;
//             }
//         });
        
//         if (drawResults.total === 0) {

//             sphereGroups.forEach(group => {

         
//                 if (clickX > group.minusButton.x && clickX < group.minusButton.x + group.minusButton.width && clickY > group.minusButton.y && clickY < group.minusButton.y + group.minusButton.height) {
//                     if (group.count > 0) group.count--;

//                     updateAndResetSimulation();
//                 }

//                 if (clickX > group.plusButton.x && clickX < group.plusButton.x + group.plusButton.width && clickY > group.plusButton.y && clickY < group.plusButton.y + group.plusButton.height) {
//                     group.count++;
//                     updateAndResetSimulation();
//                 }
//             });
//         }
        
//         if (clickX > reloadButton.x && clickX < reloadButton.x + reloadButton.width && clickY > reloadButton.y && clickY < reloadButton.y + reloadButton.height) {
//             location.reload();
//         }
//     });

//     const imagenCaja = new Image();

//     imagenCaja.src = 'img/caja.png';

//     imagenCaja.onload = function() {
//         gameLoop();
//     };

//     function updateAndResetSimulation() {

//         totalSpheres = [];

//         sphereGroups.forEach(group => {

//             for (let i = 0; i < group.count; i++) {
//                 totalSpheres.push(group.color);
//             }
//         });

//         Object.assign(drawResults, {

//             red: 0, white: 0, blue: 0, orange: 0,
//             total: 0, lastDraw: 'ninguna'

//         });

//         //console.log("Simulación actualizada con " + totalSpheres.length + " esferas.");
//     }

//     function funcionAleatoria() {

//         if (drawResults.total > 0 && totalSpheres.length === 0) {

//              alert("Ya no hay esferas en la caja. Reinicie para empezar de nuevo.");
//              return;
//         }

//         if (totalSpheres.length === 0) {

//             alert("La caja está vacía. Modifique las cantidades.");
//             return;
//         }

//         const randomIndex = Math.floor(Math.random() * totalSpheres.length);
//         const chosenColor = totalSpheres[randomIndex];

//         drawResults[chosenColor]++;
//         drawResults.total++;
//         drawResults.lastDraw = chosenColor;
//     }

//     function calculateTheoreticalProbability() {

//         let favorableOutcomes = 0;

//         sphereGroups.forEach(group => { if (group.isSelected) favorableOutcomes += group.count; });

//         if (totalSpheres.length === 0) return 0;

//         return favorableOutcomes / totalSpheres.length;
//     }

//     function calculateEmpiricalProbability() {

//         let favorableDraws = 0;

//         sphereGroups.forEach(group => { if (group.isSelected) favorableDraws += drawResults[group.color]; });

//         if (drawResults.total === 0) return 0;

//         return favorableDraws / drawResults.total;
//     }

//     function drawSelectors(groups) {

//         const startX = 100, startY = 100, radius = 25, spacing = 120;
//         const buttonSize = 22;
//         const isLocked = drawResults.total > 0;

//         groups.forEach((group, index) => {

//             const x = startX + (index * spacing);

//             cajaDeEsferas.beginPath();
//             cajaDeEsferas.fillStyle = group.color;
//             cajaDeEsferas.arc(x, startY, radius, 0, 2 * Math.PI);
//             cajaDeEsferas.fill();

//             const controlsY = startY + radius + 25;
            
//             group.minusButton = { x: x - 45, y: controlsY - buttonSize/2, width: buttonSize, height: buttonSize };

//             cajaDeEsferas.fillStyle = isLocked ? '#e9ecef' : '#fde0e0';
//             cajaDeEsferas.fillRect(group.minusButton.x, group.minusButton.y, buttonSize, buttonSize);
//             cajaDeEsferas.fillStyle = isLocked ? '#adb5bd' : '#c82333';
//             cajaDeEsferas.font = 'bold 20px Arial';
//             cajaDeEsferas.textAlign = 'center';
//             cajaDeEsferas.textBaseline = 'middle';
//             cajaDeEsferas.fillText('-', x - 34, controlsY);
            
//             cajaDeEsferas.fillStyle = 'black';
//             cajaDeEsferas.font = '18px Arial';
//             cajaDeEsferas.fillText(group.count, x, controlsY);

//             group.plusButton = { x: x + 23, y: controlsY - buttonSize/2, width: buttonSize, height: buttonSize };

//             cajaDeEsferas.fillStyle = isLocked ? '#e9ecef' : '#d4edda';
//             cajaDeEsferas.fillRect(group.plusButton.x, group.plusButton.y, buttonSize, buttonSize);
//             cajaDeEsferas.fillStyle = isLocked ? '#adb5bd' : '#218838';
//             cajaDeEsferas.fillText('+', x + 34, controlsY);
            
//             const checkboxY = controlsY + 30;
//             const checkboxSize = 30;
//             const checkboxX = x - checkboxSize / 2;

//             group.checkbox = { x: checkboxX, y: checkboxY, width: checkboxSize, height: checkboxSize };

//             cajaDeEsferas.strokeStyle = 'black';
//             cajaDeEsferas.lineWidth = 2;
//             cajaDeEsferas.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize);

//             if (group.isSelected) {

//                 cajaDeEsferas.strokeStyle = '#08ac36ff';
//                 cajaDeEsferas.lineWidth = 8;
//                 cajaDeEsferas.beginPath();
//                 cajaDeEsferas.moveTo(checkboxX + 5, checkboxY + 5);
//                 cajaDeEsferas.lineTo(checkboxX + checkboxSize - 5, checkboxY + checkboxSize - 5);
//                 cajaDeEsferas.moveTo(checkboxX + checkboxSize - 5, checkboxY + 5);
//                 cajaDeEsferas.lineTo(checkboxX + 5, checkboxY + checkboxSize - 5);
//                 cajaDeEsferas.stroke();
//             }
//         });
//     }
    
//     function drawReloadButton() {

//         const isMouseOver = mouse.x > reloadButton.x && mouse.x < reloadButton.x + reloadButton.width && mouse.y > reloadButton.y && mouse.y < reloadButton.y + reloadButton.height;

//         cajaDeEsferas.fillStyle = isMouseOver ? '#a81d2a' : '#c82333';
//         cajaDeEsferas.fillRect(reloadButton.x, reloadButton.y, reloadButton.width, reloadButton.height);
//         cajaDeEsferas.fillStyle = 'white';
//         cajaDeEsferas.font = '16px Arial';
//         cajaDeEsferas.textAlign = 'center';
//         cajaDeEsferas.textBaseline = 'middle';
//         cajaDeEsferas.fillText(reloadButton.text, reloadButton.x + reloadButton.width / 2, reloadButton.y + reloadButton.height / 2);
//     }
    
//     function drawResultsInfo() {
//         const startX = 600, startY = 100, lineHeight = 25;
//         cajaDeEsferas.fillStyle = 'black';
//         cajaDeEsferas.font = '18px Arial';
//         cajaDeEsferas.textAlign = 'left';
//         cajaDeEsferas.fillText(`Extracciones totales: ${drawResults.total}`, startX, startY);
//         if (drawResults.total > 0) {
//             const lastDrawGroup = sphereGroups.find(group => group.color === drawResults.lastDraw);
//             const singularLabel = lastDrawGroup ? lastDrawGroup.singularLabel : drawResults.lastDraw;
//             cajaDeEsferas.fillText(`Última extraída: ${singularLabel}`, startX, startY + lineHeight);
//         }
//         sphereGroups.forEach((group, index) => {
//             const y = startY + lineHeight * (3 + index);
//             const colorName = group.label;
//             const count = drawResults[group.color];
//             cajaDeEsferas.fillText(`${colorName}: ${count}`, startX, y);
//         });
//     }

//     function drawProbabilityInfo() {

//         if (!sphereGroups.some(g => g.isSelected)) return;

//         const theoreticalProb = calculateTheoreticalProbability();

//         const empiricalProb = calculateEmpiricalProbability();

//         const theoreticalPercent = (theoreticalProb * 100).toFixed(2);

//         const empiricalPercent = (empiricalProb * 100).toFixed(2);

//         const text1 = `Probabilidad Matemática (Teórica): ${theoreticalPercent}%`;
//         const text2 = `Probabilidad Práctica (Empírica): ${empiricalPercent}%`;

//         const x = espacioProbabilistico.width - 400;
//         const y = espacioProbabilistico.height - 200;

//         cajaDeEsferas.fillStyle = 'darkblue';
//         cajaDeEsferas.font = '20px Arial';
//         cajaDeEsferas.textAlign = 'right';
//         cajaDeEsferas.fillText(text2, x, y);
//         cajaDeEsferas.fillText(text1, x, y - 30);
//     }

//     function gameLoop() {
//         cajaDeEsferas.clearRect(0, 0, espacioProbabilistico.width, espacioProbabilistico.height);
        
//         drawSelectors(sphereGroups);

//         cajaDeEsferas.drawImage(imagenCaja, miCaja.x, miCaja.y, miCaja.width, miCaja.height);

//         drawResultsInfo();
//         drawProbabilityInfo();
//         drawReloadButton();
        
//         let isMouseOver = mouse.x > miCaja.x && mouse.x < miCaja.x + miCaja.width && mouse.y > miCaja.y && mouse.y < miCaja.y + miCaja.height;

//         if (isMouseOver) {

//             cajaDeEsferas.fillStyle = 'black';
//             cajaDeEsferas.font = '30px Arial';
//             cajaDeEsferas.textAlign = 'center';
//             cajaDeEsferas.fillText("Sacar Esfera", miCaja.x + miCaja.width / 2, miCaja.y - 40);
//         }

//         requestAnimationFrame(gameLoop);
//     }
    
//     // Inicia la simulación con los valores por defecto
//     updateAndResetSimulation();
// };




















































// window.onload = function() {
    
//     const espacioProbabilistico = document.getElementById('universoProbabilistico');
//     const cajaDeEsferas = espacioProbabilistico.getContext('2d');

//     espacioProbabilistico.width = window.innerWidth;
//     espacioProbabilistico.height = window.innerHeight;

//     const miCaja = { x: 100, y: 300, width: 202, height: 164 };
//     const mouse = { x: 0, y: 0 };
    
//     const resetButton = {
//         x: espacioProbabilistico.width - 170, // a 20px del borde derecho
//         y: 20,                                // a 20px del borde superior
//         width: 150,
//         height: 40
//     };

//     const sphereGroups = [
//         { color: 'red',    label: 'Rojas',    singularLabel: 'Roja',    count: 20, isSelected: false },
//         { color: 'white',  label: 'Blancas',  singularLabel: 'Blanca',  count: 15, isSelected: false },
//         { color: 'blue',   label: 'Azules',   singularLabel: 'Azul',    count: 30, isSelected: false },
//         { color: 'orange', label: 'Naranjas', singularLabel: 'Naranja', count: 10, isSelected: false }
//     ];

//     const totalSpheres = [];
//     sphereGroups.forEach(group => {
//         for (let i = 0; i < group.count; i++) {
//             totalSpheres.push(group.color);
//         }
//     });

//     const drawResults = {
//         red: 0, white: 0, blue: 0, orange: 0,
//         total: 0, lastDraw: 'ninguna'
//     };

//     espacioProbabilistico.addEventListener('mousemove', function(event) {
//         const rect = espacioProbabilistico.getBoundingClientRect();
//         mouse.x = event.clientX - rect.left;
//         mouse.y = event.clientY - rect.top;
//     });

//     espacioProbabilistico.addEventListener('click', function(event) {
//         const rect = espacioProbabilistico.getBoundingClientRect();
//         const scaleX = espacioProbabilistico.width / rect.width;
//         const scaleY = espacioProbabilistico.height / rect.height;
//         const clickX = (event.clientX - rect.left) * scaleX;
//         const clickY = (event.clientY - rect.top) * scaleY;

//         // Comprobación para la caja de esferas
//         const isClickInsideBox = clickX > miCaja.x && clickX < miCaja.x + miCaja.width &&
//                                  clickY > miCaja.y && clickY < miCaja.y + miCaja.height;
//         if (isClickInsideBox) {
//             funcionAleatoria();
//         }

//         // Comprobación para los checkboxes
//         const startX = 100, startY = 100, radius = 25, spacing = 120, checkboxSize = 30;
//         sphereGroups.forEach((group, index) => {
//             const x = startX + (index * spacing);
//             const checkboxY = startY + radius + 35;
//             const checkboxX = x - checkboxSize / 2;
//             const isClickOnCheckbox = clickX > checkboxX && clickX < checkboxX + checkboxSize &&
//                                       clickY > checkboxY && clickY < checkboxY + checkboxSize;
//             if (isClickOnCheckbox) {
//                 group.isSelected = !group.isSelected;
//             }
//         });

//         // Comprobación para el botón de reinicio
//         const isClickOnResetButton = clickX > resetButton.x && clickX < resetButton.x + resetButton.width &&
//                                      clickY > resetButton.y && clickY < resetButton.y + resetButton.height;
        
//         if (isClickOnResetButton) {
//             // =========================================================================
//             // == ¡ÚNICO CAMBIO AQUÍ! ==
//             // =========================================================================
//             location.reload(); // Esta línea recarga la página.
//         }
//     });

//     const imagenCaja = new Image();
//     imagenCaja.src = 'img/caja.png';
//     imagenCaja.onload = function() {
//         gameLoop();
//     };

//     function funcionAleatoria() {
//         if (totalSpheres.length === 0) return;
//         const randomIndex = Math.floor(Math.random() * totalSpheres.length);
//         const chosenColor = totalSpheres[randomIndex];
//         drawResults[chosenColor]++;
//         drawResults.total++;
//         drawResults.lastDraw = chosenColor;
//     }

//     function calculateTheoreticalProbability() {
//         let favorableOutcomes = 0;
//         sphereGroups.forEach(group => {
//             if (group.isSelected) {
//                 favorableOutcomes += group.count;
//             }
//         });
//         if (totalSpheres.length === 0) return 0;
//         return favorableOutcomes / totalSpheres.length;
//     }

//     function calculateEmpiricalProbability() {
//         let favorableDraws = 0;
//         sphereGroups.forEach(group => {
//             if (group.isSelected) {
//                 favorableDraws += drawResults[group.color];
//             }
//         });
//         if (drawResults.total === 0) return 0;
//         return favorableDraws / drawResults.total;
//     }

//     function drawSelectors(groups) {
//         const startX = 100, startY = 100, radius = 25, spacing = 120, checkboxSize = 30;
//         groups.forEach((group, index) => {
//             const x = startX + (index * spacing);
//             cajaDeEsferas.beginPath();
//             cajaDeEsferas.fillStyle = group.color;
//             cajaDeEsferas.arc(x, startY, radius, 0, 2 * Math.PI);
//             cajaDeEsferas.fill();
//             cajaDeEsferas.fillStyle = 'black';
//             cajaDeEsferas.font = '16px Arial';
//             cajaDeEsferas.textAlign = 'center';
//             cajaDeEsferas.fillText(`${group.label} (${group.count})`, x, startY + radius + 20);
//             const checkboxY = startY + radius + 35;
//             const checkboxX = x - checkboxSize / 2;
//             cajaDeEsferas.strokeStyle = 'black';
//             cajaDeEsferas.lineWidth = 2;
//             cajaDeEsferas.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize);
//             if (group.isSelected) {
//                 cajaDeEsferas.strokeStyle = '#08ac36ff';
//                 cajaDeEsferas.lineWidth = 8;
//                 cajaDeEsferas.beginPath();
//                 cajaDeEsferas.moveTo(checkboxX + 5, checkboxY + 5);
//                 cajaDeEsferas.lineTo(checkboxX + checkboxSize - 5, checkboxY + checkboxSize - 5);
//                 cajaDeEsferas.moveTo(checkboxX + checkboxSize - 5, checkboxY + 5);
//                 cajaDeEsferas.lineTo(checkboxX + 5, checkboxY + checkboxSize - 5);
//                 cajaDeEsferas.stroke();
//             }
//         });
//     }
    
//     function drawResultsInfo() {
//         const startX = 600, startY = 100, lineHeight = 25;
//         cajaDeEsferas.fillStyle = 'black';
//         cajaDeEsferas.font = '18px Arial';
//         cajaDeEsferas.textAlign = 'left';
//         cajaDeEsferas.fillText(`Extracciones totales: ${drawResults.total}`, startX, startY);

//         if (drawResults.total > 0) {
//             const lastDrawGroup = sphereGroups.find(group => group.color === drawResults.lastDraw);
//             const singularLabel = lastDrawGroup ? lastDrawGroup.singularLabel : drawResults.lastDraw;
//             cajaDeEsferas.fillText(`Última extraída: ${singularLabel}`, startX, startY + lineHeight);
//         }

//         sphereGroups.forEach((group, index) => {
//             const y = startY + lineHeight * (3 + index);
//             const colorName = group.label;
//             const count = drawResults[group.color];
//             cajaDeEsferas.fillText(`${colorName}: ${count}`, startX, y);
//         });
//     }
    
//     function drawProbabilityInfo() {
//         if (!sphereGroups.some(g => g.isSelected)) return;
//         const theoreticalProb = calculateTheoreticalProbability();
//         const empiricalProb = calculateEmpiricalProbability();
//         const theoreticalPercent = (theoreticalProb * 100).toFixed(2);
//         const empiricalPercent = (empiricalProb * 100).toFixed(2);
//         const text1 = `Probabilidad Matemática (Teórica): ${theoreticalPercent}%`;
//         const text2 = `Frecuencia de Resultados (Empírica): ${empiricalPercent}%`;
//         const x = espacioProbabilistico.width - 500;
//         const y = espacioProbabilistico.height - 200;
//         cajaDeEsferas.fillStyle = 'darkblue';
//         cajaDeEsferas.font = '20px Arial';
//         cajaDeEsferas.textAlign = 'right';
//         cajaDeEsferas.fillText(text2, x, y);
//         cajaDeEsferas.fillText(text1, x, y - 30);
//     }

//     function drawResetButton() {
//         const isMouseOver = mouse.x > resetButton.x && mouse.x < resetButton.x + resetButton.width &&
//                             mouse.y > resetButton.y && mouse.y < resetButton.y + resetButton.height;

//         cajaDeEsferas.fillStyle = isMouseOver ? '#a81d2a' : '#c82333';
//         cajaDeEsferas.fillRect(resetButton.x, resetButton.y, resetButton.width, resetButton.height);

//         cajaDeEsferas.fillStyle = 'white';
//         cajaDeEsferas.font = '18px Arial';
//         cajaDeEsferas.textAlign = 'center';
//         cajaDeEsferas.textBaseline = 'middle';
//         cajaDeEsferas.fillText("Reiniciar", resetButton.x + resetButton.width / 2, resetButton.y + resetButton.height / 2);
//     }

//     function gameLoop() {
//         let isMouseOver = mouse.x > miCaja.x && mouse.x < miCaja.x + miCaja.width &&
//                           mouse.y > miCaja.y && mouse.y < miCaja.y + miCaja.height;
        
//         cajaDeEsferas.clearRect(0, 0, espacioProbabilistico.width, espacioProbabilistico.height);
        
//         drawSelectors(sphereGroups);
//         cajaDeEsferas.drawImage(imagenCaja, miCaja.x, miCaja.y, miCaja.width, miCaja.height);
//         drawResultsInfo();
//         drawProbabilityInfo();
//         drawResetButton();
        
//         let hoverText = "Sacar Esfera";
//         if (isMouseOver) {
//             cajaDeEsferas.fillStyle = 'black';
//             cajaDeEsferas.font = '30px Arial';
//             cajaDeEsferas.textAlign = 'center';
//             cajaDeEsferas.fillText(hoverText, miCaja.x + miCaja.width / 2, miCaja.y - 40);
//         }

//         requestAnimationFrame(gameLoop);
//     }
// };



























// window.onload = function() {
    
//     const espacioProbabilistico = document.getElementById('universoProbabilistico');
//     const cajaDeEsferas = espacioProbabilistico.getContext('2d');

//     espacioProbabilistico.width = window.innerWidth;
//     espacioProbabilistico.height = window.innerHeight;

//     const miCaja = { x: 100, y: 300, width: 202, height: 164 };
//     const mouse = { x: 0, y: 0 };

//     const sphereGroups = [
//         { color: 'red',    label: 'Rojas',    singularLabel: 'Roja',    count: 20, isSelected: false },
//         { color: 'white',  label: 'Blancas',  singularLabel: 'Blanca',  count: 15, isSelected: false },
//         { color: 'blue',   label: 'Azules',   singularLabel: 'Azul',    count: 30, isSelected: false },
//         { color: 'orange', label: 'Naranjas', singularLabel: 'Naranja', count: 10, isSelected: false }
//     ];

//     const totalSpheres = [];
    
//     sphereGroups.forEach(group => {
//         for (let i = 0; i < group.count; i++) {
//             totalSpheres.push(group.color);
//         }
//     });

//     const drawResults = {
//         red: 0, white: 0, blue: 0, orange: 0,
//         total: 0, lastDraw: 'ninguna'
//     };

//     espacioProbabilistico.addEventListener('mousemove', function(event) {
//         const rect = espacioProbabilistico.getBoundingClientRect();
//         mouse.x = event.clientX - rect.left;
//         mouse.y = event.clientY - rect.top;
//     });

//     espacioProbabilistico.addEventListener('click', function(event) {
//         const rect = espacioProbabilistico.getBoundingClientRect();
//         const scaleX = espacioProbabilistico.width / rect.width;
//         const scaleY = espacioProbabilistico.height / rect.height;
//         const clickX = (event.clientX - rect.left) * scaleX;
//         const clickY = (event.clientY - rect.top) * scaleY;

//         const isClickInsideBox = clickX > miCaja.x && clickX < miCaja.x + miCaja.width &&
//                                  clickY > miCaja.y && clickY < miCaja.y + miCaja.height;
//         if (isClickInsideBox) {
//             funcionAleatoria();
//         }

//         const startX = 100, startY = 100, radius = 25, spacing = 120, checkboxSize = 30;
//         sphereGroups.forEach((group, index) => {
//             const x = startX + (index * spacing);
//             const checkboxY = startY + radius + 35;
//             const checkboxX = x - checkboxSize / 2;
//             const isClickOnCheckbox = clickX > checkboxX && clickX < checkboxX + checkboxSize &&
//                                       clickY > checkboxY && clickY < checkboxY + checkboxSize;
//             if (isClickOnCheckbox) {
//                 group.isSelected = !group.isSelected;
//             }
//         });
//     });

//     const imagenCaja = new Image();
//     imagenCaja.src = 'img/caja.png';
//     imagenCaja.onload = function() {
//         gameLoop();
//     };

//     function funcionAleatoria() {
//         if (totalSpheres.length === 0) return;
//         const randomIndex = Math.floor(Math.random() * totalSpheres.length);
//         const chosenColor = totalSpheres[randomIndex];
//         drawResults[chosenColor]++;
//         drawResults.total++;
//         drawResults.lastDraw = chosenColor;
//     }

//     function calculateTheoreticalProbability() {
//         let favorableOutcomes = 0;
//         sphereGroups.forEach(group => {
//             if (group.isSelected) {
//                 favorableOutcomes += group.count;
//             }
//         });
//         if (totalSpheres.length === 0) return 0;
//         return favorableOutcomes / totalSpheres.length;
//     }

//     function calculateEmpiricalProbability() {
//         let favorableDraws = 0;
//         sphereGroups.forEach(group => {
//             if (group.isSelected) {
//                 favorableDraws += drawResults[group.color];
//             }
//         });
//         if (drawResults.total === 0) return 0;
//         return favorableDraws / drawResults.total;
//     }

//     function drawSelectors(groups) {
//         const startX = 100, startY = 100, radius = 25, spacing = 120, checkboxSize = 30;
//         groups.forEach((group, index) => {
//             const x = startX + (index * spacing);
//             cajaDeEsferas.beginPath();
//             cajaDeEsferas.fillStyle = group.color;
//             cajaDeEsferas.arc(x, startY, radius, 0, 2 * Math.PI);
//             cajaDeEsferas.fill();
//             cajaDeEsferas.fillStyle = 'black';
//             cajaDeEsferas.font = '16px Arial';
//             cajaDeEsferas.textAlign = 'center';
//             cajaDeEsferas.fillText(`${group.label} (${group.count})`, x, startY + radius + 20);
//             const checkboxY = startY + radius + 35;
//             const checkboxX = x - checkboxSize / 2;
//             cajaDeEsferas.strokeStyle = 'black';
//             cajaDeEsferas.lineWidth = 2;
//             cajaDeEsferas.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize);
//             if (group.isSelected) {
//                 cajaDeEsferas.strokeStyle = '#08ac36ff';
//                 cajaDeEsferas.lineWidth = 8;
//                 cajaDeEsferas.beginPath();
//                 cajaDeEsferas.moveTo(checkboxX + 5, checkboxY + 5);
//                 cajaDeEsferas.lineTo(checkboxX + checkboxSize - 5, checkboxY + checkboxSize - 5);
//                 cajaDeEsferas.moveTo(checkboxX + checkboxSize - 5, checkboxY + 5);
//                 cajaDeEsferas.lineTo(checkboxX + 5, checkboxY + checkboxSize - 5);
//                 cajaDeEsferas.stroke();
//             }
//         });
//     }

//     function drawResultsInfo() {
//         const startX = 600, startY = 100, lineHeight = 25;
//         cajaDeEsferas.fillStyle = 'black';
//         cajaDeEsferas.font = '18px Arial';
//         cajaDeEsferas.textAlign = 'left';
//         cajaDeEsferas.fillText(`Extracciones totales: ${drawResults.total}`, startX, startY);

//         if (drawResults.total > 0) {
//             const lastDrawGroup = sphereGroups.find(group => group.color === drawResults.lastDraw);
            
//             // Usamos la nueva propiedad 'singularLabel' para mostrar el nombre correcto.
//             const singularLabel = lastDrawGroup ? lastDrawGroup.singularLabel : drawResults.lastDraw;

//             cajaDeEsferas.fillText(`Última extraída: ${singularLabel}`, startX, startY + lineHeight);
//         }

//         sphereGroups.forEach((group, index) => {
//             const y = startY + lineHeight * (3 + index);
//             const colorName = group.label;
//             const count = drawResults[group.color];
//             cajaDeEsferas.fillText(`${colorName}: ${count}`, startX, y);
//         });
//     }
    
//     function drawProbabilityInfo() {
//         if (!sphereGroups.some(g => g.isSelected)) return;
//         const theoreticalProb = calculateTheoreticalProbability();
//         const empiricalProb = calculateEmpiricalProbability();

//         const theoreticalPercent = (theoreticalProb * 100).toFixed(2);
//         const empiricalPercent = (empiricalProb * 100).toFixed(2);
        
//         const text1 = `Probabilidad Matemática (Teórica): ${theoreticalPercent}%`;
//         const text2 = `Frecuencia de Resultados (Empírica): ${empiricalPercent}%`;

//         const x = espacioProbabilistico.width - 500;
//         const y = espacioProbabilistico.height - 200;
        
//         cajaDeEsferas.fillStyle = 'darkblue';
//         cajaDeEsferas.font = '20px Arial';
//         cajaDeEsferas.textAlign = 'right';

//         cajaDeEsferas.fillText(text2, x, y);
//         cajaDeEsferas.fillText(text1, x, y - 30);
//     }

//     function gameLoop() {
//         let isMouseOver = mouse.x > miCaja.x && mouse.x < miCaja.x + miCaja.width &&
//                           mouse.y > miCaja.y && mouse.y < miCaja.y + miCaja.height;
        
//         cajaDeEsferas.clearRect(0, 0, espacioProbabilistico.width, espacioProbabilistico.height);
        
//         drawSelectors(sphereGroups);
//         cajaDeEsferas.drawImage(imagenCaja, miCaja.x, miCaja.y, miCaja.width, miCaja.height);
//         drawResultsInfo();
//         drawProbabilityInfo();
        
//         let hoverText = "Sacar Esfera";
//         if (isMouseOver) {
//             cajaDeEsferas.fillStyle = 'black';
//             cajaDeEsferas.font = '30px Arial';
//             cajaDeEsferas.textAlign = 'center';
//             cajaDeEsferas.fillText(hoverText, miCaja.x + miCaja.width / 2, miCaja.y - 40);
//         }

//         requestAnimationFrame(gameLoop);
//     }
// };