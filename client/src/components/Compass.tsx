
export default function Compass({angle} : {angle: number}) {
    return (
        <div
            style={{
                position: "relative"
            }} 
        >
            <img alt="compass" src={process.env.PUBLIC_URL + "/compass/compass-niddle.svg"}
                style={{
                    position: "absolute",
                    transform: `rotateZ(${angle}deg)`,
                    transition: 'transform 0.5s'
                }} 
            />
            <img 
                alt="compass"
                src={process.env.PUBLIC_URL + "/compass/compass-directions.svg"}
                style={{
                }}
            />
        </div>
    )
}