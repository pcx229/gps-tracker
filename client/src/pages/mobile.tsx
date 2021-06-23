import { useEffect, useState } from "react"
import { MobileSocket } from "../services/SocketGeolocation"
import queryString from 'query-string'
import Icon from '@material-ui/core/Icon'
import Alert from '@material-ui/lab/Alert'
import LinkUI from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { createStyles, makeStyles } from "@material-ui/styles"
import { IconButton, Theme, Tooltip } from "@material-ui/core"
import Position from "../models/Position"
import { Link, useHistory } from "react-router-dom"
import Globe from "../components/Globe"
import { ConnectionStatus, selectWatchedPosition, startWatchingPosition, stopWatchingPosition } from "../state/WatchPositionSlice"
import { useAppDispatch, useAppSelector } from "../state/hooks"
import services, { GeolocationTypes } from "../services"

const useStyles =  makeStyles((theme: Theme) => createStyles({
    retryButton: {
        margin: "0px 10px"
    },
    buttonNoCaps: {
        textTransform: "none"
    }
  }),
)

export default function Mobile() {

    const history = useHistory()

    const classes = useStyles()

    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [updatePositionCallback, setUpdatePositionCallback] = useState<undefined | ((position: Position) => void)>(undefined)
    
    const [keyInput, setKeyInput] = useState("")
    
    const [askForGpsAccess, setAskForGpsAccess] = useState(0)
    const [currentPosition, status] = useAppSelector(selectWatchedPosition)
    const dispatch = useAppDispatch()

    // room key from query string
    const key = queryString.parse(window.location.search).key as string

    useEffect(() => {
        if(status === ConnectionStatus.active) {
            const socket = MobileSocket()
            // listeners
            const error = (error: string | Error) => {
                if(error instanceof Error) 
                    error = "Error: could not connect to server"
                setError(error as string)
                setIsConnecting(false)
                setUpdatePositionCallback(undefined)
                socket.Disconnect()
            }
            socket.OnErrorListener(error)
            const connected = () => {
                setError(undefined)
                setIsConnecting(false)
                setUpdatePositionCallback(() => socket.UpdatePosition)
            }
            socket.OnConnectedListener(connected)
            // connect to room
            if(key) {
                setIsConnecting(true)
                socket.Join(key)
            }
            // remove listeners
            return () => {
                socket.RemoveOnErrorListener(error)
                socket.RemoveOnConnectedListener(connected)
                socket.Disconnect()
            }
        }
    }, [status, key])

    useEffect(() => {
        services.config(GeolocationTypes.GPS)
    }, [])

    useEffect(() => {
        if(key) {
            dispatch<any>(startWatchingPosition())
            return () => {
                dispatch<any>(stopWatchingPosition())
            }
        }
    }, [dispatch, askForGpsAccess, key])

    useEffect(() => {
        if(currentPosition && updatePositionCallback) {
            updatePositionCallback(currentPosition)
        }
    }, [currentPosition, updatePositionCallback])

    const goToKey = () => {
        history.push({search: "key=" + keyInput})
        history.go(0)
    }

    if(!key) {
        return (
            <Container maxWidth="md"> 
                <Box display="flex" flexDirection="column">
					<Box py={3} display="flex" flexDirection="row">
						<Tooltip title="go home">
							<Link to="/">
								<IconButton aria-label="location" size="medium">
									<Icon>arrow_back</Icon>
								</IconButton>
							</Link>
						</Tooltip>
						<Typography variant="h4">
							&nbsp; <Icon color="error">link</Icon> &nbsp; Connect to recorder
						</Typography>
					</Box>
                    <Box p={1} py={2}>
                        <Typography variant="body2">
                            the recorder will use the GPS sensor on this device to obtain your exact location and to track your movements 
                        </Typography>
                    </Box>
                    <TextField
                        label="write your code here"
                        variant="filled"
                        placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                        fullWidth
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        />
                    <Box py={2} display="flex" justifyContent="center">
                        <Button className={classes.buttonNoCaps} variant="contained" color="primary" onClick={goToKey}>
                            Enter &nbsp; <Icon>arrow_forward</Icon>
                        </Button>
                    </Box>
                </Box>
            </Container>
        )
    }

    const onRequestGpsAccess = () => {
        setAskForGpsAccess(askForGpsAccess+1)
    }

    let message = undefined

    if(status === ConnectionStatus.asking_permisision) {
        message = <Alert icon={<Icon>login</Icon>} severity="info">Requesting GPS access permisision</Alert>
    }

    else if(status !== ConnectionStatus.active) {
        message = (
            <Alert severity="error">
                GPS access permisision denied
                <LinkUI href="#" className={classes.retryButton} onClick={onRequestGpsAccess}>
                    RETRY
                </LinkUI>
            </Alert>
        )
    }

    else if(error) {
        message = <Alert severity="error">{error}</Alert>
    }

    else if(isConnecting) {
        message = <Alert icon={<Icon>hourglass_top</Icon>} severity="warning">Connecting...</Alert>
    }

    else {
        message = <Alert icon={<Icon>sensors</Icon>} severity="success">Reporting position</Alert>
    }

    return (
        <Container maxWidth="md">
            {message}
            <Box m={2} display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="75vh">
                <Globe />
            </Box>
        </Container>
    )
}