const video = document.getElementById('video')
let counter = 0;
let prevX = 0;
let prevY = 0;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    counter = counter + 1;
    console.log(counter) 
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // console.log(detections)
    const nose = detections[0].landmarks.getNose()
    if ( counter % 17 == 0 ) {
      console.log('entro al counter')
      prevX = nose[0].x
      prevY = nose[0].y
    }

    if (nose[0].x < (prevX - nose[0].x * 0.30)) {
      console.log('GESTO DERECHA')
      prevX = 10
    }

    if (nose[0].y < (prevY - nose[0].y * 0.20)) {
      console.log('GESTO UP')
      prevY = 10
    }

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
