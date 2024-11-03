export const defaultQuery = `
# Welcome to the GraphQL playground!
query FetchData {
  people {
    name
  }
  profiles {
    nickname
  }
  memberships {
    community {
      name
    }
    owner {
      name
    }
  }
  communities {
    name
    description
    slug
    status
    memberships {
      communityProfile {
        nickname
      }
    }
  }
}

mutation Logout {
  endSession
}

mutation Login($email: String!, $password: String!) {
  authenticatePersonWithPassword(email: $email, password: $password) {
    ... on PersonAuthenticationWithPasswordSuccess {
      sessionToken
      item {
        email
      }
    }
    ... on PersonAuthenticationWithPasswordFailure {
      message
    }
  }
}
`;
