import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import * as Mui from '@material-ui/core'
import { useWideCardMediaStyles } from '@mui-treasury/styles/cardMedia/wide';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import { useStyles } from '../../styles';
import IconButton from '@material-ui/core/IconButton';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Alert from '../Alert/Alert'
import moment from 'moment';
import cx from 'clsx';

export default function DiffrentCard({ vacation }) {
    const user = useSelector(state => state.LoginReducer)
    const dispatch = useDispatch()
    const mediaStyles = useWideCardMediaStyles();
    const shadowStyles = useFadedShadowStyles();
    const gutterStyles = usePushingGutterStyles({ firstExcluded: true });
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false)
    const [vacation_description, setVacation_description] = useState(vacation.vacation_description)
    const [vacation_destination, setVacation_destination] = useState(vacation.vacation_destination)
    const [vacation_image, setVacation_image] = useState(vacation.vacation_image)
    const [vacation_fromDate, setVacation_fromDate] = useState(moment(vacation.vacation_fromDate).format('YYYY-MM-DD'))
    const [vaction_toDate, setVaction_toDate] = useState(moment(vacation.vaction_toDate).format('YYYY-MM-DD'))
    const [vacation_price, setVacation_price] = useState(vacation.vacation_price)
    const [errorMsg, setErrorMsg] = useState("")

    const styles = useStyles();

    const handleFollow = async () => {
        let res = await fetch(`http://localhost:1000/vacations/follow/${vacation.vacation_id}`, {
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
        }
    }

    const handleDelete = async () => {
        let res = await fetch('http://localhost:1000/vacations/delete', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            },
            body: JSON.stringify({ vacation_id: vacation.vacation_id })
        })
        let data = await res.json()
        if (res.status === 200) {
            handleClose()
            dispatch({ type: 'SETVACATIONS', payload: data })
        } else if (data.error && data.errorType === "Token") {
            dispatch({ type: "LOGOUT" })
        }
    }
    const handleEdit = async () => {
        let res = await fetch('http://localhost:1000/vacations/update/' + vacation.vacation_id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user.token
            },
            body: JSON.stringify({ vacation_description, vacation_destination, vacation_image, vacation_fromDate, vaction_toDate, vacation_price })
        })
        let data = await res.json()
        if (res.status === 200) {
            dispatch({ type: 'SETVACATIONS', payload: data })
            handleEditClose()
        } else if (data.error && data.errorType === "Token") {
            dispatch({ type: "LOGOUT" })
        } else if (data.msg) {
            setErrorMsg(data.msg)
        }
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleEditOpen = () => {
        setErrorMsg("")
        setOpenEdit(true)
    }
    const handleEditClose = () => {
        setOpenEdit(false)
    }
    return (
        <>
            {vacation ? <>
                <div >
                    <Mui.Card elevation={0} className={styles.root}>
                        <Mui.CardMedia
                            classes={mediaStyles}
                            image={vacation.vacation_image}
                            title={vacation.vacation_destination}>
                        </Mui.CardMedia>
                        <Mui.CardContent className={cx(shadowStyles.root, styles.content)}>
                            <h3 className={styles.title}>{vacation.vacation_destination}</h3>
                            <Mui.Box className={styles.priceIcon} display={'flex'} alignItems={'center'} mb={1}>
                                <AttachMoneyIcon />
                                <span className={styles.price}>{vacation.vacation_price}</span>
                            </Mui.Box>
                            <Mui.Box display={'flex'} alignItems={'center'} mb={1} className={gutterStyles.parent}>
                                <Mui.Typography variant={'body2'} className={styles.rateValue}>
                                    From: {moment(vacation.vacation_fromDate).format('YYYY-MM-DD')}
                                </Mui.Typography>
                            </Mui.Box>
                            <Mui.Box display={'flex'} alignItems={'center'} mb={1} className={gutterStyles.parent}>
                                <Mui.Typography variant={'body2'} className={styles.rateValue}>
                                    To: {moment(vacation.vaction_toDate).format('YYYY-MM-DD')}
                                </Mui.Typography>
                            </Mui.Box>
                            <Mui.Typography className={styles.description} color={'textSecondary'} variant={'body2'}>
                                {vacation.vacation_description}
                            </Mui.Typography>
                            <Mui.CardActions>
                                <Mui.Chip label={`Followers ${vacation.vacation_followers}`} />
                                {user.role == "user" && <Mui.Button size="small" color="primary" onClick={() => handleFollow()}>
                                    {vacation.isfollowed ? "unfollow" : "follow"}
                                </Mui.Button>}
                                {user.role == 'admin' && <><IconButton aria-label="delete" onClick={() => handleClickOpen()}>
                                    <DeleteIcon />
                                </IconButton>
                                    <IconButton aria-label="Edit" onClick={handleEditOpen}>
                                        <EditIcon />
                                    </IconButton>
                                </>}
                            </Mui.CardActions>
                        </Mui.CardContent>
                        <Mui.Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <Mui.DialogTitle id="alert-dialog-title">{`Are you sure you want to delete this Vacation??`}</Mui.DialogTitle>
                            <Mui.DialogContent>
                                <Mui.DialogContentText id="alert-dialog-description">Deleting this vacation will permantly remove it from the database..</Mui.DialogContentText>
                            </Mui.DialogContent>
                            <Mui.DialogActions>
                                <Mui.Button onClick={handleClose} color="primary">Cancel</Mui.Button>
                                <Mui.Button onClick={handleDelete} color="primary" autoFocus>Delete</Mui.Button>
                            </Mui.DialogActions>
                        </Mui.Dialog>
                        <Mui.Dialog open={openEdit} onClose={handleEditClose} aria-labelledby="form-dialog-title">
                            <Mui.DialogTitle id="form-dialog-title">Edit Vacation</Mui.DialogTitle>
                            <Mui.DialogContent>
                                {errorMsg && <Alert message={errorMsg} />}
                                <Mui.DialogContentText>Saving will permantly change this vacation..</Mui.DialogContentText>
                                <Mui.TextField autoFocus margin="dense" id="Destanation" label="Destanation" type="text" fullWidth
                                    defaultValue={vacation.vacation_destination}
                                    onChange={e => { setVacation_destination(e.target.value) }}
                                />
                                <Mui.TextField autoFocus margin="dense" label="Price" type="number" fullWidth defaultValue={vacation.vacation_price}
                                    onChange={e => { setVacation_price(e.target.value) }}
                                />
                                <Mui.TextField autoFocus margin="dense" helperText="from date" type="date" fullWidth defaultValue={moment(vacation.vacation_fromDate).format('YYYY-MM-DD')}
                                    onChange={e => { setVacation_fromDate(e.target.value) }}
                                />
                                <Mui.TextField autoFocus margin="dense" helperText="to date" type="date" fullWidth defaultValue={moment(vacation.vaction_toDate).format('YYYY-MM-DD')}
                                    onChange={e => { setVaction_toDate(e.target.value) }}
                                />
                                <Mui.TextField autoFocus margin="dense" label="Image Url" type="url" fullWidth defaultValue={vacation.vacation_image}
                                    onChange={e => { setVacation_image(e.target.value) }}
                                />
                                <Mui.TextField autoFocus margin="dense" label="description (maximum 255 letters)" type="text" fullWidth defaultValue={vacation.vacation_description}
                                    onChange={e => { setVacation_description(e.target.value) }}
                                    inputProps={{
                                        maxLength: 255
                                    }}
                                />
                            </Mui.DialogContent>
                            <Mui.DialogActions>
                                <Mui.Button onClick={handleEditClose} color="primary">Cancel</Mui.Button>
                                <Mui.Button onClick={handleEdit} color="primary">Save</Mui.Button>
                            </Mui.DialogActions>
                        </Mui.Dialog>
                    </Mui.Card>
                </div> </> : null} </>
    )
}
