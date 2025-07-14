import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>¡Algo salió mal!</Text>
          <Text style={styles.message}>{this.state.error?.message || 'Error desconocido.'}</Text>
          <Button title="Reintentar" onPress={this.handleReload} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c00',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ErrorBoundary; 