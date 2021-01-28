import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '../Alert/Alert'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

export default function AddVacation() {
    const user = useSelector(state => state.LoginReducer)
    const dispatch = useDispatch()
    const [errorMsg,setErrorMsg] = useState('')
    const [vacation_description, setVacation_description] = useState('')
    const [vacation_destination, setVacation_destination] = useState('')
    const [vacation_image, setVacation_image] = useState('')
    const [vacation_fromDate, setVacation_fromDate] = useState('')
    const [vaction_toDate, setVaction_toDate] = useState('')
    const [vacation_price, setVacation_price] = useState('')
    let history = useHistory();
    const handleAdd = async e => {
        e.preventDefault()
        try {
            let res = await fetch('http://localhost:1000/vacations/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                },
                body: JSON.stringify({ vacation_description, vacation_destination, vacation_image, vacation_fromDate, vaction_toDate, vacation_price })
            })
            let data = await res.json()
            if (res.status === 200) {
                history.push('/')
            } else if (res.status === 400) {
                setErrorMsg(data.msg)
            } else if (data.error && data.errorType === "Token") {
                dispatch({ type: "LOGOUT" })
            }
        } catch (error) {

        }
    }

    return (
        <div className="register_container">
            {user.login && user.role === 'admin' ? <>
                <Typography variant="h2">Add Vacation</Typography>
                <Paper >
                {errorMsg && <Alert message={errorMsg} />}
                    <form className="register" onSubmit={handleAdd}>
                        <TextField onChange={e => { setVacation_destination(e.target.value) }} label="vacation destination" />
                        <TextField onChange={e => { setVacation_description(e.target.value) }} label="vacation description" />
                        <TextField onChange={e => { setVacation_image(e.target.value) }} label="Image Url" />
                        <TextField onChange={e => { setVacation_fromDate(e.target.value) }} type="date" helperText="From date" />
                        <TextField onChange={e => { setVaction_toDate(e.target.value) }} type="date" helperText="To date" />
                        <TextField onChange={e => { setVacation_price(e.target.value) }} type="number" helperText="Price" />
                        <Button variant="contained" color="primary" onClick={handleAdd}>Add</Button>
                    </form>
                </Paper>
            </> : history.push('/')}
        </div>
    )
}


