const URL = "../../my_model/";

let model, webcam, labelContainer, labelContainer2, maxPredictions, video;
var speech = new SpeechSynthesisUtterance();
var curentText = ''
var type = 'webcam'
var isFull = false
var idTimeout
var time = 0
var textold = ''


let list = [
    {
        id: '1',
        disciption: 'Toyota là công ty dẫn đầu thị trường thế giới về doanh số bán xe điện hybrid và là một trong những công ty lớn nhất khuyến khích áp dụng thị trường xe hybrid trên toàn cầu. '
    },
    {
        id: '2',
        disciption: 'Honda là nhà sản xuất xe máy lớn nhất thế giới kể từ năm 1959, đạt sản lượng 400 triệu vào cuối năm 2019, cũng như là nhà sản xuất động cơ đốt trong lớn nhất thế giới tính theo khối lượng, sản xuất hơn 14 triệu động cơ đốt trong mỗi năm.'
    }
    ,
    {
        id: '3',
        disciption: 'Rolls-Royce Motor Cars là một hãng sản xuất xe hơi siêu sang của Anh có trụ sở chính và nhà máy lắp ráp được đặt tại Goodwood, West Sussex'
    }
    ,
    {
        id: '4',
        disciption: 'Tập đoàn Mô tô Suzuki  là một tập đoàn đa quốc gia của Nhật chuyên sản xuất các loại xe hơi.'
    }
    ,
    {
        id: '6',
        disciption: 'Hãng xe Kia là một thương hiệu xe hơi của Hàn Quốc.'
    },

    {
        id: '7',
        disciption: 'Cadillac là một hãng xe sản xuất tại General Motors, Mỹ.'
    },

    {
        id: '8',
        disciption: 'Ford là một trong những hãng xe hơi lớn nhất thế giới, được thành lập vào năm 1903 bởi Henry Ford tại Dearborn, Michigan, Mỹ.'
    },

    {
        id: '9',
        disciption: 'Chrysler là một hãng xe ô tô của Mỹ, có trụ sở tại Auburn Hills, Michigan.'
    },

    {
        id: '10',
        disciption: 'Lexus là một trong những hãng xe ô tô nổi tiếng trực thuộc Toyota – tập đoàn xe hơi lớn nhất Nhật Bản.'
    },

    {
        id: '11',
        disciption: 'GM Korea là công ty con của tập đoàn đa quốc gia General Motors. GM Korea cũng là nhà sản xuất ô tô lớn thứ ba tại Hàn Quốc.'
    },

    {
        id: '12',
        disciption: 'SsangYong là một công ty sản xuất ô tô của Hàn Quốc. Công ty này được thành lập vào năm 1954 và có trụ sở tại Pyeongtaek.'
    },

    {
        id: '13',
        disciption: 'Hãng xe Chevrolet là thương hiệu xe hơi của Mỹ, Chevrolet Motor Car Company được thành lập ngày 03/11/1911 bởi William C.'
    },

    {
        id: '14',
        disciption: 'Hyundai là một hãng sản xuất xe hơi đến từ Hàn Quốc.'
    },

    {
        id: '15',
        disciption: 'Aston Martin là một hãng sản xuất xe hơi đến từ Anh Quốc.'
    },


]


// Load the image model and setup the webcam
async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    labelContainer2 = document.getElementById("label-container2");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

init()

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element

    // const prediction = await model.predict(video);
    const prediction = await model.predict(webcam.canvas);

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability.toFixed(2) > 0.90) {
            const classPrediction =
                prediction[i].className
            labelContainer.innerHTML = classPrediction.replace("This is the flag of", "");

            curentText = prediction[i].className
        }
        if (prediction[i].className === curentText && prediction[i].probability.toFixed(2) < 0.90) {
            console.log('vao');
            labelContainer.innerHTML = ''
            time = 0
        }
    }
}


document.addEventListener('click', function () {
    window.close()
});


setInterval(() => {
    if (labelContainer.innerHTML !== '') time++
    else time = 0

    if (time === 2) {
        if ('speechSynthesis' in window && curentText !== textold) {
            list.forEach(item => {
                if (item.id === curentText) {
                    speech.lang = 'en-US';
                    speech.text = curentText
                    speechSynthesis.speak(speech);
                    time = 0
                    textold = curentText
                    labelContainer2.innerHTML = textold.replace("This is the flag of", "");
                }
            })
        }
    }

}, 1000);