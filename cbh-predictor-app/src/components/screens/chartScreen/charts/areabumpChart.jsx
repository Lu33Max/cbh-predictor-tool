import { ResponsiveAreaBump } from '@nivo/bump'

export const AreaBump = (props) => {
    return(
        <ResponsiveAreaBump
            data={props.data}
            margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
            spacing={8}
            colors={props.scheme}
            blendMode="multiply"
            startLabel="id"
            endLabel="id"
            axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: -36
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendPosition: 'middle',
                legendOffset: 32
            }}
        />
    )
}