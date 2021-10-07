import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import QRCodeStyling from "qr-code-styling";
import jsQR from "jsqr";
import png from "png.js";

const qrCode = new QRCodeStyling({
  width: 500,
  height: 500,
  image:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  dotsOptions: {
    color: "#4267b2",
    type: "rounded"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20
  }
});

function convertPNGtoByteArray(pngData) {
  const data = new Uint8ClampedArray(pngData.width * pngData.height * 4);
  for (let y = 0; y < pngData.height; y++) {
    for (let x = 0; x < pngData.width; x++) {
      const pixelData = pngData.getPixel(x, y);

      data[(y * pngData.width + x) * 4] = pixelData[0];
      data[(y * pngData.width + x) * 4 + 1] = pixelData[1];
      data[(y * pngData.width + x) * 4 + 2] = pixelData[2];
      data[(y * pngData.width + x) * 4 + 3] = pixelData[3];
    }
  }
  return data;
}

export default function App() {
  const fileReader = new FileReader();
  const [url, setUrl] = useState("https://qr-code-styling.com");
  const [fileExt, setFileExt] = useState("png");
  const ref = useRef(null);

  fileReader.onload = function(event) {
    const pngReader = new png(event.target.result);
    pngReader.parse(function(err, pngData) {
      if (err) throw err;
      const pixelArray = convertPNGtoByteArray(pngData);
      setUrl(jsQR(pixelArray, pngData.width, pngData.height).data)
    });
  };


  useEffect(() => {
    qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: url
    });
  }, [url]);

  const onUrlChange = (event) => {
    event.preventDefault();
    setUrl(event.target.value);
  };

  const onExtensionChange = (event) => {
    setFileExt(event.target.value);
  };

  const onDownloadClick = () => {
    qrCode.download({
      extension: fileExt
    });
  };
  const onFileSelectorClick = event => {
    fileReader.readAsArrayBuffer(event.target.files[0])
  };

  return (
      <div className="App">
        <div style={styles.inputWrapper}>
          <input type='file' onChange={onFileSelectorClick}/>
          <input value={url} onChange={onUrlChange} style={styles.inputBox} />
          <select onChange={onExtensionChange} value={fileExt}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>
          <button onClick={onDownloadClick}>Download</button>
        </div>
        <div ref={ref} />
      </div>
  );
}

const styles = {
  inputWrapper: {
    margin: "20px 0",
    display: "flex",
    justifyContent: "space-between",
    width: "100%"
  },
  inputBox: {
    flexGrow: 1,
    marginRight: 20
  }
};
