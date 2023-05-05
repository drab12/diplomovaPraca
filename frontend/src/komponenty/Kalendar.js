import React, { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import Spojenie from '../spojenie/Spojenie'
import "react-big-calendar/lib/css/react-big-calendar.css"


const locales = {
    "eu": require("date-fns/locale/eu")
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

export default function Kalendar(){
    const [udalosti, setUdalosti] = useState([])

    useEffect(()=>{   
        let udalosti =[]
        Spojenie.getKalendar().then( res =>{
            for(let i=0; i< res.data.length;i++){
                udalosti.push(res.data[i])
                udalosti[i].start = new Date(res.data[i].start)
                udalosti[i].end = new Date(res.data[i].end)
            }
            
            setUdalosti(udalosti);
        });
        
    },[])

    return (
        <div> 
          <Calendar
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            events={udalosti}
            style= {{height: 600}}/>
           
        </div>
    )
}
