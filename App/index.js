// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert, Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const CELL_SIZE = 20;
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
};

let timer;

const SnakeGame = () => {
    const [snake, setSnake] = useState([
        { x: Math.floor(WIDTH / 2 / CELL_SIZE) * CELL_SIZE, y: Math.floor(HEIGHT / 2 / CELL_SIZE) * CELL_SIZE },
    ]);
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [food, setFood] = useState(getRandomFoodLocation());
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.nativeEvent.key === 'ArrowUp' && direction !== DIRECTIONS.DOWN) {
                setDirection(DIRECTIONS.UP);
            } else if (event.nativeEvent.key === 'ArrowDown' && direction !== DIRECTIONS.UP) {
                setDirection(DIRECTIONS.DOWN);
            } else if (event.nativeEvent.key === 'ArrowLeft' && direction !== DIRECTIONS.RIGHT) {
                setDirection(DIRECTIONS.LEFT);
            } else if (event.nativeEvent.key === 'ArrowRight' && direction !== DIRECTIONS.LEFT) {
                setDirection(DIRECTIONS.RIGHT);
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [direction]);

    useEffect(() => {
        if (isGameOver) {
            return;
        }

        timer = setInterval(() => {
            moveSnake();
        }, 200);

        return () => clearInterval(timer);
    });

    const getRandomFoodLocation = () => {
        const x = Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE;
        const y = Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE;
        return { x, y };
    };

    const moveSnake = () => {
        const newSnake = snake.map((segment, index) => {
            if (index === 0) {
                return {
                    x: segment.x + direction.x * CELL_SIZE,
                    y: segment.y + direction.y * CELL_SIZE,
                };
            }
            return snake[index - 1];
        });

        const head = newSnake[0];
        if (
            head.x < 0 || head.x >= WIDTH ||
            head.y < 0 || head.y >= HEIGHT ||
            newSnake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)
        ) {
            setIsGameOver(true);
            clearInterval(timer);
            Alert.alert("Game Over", `Score: ${newSnake.length}`);
            return;
        }

        if (head.x === food.x && head.y === food.y) {
            setFood(getRandomFoodLocation());
            newSnake.push({});
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const handleRestart = () => {
        setSnake([
            { x: Math.floor(WIDTH / 2 / CELL_SIZE) * CELL_SIZE, y: Math.floor(HEIGHT / 2 / CELL_SIZE) * CELL_SIZE },
        ]);
        setDirection(DIRECTIONS.RIGHT);
        setFood(getRandomFoodLocation());
        setIsGameOver(false);
    };

    return (
        <View style={styles.snakeGameContainer}>
            <View style={styles.board}>
                {snake.map((segment, index) => (
                    <View key={index} style={{
                        ...styles.snakeSegment,
                        left: segment.x,
                        top: segment.y,
                    }} />
                ))}
                <View style={{
                    ...styles.food,
                    left: food.x,
                    top: food.y,
                }} />
            </View>
            {isGameOver && <Button title="Restart" onPress={handleRestart} />}
        </View>
    );
};

const App = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.gameContainer}>
                <SnakeGame />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    gameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    snakeGameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    board: {
        width: WIDTH,
        height: HEIGHT,
        borderWidth: 2,
        borderColor: '#333',
        overflow: 'hidden',
        position: 'relative',
    },
    snakeSegment: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
});

export default App;