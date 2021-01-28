import cx from 'clsx';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { useStyles } from '../../styles';
import Alert from '../Alert/Alert'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useWideCardMediaStyles } from '@mui-treasury/styles/cardMedia/wide';
import { useFadedShadowStyles } from '@mui-treasury/styles/shadow/faded';
import { usePushingGutterStyles } from '@mui-treasury/styles/gutter/pushing';
import { TextField } from '@material-ui/core';


export default { TextField,
        usePushingGutterStyles,
        useFadedShadowStyles, 
        useWideCardMediaStyles,
        cx,
        Box,
        Card,
        CardMedia,
        CardContent,
        CardActions,
        Button,
        IconButton,
        AttachMoneyIcon,
        EditIcon,
        DeleteIcon,
        Typography,
        Chip,
        useStyles,
        Alert,
        Dialog,
        DialogActions,
        DialogContent,
        DialogContentText,
        DialogTitle }
