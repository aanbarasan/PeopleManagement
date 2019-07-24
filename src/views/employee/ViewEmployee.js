import React from 'react';
import Fetch from '../../containers/Fetch';
import ConstantValues from '../../containers/ConstantValues';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import {Row, Col, Button, ButtonToolbar, ButtonGroup} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

class ViewEmployee extends React.Component{

    constructor(props){
        super(props);
        this.state = {"searchText": "", "employeePosition": ConstantValues.EmployeePositions[0].value};
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
        Fetch.getAllEmployee({body:{"q": this.state.searchText, "position": this.state.employeePosition, "page": this.state.currentPage}, success: (data) => {
            if(data.status === 200){
                this.setState({"tableData": data.employee_list, "pageCount": (data.employee_count / data.limit)});
            }
        }, error: () => {
            ToastsStore.error('Search failed');
        }});
    }

    render(){
        return(<div className="animated fadeIn">
            <Row className="justify-content-center" style={{"marginTop":"20px"}}>
                <Col xl={8} style={{"backgroundColor":"white", "padding":"10px", "borderRadius":"5px"}}>
                    <div style={{"fontSize":"19px", "textAlign":"center"}}>
                        List of Employees
                    </div>
                    <div style={{"textAlign":"center", "marginTop":"15px"}}>
                        <form onSubmit={this.search}>
                            <label>Search: </label>&nbsp;
                            <input type={"text"} placeholder={"Enter text"} className={"form-control"} style={{"width":"200px", "display":"inline-block"}}
                                value={this.state.searchText} onChange={(event) => {this.setState({"searchText":event.target.value})}}/>&nbsp;&nbsp;&nbsp;
                            <label>Position: </label>&nbsp;
                            <select className={"form-control"} style={{"width":"200px", "display":"inline-block"}}
                                value={this.state.employeePosition} onChange={(event) => {this.setState({"employeePosition":event.target.value})}}>
                                {
                                    ConstantValues.EmployeePositions.map(function(key, index){
                                        return <option key={index} value={key.value}>{key.name}</option>;
                                    })
                                }
                            </select>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button type={"submit"}>Search</Button>
                        </form>
                    </div>
                    <div style={{"backgroundColor":"white", "padding":"10px", "borderRadius":"5px"}}>
                        <BootstrapTable data={ this.state.tableData} tableHeaderClass={'customTableHeaderClass'}>
                            <TableHeaderColumn dataField='name' isKey={true}>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='phone'>Phone</TableHeaderColumn>
                            <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField='position'>Position</TableHeaderColumn>
                        </BootstrapTable>
                        <ButtonToolbar aria-label="Toolbar with button groups" className={"pull-right"} style={{"marginTop":"10px"}}>
                            <ButtonGroup className="mr-2" aria-label="navigation">
                                <Button onClick={() => { (()=>{
                                    if(this.state.currentPage > 1){
                                        this.setState({"currentPage": (this.state.currentPage - 1)}, ()=>{ this.search() });
                                    }
                                })() }}>Prev</Button>
                                { this.state.currentPage > 1 ? <Button onClick={()=>{this.setState({"currentPage": 1}, ()=>{ this.search() })}}>1</Button> : null }
                                { this.state.currentPage > 3 ? <Button disabled>..</Button> : null }
                                { this.state.currentPage > 2 ? <Button onClick={()=>{this.setState({"currentPage": (this.state.currentPage - 1)}, ()=>{ this.search() })}}>{this.state.currentPage - 1}</Button> : null }
                                <Button color={"primary"}>{this.state.currentPage}</Button>
                                { this.state.pageCount - 1 > this.state.currentPage ? <Button onClick={()=>{this.setState({"currentPage": (this.state.currentPage + 1)}, ()=>{ this.search() })}}>{this.state.currentPage + 1}</Button> : null }
                                { this.state.pageCount - 2 > this.state.currentPage ? <Button disabled>..</Button> : null }
                                { this.state.pageCount > this.state.currentPage ? <Button onClick={()=>{this.setState({"currentPage": Math.ceil(this.state.pageCount)}, ()=>{ this.search() })}}>{Math.ceil(this.state.pageCount)}</Button> : null }
                                <Button onClick={() => { (()=>{
                                    if(this.state.pageCount > this.state.currentPage){
                                        this.setState({"currentPage": (this.state.currentPage + 1)}, ()=>{ this.search() });
                                    }
                                })() }}>Next</Button>
                            </ButtonGroup>
                        </ButtonToolbar>
                    </div>
                </Col>
            </Row>
            <ToastsContainer store={ToastsStore}/>
        </div>);
    }
}

export default ViewEmployee;