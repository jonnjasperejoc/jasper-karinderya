import React from "react";
import {
    Alert,
    Row,
    Col,
    Card,
    Media,
    CardTitle,
    CardSubtitle,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';

export default class Order extends React.Component {
    render() {
        let total = 0;

        const orders = this.props.orders;

        for (const i in orders) {
            total += orders[i].price * orders[i].quantity;
        }

        return (
            <Modal isOpen={this.props.orderModal} toggle={() => this.props.toggleOrderModal()} backdrop={this.props.orderModalbackdrop}>
                <ModalHeader toggle={() => this.props.toggleOrderModal()}>My Order</ModalHeader>
                <ModalBody className="orderList">
                    <Alert color="danger" className={orders.length <= 0 ? "" : "hidden"}>You have no order!</Alert>
                    {orders.map(({ _id, name, quantity, price, foodId, originalQuantity }) => (
                        <Row key={_id} className="ordered">
                            <Col xs="6" sm="6" md="4" lg="4" className="orderImage">
                                <Card body className="text-center">
                                    <Media left href="#">
                                        <Media object src={`api/foods/${foodId}/image`} alt={name} className="img-responsive" />
                                    </Media>
                                </Card>
                            </Col>
                            <Col xs="6" sm="6" md="8" lg="8" className="orderOptions">
                                <Col xs="12" className="details">
                                    <CardTitle>{name} x {quantity}</CardTitle>
                                    <CardSubtitle>PHP {price * quantity}</CardSubtitle>
                                </Col>
                                <Col xs="12" className="actions">
                                    <Row>
                                        <Col xs="4" className="minus">
                                            <Button block color="danger" size="sm" disabled={this.props.crementButtonDisabled} onClick={() => this.props.crementOrder(_id, foodId, '-', quantity)}>-</Button>
                                        </Col>
                                        <Col xs="4" className="plus">
                                            <Button block color="success" size="sm" disabled={this.props.crementButtonDisabled || quantity === originalQuantity} onClick={() => this.props.crementOrder(_id, foodId, '+', quantity)}>+</Button>
                                        </Col>
                                        <Col xs="4" className="delete">
                                            <Button block color="danger" size="sm" onClick={() => this.props.deleteOrder(_id)}>x</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Col>
                        </Row>
                    ))}
                </ModalBody>
                <ModalFooter className="orderModalFooter">
                    <h5>Total = {total}</h5>
                </ModalFooter>
            </Modal>
        );
    }
}
