let model = "";
let inputShape = [180, 180];

async function loadModel(modelPath) {

	try {
		this.model = await tf.loadGraphModel(modelPath);
		console.log("loaded model from "+modelPath)

		console.log("Warming up...")
		const warmupResult = this.model.predict(tf.zeros([1,180,180,3]));
		warmupResult.dataSync();
		warmupResult.dispose();

		console.log("Finished warm up")

		return true;

	} catch {

		return false;
	}
}
	
async function predict(image) {

	const classNames  = ['black pod rot', 'healthy', 'monilia']

	const tensor = tf.browser.fromPixels(image)
			.resizeBilinear(inputShape) // Resize to model's input size
			.expandDims() // Add batch dimension
			.toFloat(); // Convert to float32

		const predictions = await this.model.predict(tensor)
		const result = await predictions.data();

		const probabilities = tf.softmax(result);
		console.log('Probabilities:', probabilities.arraySync());

		const predictedClassIndices = predictions.argMax(1).arraySync(); // Get the indices of the classes with the highest probability
		const predictedClassNames = predictedClassIndices.map(index => classNames[index]);
		console.log(predictedClassNames[0]);

		predictions.dispose();

		return predictedClassNames[0];
}
