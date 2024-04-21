// Neural Network Classes

class Neuron {
  constructor(inputSize) {
    this.weights = new Array(inputSize);
    this.bias = Math.random() * 2 - 1;
    for (let i = 0; i < inputSize; i++) {
      this.weights[i] = Math.random() * 2 - 1;
    }
  }

  feedForward(inputs) {
    let sum = this.bias;
    for (let i = 0; i < this.weights.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    return this.activate(sum);
  }

  activate(x) {
    return 1 / (1 + Math.exp(-x));
  }

  train(inputs, target) {
    const output = this.feedForward(inputs);
    const error = target - output;

    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += error * inputs[i];
    }
    this.bias += error;
  }
}

class XORNetwork {
  constructor() {
    this.neuron1 = new Neuron(2);
    this.neuron2 = new Neuron(2);
    this.outputNeuron = new Neuron(2);
  }

  train(iterations, displayTrainingResults) {
    const trainingData = [
      { inputs: [0, 0], target: 1 },
      { inputs: [0, 1], target: 1 },
      { inputs: [1, 0], target: 0 },
      { inputs: [1, 1], target: 1 }
    ];

    const learningRate = 0.1;

    for (let i = 0; i < iterations; i++) {
      const data = trainingData[Math.floor(Math.random() * trainingData.length)];
      const inputs = data.inputs;
      const target = data.target;

      const hidden1 = this.neuron1.feedForward(inputs);
      const hidden2 = this.neuron2.feedForward(inputs);
      const output = this.outputNeuron.feedForward([hidden1, hidden2]);

      this.outputNeuron.train([hidden1, hidden2], target);
      this.neuron1.train(inputs, output - target);
      this.neuron2.train(inputs, output - target);

      if (displayTrainingResults) {
        displayTrainingResults(i + 1, inputs, target, output);
      }
    }
  }

  predict(inputs) {
    const hidden1 = this.neuron1.feedForward(inputs);
    const hidden2 = this.neuron2.feedForward(inputs);
    return this.outputNeuron.feedForward([hidden1, hidden2]) > 0.5 ? 1 : 0;
  }
}

const network = new XORNetwork();

const trainingResults = document.getElementById('training-results');
const predictionForm = document.getElementById('prediction-form');
const predictionResult = document.getElementById('prediction-result');

function displayTrainingResults(iteration, inputs, target, output) {
  const resultElement = document.createElement('div');
  resultElement.textContent = `Iteration: ${iteration}, Inputs: [${inputs}], Target: ${target}, Output: ${output}`;
  trainingResults.appendChild(resultElement);
}

network.train(10000, displayTrainingResults);

predictionForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const input1 = parseFloat(document.getElementById('input1').value);
  const input2 = parseFloat(document.getElementById('input2').value);
  const prediction = network.predict([input1, input2]);
  predictionResult.textContent = `Prediction: ${prediction}`;
});
