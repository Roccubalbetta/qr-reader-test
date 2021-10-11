import React, {useEffect, useRef, useState} from "react";
import "./App.css";
import QRCodeStyling from "qr-code-styling";
import jsQR from "jsqr";
import {get} from '@andreekeberg/imagedata'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {CirclePicker} from 'react-color';

const qrCode = new QRCodeStyling({
    width: 500,
    height: 500,
    margin: 0,
    image:
        "https://i.imgur.com/tNAOrkK.png",
    dotsOptions: {
        color: "#4267b2",
        type: "classy"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: false,
    }
});


const dotsOptionsType = [
    {label: 'Rounded', value: 'rounded'},
    {label: 'Dots', value: 'dots'},
    {label: 'Classy', value: 'classy'},
    {label: 'Classy Rounded', value: 'classy-rounded'},
    {label: 'Square', value: 'square'},
    {label: 'Extra Rounded', value: 'extra-rounded'}
];

const cornerSquareOptionsType = [
    {label: 'Dot', value: 'dot'},
    {label: 'Square', value: 'square'},
    {label: 'Extra Rounded', value: 'extra-rounded'}
];

const cornerDotOptionsType = [
    {label: 'Dot', value: 'dot'},
    {label: 'Square', value: 'square'},
];

export default function App() {
    const [url, setUrl] = useState("https://qr-code-styling.com");
    const [fileExt, setFileExt] = useState("png");
    const ref = useRef(null);

    useEffect(() => {
        qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
            data: url
        });
    }, [url]);

    const onExtensionChange = (event) => {
        setFileExt(event.target.value);
    };

    const onDownloadClick = () => {
        qrCode.download({
            extension: fileExt
        });
    };
    const onFileSelectorClick = event => {
        get(event.target.files[0], (error, imageData) => {
            if (error) {
                console.log(error)
            } else {
                console.log(imageData)
                let code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    setUrl(code.data);
                } else {
                    console.log("nell'immagine inserita non è presente alcun codice valido")
                }
            }
        })
    };

    return (
        <div className="App">
            <div style={styles.inputWrapper}>
                <input type='file' accept="image/png" onChange={onFileSelectorClick}/>
                <select onChange={onExtensionChange} value={fileExt}>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WEBP</option>
                </select>
                <button onClick={onDownloadClick}>Download</button>
                <Dropdown options={dotsOptionsType} onChange={e => qrCode.update({
                    dotsOptions: {type: e.value},
                    cornersSquareOptions: {type: "square"}
                })} placeholder="Select an option"/>
                <CirclePicker onChange={(c, e) => qrCode.update({dotsOptions: {color: c.hex}})}/>
            </div>
            <div ref={ref}/>
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
