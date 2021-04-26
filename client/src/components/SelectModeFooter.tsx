

import { Box, Icon, IconButton } from '@material-ui/core'
import { useHistory } from 'react-router'
import DEVICE_MODE from '../utill/DeviceMode'

interface SelectModeFooterProps {
    mode: DEVICE_MODE
}

export default function SelectModeFooter({mode} : SelectModeFooterProps) {

    const history = useHistory()

    const goToMode = (mode: string) => {
      history.push({search: "mode=" + mode})
      history.go(0)
    }
  
    const openMobileConnect = () => {
      window.open(process.env.REACT_APP_URL + "/mobile")
    }

    return (
        <Box m={2} display="flex" flexDirection="row" justifyContent="space-between" width="95%">
            <Box>
                Mode &nbsp;
                <IconButton aria-label="test" size="small" disabled={mode === DEVICE_MODE.TEST} onClick={() => goToMode(DEVICE_MODE.TEST)}>
                <Icon>shuffle</Icon>
                </IconButton>
                <IconButton aria-label="gps" size="small" disabled={mode === DEVICE_MODE.GPS} onClick={() => goToMode(DEVICE_MODE.GPS)}>
                <Icon>gps_fixed</Icon>
                </IconButton>
                <IconButton aria-label="gps" size="small" disabled={mode === DEVICE_MODE.MOBILE} onClick={() => goToMode(DEVICE_MODE.MOBILE)}>
                <Icon>smartphone</Icon>
                </IconButton>
            </Box>
            <Box>
                <IconButton aria-label="gps" size="small" onClick={openMobileConnect}>
                <Icon>podcasts</Icon>
                </IconButton>
            </Box>
        </Box>
    )
}