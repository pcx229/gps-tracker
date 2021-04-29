import { useState, useEffect } from "react"
import QRCode from "qrcode.react"
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import { createStyles, makeStyles } from "@material-ui/styles"
import { Theme } from "@material-ui/core"
import copy from 'copy-to-clipboard'
import Snackbar from '@material-ui/core/Snackbar'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Record from "../models/Record"
import LinearProgress from '@material-ui/core/LinearProgress'
import Alert from '@material-ui/lab/Alert'
import ShareTrackingAPI from '../services/ShareTrackingAPI'

const useStyles =  makeStyles((theme: Theme) => createStyles({
    buttonNoCaps: {
        textTransform: "none",
        margin: "5px"
    },
    inputLinkMore: {
        '& input': {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        }
    }
  }),
)

interface ShareTrackingLinkDialogProps {
    setOpen: (open: boolean) => void,
    isOpen: boolean,
    record: Record | undefined
}

export default function  ShareTrackingLinkDialog({isOpen, setOpen, record} :  ShareTrackingLinkDialogProps) {
    const classes = useStyles()

    const [hash, setHash] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<undefined | Error>()

    const [notifyOpen, setNotifyOpen] = useState(false)
    const [notifyText, setNotifyText] = useState("")
    const notifyHandleOpen = (text: string) => {
        setNotifyText(text)
        setNotifyOpen(true)
    }
    const notifyHandleClose = () => {
        setNotifyOpen(false)
    }

    useEffect(() => {
        setLoading(true)
        if(record) {
            // upload the record to the cloud and get a link to it
            ShareTrackingAPI.upload(record)
                .then(res => {
                    setLoading(false)
                    setHash(res.data as string)
                })
                .catch(err => {
                    setLoading(false)
                    setError(err)
                })
        }
    }, [record])

    const link = process.env.REACT_APP_URL + "/share/" + hash

    const copyToClipbard = () => {
        copy(link)
        notifyHandleOpen("Link was copyed to clipboard")
    }

    const openInNewTab = () => {
        window.open(link)
    }

    const dialogClose = () => {
        setOpen(false)
    }

    let content = null

    if(loading) {
        content = (
            <Box m={3}>
                <Typography align="center">Uploading Tracking...</Typography>
                <LinearProgress />
            </Box>
        )
    }

    if(error) {
        console.log(error)
        content = <Alert severity="error">An error has occure when trying to upload</Alert>
    }

    if(!loading && !error) {
        content = (
            <>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box m={2}>
                        <QRCode size={256} value={link} onDoubleClick={openInNewTab} />
                    </Box>
                    <TextField
                        classes={{root: classes.inputLinkMore}}
                        disabled
                        label="link"
                        placeholder=""
                        variant="outlined"
                        fullWidth
                        value={link}
                        />
                    <Box m={2} display="inline" textAlign="center">
                        <Button 
                            className={classes.buttonNoCaps} 
                            variant="contained" 
                            color="primary"
                            onClick={copyToClipbard}> 
                            <Icon>content_copy</Icon> &nbsp; Copy to clipboard
                        </Button>
                    </Box>
                </Box>
                <Snackbar
                    open={notifyOpen}
                    onClose={notifyHandleClose}
                    message={
                        <Box display="flex" alignItems="center" > 
                            <Icon> info </Icon> &nbsp; {notifyText}
                        </Box>
                    }
                    autoHideDuration={4000}
                />
            </>
        )
    }

    return (
        <Dialog onClose={dialogClose} open={isOpen}>
            <MuiDialogTitle disableTypography>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"> Share Tracking With Others </Typography>
                    &nbsp;
                    &nbsp;
                    <Link underline="none" onClick={dialogClose}>
                        <Icon> close </Icon>
                    </Link>
                </Box>
            </MuiDialogTitle>
            <MuiDialogContent dividers>
                { content }
            </MuiDialogContent>
        </Dialog>
    )
}