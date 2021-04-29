import { useState } from "react"
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

interface MobileConnectionSettingDialogProps {
    setOpen: (open: boolean) => void,
    isOpen: boolean,
    code: undefined | string,
    refreshCode: undefined | (() => void)
}

export default function MobileConnectionSettingDialog({isOpen, setOpen, code, refreshCode} : MobileConnectionSettingDialogProps) {
    const classes = useStyles()

    const [notifyOpen, setNotifyOpen] = useState(false)
    const [notifyText, setNotifyText] = useState("")
    const notifyHandleOpen = (text: string) => {
        setNotifyText(text)
        setNotifyOpen(true)
    }
    const notifyHandleClose = () => {
        setNotifyOpen(false)
    }

    const link = process.env.REACT_APP_URL + "/mobile?key=" + code

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

    return (
        <Dialog onClose={dialogClose} open={isOpen}>
            <MuiDialogTitle disableTypography>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6"> Connect To Remote Device </Typography>
                    &nbsp;
                    &nbsp;
                    <Link underline="none" onClick={dialogClose}>
                        <Icon> close </Icon>
                    </Link>
                </Box>
            </MuiDialogTitle>
            <MuiDialogContent dividers>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box m={2}>
                        <QRCode size={256} value={link} onDoubleClick={openInNewTab} />
                    </Box>
                    <TextField
                        classes={{root: classes.inputLinkMore}}
                        disabled
                        label="code"
                        placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                        variant="outlined"
                        fullWidth
                        value={code}
                        />
                    <Box m={2} display="inline" textAlign="center">
                        <Button 
                            className={classes.buttonNoCaps} 
                            variant="outlined" 
                            color="primary"
                            onClick={refreshCode}> 
                            <Icon>refresh</Icon> &nbsp; Refresh code
                        </Button>
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
            </MuiDialogContent>
        </Dialog>
    )
}