from pprint import pprint

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from db import DB

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

db = DB()

@app.get("/times")
def get_times():
    return db.all_countries_and_times()

@app.get("/countries_data")
def get_countries():
    print("Fetching countries data...")
    country_data = db.countries_allowed_capitals()
    country_times = db.all_countries_and_times()
    return {
        "countries": country_data,
        "times": country_times
    }

@app.post("/update_time/{country}")
def update_time(country: str, time: float):
    db.update_country_time(country, time)
    return {"status": "ok"}



if __name__ == "__main__":

    db = DB()

    # inspect db table and column names
    print("=== DATABASE TABLES ===")
    pprint(db.cur.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall())
    
    print("\n=== TABLE SCHEMAS ===")
    for table_name in [r[0] for r in db.cur.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()]:
        print(f"\nTable: {table_name}")
        pprint(db.cur.execute(f"PRAGMA table_info({table_name});").fetchall())