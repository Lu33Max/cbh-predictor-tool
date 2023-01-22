import { ResponsivePie } from "@nivo/pie";

export const PieChart = (props) => {
    return(
        <ResponsivePie
            data={props.data}
            colors={props.scheme}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={0}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={{
                from: 'color',
                modifiers: [['darker', 1.2]],
            }}
            arcLinkLabelsThickness={3}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="#000000"
        />
    )
}