

import { Box, Icon, IconButton, Tooltip } from '@material-ui/core'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
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
				<Tooltip title="Use Random Path Generator">
					<IconButton aria-label="test" size="small" disabled={mode === DEVICE_MODE.TEST} onClick={() => goToMode(DEVICE_MODE.TEST)}>
						<Icon>shuffle</Icon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Use Browser Geolocation">
					<IconButton aria-label="gps" size="small" disabled={mode === DEVICE_MODE.GPS} onClick={() => goToMode(DEVICE_MODE.GPS)}>
						<Icon>gps_fixed</Icon>
					</IconButton>
				</Tooltip>
				<Tooltip title="Use Remote Device">
					<IconButton aria-label="mobile" size="small" disabled={mode === DEVICE_MODE.MOBILE} onClick={() => goToMode(DEVICE_MODE.MOBILE)}>
						<Icon>smartphone</Icon>
					</IconButton>
				</Tooltip>
            </Box>
            <Box>
				<Tooltip title="Guides">
					<Link to="/guide">
						<IconButton aria-label="help" size="small">
							<Icon>help</Icon>
						</IconButton>
					</Link>
				</Tooltip>
				<Tooltip title="Connect To Remote Device">
					<IconButton aria-label="gps" size="small" onClick={openMobileConnect}>
						<Icon>podcasts</Icon>
					</IconButton>
				</Tooltip>
            </Box>
        </Box>
    )
}