import  {Typography, Icon, List, IconButton, Avatar, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, Container, LinearProgress, Box, Tooltip } from "@material-ui/core"
import { removeFromHistory, selectHistory } from "../state/HistorySlice"
import { useAppDispatch, useAppSelector } from "../state/hooks"
import Alert from '@material-ui/lab/Alert'
import { TimeParserString, getDateName, ParseTime, splitListByDate } from "../util/TimeParser"
import Record from "../models/Record"
import React from "react"
import recordAnalysis from './RecordAnalysis'
import activity_icon from '../util/ActivityIcon'
import jsonexport from "jsonexport/dist"
import { useHistory } from "react-router"
import { download } from "../util/FileDownloader"
import { useState } from "react"
import ShareTrackingLinkDialog from "./ShareTrackingLinkDialog"

export default function HistoryList() {
    
    const {list, loading, operating, error} = useAppSelector(selectHistory)

    const [shareTrackingLinkDialogOpen, setShareTrackingLinkDialogOpen] = useState(false)
    const [shareRecord, setShareRecord] = useState<undefined | Record>()
  
    const dispatch = useAppDispatch()

    const history = useHistory()

    const deleteItem = (record: Record) => {
        dispatch<any>(removeFromHistory(String(record.startTime)))
    }

    const shareItem = (record: Record) => {
        // upload the record to the cloud and show a link to it
        setShareRecord(record)
        setShareTrackingLinkDialogOpen(true)
    }

    const exportItem = (record: Record) => {
        // download path as a csv file
        jsonexport(record.path, function(err, csv){
            if (err) return console.error(err);
            download("travel.csv", 'data:text/csv;charset=utf-8,' + encodeURI(csv))
        });
    }

    const goToPathView = (record: Record) => {
        history.push('/item/' + record.startTime)
    }

    const split = splitListByDate(list, (item: Record) => new Date(item.startTime))
    const splitListView = split.map(({date, list}, index) => {
        return (
            <React.Fragment key={index}>
                <Typography align="center" color="secondary"> {getDateName(date)} </Typography>
                <List>
                    { list.map((record : Record, index) => {
                        const analitics = recordAnalysis(record)
                        return (
                            <ListItem key={index} divider={true} button onClick={() => goToPathView(record)} style={{border:"1px solid lightgrey"}}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Icon>{activity_icon.get(record.tag)}</Icon>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${analitics.distance/1000} kilometers`}
                                    secondary={TimeParserString(ParseTime(analitics.time))}
                                />
                                <ListItemSecondaryAction>
									<Tooltip title="Share"> 
										<IconButton edge="end" aria-label="share" onClick={() => shareItem(record)}>
											<Icon>share</Icon>
										</IconButton>
									</Tooltip>
									<Tooltip title="Download Path As CSV File"> 
										<IconButton edge="end" aria-label="export to csv" onClick={() => exportItem(record)}>
											<Icon>get_app</Icon>
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete"> 
										<IconButton edge="end" aria-label="delete" onClick={() => deleteItem(record)}>
											<Icon>delete</Icon>
										</IconButton>
									</Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    })
                }
                </List>
            </React.Fragment>
        )
    })

    if(loading)
        return <LinearProgress />

    return (
        <Box mb={3}>
            <Container maxWidth="sm">
                { loading ? <LinearProgress variant="indeterminate" /> : undefined }
                { operating ? <LinearProgress color="secondary" variant="indeterminate" /> : undefined }
                { error ? <Alert severity="error">Something went wrong! the server was unable to preform operation [{error}]</Alert> : undefined }
                <Box mt={2}>
                    { splitListView }
                </Box>
            </Container>
            <ShareTrackingLinkDialog isOpen={shareTrackingLinkDialogOpen} setOpen={setShareTrackingLinkDialogOpen} record={shareRecord} />
        </Box>
    )
}