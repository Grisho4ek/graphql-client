import React, { useState } from 'react';
import { Icon, Button, Confirm, Popup } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteObject] = useMutation(commentId ? DELETE_COMMENT : DELETE_POST, {
    variables: {
      postId,
      commentId
    },
    onError() {},
    update(proxy) {
      if (!commentId) {
        setConfirmOpen(false);
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            ...data,
            getPosts: data.getPosts.filter(post => post.id !== postId)
          }
        });
      }

      console.log('object');
      callback && callback();
    }
  });
  return (
    <>
      <Popup
        inverted
        content={`Delete ${commentId ? 'comment' : 'post'}`}
        trigger={
          <Button
            color='red'
            as='div'
            onClick={() => setConfirmOpen(true)}
            floated='right'
          >
            <Icon name='trash' style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteObject}
      />
    </>
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
