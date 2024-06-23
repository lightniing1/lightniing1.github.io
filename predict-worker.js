// Inside your web worker
importScripts('classify.js', 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js')

self.onmessage = async function (e) {

    const receivedObject = e.data;

    if (receivedObject.type === "init") {
        const result = await loadModel(receivedObject.modelPath)
        self.postMessage(result)
    } else {
        const image = e.data
        const result = await predict(image)
        // You can post it back to the main thread or perform further processing.
        self.postMessage(result);
    }
};