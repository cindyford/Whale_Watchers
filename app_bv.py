from flask import Flask, jsonify
import numpy as np
import pandas as pd
from matplotlib import style
style.use('fivethirtyeight')
import matplotlib.pyplot as plt
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
from datetime import datetime
from sqlalchemy import inspect

engine = create_engine("sqlite:///whale_watching.sqlite")

# reflect an existing database into a new model
Auto = automap_base()
# reflect the tables
Auto.prepare(engine, reflect=True)

print(Auto.classes)
insp = inspect(engine)
print(insp.get_table_names())
print(insp.get_columns('whale_table'))

ta = Auto.classes.whale_table

# Create our session (link) from Python to the DB
session = Session(engine)

q = session.query(ta).all()

def js(query):
    q_list = []
    for x in query:
        q_list.append({"id":x.id,
                        "species":x.species,
                        "description":x.description,
                        "latitude":x.latitude,
                        "longitude":x.longitude,
                        "location":x.location,
                        "sighted_at":x.sighted_at,
                        "orca_type":x.orca_type,
                        "orca_pod":x.orca_pod,
                        "date":x.date,
                        "time":x.time,
                        "month":x.month,
                        "year":x.year,
                        "hour":x.hour,
                        "year_month":x.year_month})
    return q_list


# Flask Setup
app = Flask(__name__)

#Define Base Route
@app.route("/")
def welcome():
    return (
        f"Whale Watchers<br/>"

    )

@app.route("/api/v1.0/json")
def precipitation():
    # for x in q:
    #     q_list.append({"id":x.id,
    #                     "species":x.species})

    # return jsonify(q_list)
    return jsonify(js(q))




@app.route("/api/v1.0/json/<yr>/<mo>/<spec>/<type>/<pod>")
def year(yr,mo,spec,type,pod):
    session = Session(engine)
    # All items in query (no all's)
    if (yr != '0' and mo != '0' and spec != '0' and type != '0' and pod != '0'):
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.species==spec).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    # elif if only one item was all
    elif (yr != '0' and mo != '0' and spec != '0' and type != '0'):
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.species==spec).filter(ta.orca_type==type).all()
    elif (yr != '0' and mo != '0' and spec != '0' and pod != '0'):
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.species==spec).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (yr != '0' and mo != '0' and type != '0' and pod != '0'):
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (yr != '0' and spec != '0' and type != '0' and pod != '0'):
        exit = session.query(ta).filter(ta.year==yr).filter(ta.species==spec).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (mo != '0' and spec != '0' and type != '0' and pod != '0'):
        exit = session.query(ta).filter(ta.month==mo).filter(ta.species==spec).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    # elif if only two item's was all
    elif (spec != '0' and type != '0' and pod != '0'): #yr,mo all
        exit = session.query(ta).filter(ta.species==spec).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (mo != '0' and type != '0' and pod != '0'): #yr, spec all
        exit = session.query(ta).filter(ta.month==mo).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (mo != '0' and spec != '0' and pod != '0'): #yr, type all
        exit = session.query(ta).filter(ta.month==mo).filter(ta.species==spec).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (mo != '0' and spec != '0' and type != '0'): #yr, pod all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.species==spec).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()    
    elif (yr != '0' and type != '0' and pod != '0'): #mo, spec all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (yr != '0' and spec != '0' and pod != '0'): #mo, type all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.species==spec).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (yr != '0' and spec != '0' and type != '0'): #mo, pod all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.species==spec).filter(ta.orca_type==type).all()
    elif (yr != '0' and mo != '0' and pod != '0'): #spec, type all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (yr != '0' and mo != '0' and type != '0'): #spec, pod all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.orca_type==type).all()
    elif (yr != '0' and mo != '0' and spec != '0'): #type, pod all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).filter(ta.species==spec).all()
    # elif if only three item's was all
    elif (type != '0' and pod != '0'): #yr, mo, spec all
        exit = session.query(ta).filter(ta.orca_type==type).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (spec != '0' and pod != '0'): #yr, mo, type
        exit = session.query(ta).filter(ta.species==spec).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (spec != '0' and type != '0'): #yr, mo, pod
        exit = session.query(ta).filter(ta.species==spec).filter(ta.orca_type==type).all()
    elif (mo != '0' and pod != '0'): #yr, spec, tyype all
        exit = session.query(ta).filter(ta.month==mo).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (mo != '0' and type != '0'): #yr, spec, pod all
        exit = session.query(ta).filter(ta.month==mo).filter(ta.orca_type==type).all()
    elif (mo != '0' and spec != '0'): #yr, type, pod all
        exit = session.query(ta).filter(ta.month==mo).filter(ta.species==spec).all()
    elif (yr != '0' and pod != '0'): #mo, spec, type all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.orca_pod.like('%'+pod+'%')).all()
    elif (yr != '0' and spec != '0'): #mo, type, pod all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.species==spec).all()
    elif (yr != '0' and mo != '0'): #spec,type,pod all
        exit = session.query(ta).filter(ta.year==yr).filter(ta.month==mo).all()                     
# elif if only four item's was all
    elif (pod != '0'):
        exit = session.query(ta).filter(ta.orca_pod.like('%'+pod+'%')).all()       
    elif (type != '0'):
        exit = session.query(ta).filter(ta.orca_type==type).all()
    elif (spec != '0'):
        exit = session.query(ta).filter(ta.species==spec).all()
    elif (mo != '0'):
        exit = session.query(ta).filter(ta.month==mo).all()
    elif (yr != '0'):
        exit = session.query(ta).filter(ta.year==yr).all()

    else:
        exit = session.query(ta).filter(ta.year==yr).all()
        

    return jsonify(js(exit))



@app.route("/api/v1.0/tobs")
@app.route("/api/v1.0/<st_dt>")
@app.route("/api/v1.0/<st_dt>/<en_dt>")
def test():
    return "test"
        
if __name__ == "__main__":
    app.run(debug=True)

