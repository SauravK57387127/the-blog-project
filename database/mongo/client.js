import mongoose from 'mongoose';

let connection = null;

export function getMongoConnection() {
    return connection;
}

export { mongoose };
