document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('convertButton').addEventListener('click', convertImage);
});

async function convertImage() {
  const imageUrl = document.getElementById('imageUrl').value;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const stitchesPerInch = 14;

  try {
    const response = await fetch('colors.json');
    const colors = await response.json();

    const image = await loadImage(imageUrl);

    // Calculate canvas dimensions for desired stitch density
    canvas.width = image.width * stitchesPerInch; 
    canvas.height = image.height * stitchesPerInch;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw resized image

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;

    const stitchSize = canvas.width / image.width; // Size of each stitch in pixels

    for (let i = 0; i < pixelData.length; i += 4) {
      const r = pixelData[i];
      const g = pixelData[i + 1];
      const b = pixelData[i + 2];

      const closestColor = findClosestColor(r, g, b, colors);
      ctx.fillStyle = closestColor.Hex;

      // Calculate stitch position
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);

      // Draw a square for each stitch
      ctx.fillRect(x - (x % stitchSize), y - (y % stitchSize), stitchSize, stitchSize); 
    }

  } catch (error) {
    console.error("Error converting image:", error);
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
