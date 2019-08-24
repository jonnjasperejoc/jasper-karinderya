import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { signup } from '../actions/userActions';
import PropTypes from 'prop-types';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            nameDisabled: false,
            emailDisabled: false,
            passwordDisabled: false,
            submitBtnDisabled: false,
            submitBtnText: "Sign Up",
            errorMessage: ""
        }
    }

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        signup: PropTypes.func.isRequired,
        error: PropTypes.bool,
        errorMessage: PropTypes.string
    };

    componentDidMount() {

    }

    componentDidUpdate() {
    }

    onSubmit = e => {
        e.preventDefault();

        this.setState({
            nameDisabled: true,
            emailDisabled: true,
            passwordDisabled: true,
            submitBtnDisabled: true,
            submitBtnText: 'Creating your account...'
        });

        const user = {
            name: e.target.elements.name.value.trim(),
            email: e.target.elements.email.value.trim(),
            password: e.target.elements.password.value.trim()
        }

        axios
            .post('/api/users', user)
            .then(res => {
                this.props.signup(res.data);
                this.props.history.push({
                    pathname: '/foods'
                });
            })
            .catch(err => {
                this.setState({
                    nameDisabled: false,
                    emailDisabled: false,
                    passwordDisabled: false,
                    submitBtnDisabled: false,
                    submitBtnText: 'Signup',
                    errorMessage: err.response.data.msg
                });
            });
    }

    render() {
        return (
            <Row>
                <Col xs="12" sm="1" md="3" lg="4"></Col>
                <Col xs="12" sm="10" md="6" lg="4" className="main-container sign-up">
                    <h3 className="appName">Sign Up</h3>
                    <Alert color="danger" className={this.state.errorMessage ? "" : "hidden"}>{this.state.errorMessage}</Alert>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter your name"
                                required
                                disabled={this.state.nameDisabled}
                            />
                        </FormGroup>
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
                            <Button color="success" block disabled={this.state.submitBtnDisabled}>{this.state.submitBtnText}</Button>
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
    { signup }
)(Signup);
