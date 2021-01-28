import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import DiffrentCard from './DiffrentCard'
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '../Alert/Alert'
const useStyles = makeStyles(() => ({
    buttons: {
        marginLeft: '8px',
        marginBlockStart: '18px'
    },
    search: {
        marginRight: '4px'
    }
}))


export default function VactionList() {
    const Vacations = useSelector(state => state.VacationsReducer)
    const [keywords, setKeywords] = useState("")
    const [date, setdate] = useState("")
    const [toDate, setToDate] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const user = useSelector(state => state.LoginReducer)

    const dispatch = useDispatch()
    const styles = useStyles();


    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            let res = await fetch('http://localhost:1000/vacations', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user.token
                }
            })
            let data = await res.json()
            if (data.error && data.errorType === "Token") {
                dispatch({ type: "LOGOUT" })
            } else if (res.status === 200) {
                dispatch({ type: 'SETVACATIONS', payload: data })
                setKeywords("")
                setdate("")
                setToDate("")
                setErrorMsg("")
            }
        } catch (error) {

        }
    }
    const handleSearch = async () => {
        let res = await fetch(`http://localhost:1000/vacations/search`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            },
            body: JSON.stringify({ keywords, date, toDate })
        })
        let data = await res.json()
        if (data.length > 0 && !data.error) {
            dispatch({ type: 'SETVACATIONS', payload: data })
            setErrorMsg("")
        } else if (data.error && data.errorType === "Token") {
            dispatch({ type: "LOGOUT" })
        } else if (!data.error) {
            setErrorMsg("couldn't find any results")
        } else {
            setErrorMsg(data.msg)
        }
    }
    return (
        <div className="vacation_list">
            <div className="search_container">
                <div className="search_form" >
                    <TextField className={styles.search} id="outlined-basic" label="Search" value={keywords} onChange={e => { setKeywords(e.target.value) }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField onChange={e => { setdate(e.target.value) }} label="From date" type="date" value={date} InputLabelProps={{
                        shrink: true,
                    }}
                    />
                    <TextField onChange={e => { setToDate(e.target.value) }}
                        label="To date"
                        type="date"
                        value={toDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button className={styles.buttons} variant="contained" color="primary" size="small" onClick={() => { handleSearch() }}>
                        search
                     </Button>
                    <Button className={styles.buttons} variant="contained" color="primary" size="small" onClick={() => { fetchData() }}>
                        Clear
                     </Button>
                </div>
                {errorMsg && <Alert className='error' message={errorMsg} />}
            </div>
            <Divider />
            <div className="vacation_container">
                {Vacations.length > 0 && Vacations.map(Vacation => <DiffrentCard className="Card" key={Vacation.vacation_id} vacation={Vacation} />)}
            </div>
        </div>
    )
}
