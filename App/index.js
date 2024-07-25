// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, ScrollView, ActivityIndicator, View } from 'react-native';
import axios from 'axios';

const WorkoutList = () => {
    const [loading, setLoading] = useState(true);
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant. Please provide answers for given requests."
                        },
                        {
                            role: "user",
                            content: "Please provide sample workout routines."
                        }
                    ],
                    model: "gpt-4o"
                });
                const { data } = response;
                const resultString = data.response;
                const workoutData = JSON.parse(resultString); // Assuming the API returns a JSON string.

                setWorkouts(workoutData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching workouts:', error);
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {workouts.map((workout, index) => (
                <View key={index} style={styles.workoutBox}>
                    <Text style={styles.workoutTitle}>{workout.title}</Text>
                    <Text>{workout.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Workout Tracker</Text>
            <WorkoutList />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    scrollContainer: {
        paddingVertical: 12,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    workoutBox: {
        backgroundColor: '#f0f0f0',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    workoutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});

export default App;