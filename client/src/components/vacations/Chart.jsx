import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useDispatch, useSelector } from 'react-redux'

export default function Charts() {
    const [vacations, setVacations] = useState([])
    const user = useSelector(state => state.LoginReducer)
    const dispatch = useDispatch()



    useEffect(() => {
        fetchData()

    }, [])

    const fetchData = async () => {
        let res = await fetch('http://localhost:1000/vacations/chart', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            }
        })
        let data = await res.json()
        if (res.status === 200) {
            setVacations(data)
        } else if (data.error && data.errorType === "Token") {
            dispatch({ type: 'LOGOUT' })
        }
    }
    const data = {
        labels: vacations.map(v => v.vacation_destination),
        datasets: [
            {
                label: vacations.map(v => v.vacation_destination),
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: vacations.map(v => v.vacation_followers)
            },

        ],
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0
                    }
                }],

            },
            maintainAspectRatio: false
        }
    }

    return (

        <div className="chart_container">
            {user && user.role === "admin" &&
                <>
                    <h2>Followers Chart</h2>
                    {vacations && vacations.length > 0 ?
                        <div className="chart" >
                            <Bar data={data}
                                options={data.options}
                            /></div> : <h1>There is no followers yet check later for updates..</h1>}</>}
        </div>
    )
}
