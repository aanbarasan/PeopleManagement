import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import Fetch from '../../containers/Fetch';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import Loader from '../../containers/svg_images/Loader'

class BulkUploadModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {loadingShow: false};
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
        this.setState({"dropFileStatus": false, "uploadFile": null, "loadingShow": false});
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
        this.setState({"loadingShow": true});
        var formData = new FormData();
        formData.append('employee_xlxs', this.state.uploadFile);
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", Fetch.globalURL("/upload-employee-xlxs"), true);
        xhr.onreadystatechange = () =>  {
            if (xhr.readyState === 4) {
                if(xhr.status === 200){
                    ToastsStore.success('Bulk upload successfully');
                    this.closeModal();
                }
                else {
                    ToastsStore.error('Bulk upload failed');
                }
                this.setState({"loadingShow": true});
            }
        }
        xhr.send(formData);
    }

    render(){

        return(
            <Modal centered={true} isOpen={this.state.show} toggle={this.toggle} className={this.props.className}>
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
                    {
                        this.state.loadingShow ? <Loader style={{"width":"30px"}}/> : null
                    }
                    <Button color="primary" onClick={this.uploadBulkData} disabled={this.state.loadingShow ? true : false}>Upload</Button>&nbsp;
                    <Button color="secondary" onClick={this.closeModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

class CreateEmployee extends React.Component{

    constructor(props){
        super(props);
        this.state = {employeeName: '', loadingShow: false};
        this.state.bulkUploadEnable = false;
    }

    bulkUpload = () => {
        this.child.openModal();
    }

    sumbitNewEmployee = () => {
        let params = {name: this.state.employeeName};
        this.setState({"loadingShow": true});
        Fetch.sumbitNewEmployee({body:params, success:(data) => {
            if(data.status === 200){
                ToastsStore.success('Employee added successfully');
                this.setState({requestMessage: "", requestStatusClass: ""});
            }
            else {
                let messages = [];
                if(data.errors && data.errors.length > 0){
                    for(var i=0;i<data.errors.length;i++){
                        let e = data.errors[i];
                        messages.push(e.msg + " '" + e.param  + "'");
                    }
                }
                this.setState({requestMessage: messages.join(", "), requestStatusClass: "errorClass"});
                ToastsStore.error('Employee added failed');
            }
            this.setState({"loadingShow": false});
        }});
    }

    render(){
        let fieldXL = 6, fieldLG = 6, fieldMD = 6, fieldSM = 12, fieldXS = 12;
        return(<div className="animated fadeIn">
            <Row>
                <Col style={{"fontSize":"19px", "paddingRight":"0px"}}>
                    Add Employee
                </Col>
                <Col style={{"textAlign":"right", "paddingLeft":"0px"}}>
                    <Button onClick={this.bulkUpload}>Bulk Upload</Button>
                    <BulkUploadModal onRef={ref => (this.child = ref)} show={this.state.bulkUploadEnable}/>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xs={12} sm={9} md={10} lg={9} xl={7} className={"card"}>
                    <Row className={"card-body"}>
                        <Col xl={fieldXL} lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Name
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"} value={this.state.employeeName} 
                                        onChange={(event) => {this.setState({"employeeName":event.target.value})}}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Age
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Gender
                                </div>
                                <div name={"input"}>
                                    <select className={"form-control"}>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Position
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Level
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Contact
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Date of birth
                                </div>
                                <div name={"input"}>
                                    <input type={"date"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Date of joining
                                </div>
                                <div name={"input"}>
                                    <input type={"date"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Skills
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Experience
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                        </Col>
                        <Col xl={fieldXL} lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Blood Group
                                </div>
                                <div name={"input"}>
                                    <select className={"form-control"}>
                                        <option>A - positive</option>
                                        <option>B - positive</option>
                                        <option>O - positive</option>
                                        <option>AB - positive</option>
                                    </select>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Emergency contact
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Highest qualification
                                </div>
                                <div name={"input"}>
                                    <select className={"form-control"}>
                                        <option>B.E</option>
                                        <option>B.Tect</option>
                                        <option>M.E</option>
                                        <option>Phd</option>
                                    </select>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Project manager
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Bank account
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    PAN
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Aadhar number
                                </div>
                                <div name={"input"}>
                                    <input type={"text"} className={"form-control"}/>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Permanent Address
                                </div>
                                <div name={"input"}>
                                    <textarea  className={"form-control"}></textarea>
                                </div>
                            </div>
                            <div className={"form-group FormFieldandInput"}>
                                <div name={"header"}>
                                    Present Address
                                </div>
                                <div name={"input"}>
                                    <textarea  className={"form-control"}></textarea>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className={"card-footer"} style={{"display":"block", "textAlign":"center", "padding":"20px"}}>
                        {
                            this.state.requestMessage ? 
                            <Col>
                                <div className={this.state.requestStatusClass} style={{"padding":"8px"}}>
                                    <span>{this.state.requestMessage}</span>
                                </div>
                            </Col> : null
                        }
                        <Col>
                            {
                                this.state.loadingShow ? <Loader style={{"width":"30px"}}/> : null
                            }
                            <Button color={"success"} className={"btn-lg"} disabled={this.state.loadingShow ? true : false}
                                onClick={this.sumbitNewEmployee}>Submit</Button>
                        </Col>
                    </Row>
                </Col>
                <ToastsContainer store={ToastsStore}/>
            </Row>
        </div>)
    }
}

export default CreateEmployee;