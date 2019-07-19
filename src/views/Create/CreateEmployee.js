import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import Fetch from '../../containers/Fetch';

class BulkUploadModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.state.show = false;
        this.state.dropFileStatus = false;

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    openModal(){
        this.setState({"show":true});
        this.setState({"dropFileStatus": false, "uploadFile": null});
    }

    closeModal(){
        this.setState({"show":false});
    }

    toggle = () => {
        this.setState({"show": !this.state.show});
    }

    onDragEnter = (event) => {
        this.setState({"dropFileStatus": true});
    }

    onFileDragLeave = (event) => {
        this.setState({"dropFileStatus": false});
    }

    onFileDragOver = (event) => {
        event.preventDefault();
    }

    onFileDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({"dropFileStatus": false});
        if(event.dataTransfer.files && event.dataTransfer.files.length > 0){
            let file = event.dataTransfer.files[0];
            this.setState({"uploadFile":file});
        }
    }

    onFileContainerClick = () => {
        document.getElementById("uploadInputFile").click();
    }

    handleUploadFileChange = (event) => {
        if(event.target.files && event.target.files.length > 0){
            let file = event.target.files[0];
            this.setState({"uploadFile":file});
        }
        else {
            this.setState({"uploadFile": null});
        }
    }

    uploadBulkData = () => {
        if(!this.state.uploadFile){
            alert("Select file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            Fetch.uploadBulkData({ body: {file: reader.result}, success: function(data){
                console.log(data);
            }, error: function(data){
                console.error(data);
            }});
        }
        reader.readAsDataURL(this.state.uploadFile);
    }

    render(){

        return(
            <div>
                <Modal isOpen={this.state.show} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader>
                        Bulk Upload
                    </ModalHeader>
                    <ModalBody className={"nopadding"}>
                        <div onDragEnter={this.onDragEnter} onDragLeave={this.onFileDragLeave} onDragOver={this.onFileDragOver} onDrop={this.onFileDrop} onClick={this.onFileContainerClick}>
                            <button className={"UploadDropButton " + (this.state.uploadFile ? "UploadDropButtonSuccess" : "") + " " + (this.state.dropFileStatus ? "FileOverUploadDropButton" : "")}>
                                {
                                    this.state.uploadFile ? this.state.uploadFile.name : "Click to upload"
                                }
                            </button>
                            <input type="file" id="uploadInputFile" style={{"display":"none"}} onChange={this.handleUploadFileChange}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.uploadBulkData}>Upload</Button>&nbsp;
                        <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

class CreateEmployee extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.state.bulkUploadEnable = false;
    }

    bulkUpload = () => {
        this.child.openModal();
    }

    render(){
        let fieldLG = 6, fieldMD = 6, fieldSM = 6, fieldXS = 6;
        return(<div className="animated fadeIn">
            <Row>
                <Col style={{"fontSize":"19px"}}>
                    Add Employee
                </Col>
                <Col style={{"textAlign":"right"}}>
                    <Button onClick={this.bulkUpload}>Bulk Upload</Button>
                    <BulkUploadModal onRef={ref => (this.child = ref)} show={this.state.bulkUploadEnable}/>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg={6} style={{"padding":"10px"}}>
                    <Row>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>Name:</label>
                            <input type={"text"}/>
                        </Col>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>Age:</label>
                            <input type={"text"}/>
                        </Col>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>Gender:</label>
                            <input type={"text"}/>
                        </Col>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>Email:</label>
                            <input type={"text"}/>
                        </Col>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>CUG:</label>
                            <input type={"text"}/>
                        </Col>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>Position Level:</label>
                            <input type={"text"}/>
                        </Col>
                        <Col lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <label>Contact:</label>
                            <input type={"text"}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>)
    }
}

export default CreateEmployee;