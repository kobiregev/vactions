import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    root: {
        overflow: 'initial',
        maxWidth: 304,
        backgroundColor: 'transparent',
        margin: 8
    },
    description: {
        minHeight: 160
    },
    title: {
        marginBottom: 0,
    },
    rateValue: {
        fontWeight: 'bold',
        marginTop: 2,
    },
    priceIcon: {
        fontWeight: 'bold',
        marginTop: 2,

    },
    price: {
        fontWeight: 'bold',
        marginTop: 2,
        justifyContent: 'center'
    },
    content: {
        position: 'relative',
        padding: 24,
        margin: '-24% 16px 0',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    favorite: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    locationIcon: {
        marginRight: 4,
        fontSize: 18,
    },
    chip: {
        marginRight: 4
    }
}));