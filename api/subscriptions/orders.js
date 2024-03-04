import gql from "graphql-tag";

export default gql`
  subscription orders {
    orders(where: { user_id: { _is_null: true } }) {
      id
    }
  }
`;
