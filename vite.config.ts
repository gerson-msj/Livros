import { fresh } from "@fresh/plugin-vite"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [fresh()],
    server: {
        watch: {
            ignored: ["**/Livros.db", "**/Livros.db-*", "**/livros.db", "**/livros.db-*"]
        }
    }
})
