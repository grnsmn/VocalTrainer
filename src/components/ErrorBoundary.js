import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Something went wrong!</Text>
                    <Text style={styles.error}>{this.state.error?.toString()}</Text>
                    {this.state.errorInfo && (
                        <Text style={styles.stackTrace}>
                            {this.state.errorInfo.componentStack}
                        </Text>
                    )}
                </ScrollView>
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
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'red',
    },
    error: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    stackTrace: {
        fontSize: 12,
        color: '#666',
    },
});

export default ErrorBoundary;
