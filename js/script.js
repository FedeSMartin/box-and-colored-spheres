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
        width: 200,
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