import React from "react";
import { Link } from "react-router-dom";
import {
    Collapse,
    Nav,
    Navbar,
    NavItem,
    NavbarToggler,
    NavLink,
    Media
} from 'reactstrap';

export default class NavBar extends React.Component {
    render() {
        return (
            <Navbar color="light" light expand="md">
                <Link to="/foods" className="navbar-brand">
                    <Media object src={this.props.appLogo} className="img-responsive appLogoXs" />
                    <b className="appName">Karinderya</b>
                </Link>
                <NavbarToggler onClick={this.props.toggle} />
                <Collapse isOpen={this.props.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink className="profile" href="#">Welcome {this.props.userType === 'admin' ? `Admin` : ``} {this.props.name}</NavLink>
                        </NavItem>
                        {this.props.userType === "user" ?
                            <NavItem>
                                <NavLink href="#" onClick={() => this.props.toggleOrderModal()}>My Order</NavLink>
                            </NavItem>
                            : ""}
                        {this.props.userType === "admin" ?
                            <NavItem>
                                <Link to="/users" className="nav-link">Users</Link>
                            </NavItem>
                            : ""}
                        <NavItem>
                            <NavLink href="/" onClick={this.props.logout}>Logout</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
