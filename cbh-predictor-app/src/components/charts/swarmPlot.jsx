import { ResponsiveSwarmPlot } from "@nivo/swarmplot"

export const SwarmPlot = (props) => {
    return(
        <ResponsiveSwarmPlot
            data={props.data}
            groups={[ 'specimen','order' ]}
            identity="id"
            value="price"
            valueFormat="$.0f"
            colors={[ '#8cb171', '#6BB238' ]}
            valueScale={{ type: 'linear', min: 0, max: 500, reverse: false }}
            size={{
                key: 'volume',
                values: [
                    1,
                    300
                ],
                sizes: [
                    6,
                    15
                ]
            }}
            forceStrength={4}
            simulationIterations={50}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.6
                    ],
                    [
                        'opacity',
                        0.5
                    ]
                ]
            }}
            margin={{ top: 20, right: 50, bottom: 55, left: 50 }}
            axisBottom={{
                orient: 'bottom',
                tickSize: 10,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Price Distribution',
                legendPosition: 'middle',
                legendOffset: 46
            }}
            tooltip={({ data }) => (
                <div style={{ padding: 12, color: '#000000', background: '#ffffff'}}>
                    <strong>
                        {data.price}: {data.volume}
                    </strong>
                </div>
            )}
        />
    )
}