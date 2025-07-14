import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import StarRating from './StarRating';
import { Comment } from '../types/Recipie';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => (
  <View style={styles.commentCard}>
    <View style={styles.commentHeader}>
      <Image
        source={{ uri: comment.usuario.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg' }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentInfo}>
        <Text style={styles.commentAuthor}>{comment.usuario.name}</Text>
        <View style={styles.commentRating}>
          <StarRating rating={comment.valoracion} />
        </View>
      </View>
    </View>
    <Text style={styles.commentText}>{comment.texto}</Text>
    <Text style={styles.commentDate}>
      {new Date(comment.fechaCreacion).toLocaleDateString('es-ES')}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  commentRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default CommentCard; 