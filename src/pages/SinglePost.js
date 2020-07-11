import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import {
  Card,
  Icon,
  Label,
  Image,
  Button,
  Input,
  Popup
} from 'semantic-ui-react';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import { AuthContext } from '../context/auth';
import DeleteButton from '../components/DeleteButton';

const SinglePost = props => {
  const [comment, setComment] = useState('');
  const { user } = useContext(AuthContext);

  const { postId } = props.match.params;

  const { data, loading, error } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables: {
      postId,
      body: comment
    },
    update() {
      setComment('');
    }
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
    comments,
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
              <Popup
                inverted
                content='Comment on post'
                trigger={
                  <Button
                    basic
                    as={!user ? Link : 'div'}
                    labelPosition='right'
                    to={!user ? '/login' : undefined}
                  >
                    <Button color='blue' basic>
                      <Icon name='comments' />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                      {commentCount}
                    </Label>
                  </Button>
                }
              />
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePost} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <Card fluid>
              <Card.Content>
                <p>Post comment</p>
                <Form onSubmit={submitComment}>
                  <Input
                    type='text'
                    placeholder='Comment..'
                    name='comment'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    fluid
                    action
                  >
                    <input />
                    <Button
                      type='submit'
                      color='teal'
                      width={2}
                      disabled={comment.trim() === ''}
                    >
                      Submit
                    </Button>
                  </Input>
                </Form>
              </Card.Content>
            </Card>
          )}
          {comments.map(comment => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                {comment.body}
              </Card.Content>
            </Card>
          ))}
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

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default SinglePost;
