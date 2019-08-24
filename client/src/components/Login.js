import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Row, Col, Nav, NavItem, NavLink, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { login, checkToken } from '../actions/userActions';
import PropTypes from 'prop-types';
import appLogo from '../images/pot.png';

class Login extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            emailDisabled: false,
            passwordDisabled: false,
            submitBtnDisabled: false
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        login: PropTypes.func.isRequired,
        checkToken: PropTypes.func.isRequired,
        error: PropTypes.bool,
        errorMessage: PropTypes.string
    };

    componentDidMount() {
        this.props.checkToken();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.error && !this.props.isAuthenticated) {
            if (prevState.emailDisabled && prevState.passwordDisabled && prevState.submitBtnDisabled) {
                this.setState({
                    emailDisabled: false,
                    passwordDisabled: false,
                    submitBtnDisabled: false
                });
            }
        }

        if (!this.props.error && this.props.isAuthenticated) {
            this.props.history.push({
                pathname: '/foods'
            });
        }
    }

    onSubmit = e => {
        e.preventDefault();

        this.setState({
            emailDisabled: true,
            passwordDisabled: true,
            submitBtnDisabled: true
        });

        const user = {
            email: e.target.elements.email.value.trim(),
            password: e.target.elements.password.value.trim()
        }

        this.props.login(user);
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="1" md="3" lg="4"></Col>
                <Col xs="12" sm="10" md="6" lg="4" className="main-container">
                    <div className="appLogoContainer">
                        <img src={appLogo} title="Karindirya" alt="Karindirya" />
                    </div>
                    <h3 className="appName">Karinderya</h3>
                    <Alert color="danger" className={this.props.error ? "" : "hidden"}>{this.props.errorMessage}</Alert>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                required
                                disabled={this.state.emailDisabled}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                required
                                disabled={this.state.passwordDisabled}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button color="success" block disabled={this.state.submitBtnDisabled}>Login</Button>
                            <Nav pills>
                                <NavItem>
                                    <NavLink href="/signup" className="no-padding-right">Create account</NavLink>
                                </NavItem>
                            </Nav>
                        </FormGroup>
                    </Form>
                </Col>
                <Col xs="12" sm="1" md="3" lg="4"></Col>
            </Row>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated,
    user: state.user.user,
    error: state.user.error,
    errorMessage: state.user.errorMessage,
    token: state.user.token
});

export default connect(
    mapStateToProps,
    { login, checkToken }
)(Login);
