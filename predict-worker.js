// Inside your web worker
importScripts('classify.js', 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js')

const assets = [
    "/",
    "/index.html",
    "/index.js",
    "/style.css",
    "/classify.js",
    "/predict-worker.js",
    "/assets/tfjs_graph_8/group1-shard1of5.bin",
    "/assets/tfjs_graph_8/group1-shard2of5.bin",
    "/assets/tfjs_graph_8/group1-shard3of5.bin",
    "/assets/tfjs_graph_8/group1-shard4of5.bin",
    "/assets/tfjs_graph_8/group1-shard5of5.bin",
    "/assets/tfjs_graph_8/model.json",
    "/assets/icon192.webp",
    "/assets/icon512.webp",
    "/assets/upload-image-icon.svg"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUnil(
        caches.open("cacau").then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
        })
    )
})

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