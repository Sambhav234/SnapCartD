import { Connection } from "mongoose"


declare global{
    var mongoose:{
        conn:Connection | null
        promise:Promise<Connection> | null
    }
}

export {};


// You're telling TypeScript that a global object named mongoose exists

// It stores either a real DB connection or a connection promise

// It's used to reuse MongoDB connection, especially in Next.js dev mode

// It prevents multiple connections during hot reloads

// Connection | null means it may or may not exist yet

// Promise<Connection> | null means connection might be loading

// export {} just makes the file a module