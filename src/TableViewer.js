import React from 'react';
import './TableViewer.css'

const makeTableViewer = (thead, renderHead, renderCell, spacingCell) => {
    // thead : List<String>  { no repeated elements }
    // renderHead  : forall s in thread → Component
    // renderCell  : forall s in thread → Cell(s) → Component
    // spacingCell : forall s in thread → Cell(s) → String
    class TableViewer extends React.Component {
        constructor(props) {
            super(props);
            const data = props.data;
            const config = Object.assign({}, {
                limit: 10,
                start: 0,
            }, props.config)
            this.state = {
                data: data,
                limit: config.limit,
                start: config.start,
            };
            const transition = (cmd, oldState) => {
                const { data, start, limit } = oldState;
                switch (cmd.kind) {
                    case "inc": {
                        return {
                            start: Math.min(start + limit, data.length - limit)
                        };
                    }
                    case "dec": {
                        return {
                            start: Math.max(start - limit, 0)
                        };
                    }
                    case "fastInc": {
                        return {
                            start: Math.min(start + (10 * limit), data.length - limit)
                        };
                    }
                    case "fastDec": {
                        return {
                            start: Math.max(start - (10 * limit), 0)
                        };
                    }
                    case "changeLimit": {
                        const { value } = cmd;
                        return {
                            limit: value,
                        };
                    }
                    default: {
                        return null;
                    }
                }
            }
            this.editor = (cmd) => {
                this.setState(transition(cmd, this.state));
            }
        }
        render() {
            const { data, start, limit } = this.state;
            const end = Math.min(start + limit, data.length);
            const shownIndexes = [];
            for (let i = start; i < end; i++) {
                shownIndexes.push(i);
            }
            const handleInc = (e) => this.editor({ kind: "inc" })
            const handleDec = (e) => this.editor({ kind: "dec" })
            const handleFastInc = (e) => this.editor({ kind: "fastInc" })
            const handleFastDec = (e) => this.editor({ kind: "fastDec" })
            const handleChangeLimit = (e) => {
                this.editor({ kind: 'changeLimit', value: e.target.value })
            }
            return (
                <div className="TableViewer">
                    <div>
                        {/* <div>
                            Page Limit:
                            <select value={limit} onChange={handleChangeLimit}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={100}>100</option>
                                <option value={parseFloat("+inf")}>∞</option>
                            </select>
                        </div> */}
                        <div>
                            showing {(start < end) ? ((start + 1) + "-" + end) : "none"} of {data.length}&nbsp;
                            <button onClick={handleFastDec} disabled={start === 0}>≪</button>
                            <button onClick={handleDec} disabled={start === 0}>&lt;</button>
                            <button onClick={handleInc} disabled={end === data.length}>&gt;</button>
                            <button onClick={handleFastInc} disabled={end === data.length}>≫</button>
                        </div>
                    </div>
                    <table style={{ gridTemplateColumns: thead.map((s) => spacingCell[s]).join(" ") }}>
                        <thead>
                            <tr>
                                {thead.map((s) => (
                                    <th key={s}>{renderHead(s)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {shownIndexes.map((i) => (
                                <tr key={i}>
                                    {thead.map((s) => (
                                        <td key={s}>{renderCell[s](data[i])}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    }
    return TableViewer;
}

export default makeTableViewer;