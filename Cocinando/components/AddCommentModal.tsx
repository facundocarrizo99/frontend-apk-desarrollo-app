import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from './StarRating';

interface AddCommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newComment: string;
  setNewComment: (text: string) => void;
  newRating: number;
  setNewRating: (rating: number) => void;
  submittingComment: boolean;
}

const AddCommentModal: React.FC<AddCommentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  newComment,
  setNewComment,
  newRating,
  setNewRating,
  submittingComment,
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Agregar Comentario</Text>
        <Text style={styles.modalLabel}>Calificación:</Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={newRating} interactive onChange={setNewRating} size={24} />
        </View>
        <Text style={styles.modalLabel}>Comentario:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Escribe tu comentario..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={onClose}
          >
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalSubmitButton, submittingComment && styles.modalSubmitButtonDisabled]}
            onPress={onSubmit}
            disabled={submittingComment}
          >
            <Text style={styles.modalSubmitText}>
              {submittingComment ? 'Enviando...' : 'Enviar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    backgroundColor: '#4C5F00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default AddCommentModal; 