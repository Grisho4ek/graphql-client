import React, { useEffect, useState } from 'react';
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const LikeButton = ({ post: { id, likes, likeCount }, user }) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  });

  return (
    <Popup
      inverted
      content='Comment on post'
      trigger={
        <Button
          as={!user ? Link : 'div'}
          labelPosition='right'
          onClick={user ? likePost : undefined}
          to={!user ? '/login' : undefined}
        >
          <Button color='teal' basic={!liked}>
            <Icon name='heart' />
          </Button>
          <Label color='teal' basic pointing='left'>
            {likeCount}
          </Label>
        </Button>
      }
    />
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
