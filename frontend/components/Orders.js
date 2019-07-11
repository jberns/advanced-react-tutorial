import React from 'react';
import { Query } from 'react-apollo';
import { formatDistance } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Error from './ErrorMessage';
import OrderItemStyles from './styles/OrderItemStyles';
import User from './User';
import formatMoney from '../lib/formatMoney';

export const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY($userId: ID!) {
    orders(userId: $userId, orderBy: createdAt_DESC) {
      id
      charge
      total
      createdAt
      user {
        id
        name
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(60%, 1fr));
`;

const Orders = () => (
  <User>
    {({ data: { me } }) =>
      me && (
        <Query query={ALL_ORDERS_QUERY} variables={{ userId: me.id }}>
          {query => {
            if (query.error) {
              return <Error error={query.error} />;
            }
            if (query.loading) {
              return <p>Loading...</p>;
            }
            const orders = query.data.orders;
            console.log(orders);
            return (
              <div>
                <Head>
                  <title>Sick Fits - All Orders</title>
                </Head>
                <h2>You have {orders.length} order(s).</h2>
                <OrderUl>
                  {orders.map(order => {
                    const { id } = order;
                    return (
                      <OrderItemStyles key={id}>
                        <Link
                          href={{
                            pathname: '/order',
                            query: { id },
                          }}
                        >
                          <a>
                            <div className="order-meta">
                              <p>
                                {order.items.reduce(
                                  (a, b) => a + b.quantity,
                                  0,
                                )}{' '}
                                Items
                              </p>
                              <p>{order.items.length} Products</p>
                              <p>
                                {formatDistance(order.createdAt, new Date())}
                              </p>
                              <p>{formatMoney(order.total)}</p>
                            </div>
                            <div className="images">
                              {order.items.map(item => (
                                <img
                                  key={item.id}
                                  src={item.image}
                                  alt={item.title}
                                />
                              ))}
                            </div>
                          </a>
                        </Link>
                      </OrderItemStyles>
                    );
                  })}
                </OrderUl>
              </div>
            );
          }}
        </Query>
      )
    }
  </User>
);

export default Orders;
