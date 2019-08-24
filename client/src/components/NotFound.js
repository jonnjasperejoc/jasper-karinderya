import React from "react";
import {
    Container,
    Col,
    Row
} from 'reactstrap';
import appLogo from '../images/pot.png';

export default class NotFound extends React.Component {
    render() {
        return (
            <Container>
                <Row className="page-not-found">
                    <Col></Col>
                    <Col className="center">
                        <img src={appLogo} alt="App Logo" title="App Logo"></img>
                        <h2>404 - Page not found!</h2>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}
