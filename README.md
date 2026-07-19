This is a quiz that fills in a map of tje world as the player guesses all of the capital cities.

Frontend is React Native in Typescript built with Expo.
Backend is Python FastAPI with a SQLite database to store country data and spelling variations.

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

