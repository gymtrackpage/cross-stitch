document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('convertButton').addEventListener('click', convertImage);
});

async function convertImage() {
  const imageUrl = document.getElementById('imageUrl').value;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d'); 

  try {
    const response = await fetch('colors.json');
    const colors = await response.json();

    const image = await loadImage(imageUrl);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Color Matching and Pattern Generation 
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];

      const closestColor = findClosestColor(r, g, b, colors);
      imageData.data[i] = closestColor.Red;     // Update the pixel data
      imageData.data[i + 1] = closestColor.Green;
      imageData.data[i + 2] = closestColor.Blue;
    }

    ctx.putImageData(imageData, 0, 0);

  } catch (error) {
    console.error("Error converting image:", error);
    // Handle errors (display message, etc.)
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function findClosestColor(r, g, b, colors) {
  let closestColor = null;
  let smallestDistance = Infinity;
  for (const color of colors) {
    const distance = Math.sqrt(
      Math.pow(r - color.Red, 2) +
      Math.pow(g - color.Green, 2) +
      Math.pow(b - color.Blue, 2)
    );
    if (distance < smallestDistance) {
      closestColor = color;
      smallestDistance = distance;
    }
  }
  return closestColor;
}
