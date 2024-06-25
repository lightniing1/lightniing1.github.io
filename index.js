const worker = new Worker("predict-worker.js")

window.onload = async function() {

    //Load model
    showLoadingScreen()
    
    worker.postMessage({type: "init", modelPath: "assets/tfjs_graph_8/model.json"})

    worker.onmessage = (e) => {
        const result = e.data;
        
        if (result === true) {
            hideLoadingScreen()
            showUploadArea();
        } else {
            //exibir mensagem de error em um modal
        }
      };
    
  };

function showUploadArea() {    
    showElementById('uploadArea')
    resetResultTypes()
    hideResultPredictionArea()
    showMainDescription()
    hideResetButton()
}

function hideUploadArea() {
    hideElementById('uploadArea')
}

function hideResultPredictionArea() {
    hideElementById('predictionResult')
}

function showResultPrediction(result) {
    showElementById('predictionResult')
    showElementById(result)
}

function hideMainDescription() {
    hideElementById('mainDescription')
}

function showMainDescription() {
    showElementById('mainDescription')
}

function resetResultTypes() {
    const possibleResults = ['black pod rot', 'healthy', 'monilia']
    
    possibleResults.forEach(result => {
        hideElementById(result)
    });
}

function hideElementById(elementById) {
    const element = document.getElementById(elementById);
    element.style.display = 'none'
}

function showElementById(elementById) {
    const element = document.getElementById(elementById);
    element.style.display = 'revert'
}

function hideResetButton() {
    let element = document.getElementById("restart");
    element.setAttribute("hidden", "hidden");
}

function showResetButton() {
    let element = document.getElementById("restart");
    let hidden = element.getAttribute("hidden");

    if (hidden) {
       element.removeAttribute("hidden");
    }
}

function showLoadingScreen() {
    showElementById('loadingModel')
}

function hideLoadingScreen() {
    hideElementById('loadingModel')
}

document.getElementById('uploadArea').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

function showHome() {
    hideElementById('about');
    showElementById('home');
}

function showAbout() {
    hideElementById('home');
    showElementById('about')
}

//When the image is inserted, try to classify it
document.getElementById('fileInput').addEventListener('change', classifyImage);

async function classifyImage() {

    const fileInput = document.getElementById('fileInput');
    const resultImage = document.getElementById('resultImage'); 
    const loadingDescription = document.getElementById('loadingDescription')

    const file = fileInput.files[0];

    const reader = new FileReader();
    const img = new Image();

    hideMainDescription()
    reader.readAsDataURL(file);

    reader.onload = function(e) {
        // Set the src attribute of img to start loading the image
        img.src = e.target.result;
    };
    
    img.onload = async function() {        
        resultImage.src = img.src;
        resultImage.style.display = 'block';

        loadingDescription.textContent = 'Analisando...'
        hideUploadArea();
        showLoadingScreen();

        const bitmapImage = await createImageBitmap(img)
        worker.postMessage(bitmapImage)
    };

    worker.onmessage = (e) => {
        const result = e.data;

        hideLoadingScreen();
        showResultPrediction(result)
        showResetButton();

        //worker.terminate();
      };
}