import React from 'react';
import Fetch from '../../containers/Fetch';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import {Row, Col, Button, ButtonToolbar, ButtonGroup} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class ViewEmployee extends React.Component{

    constructor(props){
        super(props);
        this.state = {"searchText": "", "employeePosition": "software"};
        this.state.tableData = [];
        this.state.currentPage = 1;
        this.state.pageCount = 1;
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
            if(data.status === 200){
                this.setState({"tableData": data.employee_list});
            }
        }, error: () => {
            ToastsStore.error('Search failed');
        }});
    }

    render(){
        return(<div className="animated fadeIn">
            <Row>
                <Col xs={12} style={{"fontSize":"19px", "textAlign":"center"}}>
                    List of Employees
                </Col>
                <Col xs={12} style={{"textAlign":"center", "marginTop":"15px"}}>
                    <form onSubmit={this.search}>
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
                        <Button type={"submit"}>Search</Button>
                    </form>
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
                    <ButtonToolbar aria-label="Toolbar with button groups" className={"pull-right"}>
                        <ButtonGroup className="mr-2" aria-label="navigation">
                            <Button>Prev</Button>
                            <Button>1</Button>
                            <Button>2</Button>
                            <Button>Next</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Col>
            </Row>
            <ToastsContainer store={ToastsStore}/>
        </div>);
    }
}

export default ViewEmployee;