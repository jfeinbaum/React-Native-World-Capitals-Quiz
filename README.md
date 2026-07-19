This is a quiz that fills in a map of the world as the player guesses the capital cities.

Frontend is React Native in Typescript.
Backend is FastAPI with a SQLite database.

---
Initial setup:

1. Clone project into a terminal and `cd backend`
2. `chmod +x setup.sh` and then `./setup.sh` to setup the backend environment and database.
3. Return to the project root with `cd ..`
4. Modify the `API_URL` in `App.tsx` with your local IP.
5. Run with `npm run dev` -- concurrently starts FastAPI with uvicorn and Expo app with npx.

---


Based on the original [PyQt version.](https://github.com/jfeinbaum/PyQtWorldCapitalsQuiz)

![](assets/screenshot.png)

![](assets/screenshot2.jpeg)

