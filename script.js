document.getElementById('convertButton').addEventListener('click', convertImage);

async function convertImage() {
    const imageUrl = document.getElementById('imageUrl').value;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d'); // Define ctx inside the function

    try {
        const response = await fetch('colors.json');
        const colors = await response.json();

        const image = await loadImage(imageUrl);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Color Matching and Pattern Generation 
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data; // this line should be moved into this part of the function. 
        for (let i = 0; i < pixelData.length; i += 4) {
            const r = pixelData[i];
            const g = pixelData[i + 1];
            const b = pixelData[i + 2];

            const closestColor = findClosestColor(r, g, b, colors);
            ctx.fillStyle = closestColor.Hex;
            ctx.fillRect(i / 4 % canvas.width, Math.floor(i / 4 / canvas.width), 1, 1); 
        }

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

 // Color Matching
  const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    const closestColor = findClosestColor(r, g, b, colors);
    ctx.fillStyle = closestColor.Hex;
    ctx.fillRect(i / 4 % canvas.width, Math.floor(i / 4 / canvas.width), 1, 1);
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
