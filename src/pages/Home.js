import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid } from 'semantic-ui-react';
import PostCard from '../components/PostCard';

const Home = () => {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <>
      <h1 className='page-title'>Recent Posts</h1>
      <Grid columns={3}>
        <Grid.Row>
          {loading ? (
            <h1>loading...</h1>
          ) : (
            data &&
            data.getPosts.map(post => (
              <Grid.Column key={post.id}>
                <PostCard post={post} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    </>
  );
};

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;
