import gql from "graphql-tag";

export default gql`
  query getUser($id: String!) {
    users_by_pk(id: $id) {
      id
      email
      first_name
      last_name
    }
  }
`;
