import gql from "graphql-tag";

export default gql`
  mutation updateSession($id: Int!, $end: timestamptz) {
    update_sessions_by_pk(pk_columns: { id: $id }, _set: { end: $end }) {
      id
    }
  }
`;
