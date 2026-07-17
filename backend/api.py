from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import sqlite3


DB_NAME = 'data.db'

class DB:
    def __init__(self):
        self.conn = sqlite3.connect(DB_NAME, check_same_thread=False
                                    )
        self.cur = self.conn.cursor()

    def disconnect(self):
        self.conn.close()

    def capital_from_country(self, country):
        sql = ''' SELECT display_capital FROM data WHERE country=? '''
        self.cur.execute(sql, (country,))
        return self.cur.fetchall()[0][0]

    def countries(self):
        sql = ''' SELECT country FROM data ORDER BY country '''
        self.cur.execute(sql)
        return [r[0] for r in self.cur.fetchall()]

    def countries_capitals(self):
        sql = ''' SELECT country, display_capital FROM data ORDER BY country '''
        self.cur.execute(sql)
        return {country: display_capital for (country, display_capital) in self.cur.fetchall()}

    def allowed_capitals_from_country(self, country):
        display_capital = self.capital_from_country(country)
        capitals = [display_capital]
        sql = ''' SELECT c.capital FROM allowed_capitals c 
        JOIN data d on d.id=c.country_id WHERE d.country=? '''
        self.cur.execute(sql, (country,))
        capitals.extend([r[0] for r in self.cur.fetchall()])
        return capitals

    def all_countries_and_times(self):
        sql = ''' SELECT country, time FROM data '''
        self.cur.execute(sql)
        return {country: time for (country, time) in self.cur.fetchall()}

    def get_country_time(self, country):
        sql = ''' SELECT time FROM data where country=? '''
        self.cur.execute(sql, (country,))
        return self.cur.fetchall()[0][0]

    def update_country_time(self, country, new_time):
        sql = ''' UPDATE data SET time=? WHERE country=? '''
        self.cur.execute(sql, (new_time, country))

    def countries_allowed_capitals(self):
        sql = """
            SELECT
                d.country,
                d.display_capital,
                c.capital
            FROM data d
            LEFT JOIN allowed_capitals c
                ON d.id = c.country_id
            ORDER BY d.country, c.capital
        """

        self.cur.execute(sql)

        countries = {}

        for country, display_capital, allowed_capital in self.cur.fetchall():
            if country not in countries:
                countries[country] = {
                    "display_capital": display_capital,
                    "allowed_capitals": [display_capital]
                }

            if (
                allowed_capital is not None
                and allowed_capital not in countries[country]["allowed_capitals"]
            ):
                countries[country]["allowed_capitals"].append(allowed_capital)

        return countries

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
    return country_data



if __name__ == '__main__':
    db = DB()
    r = db.countries_allowed_capitals()
    print(r['United States of America'])
