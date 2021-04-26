
import { createStyles, makeStyles } from "@material-ui/styles"
import { Theme } from "@material-ui/core"

const useStyles =  makeStyles((theme: Theme) => createStyles({
    container: {
        position: 'relative',
        width: "300px",
        height: "300px"
    },
    stage: {
        width: '201px',
        height: '201px',
        position: 'absolute',
        top: '32px',
        left: '49px'
    },
    ball: {
        '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxShadow: '-40px 10px 70px 10px rgba(0,0,0,0.7) inset',
            zIndex: '2'
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            filter: 'blur(0)',
            opacity: '0.3',
            background: 'radial-gradient(circle at 30% 35%, #fff, #3a4142 30%, #055194 56%, #062745 100%)'
        },
        margin: '0',
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        perspective: '600px',
        backfaceVisibility: 'visible',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        background: `url('${ process.env.PUBLIC_URL }/globe/world-equirectangular-blank-physical-map.jpg') repeat`,
        backgroundSize: 'auto 120%',
        animation: '$move-map 7s infinite linear'
    },
    '@global': {
        "@keyframes move-map": {
        "0%": {
            backgroundPosition: '0 0'
        },
        "100%": {
            backgroundPosition: '482px 0'
        }
        }
    },
    credit: {
        textDecoration: "none",
        fontSize: '10px',
        width: '100%',
        textAlign: 'center',
        marginTop: '50px',
        display: 'block',
        position: 'absolute',
        bottom: '0'
    },
    satellite: {
        width: 'inherit',
        position: 'absolute'
    },
    '@media screen and (min-width: 0px)': {
        container: {
            width: "300px",
            height: "300px"
        },
        stage: {
            width: '201px',
            height: '201px',
            top: '32px',
            left: '49px'
        },
        ball: {
            '@global': {
                "@keyframes move-map": {
                    "100%": {
                        backgroundPosition: '482px 0'
                    }
                }
            }
        }
    },
    '@media screen and (min-width: 600px)': {
        container: {
            width: "400px",
            height: "400px"
        },
        stage: {
            width: '268px',
            height: '268px',
            top: '42px',
            left: '66px'
        },
        ball: {
            '@global': {
                "@keyframes move-map": {
                    "100%": {
                        backgroundPosition: '643px 0'
                    }
                }
            }
        }
    }
  }),
)

export default function Globe() {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <img className={classes.satellite} alt="satellite" src={process.env.PUBLIC_URL + "/globe/satellite.svg"} />
            <section className={classes.stage}>
                <figure className={classes.ball}></figure>
            </section>
            <a href="http://www.mapswire.com" className={classes.credit}> Map from mapswire.com</a>
        </div>
    )
}