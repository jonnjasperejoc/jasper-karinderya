import React from "react";
import {
    Button
} from 'reactstrap';

export default class OrderButton extends React.Component {
    render() {
        let count = 0;
        let disabled = false;
        let text = "Order";

        const orders = this.props.orders;

        for (const i in orders) {
            if (orders[i].foodId === this.props._id && orders[i].owner === this.props.user) {
                count = count + 1;
            }
        }

        if (count > 0) {
            disabled = true;
            text = "Ordered";
        }

        if (this.props.quantity === 0) {
            disabled = true;
            text = "Out of stock";
        }

        return (
            <div>
                <Button block
                    color="success"
                    size="sm"
                    onClick={() => this.props.toggleOrderModal(this.props._id)}
                    disabled={disabled}
                >{text}</Button>
            </div>
        );
    }
}
