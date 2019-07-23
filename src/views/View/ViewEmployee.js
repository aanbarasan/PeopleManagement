import React from 'react';
import {Row, Col} from 'reactstrap';

class ViewEmployee extends React.Component{

    render(){
        return(<div className="animated fadeIn">
            <Row>
                <Col style={{"fontSize":"19px", "paddingRight":"0px"}}>
                    View Employee
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col xl={8}>
                    Check
                </Col>
            </Row>
        </div>);
    }
}

export default ViewEmployee;