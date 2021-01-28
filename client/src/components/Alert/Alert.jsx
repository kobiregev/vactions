import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
const useStyles = makeStyles(() => ({
    alert: {
        background: '#fdecea',
        color: '#611a15',
        display: 'flex',
        marginRight: '3px',
        padding: '6px',
        alignSelf: 'center',
    },
    icon: {
        marginRight: '8px'
    },
}))

export default function Alert({ message }) {
    const styles = useStyles();
    return (

        <div className={styles.alert}>
            <ErrorOutlineIcon className={styles.icon} />
            <span>{message}</span>
        </div>
    )
}
