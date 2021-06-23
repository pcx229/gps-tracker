import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Divider, Grid, Icon, IconButton, Tooltip, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Guide() {

	return (
		<Container maxWidth="md">
			<Box my={5}>
				<Box my={5} display="flex" flexDirection="row">
					<Tooltip title="go home">
						<Link to="/mobile">
							<IconButton aria-label="location" size="medium">
								<Icon>arrow_back</Icon>
							</IconButton>
						</Link>
					</Tooltip>
					<Typography variant="h3">&nbsp; &nbsp; Guides</Typography>
				</Box>
				<Accordion>
					<AccordionSummary expandIcon={<Icon> expand_more </Icon>} >
						<Typography>Viewing my location</Typography>
					</AccordionSummary>
        			<Divider />
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									Press the location button &nbsp; <Icon>gps_fixed</Icon> &nbsp; then grant Geolocation access permission to the site if requested. 
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/view-location.gif"} alt="view location" />
							</Grid>
						</Grid>
						<br />
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<Icon> expand_more </Icon>} >
						<Typography>Recording a path</Typography>
					</AccordionSummary>
        			<Divider />
					<AccordionDetails> 
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									Press the record button &nbsp; <Icon>play_circle</Icon> &nbsp;, then grant Geolocation access permission to the site if requested. 
									<br />
									to end the recording press the stop button  &nbsp; <Icon>stop</Icon> &nbsp;, if you like to keep it choose your activity and press the save button &nbsp; <Icon>done</Icon> &nbsp; then a new recording will be added o your list.
									<br />
									to view your recording later, select your recording from the list.
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/record-path.gif"} alt="view location" />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<Icon> expand_more </Icon>} >
						<Typography>Sharing Recorded path</Typography>
					</AccordionSummary>
        			<Divider />
					<AccordionDetails>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									Choose the recording you wish to share.
									<br />
									press the share button &nbsp; <Icon>share</Icon> &nbsp;, then wait until the recording will be uploaded to the server. 
									<br />
									send the link or the barcode to a friend.
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/share-path.gif"} alt="view location" />
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									The link will navigate you to a view of your recorded path.
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/share-path-link.gif"} alt="view location" />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<Icon> expand_more </Icon>} >
						<Typography>Connecting to a remote Geolocation Device</Typography>
					</AccordionSummary>
        			<Divider />
					<AccordionDetails> 
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									in the <b>Recorder</b> go to use mobile location mode by pressing the mobile button &nbsp; <Icon>smartphone</Icon> &nbsp; at the bottom of the page.
									<br />
									press the location button &nbsp; <Icon>gps_fixed</Icon> &nbsp; then go to settings by pressing the button &nbsp; <Icon>settings</Icon> &nbsp; and view your connection details.
									<br />
									send the code or the barcode to a the remote device you wish to connect to.
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/remote-connect.gif"} alt="view location" />
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									in the <b>Mobile</b> use the code to connect to the recorder at <Link to="/moblie">/mobile</Link> or use the barcode as a link to the site.
									<br />
									when entering the site you will be requested to grant Geolocation access permission and after that you will be connected automatically to the Recorder.
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/remote-connect-mobile-view.gif"} alt="view location" />
							</Grid>
							<Grid item xs={12}>
								<Typography variant="body1"> 
									in the <b>Recorder</b> now you can see the mobile location.
								</Typography>
							</Grid>
							<Grid item xs={12} container direction="row" justify="center" alignItems="center">
								<img src={process.env.PUBLIC_URL + "/guides/remote-connect-recorder-view.gif"} alt="view location" />
							</Grid>
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Box>
		</Container>
	)
}