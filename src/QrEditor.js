import React from "react";
import QRCodeStyling from "qr-code-styling";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import { SelectButton } from 'primereact/selectbutton';
import { Panel } from 'primereact/panel';
import './QrEditor.css'
import jsQR from "jsqr";
import {get} from '@andreekeberg/imagedata'
import QrReader from 'react-qr-reader'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';

export default class QrEditor extends React.Component {

    imageSizeRange = [0.5, 0.4, 0.3]

    dotsOptionsType = [
        {label: 'Rounded', value: 'rounded'},
        {label: 'Dots', value: 'dots'},
        {label: 'Classy', value: 'classy'},
        {label: 'Classy Rounded', value: 'classy-rounded'},
        {label: 'Square', value: 'square'},
        {label: 'Extra Rounded', value: 'extra-rounded'}
    ];

    cornersSquareOptionsType = [
        {label: 'Dot', value: 'dot'},
        {label: 'Square', value: 'square'},
        {label: 'Extra Rounded', value: 'extra-rounded'}
    ];

    cornerDotOptionsType = [
        {label: 'Dot', value: 'dot'},
        {label: 'Square', value: 'square'},
    ];

    qrcodeDownloadTypes = [
        {label: 'jpeg', value : 'jpeg'},
        {label: 'png', value : 'png'},
        {label: 'svg', value : 'svg'},
    ]

    constructor(props) {
        super(props);
        this.qrImage = React.createRef()
        this.qrSvg = React.createRef()
        this.state = {
            qrOptions : {
                data : "https://master.d2g7knv9wv4iw9.amplifyapp.com/",
                width: 2000,
                height: 2000,
                type: "canvas",
                margin: 2,
                image: "",
                dotsOptions: {
                    color: "#000000",
                    type: "square",
                    gradient : ""
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    hideBackgroundDots: false,
                    imageSize : 0.3,
                    margin: 5
                },
                cornersSquareOptions: {
                    color: "#000000",
                    type: "square",
                    gradient : ""
                },
                cornersDotOptions: {
                    color: "#000000",
                    type: "square",
                    gradient : ""
                },
            },
            qrCode : new QRCodeStyling(),
            dotsOptionPanelCollapsed : false,
            logoPanelCollapsed : false,
            selectedDownloadType : "png",
        }
    }

    componentDidMount() {
        this.state.qrCode.update(this.state.qrOptions);
        this.state.qrCode.append(this.qrSvg.current)
        //this.getQrStylingPng()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevState.qrOptions !== this.state.qrOptions){
            this.state.qrCode.update(this.state.qrOptions)
            //this.getQrStylingPng()
        }
    }

    getQrStylingPng(){
        this.state.qrCode.getRawData("png")
            .then(data => {
                console.log(data)
                this.qrImage.current.setAttribute('src', URL.createObjectURL(data))
                console.log(this.qrImage.current.getAttribute('src'))
            }).catch(e => console.log(e))
    }

    setDotOptionsValue(value){
        this.setState(prevState => ({
            qrOptions : {
                ...prevState.qrOptions,
                dotsOptions : {
                    ...prevState.qrOptions.dotsOptions,
                    type : value
                }
            }
        }))
    }
    setCornersSquareOptionsValue(value){
        this.setState(prevState => ({
            qrOptions : {
                ...prevState.qrOptions,
                cornersSquareOptions : {
                    ...prevState.qrOptions.cornersSquareOptions,
                    type : value
                }
            }
        }))
    }

    setCornersDotsOptionsValue(value){
        this.setState(prevState => ({
            qrOptions : {
                ...prevState.qrOptions,
                cornersDotOptions : {
                    ...prevState.qrOptions.cornersDotOptions,
                    type : value
                }
            }
        }))
    }

    onImageSelectorClick(files){
        get(files[0], (error, imageData) => {
            if (error) {
                console.log(error)
            } else {
                let code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    this.updateQrCodeString(code.data);
                } else {
                    console.log("nell'immagine inserita non è presente alcun codice valido")
                }
            }
        })
    }

    updateQrCodeString(value){
        this.setState(prevState => ({
            qrOptions : {
                ...prevState.qrOptions,
                data : value
            }
        }))
    }

    updateQrCodeLogo(value){
        this.setState(prevState => ({
            qrOptions : {
                ...prevState.qrOptions,
                image : URL.createObjectURL(value)
            }
        }))
    }


    handleCameraScan = data => {
        if (data) {
            console.log(data)
            this.updateQrCodeString(data)
        }
    }
    handleCameraError = err => {
        console.error(err)
    }

    onDownloadTypeChanged(value){
        this.setState( {
            selectedDownloadType : value
        })
    }

    onDownloadButtonClick(e){
        console.log("><")
        this.state.qrCode.download({extension : this.state.selectedDownloadType})
    }

    setLogoSize(value){
        this.setState(prevState => ({
            qrOptions : {
                ...prevState.qrOptions,
                imageOptions : {
                    ...prevState.qrOptions.imageOptions,
                    imageSize: value/10
                }
            }
        }))
    }

    render() {
        return (
            <div className="QrEditor">
                <div className="p-grid p-nogutter">
                    <div className="p-col-12 p-lg-4 p-text-center">
                        <label className="custom-file-upload">
                            <input type="file" accept="image/png, image/jpeg" onChange={ e => (this.onImageSelectorClick(e.target.files))}/>Choose your file
                        </label>
                        <p>or use the camera</p>
                        <div >
                            <QrReader
                                delay={300}
                                resolution={1000}
                                onError={this.handleCameraError}
                                onScan={this.handleCameraScan}
                                style={{ width: '70%' }}
                            />
                        </div>
                    </div>
                    <div className="p-col-12 p-lg-4">
                        <Panel header="Shape & Form" toggleable collapsed={this.state.dotsOptionPanelCollapsed} onToggle={(e) => this.setState({dotsOptionPanelCollapsed : e.value})}>
                            <section>
                                <h5>Dots shape</h5>
                                <SelectButton value={""} options={this.dotsOptionsType} onChange={(e) => this.setDotOptionsValue(e.value)}/>
                            </section>
                            <section>
                                <h5>Corners square shape</h5>
                                <SelectButton value={""} options={this.cornersSquareOptionsType} onChange={(e) => this.setCornersSquareOptionsValue(e.value)}/>
                            </section>
                            <section>
                                <h5>Corners dot shape</h5>
                                <SelectButton value={""} options={this.cornerDotOptionsType} onChange={(e) => this.setCornersDotsOptionsValue(e.value)}/>
                            </section>
                        </Panel>
                        <Panel header="Logo" toggleable collapsed={this.state.logoPanelCollapsed} onToggle={(e) => this.setState({logoPanelCollapsed : e.value})}>
                            <label className="custom-file-upload">
                                <input type="file" accept="image/png, image/jpeg" onChange={ e => (this.updateQrCodeLogo(e.target.files[0]))}/><span>Choose your logo</span>
                            </label>
                            <Slider value={this.state.qrOptions.imageOptions.imageSize * 10} onChange={(e) => this.setLogoSize(e.value)} min={3} max={6} />
                        </Panel>
                    </div>
                    <div className="p-col-12 p-lg-4">
                        <div ref={this.qrSvg} className={"qr-code"}/>
                        <img style={{width : 500, height :500}} ref={this.qrImage} alt="qrcode rendered"/>
                            <div className="p-col">
                                <Button label="Download QrCode" onClick={ e => this.onDownloadButtonClick(e)}/>
                                <Dropdown value={this.state.selectedDownloadType} options={this.qrcodeDownloadTypes} onChange={e => this.onDownloadTypeChanged(e.value)} placeholder="Select a Download Type" />
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}