import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommentCard from './CommentCard';
import { Comment } from '../types/Recipie';

interface CommentsSectionProps {
  comments: Comment[];
  loading: boolean;
  onAddComment: () => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, loading, onAddComment }) => (
  <View style={styles.section}>
    <View style={styles.commentsHeader}>
      <Text style={styles.sectionTitle}>Comentarios</Text>
      <TouchableOpacity style={styles.addCommentButton} onPress={onAddComment}>
        <Ionicons name="add" size={20} color="#4C5F00" />
        <Text style={styles.addCommentText}>Agregar</Text>
      </TouchableOpacity>
    </View>
    {loading ? (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando comentarios...</Text>
      </View>
    ) : comments.length === 0 ? (
      <View style={styles.emptyCommentsContainer}>
        <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
        <Text style={styles.emptyCommentsText}>No hay comentarios aún</Text>
        <Text style={styles.emptyCommentsSubtext}>¡Sé el primero en comentar!</Text>
      </View>
    ) : (
      <FlatList
        data={comments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <CommentCard comment={item} />}
        contentContainerStyle={styles.commentsContainer}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C5F00',
    marginBottom: 0,
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addCommentText: {
    color: '#4C5F00',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  emptyCommentsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyCommentsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '600',
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  commentsContainer: {
    gap: 16,
    paddingBottom: 16,
  },
});

export default CommentsSection; 