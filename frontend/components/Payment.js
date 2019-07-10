import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class Payment extends React.Component {
  onToken = (res, createOrder) => {
    console.log('On Token Called');
    console.log(res.id);
    createOrder({
      variables: {
        token: res.id,
      },
    }).catch(error => {
      alert(error.message);
    });
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${totalItems(me.cart)} items`}
                image={me.cart[0].item && me.cart[0].item.image}
                stripeKey="pk_test_9V9h2R0N0dEwyIDXRPVbD9Uh"
                currency="USD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default Payment;
