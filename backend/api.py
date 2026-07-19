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

@app.get("/countries")
def get_countries():
    country_data = db.countries_allowed_capitals()
    #return country_data

    # below is only for testing
    keys = list(country_data.keys())
    random.shuffle(keys)
    country_data = {k: country_data[k] for k in keys}
    
    return dict(list(country_data.items())[:10])