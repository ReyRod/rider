import gql from "graphql-tag";

export default gql`
  mutation createSession($user_id: String!, $start: timestamptz) {
    insert_sessions_one(object: { user_id: $user_id, start: $start }) {
      id
    }
  }
`;
