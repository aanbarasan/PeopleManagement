import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import Fetch from '../../containers/Fetch';
import ConstantValues from '../../containers/ConstantValues';
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
            <Modal centered={true} backdrop={"static"} isOpen={this.state.show} toggle={this.toggle} className={this.props.className}>
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
        this.state = this.getDefaultFormFeilds();
        this.state.loadingShow = false;
        this.state.bulkUploadEnable = false;
        this.state.viewName = "NewEmployee";
    }

    bulkUpload = () => {
        this.child.openModal();
    }

    getDefaultFormFeilds = () => {
        return {employeeID: '', employeeName: '', employeeLastName: '', employeeGender: 1, employeePosition: ConstantValues.EmployeePositions[0].value, employeeLevel: '', employeeEmail: '', employeeDOB: '', 
            employeeDOJ: '', employeeBloodGroup: ConstantValues.BloodGrouplist[0].value, employeePhone: '', employeeEmergencyContact: '', employeeProjectManager: '', 
            employeeProjectManagerNPlus: '', employeePermanentAddress: '', employeePresentAddress: ''};        
    }

    sumbitNewEmployee = () => {
        let params = {emp_id: this.state.employeeID, name: this.state.employeeName, last_name: this.state.employeeLastName, gender: this.state.employeeGender, position: this.state.employeePosition, 
                    level: this.state.employeeLevel, email: this.state.employeeEmail, date_of_birth: this.state.employeeDOB, date_of_join: this.state.employeeDOJ,
                    blood_group: this.state.employeeBloodGroup, phone: this.state.employeePhone, emergency_contact: this.state.employeeEmergencyContact, 
                    project_manager: this.state.employeeProjectManager, project_manager_n_plus: this.state.employeeProjectManagerNPlus,
                    permanent_address: this.state.employeePermanentAddress, present_address: this.state.employeePresentAddress};
        this.setState({"loadingShow": true, "errorMessage": {}});
        Fetch.sumbitNewEmployee({body:params, success:(data) => {
            if(data.status === 200){
                ToastsStore.success('Employee added successfully');
                this.setState({requestMessage: "", viewName: "SuccessPage"});
                this.setState(this.getDefaultFormFeilds());
            }
            else if(data.status === 422){
                let errorMessage = {};
                if(data.errors && data.errors.length > 0){
                    for(var i=0;i<data.errors.length;i++){
                        let e = data.errors[i];
                        errorMessage[e.param] = e.msg;
                    }
                }
                this.setState({"errorMessage": errorMessage});
                ToastsStore.error('Employee added failed');
            }
            else {
                if(data.status === 403 && data.message === "Email has already registered"){
                    this.setState({"errorMessage": {"email":data.message}});
                }
                ToastsStore.error('Employee added failed: ' + data.message);
            }
            this.setState({"loadingShow": false});
        }, error: () => {
            ToastsStore.error('Server connection failed');
            this.setState({"loadingShow": false});
        }});
    }

    errorMessagePrint = (param) => {
        if(this.state.errorMessage && this.state.errorMessage[param]){
            return <div style={{"color":"red", "padding":"0px 10px"}}>{this.state.errorMessage[param]}</div>;
        }
        else {
            return null;
        }
    }

    render(){
        let fieldXL = 6, fieldLG = 6, fieldMD = 6, fieldSM = 12, fieldXS = 12;
        return(<div className="animated fadeIn">
            <Row>
                <Col style={{"fontSize":"19px", "paddingRight":"0px"}}>
                    Add Employee
                </Col>
                <Col style={{"textAlign":"right", "paddingLeft":"0px"}}>
                    <a href={Fetch.globalURL("/get-sample-xl")} title={"Sample file"}>Sample <i className={"fa fa-download"}></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={this.bulkUpload} color={"primary"}>Bulk Upload</Button>
                    <BulkUploadModal onRef={ref => (this.child = ref)} show={this.state.bulkUploadEnable}/>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {(() => {
                    switch(this.state.viewName){
                        case "NewEmployee":
                            return <Col xs={12} sm={9} md={10} lg={9} xl={7} className={"card"}>
                                    <form onSubmit={this.sumbitNewEmployee}>
                                        <Row className={"card-body"}>
                                            <Col xl={fieldXL} lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Employee ID
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"number"} className={"form-control removeUpDownArrow"} value={this.state.employeeID}
                                                            onChange={(event) => {this.setState({"employeeID":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('emp_id')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        First name
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"text"} className={"form-control"} value={this.state.employeeName}
                                                            onChange={(event) => {this.setState({"employeeName":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('name')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Last name
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"text"} className={"form-control"} value={this.state.employeeLastName}
                                                            onChange={(event) => {this.setState({"employeeLastName":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('last_name')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Gender
                                                    </div>
                                                    <div name={"input"}>
                                                        <select required className={"form-control"} value={this.state.employeeGender} onChange={(event) => {this.setState({"employeeGender":event.target.value})}}>
                                                            <option value={1}>Male</option>
                                                            <option value={2}>Female</option>
                                                            <option value={3}>Others</option>
                                                        </select>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('gender')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Level
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"text"} className={"form-control"} value={this.state.employeeLevel} onChange={(event) => {this.setState({"employeeLevel":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('level')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Email
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"email"} className={"form-control"} value={this.state.employeeEmail} onChange={(event) => {this.setState({"employeeEmail":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('email')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Date of birth
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"date"} className={"form-control"} value={this.state.employeeDOB} onChange={(event) => {this.setState({"employeeDOB":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('date_of_birth')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Date of joining
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"date"} className={"form-control"} value={this.state.employeeDOJ} onChange={(event) => {this.setState({"employeeDOJ":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('date_of_join')
                                                    }
                                                </div>
                                            </Col>
                                            <Col xl={fieldXL} lg={fieldLG} md={fieldMD} sm={fieldSM} xs={fieldXS}>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Blood Group
                                                    </div>
                                                    <div name={"input"}>
                                                        <select required className={"form-control"} value={this.state.employeeBloodGroup} onChange={(event) => {this.setState({"employeeBloodGroup":event.target.value})}}>
                                                            {
                                                                ConstantValues.BloodGrouplist.map(function(key, index){
                                                                    return <option key={index} value={key.value}>{key.name}</option>;
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('blood_group')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Position
                                                    </div>
                                                    <div name={"input"}>
                                                        <select required className={"form-control"} value={this.state.employeePosition} onChange={(event) => {this.setState({"employeePosition":event.target.value})}}>
                                                            {
                                                                ConstantValues.EmployeePositions.map(function(key, index){
                                                                    return <option key={index} value={key.value}>{key.name}</option>;
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('position')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Contact
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"number"} className={"form-control removeUpDownArrow"} value={this.state.employeePhone} onChange={(event) => {this.setState({"employeePhone":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('phone')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Emergency contact
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"number"} className={"form-control removeUpDownArrow"} value={this.state.employeeEmergencyContact} onChange={(event) => {this.setState({"employeeEmergencyContact":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('emergency_contact')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        N - Plus one
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"text"} className={"form-control"} value={this.state.employeeProjectManager} onChange={(event) => {this.setState({"employeeProjectManager":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('project_manager')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        N - Plus two
                                                    </div>
                                                    <div name={"input"}>
                                                        <input required type={"text"} className={"form-control"} value={this.state.employeeProjectManagerNPlus} onChange={(event) => {this.setState({"employeeProjectManagerNPlus":event.target.value})}}/>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('project_manager_n_plus')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Permanent Address
                                                    </div>
                                                    <div name={"input"}>
                                                        <textarea required className={"form-control"} value={this.state.employeePermanentAddress} onChange={(event) => {this.setState({"employeePermanentAddress":event.target.value})}}></textarea>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('permanent_address')
                                                    }
                                                </div>
                                                <div className={"form-group FormFieldandInput"}>
                                                    <div name={"header"}>
                                                        Present Address
                                                    </div>
                                                    <div name={"input"}>
                                                        <textarea required className={"form-control"} value={this.state.employeePresentAddress} onChange={(event) => {this.setState({"employeePresentAddress":event.target.value})}}></textarea>
                                                    </div>
                                                    {
                                                        this.errorMessagePrint('present_address')
                                                    }
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className={"card-footer"} style={{"display":"block", "textAlign":"center", "padding":"20px"}}>
                                            <Col>
                                                {
                                                    this.state.loadingShow ? <Loader style={{"width":"30px"}}/> : null
                                                }
                                                <Button color={"success"} className={"btn-lg"} type={"submit"}
                                                    disabled={this.state.loadingShow ? true : false}>Submit</Button>
                                            </Col>
                                        </Row>
                                    </form>
                                </Col>
                        case "SuccessPage":
                            return <Col xl={3}>
                                        <div style={{"textAlign":"center"}}>
                                            <i className="fa fa-check-circle" style={{"color":"green", "fontSize": "150px"}}></i>
                                        </div>
                                        <div style={{"textAlign":"center", "fontSize":"30px"}}>
                                            Successfully added
                                        </div>
                                        <div style={{"textAlign":"center", "fontSize":"30px"}}>
                                            <Button onClick={() => {this.setState({"viewName": "NewEmployee"})}}>Add new</Button>
                                        </div>
                                    </Col>;
                        default:
                            return <div>Loading</div>;
                    }
                })()}
            </Row>
            <ToastsContainer store={ToastsStore}/>
        </div>)
    }
}

export default CreateEmployee;