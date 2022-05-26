import { gql } from '@apollo/client'
export const GET_IDENTITY = gql`
  query($address: String!, $first: Int, $after: String) {
    identity(address: $address) {
      domain
      avatar
      joinTime
      twitter {
        handle
        avatar
        verified
        tweetId
        source
        followerCount
      }
      github {
        username
        gistId
        userId
      }
      followingCount
      followings(first: $first, after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        list {
          address
          domain
          avatar
          alias
          namespace
          lastModifiedTime
          verifiable
        }
      }
      followerCount
      followers(first: $first, after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        list {
          address
          domain
          avatar
          alias
          namespace
          lastModifiedTime
          verifiable
        }
      }
      friends(first: $first, after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        list {
          address
          domain
          avatar
          alias
          namespace
          lastModifiedTime
          verifiable
        }
      }
    }
  }
`
