import { Collapse, PageHeader, Spin } from 'antd';
import RaceCard from "./races/RaceCard";
import { useState, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import './Race.css'

const { Panel } = Collapse;

function Race(props) {

    const [current, setCurrent] = useState("-1");
    const [finished, setFinished] = useState("-1");
    const [season, setSeason] = useState("");
    const [keys, setKeys] = useState([]);

    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;

    useEffect(() => {
        //console.log("In Race");
        //console.log(props);
        var c = 180 * 24;
        var f = -180 * 24;
        if (props.races.length > 0) setSeason(props.races[0]["season"]);
        for (var race of props.races) {
            const round = race["round"];
            const hour = diffHours(race);
            if (-3 < hour && hour < c) {
                c = hour;
                setCurrent(round);
            }
            if (f <= hour && hour < -3) {
                f = hour;
                setFinished(round);
            }
        }
    }, [props])

    useEffect(() => {
        setKeys([current, finished]);
    },[current,finished])

    function toTimeString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(date.getDate()).padStart(2, '0');

        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        const strDate = day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
        return strDate;
    }

    function toHeader(race) {
        const round = race["round"];
        const raceName = race["raceName"];
        const date = toTimeString(new Date(race["date"] + "T" + race["time"]));
        return <div>
            <div>{`${round}. ${raceName}`}</div>
            <div>{date}</div>
        </div>
    }

    function diffHours(race) {
        const raceDate = new Date(race["date"] + "T" + race["time"]);
        const now = new Date();

        const oneHour = 1000 * 60 * 60;

        const diffinTime = raceDate.getTime() - now.getTime();

        return Math.round(diffinTime / oneHour);
    }

    function headerColor(race) {
        /*
        const red = "#FF0000";
        const yellow = "#FFFF00";
        const green = "#3BE13B";
        const white = "#FFFFFF";
        const diffDay = diffHours(race);
        if (-1 <= diffDay && diffDay <= 7 ) return green;
        if (-1 > diffDay) return red;
        if (diffDay > 7) return yellow;
        return white;
        */
        const red = "#ff6666";
        const yellow = "#FFFF00";
        const green = "#3BE13B";
        const white = "#FFFFFF";
        const blue = "#00FFFF";
        if (race["round"] === "-1") return white;
        if (race["round"] === finished) return blue;
        if (race["round"] === current) return green;
        if (Number(race["round"]) < Number(finished)) return white;
        if (Number(race["round"]) > Number(current)) return red;
    }

    return (
        <div>
            {
                props.races.length > 0 ?
                    <div>
                        <PageHeader style={{backgroundColor: "red"}} ghost={false} title={<div style={{color: "white"}}>{season} Formula One Schedule</div>} />
                        <Collapse activeKey={keys} onChange={setKeys}>
                            {props.races.map((race) =>
                                <Panel key={race["round"]} header={toHeader(race)} style={{ backgroundColor: headerColor(race) }}>
                                    <p>{race["round"]}</p>
                                    <p>{diffHours(race)}</p>
                                    <RaceCard {...race} />
                                </Panel>
                            )}
                        </Collapse>
                    </div>

                    :
                    <Spin style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}} indicator={antIcon} />
            }
        </div>
    );
}

export default Race;