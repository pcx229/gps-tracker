

import { Box, Icon, IconButton, Tooltip } from '@material-ui/core'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import DEVICE_MODE from '../util/DeviceMode'

interface SelectModeFooterProps {
    mode: DEVICE_MODE
}

export default function SelectModeFooter({mode} : SelectModeFooterProps) {

    const history = useHistory()

    const goToMode = (mode: string) => {
      history.push({search: "mode=" + mode})
      history.go(0)
    }

    return (
        <Box m={2} display="flex" flexDirection="row" justifyContent="space-between" width="95%">
            <Box>
                Mode &nbsp;
				<Tooltip title="Use Random Path Generator">
					<span>
						<IconButton aria-label="test" size="small" disabled={mode === DEVICE_MODE.TEST} onClick={() => goToMode(DEVICE_MODE.TEST)}>
							<Icon>shuffle</Icon>
						</IconButton>
					</span>
				</Tooltip>
				<Tooltip title="Use Browser Geolocation">
					<span>
						<IconButton aria-label="gps" size="small" disabled={mode === DEVICE_MODE.GPS} onClick={() => goToMode(DEVICE_MODE.GPS)}>
							<Icon>near_me</Icon>
						</IconButton>
					</span>
				</Tooltip>
				<Tooltip title="Use Remote Device">
					<span>
						<IconButton aria-label="mobile" size="small" disabled={mode === DEVICE_MODE.MOBILE} onClick={() => goToMode(DEVICE_MODE.MOBILE)}>
							<Icon>smartphone</Icon>
						</IconButton>
					</span>
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
					<Link to="/mobile">
						<IconButton aria-label="gps" size="small">
							<Icon>podcasts</Icon>
						</IconButton>
					</Link>
				</Tooltip>
            </Box>
        </Box>
    )
}