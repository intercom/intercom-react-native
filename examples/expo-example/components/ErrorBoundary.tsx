import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Text, View } from 'react-native';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 justify-center items-center p-6 bg-gray-50">
          <View className="bg-white rounded-lg p-6 shadow-lg">
            <Text className="text-xl font-bold text-red-600 text-center mb-4">
              Something went wrong
            </Text>
            <Text className="text-gray-700 text-center mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button
              title="Try Again"
              onPress={() =>
                this.setState({ hasError: false, error: undefined })
              }
              variant="primary"
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
