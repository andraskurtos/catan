import { useEffect, useState } from "preact/hooks";
import "./Hex.less";

enum tileType {
    PASTURE = 0,
    DESERT,
    FOREST,
    HILL,
    MOUNTAIN,
    FIELD
}

class Tile {
    centerx: number = 0;
    centery: number = 0;
    type: tileType;

    constructor(centerx?: number, centery?: number, type?: tileType) {
        this.centerx = centerx;
        this.centery = centery;
        this.type = type;
    }
}

export function Hex({ radius, tile, text }: { radius: number, tile: Tile, text: number }) {

    let coords = [];
    for (let i = 0; i < 6; i++) {
        coords.push({
            x: tile.centerx + radius * Math.cos(i * Math.PI / 3 + Math.PI / 6),
            y: tile.centery + radius * Math.sin(i * Math.PI / 3 + Math.PI / 6)
        });
    }

    return (
        <svg>
            <polygon className="hex" points={coords.map(c => `${c.x},${c.y}`).join(" ")} fill={`url(#${tileType[tile.type]})`} />
            {/* <text x={tile.centerx} y={tile.centery} fill="red" >{text}</text> */}
        </svg>
    );
}

export function HexGrid({ radius, hexRadius, padding }: { radius: number, hexRadius: number, padding: number }) {

    function fact(n: number): number {
        if (n <= 1) return 1;
        return n * fact(n - 1);
    }
    const [tiles, setTiles] = useState(new Array<Tile>())
    let width = 2 * (radius + 0.5) * (hexRadius + padding) * Math.sqrt(3);
    let height = (radius * 3 + 2) * (hexRadius + padding);

    useEffect(() => {
        regenerate();
    }, [radius, hexRadius, padding])

    const regenerate = () => {

        let centers = [];
        const length = fact(radius) * 6 + 1;
        width = 2 * (radius + 0.5) * (hexRadius + padding) * Math.sqrt(3);
        height = (radius * 3 + 2) * (hexRadius + padding);

        centers.push({
            x: width / 2,
            y: height / 2
        });

        for (let i = 1; i <= radius; i++) {
            for (let j = 0; j < 6; j++) {
                let x = width / 2 + (hexRadius + padding) * i * Math.sqrt(3) * Math.cos(j * Math.PI / 3);
                let y = height / 2 + (hexRadius + padding) * i * Math.sqrt(3) * Math.sin(j * Math.PI / 3);
                centers.push({
                    x: x,
                    y: y
                });
                for (let k = 1; k <= i - 1; k++) {
                    centers.push({
                        x: x + k * (hexRadius + padding) * Math.sqrt(3) * Math.cos(j * Math.PI / 3 + Math.PI / 1.5),
                        y: y + k * (hexRadius + padding) * Math.sqrt(3) * Math.sin(j * Math.PI / 3 + Math.PI / 1.5)
                    });
                }
            }
        }

        for (let i = 0; i < centers.length; i++) {
            setTiles(tiles => [...tiles, new Tile(centers[i].x, centers[i].y, Math.floor(Math.random() * 6))]);
        }
    }



    let n = 0;
    return (
        <div className="hexgridcontainer">
            <svg className="hexgrid" width={width} height={height}>
                <defs>
                    <pattern id="PASTURE" patternUnits="objectBoundingBox" width={1} height={1}>
                        <image href="pasture.png" width={hexRadius * Math.sqrt(3)} height={hexRadius * 2} />
                    </pattern>
                    <pattern id="DESERT" patternUnits="objectBoundingBox" width={1} height={1}>
                        <image href="desert.png" width={hexRadius * Math.sqrt(3)} height={hexRadius * 2} />
                    </pattern>
                    <pattern id="FOREST" patternUnits="objectBoundingBox" width={1} height={1}>
                        <image href="forest.png" width={hexRadius * Math.sqrt(3)} height={hexRadius * 2} />
                    </pattern>
                    <pattern id="HILL" patternUnits="objectBoundingBox" width={1} height={1}>
                        <image href="hill.png" width={hexRadius * Math.sqrt(3)} height={hexRadius * 2} />
                    </pattern>
                    <pattern id="MOUNTAIN" patternUnits="objectBoundingBox" width={1} height={1}>
                        <image href="mountain.png" width={hexRadius * Math.sqrt(3)} height={hexRadius * 2} />
                    </pattern>
                    <pattern id="FIELD" patternUnits="objectBoundingBox" width={1} height={1}>
                        <image href="field.png" width={hexRadius * Math.sqrt(3)} height={hexRadius * 2} />

                    </pattern>
                </defs>

                {/* <Hex radius={hexRadius} cx={width/2} cy={height/2} textureId="field"/> */}
                {tiles.map((tile, i) => <Hex key={i} radius={hexRadius} tile={tile} text={n++} />)}
            </svg>
            <button className="generatebutton" onClick={regenerate}>Generate</button>
        </div>
    );
}