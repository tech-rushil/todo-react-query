"use client";

import styles from "./page.module.css";
import Todo from "./components/Todo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <p>
                    <code className={styles.code}>src/app/page.js</code>
                </p>
            </div>

            <div className={styles.grid}>
                <QueryClientProvider client={queryClient}>
                    <Todo />
                </QueryClientProvider>
            </div>
        </main>
    );
}
