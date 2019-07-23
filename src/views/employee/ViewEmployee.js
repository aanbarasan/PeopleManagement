import React from 'react';
import Fetch from '../../containers/Fetch';
import {Row, Col} from 'reactstrap';

class ViewEmployee extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.state.tableColumns = [{"text":"", "field": "picture"}, {"text":"Name", "field": "name"}, {"text":"Phone", "field": "phone"}, {"text":"Position", "field": "position"}, {"text":"Date of join", "field": "doj"}];
        this.state.tableData = [];
        this.state.windowWidth = window.screen.width;
    }

    componentDidMount = () => {
        Fetch.getAllEmployee({body:{}, success: (data) => {
            console.log(data);
            this.setState({"tableData": data});
        }, error: () => {
            let data = [{"name":"Jagadeesh", "phone":"9729387438", "position":"Senior software engineer", "doj":"01-01-2019"}, {"name":"Jagadeesh", "phone":"9729387438", "position":"Senior software engineer", "doj":"01-01-2019"}, {"name":"Jagadeesh", "phone":"9729387438", "position":"Senior software engineer", "doj":"01-01-2019"}];
            this.setState({"tableData": data});
        }});
        window.addEventListener("resize", (event) => {
            this.setState({"windowWidth": window.screen.width});
        });
    }

    render(){
        return(<div className="animated fadeIn">
            <Row>
                <Col style={{"fontSize":"19px", "textAlign":"center"}}>
                    List of Employees
                </Col>
            </Row>
            <Row className="justify-content-center" style={{"marginTop":"20px"}}>
                <Col xl={8}>
                    {
                        (this.state.tableData && this.state.tableData.length > 0) ? 
                            (this.state.windowWidth > 600  ? <table style={{"width":"100%"}}>
                                <thead>
                                    <tr>
                                        {
                                            this.state.tableColumns.map((key, index) => {
                                                return <th key={index} style={{"padding":"15px 5px 10px 5px"}}>{key.text}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tableData.map((keyRow, indexRow) => {
                                            return <tr key={indexRow} style={{"borderBottom":"1px solid #bfbfbfd4", "cursor":"pointer"}}>
                                                {
                                                    this.state.tableColumns.map((keyCol, indexCol) => {
                                                        if(keyCol.field === "picture"){
                                                            return <td style={{"width":"50px"}} key={indexCol}>
                                                                    <img src={"https://a.disquscdn.com/1561077851/images/noavatar92.png"} className={"userImageClass"} alt={"Profile"}/>
                                                                </td>
                                                        }
                                                        else {
                                                            return <td key={indexCol} style={{"padding":"15px 5px 10px 5px"}}>{keyRow[keyCol.field]}</td>
                                                        }
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table> : 
                            <Row>
                                {
                                    this.state.tableData.map((keyRow, indexRow) => {
                                        return <Col xs={12} key={indexRow} style={{"padding":"15px"}}>
                                            {
                                                this.state.tableColumns.map((keyCol, indexCol) => {
                                                    if(keyCol.field === "picture"){
                                                        return null;
                                                    }
                                                    else {
                                                        return <div key={indexCol}>{keyCol.text}: {keyRow[keyCol.field]}</div>
                                                    }
                                                })
                                            }
                                        </Col>
                                    })
                                }
                            </Row>
                            ) : 
                        <div>
                            No data found
                        </div>
                    }
                </Col>
            </Row>
        </div>);
    }
}

export default ViewEmployee;