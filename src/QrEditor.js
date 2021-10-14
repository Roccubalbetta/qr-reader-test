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

export default class QrEditor extends React.Component {

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
        {label: 'Jpeg', value : 'jpg'},
        {label: 'Png', value : 'png'},
    ]

    constructor(props) {
        super(props);
        this.qrImage = React.createRef()
        this.state = {
            qrOptions : {
                data : "https://master.d2g7knv9wv4iw9.amplifyapp.com/",
                width: 500,
                height: 500,
                margin: 0,
                image: "",
                dotsOptions: {
                    color: "#000000",
                    type: "square",
                    gradient : ""
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    hideBackgroundDots: false,
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
                }
            },
            qrCode : new QRCodeStyling(),
            dotsOptionPanelCollapsed : false,
            logoPanelCollapsed : false,
            selectedDownloadType : "png",
        }
    }

    componentDidMount() {
        this.state.qrCode.update(this.state.qrOptions)
        this.state.qrCode.append(this.qrImage.current)

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.qrOptions !== this.state.qrOptions){
            this.state.qrCode.update(this.state.qrOptions)
        }
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

    render() {
        return (
            <div className="QrEditor">
                <div className="p-grid">
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
                        </Panel>
                    </div>
                    <div className="p-col-12 p-lg-4">
                        <div className="p-grid">
                            <div className="p-col">
                                <div ref={this.qrImage}/>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col">
                                <Button label="Download QrCode" onClick={ e => this.onDownloadButtonClick(e)}/>
                                <Dropdown value={this.state.selectedDownloadType} options={this.qrcodeDownloadTypes} onChange={e => this.onDownloadTypeChanged(e.value)} placeholder="Select a Download Type" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}