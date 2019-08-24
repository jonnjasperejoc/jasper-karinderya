import React, { Component } from 'react';
import {
    Button,
    Container,
    Spinner,
    Table
} from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import { checkToken, getUser, getUsers, updateUser, logout } from '../actions/userActions';

import NavBar from './NavBar';

import PropTypes from 'prop-types';
import appLogo from '../images/pot.png';

class Users extends Component {
    static propTypes = {
        checkToken: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        updateUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            isOpen: false,
            isLoaded: false
        };
    }

    componentDidMount() {
        this.props.getUser(this.props.user.id);

        if (this.props.token !== null) {

        } else {
            this.props.history.push({
                pathname: '/'
            });
        }

        axios
            .get('/api/users')
            .then(res => {
                this.setState({
                    isLoaded: !this.state.isLoaded
                });
                this.props.getUsers(res.data);
            })
            .catch(err =>
                console.log(err.response.data, err.response.status)
            )
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    logout = () => {
        this.props.logout();
    }

    changeUserType = (id, type) => {
        this.props.updateUser(id, type);
    }

    render() {
        const users = this.props.users;

        return (
            <div>
                <NavBar
                    appLogo={appLogo}
                    toggle={this.toggle}
                    isOpen={this.state.isOpen}
                    userType={this.props.user.userType}
                    name={this.props.user.name}
                    toggleOrderModal={() => { }}
                    logout={this.logout}
                ></NavBar>
                <Container>
                    <div className={this.state.isLoaded ? "hidden spinner-container" : "spinner-container"}>
                        <Spinner style={{ width: '3rem', height: '3rem' }} type="grow" />
                    </div>
                    <Table className={this.state.isLoaded ? "users" : "hidden users"}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(({ _id, name, email, type }) => (
                                <tr key={_id}>
                                    <td>{name}</td>
                                    <td className="user-type">{type}</td>
                                    <td>{email}</td>
                                    <td>
                                        <Button size="sm" color="primary" disabled={type === "admin"} onClick={() => this.changeUserType(_id, type)}>Admin</Button>
                                        <Button size="sm" color="success" disabled={type === "user"} onClick={() => this.changeUserType(_id, type)}>User</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    token: state.user.token,
    user: state.user,
    users: state.user.users
});

export default connect(
    mapStateToProps,
    { checkToken, getUser, getUsers, updateUser, logout }
)(Users);