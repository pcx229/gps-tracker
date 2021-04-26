
import DEVICE_MODE from '../utill/DeviceMode'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'
import { useEffect, useState } from 'react'
import MobileConnectionSettingDialog from '../components/MobileConnectionSettingDialog'
import { useAppSelector } from '../state/hooks'
import { ConnectionStatus, selectWatchedPosition, selectWatcherId } from '../state/WatchPositionSlice'
import services from "../services"
import SocketGeolocation, { StatusMessageItemType } from '../services/SocketGeolocation'

interface PositionDeviceStatusProps {
    mode: DEVICE_MODE
}

export default function PositionDeviceStatus({mode} : PositionDeviceStatusProps)  {

    const [mobileConnectionSettingDialogOpen, setMobileConnectionSettingDialogOpen] = useState<boolean>(false)
    const [mobileCode, setMobileCode] = useState<undefined | string>()
    const [refreshCode, setRefreshCode] = useState<undefined | (() => void)>()
    const [mobileConnectionStatus, setMobileConnectionStatus] = useState<undefined | string>()

    const [, watchingStatus] = useAppSelector(selectWatchedPosition)
    const watcherId = useAppSelector(selectWatcherId)

    useEffect(() => {
        if((watchingStatus === ConnectionStatus.active || watchingStatus === ConnectionStatus.asking_permisision) && mode === DEVICE_MODE.MOBILE) {
            const device : SocketGeolocation = services.geolocation as SocketGeolocation
            const statusChanges = ({type, message} : StatusMessageItemType) => {
                switch(type) {
                    case "code":
                        setMobileCode(message)
                        break

                    case "connection":
                        setMobileConnectionStatus(message)
                        break
                }
            }
            device.watchStatus(watcherId, statusChanges)
            setRefreshCode(() => device.watchOperations(watcherId).join)
        }
    }, [watchingStatus, mode, watcherId])

    let message = undefined

    switch(mode) {
        case DEVICE_MODE.GPS:
            switch(watchingStatus) {
                case ConnectionStatus.asking_permisision:
                    message = <Alert icon={<Icon>login</Icon>} severity="info">Requesting GPS access permisision</Alert>
                    break

                case ConnectionStatus.unavilable: 
                case ConnectionStatus.permisision_rejected: 
                case ConnectionStatus.timeout:
                    message = <Alert icon={<Icon>error</Icon>} severity="error">Error: unable to obtain access to device duo to connection or server issue</Alert>
                    break

                case ConnectionStatus.active:
                    message = <Alert icon={<Icon>sensors</Icon>} severity="success"> Connected </Alert>
                    break
            }
            break

        case DEVICE_MODE.TEST:
            message = <Alert icon={<Icon>sensors</Icon>} severity="success"> Connected </Alert>
            break

        case DEVICE_MODE.MOBILE:
            const mobile_connection_settings = (
                <IconButton color="inherit" size="small" onClick={() => setMobileConnectionSettingDialogOpen(true)}>
                    <Icon> settings</Icon>
                </IconButton>
            )
            switch(watchingStatus) {
                case ConnectionStatus.unavilable: 
                case ConnectionStatus.permisision_rejected: 
                case ConnectionStatus.timeout:
                    message = <Alert icon={<Icon>error</Icon>} severity="error">Error: unable to obtain access to device</Alert>
                    break

                case ConnectionStatus.asking_permisision:
                case ConnectionStatus.active:
                    switch(mobileConnectionStatus) {
                        case "mobile is connected":
                            message = <>
                                <Alert
                                    icon={<Icon>sensors</Icon>} 
                                    action={mobile_connection_settings} 
                                    severity="success">
                                    Connected
                                </Alert>
                                <MobileConnectionSettingDialog isOpen={mobileConnectionSettingDialogOpen} setOpen={setMobileConnectionSettingDialogOpen} code={mobileCode} refreshCode={refreshCode} />
                            </>
                            break

                        case "mobile not connected":
                            message = <>
                                <Alert 
                                    icon={<Icon>hourglass_top</Icon>} 
                                    action={mobile_connection_settings} 
                                    severity="warning">
                                    Waiting for connection...
                                </Alert>
                                <MobileConnectionSettingDialog isOpen={mobileConnectionSettingDialogOpen} setOpen={setMobileConnectionSettingDialogOpen} code={mobileCode} refreshCode={refreshCode} />
                            </>
                            break
                    }
                    break
            }
            break
    }

    return <> { message } </>

}