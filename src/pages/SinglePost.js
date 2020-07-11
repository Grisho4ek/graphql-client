import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Grid } from 'semantic-ui-react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

const SinglePost = props => {
  const { user } = useContext(AuthContext);
  const { postId } = props.match.params;

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  function deletePost() {
    props.history.push('/');
  }

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return (
      <div className='ui error message' style={{ marginBottom: 20 }}>
        <ul className='list'>
          <li>{error.graphQLErrors[0].message}</li>
        </ul>
      </div>
    );
  }

  const {
    id,
    body,
    createdAt,
    username,
    // comments,
    likes,
    likeCount,
    commentCount
  } = data.getPost;

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            floated='right'
            size='small'
            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likes, likeCount }} />
              <Button
                basic
                as='div'
                labelPosition='right'
                onClick={() => console.log('comment on post')}
              >
                <Button color='blue' basic>
                  <Icon name='comments' />
                </Button>
                <Label basic color='blue' pointing='left'>
                  {commentCount}
                </Label>
              </Button>
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePost} />
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      likeCount
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default SinglePost;
