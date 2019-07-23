import React from 'react';
import Fetch from '../../containers/Fetch';
import {Row, Col, Button} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class ViewEmployee extends React.Component{

    constructor(props){
        super(props);
        this.state = {"searchText": "", "employeePosition": "software"};
        this.state.tableData = [];
        this.state.windowWidth = window.screen.width;
    }

    componentDidMount = () => {
        window.addEventListener("resize", () => {
            this.setState({"windowWidth": window.screen.width});
        });
        this.search();
    }

    search = () => {
        Fetch.getAllEmployee({body:{"q": this.state.searchText, "position": this.state.employeePosition}, success: (data) => {
            console.log(data);
            if(data.status === 200){
                this.setState({"tableData": data.message});
            }
        }, error: () => {
            let data = [{"name":"Jagadeesh", "phone":"9729387438", "position":"Senior software engineer", "doj":"01-01-2019"}, {"name":"Jagadeesh", "phone":"9729387438", "position":"Senior software engineer", "doj":"01-01-2019"}, {"name":"Jagadeesh", "phone":"9729387438", "position":"Senior software engineer", "doj":"01-01-2019"}];
            this.setState({"tableData": data});
        }});
    }

    render(){
        return(<div className="animated fadeIn">
            <Row>
                <Col xs={12} style={{"fontSize":"19px", "textAlign":"center"}}>
                    List of Employees
                </Col>
                <Col xs={12} style={{"textAlign":"center", "marginTop":"10px"}}>
                    <label>Search: </label>
                    <input type={"text"} placeholder={"Enter text"} className={"form-control"} style={{"width":"200px", "display":"inline-block"}}
                        value={this.state.searchText} onChange={(event) => {this.setState({"searchText":event.target.value})}}/>&nbsp;&nbsp;&nbsp;&nbsp;
                    <label>Position: </label>
                    <select className={"form-control"} style={{"width":"200px", "display":"inline-block"}}
                        value={this.state.employeePosition} onChange={(event) => {this.setState({"employeePosition":event.target.value})}}>
                        <option value={"software"}>Software Engineer</option>
                        <option value={"senier_software"}>Senier Software Engineer</option>
                        <option value={"tester"}>Software Tester</option>
                    </select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={this.search}>Search</Button>
                </Col>
            </Row>
            <Row className="justify-content-center" style={{"marginTop":"20px"}}>
                <Col xl={8} style={{"backgroundColor":"white", "padding":"15px", "borderRadius":"5px"}}>
                    <BootstrapTable data={ this.state.tableData}>
                        <TableHeaderColumn dataField='name' isKey={true}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='phone'>Phone</TableHeaderColumn>
                        <TableHeaderColumn dataField='position'>Position</TableHeaderColumn>
                        <TableHeaderColumn dataField='doj'>Date of join</TableHeaderColumn>
                    </BootstrapTable>
                </Col>
            </Row>
        </div>);
    }
}

export default ViewEmployee;