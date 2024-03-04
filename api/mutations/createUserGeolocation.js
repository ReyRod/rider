import gql from "graphql-tag";

export default gql`
  mutation createUserGeolocation($geolocation: point!, $user_id: String!) {
    insert_users_geolocations_one(
      object: { geolocation: $geolocation, user_id: $user_id }
      on_conflict: {
        constraint: users_geolocations_user_id_key
        update_columns: geolocation
      }
    ) {
      id
    }
  }
`;
