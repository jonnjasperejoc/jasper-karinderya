import React, { Component } from 'react';
import {
    Container,
    Card,
    Button,
    CardTitle,
    CardSubtitle,
    Row,
    Col,
    Media,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label,
    Form,
    FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import { getFoods, searchFoods, addFood, updateFood, deleteFood, crementFood } from '../actions/foodActions';
import { checkToken, getUser, logout } from '../actions/userActions';
import { getOrders, addOrder, crementOrder, deleteOrder } from '../actions/orderActions';

import NavBar from './NavBar';
import Order from './Order';
import OrderButton from './OrderButton';

import PropTypes from 'prop-types';
import appLogo from '../images/pot.png';

class FoodList extends Component {
    static propTypes = {
        getFoods: PropTypes.func.isRequired,
        searchFoods: PropTypes.func.isRequired,
        addFood: PropTypes.func.isRequired,
        updateFood: PropTypes.func.isRequired,
        deleteFood: PropTypes.func.isRequired,
        crementFood: PropTypes.func.isRequired,
        checkToken: PropTypes.func.isRequired,
        getUser: PropTypes.func.isRequired,
        getOrders: PropTypes.func.isRequired,
        addOrder: PropTypes.func.isRequired,
        deleteOrder: PropTypes.func.isRequired,
        crementOrder: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onSearch = this.onSearch.bind(this);

        this.state = {
            foodId: "",
            name: "",
            quantity: "",
            price: "",
            isOpen: false,
            modal: false,
            backdrop: true,
            orderModal: false,
            orderModalBackdrop: true,
            modalTitle: "",
            modalBtnText: "",
            modalAction: "",
            crementButtonDisabled: false
        };
    }

    componentDidMount() {
        this.props.getUser(this.props.user.id);

        const owner = this.props.user.id;
        if (this.props.token !== null) {
            this.props.getFoods(owner);
            this.getOrders();
        } else {
            this.props.history.push({
                pathname: '/'
            });
        }
    }

    getOrders = () => {
        axios
            .get('/api/orders/' + this.props.user.id)
            .then(res => {
                this.props.getOrders(res.data);
            })
            .catch(err =>
                console.log(err.response.data, err.response.status)
            )
    }

    toggleOrderModal = (id = null) => {
        this.setState(prevState => ({
            orderModal: !prevState.orderModal
        }));

        if (id) {
            const _foods = this.props.foods.filter(food => {
                return food._id === id ? food : null;
            });

            const order = {
                name: _foods[0].name,
                quantity: _foods[0].quantity,
                price: _foods[0].price,
                foodId: _foods[0]._id,
                owner: this.props.user.id
            }

            axios
                .post('/api/orders', order)
                .then(res => {
                    this.props.addOrder({
                        foodId: res.data.foodId,
                        name: res.data.name,
                        owner: res.data.owner,
                        price: res.data.price,
                        quantity: 1,
                        originalQuantity: res.data.quantity,
                        _id: res.data._id
                    });
                    this.props.crementFood(res.data.foodId);
                })
                .catch(err =>
                    console.log(err.response.data, err.response.status)
                );
        }
    }

    crementOrder = (id, foodId, operator, quantity) => {
        this.setState({
            crementButtonDisabled: true
        });

        quantity = parseInt(quantity);
        if (operator === '+') {
            quantity = quantity + 1;
        } else if (operator === '-') {
            quantity = quantity - 1;
        }

        axios
            .patch('/api/orders/' + id, { quantity })
            .then(res => {
                if (operator === '+') {
                    this.props.crementFood(foodId);
                }

                this.props.crementOrder(id, quantity);

                if (quantity === 0) {
                    this.deleteOrder(id);
                }

                this.setState({
                    crementButtonDisabled: false
                });
            })
            .catch(err =>
                console.log(err.response.data, err.response.status)
            );
    }

    deleteOrder = (id) => {
        axios
            .delete('/api/orders/' + id)
            .then(res => {
                this.props.deleteOrder(id);
            })
            .catch(err =>
                console.log(err.response.data, err.response.status)
            );
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    toggleModal = (action = this.state.modalAction, foodId = '') => {
        if (action === "Update Food") {
            this.props.foods.filter(food => {
                if (food._id === foodId) {
                    this.setState({
                        foodId: food._id,
                        name: food.name,
                        quantity: food.quantity,
                        price: food.price
                    });
                }
                return food;
            });
        } else {
            this.setState({
                foodId: '',
                name: '',
                quantity: '',
                price: ''
            });
        }

        this.setState(prevState => ({
            modalTitle: action,
            modalBtnText: action,
            modalAction: action,
            modal: !prevState.modal
        }));
    }

    logout = () => {
        this.props.logout();
    }

    deleteFood = id => {
        this.props.deleteFood(id);
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSearch = e => {
        e.preventDefault();
        const search = e.target.value.trim();
        this.props.searchFoods(search);
    }

    onSearchSubmit = e => {
        e.preventDefault();
        const search = e.target.elements.search.value.trim();
        this.props.searchFoods(search);
    }

    onSubmit = e => {
        e.preventDefault();

        const owner = this.props.user.id;

        const food = {
            id: e.target.elements.foodId.value.trim(),
            image: e.target.elements.image.files[0],
            name: e.target.elements.name.value.trim(),
            quantity: e.target.elements.quantity.value.trim(),
            price: e.target.elements.price.value.trim(),
            owner
        }

        if (this.state.modalAction === 'Update Food') {
            this.props.updateFood(food);
        } else {
            this.props.addFood(food);
        }

        this.props.getFoods(owner);
        this.toggleModal(this.state.modalAction);
    }

    render() {
        const foods = this.props.foods;
        return (
            <div>
                <NavBar
                    appLogo={appLogo}
                    toggle={this.toggle}
                    isOpen={this.state.isOpen}
                    userType={this.props.user.userType}
                    name={this.props.user.name}
                    toggleOrderModal={this.toggleOrderModal}
                    logout={this.logout}
                    users={false}
                ></NavBar>
                <Container>
                    <Form inline className="searchAdd" onSubmit={this.onSearchSubmit}>
                        {this.props.user.userType === "admin" ?
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0 mb-xs-0 addBtn"><Button onClick={() => this.toggleModal('Add Food')} color="success">Add Food</Button></FormGroup>
                            : ""}
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 mb-xs-0 searchText">
                            <Input type="text" name="search" id="search" placeholder="Search" onChange={this.onSearch} />
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0 mb-xs-0 searchBtn">
                            <Button color="success">Search</Button>
                        </FormGroup>
                    </Form>
                    <h5>FoodList</h5>
                    <Row className="foodList">
                        {foods.map(({ _id, name, price, quantity }) => (
                            <Col xs="12" sm="6" md="3" lg="2" key={_id}>
                                <Card body className="text-center">
                                    <Media left href="#">
                                        <Media object src={`api/foods/${_id}/image`} alt={name} className="img-responsive" />
                                    </Media>
                                    <div className="foodInfo">
                                        <CardTitle>{name}</CardTitle>
                                        <CardSubtitle>Price: {price}</CardSubtitle>
                                        <CardSubtitle className="quantity">Quantity: {quantity}</CardSubtitle>

                                        {this.props.user.userType === "admin" ?
                                            <div>
                                                <Button color="info" size="sm" onClick={() => this.toggleModal('Update Food', _id)}>Update</Button>
                                                <Button color="danger" size="sm" onClick={() => this.deleteFood(_id)}>x</Button>
                                            </div>
                                            :
                                            <OrderButton
                                                _id={_id}
                                                toggleOrderModal={this.toggleOrderModal}
                                                orders={this.props.orders}
                                                user={this.props.user.id}
                                                quantity={quantity}
                                            ></OrderButton>
                                        }
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={() => this.toggleModal()} backdrop={this.state.backdrop}>
                        <Form onSubmit={this.onSubmit}>
                            <ModalHeader toggle={() => this.toggleModal()}>{this.state.modalTitle}</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="hidden"
                                    name="foodId"
                                    id="foodId"
                                    value={this.state.foodId}
                                    onChange={this.onChange}
                                />
                                <FormGroup>
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Enter the name of food"
                                        required
                                        disabled={false}
                                        value={this.state.name}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        name="quantity"
                                        id="quantity"
                                        placeholder="Enter the amount of food"
                                        required
                                        disabled={false}
                                        value={this.state.quantity}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        name="price"
                                        id="price"
                                        placeholder="Enter the price of food"
                                        required
                                        disabled={false}
                                        value={this.state.price}
                                        onChange={this.onChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleFile">Food Image</Label>
                                    <Input type="file" name="image" id="image" />
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button block color="success">{this.state.modalBtnText}</Button>
                            </ModalFooter>
                        </Form>
                    </Modal>

                    <Order
                        orders={this.props.orders}
                        crementOrder={this.crementOrder}
                        deleteOrder={this.deleteOrder}
                        crementButtonDisabled={this.state.crementButtonDisabled}
                        orderModal={this.state.orderModal}
                        toggleOrderModal={this.toggleOrderModal}
                        orderModalBackdrop={this.state.orderModalBackdrop}
                    ></Order>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    foods: state.food.foods,
    foodAddedSuccess: state.food.foodAddedSuccess,
    foodQuantity: state.food.foodQuantity,
    token: state.user.token,
    user: state.user,
    orders: state.order.orders
});

export default connect(
    mapStateToProps,
    { getFoods, searchFoods, addFood, updateFood, deleteFood, crementFood, checkToken, getUser, getOrders, addOrder, crementOrder, deleteOrder, logout }
)(FoodList);