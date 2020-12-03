import { Component } from 'react';
import './App.css';
import makeTableViewer from './TableViewer';

const INVENTORY = [
  { icon: '🍅', color: "warm", name: 'tomato' },
  { icon: '🍆', color: "cool", name: 'eggplant' },
  { icon: '🍇', color: "cool", name: 'grapes' },
  { icon: '🍈', color: "cool", name: 'melon' },
  { icon: '🍉', color: "warm", name: 'watermelon' },
  { icon: '🍊', color: "warm", name: 'tangerine' },
  { icon: '🍋', color: "warm", name: 'lemon' },
  { icon: '🍌', color: "warm", name: 'banana' },
  { icon: '🍍', color: "warm", name: 'pineapple' },
  { icon: '🍎', color: "warm", name: 'red apple' },
  { icon: '🍏', color: "cool", name: 'green apple' },
  { icon: '🍐', color: "cool", name: 'pear' },
  { icon: '🍑', color: "warm", name: 'peach' },
  { icon: '🍒', color: "warm", name: 'cherries' },
  { icon: '🍓', color: "warm", name: 'strawberry' },
]

const ICON_STYLE = {
  display: 'flex',
  justifyContent: 'center',
}
const NAME_STYLE = {
  paddingLeft: '.5em',
  paddingRight: '.5em',
}
const PRICE_STYLE = {
  display: 'flex',
  justifyContent: 'flex-end',
  paddingLeft: '.5em',
  paddingRight: '.5em',
}
const COUNT_STYLE = {
  display: 'flex',
  justifyContent: 'space-evenly',
  paddingLeft: '.5em',
  paddingRight: '.5em',
}

const THEAD_STYLE = { backgroundColor: 'sandybrown', color: 'white', width: '100%', height: '100%' };
class App extends Component {
  constructor(props) {
    super(props);
    const rawData = INVENTORY.map(({ icon, color, name }) => {
      return {
        icon, color, name,
        count: 0,
        price: Math.floor((Math.random() * 10)) + 0.99,
      };
    })
    this.state = {
      data: rawData,
      filterZeroCount: true,
      filterPositiveCount: true,
      filterColorWarm: true,
      filterColorCool: true,
    };
    const transition = (cmd, oldState) => {
      const { data, filterZeroCount, filterPositiveCount, filterColorWarm, filterColorCool } = oldState;
      switch (cmd.kind) {
        case 'inc': {
          return {
            data: data.map((item) => {
              const { name, count } = item;
              if ((name) === cmd.name) {
                return Object.assign({}, item, { count: count + 1 });
              } else {
                return item;
              }
            })
          };
        }
        case 'dec': {
          return {
            data: data.map((item) => {
              const { name, count } = item;
              if ((name) === cmd.name) {
                return Object.assign({}, item, { count: Math.max(0, count - 1) });
              } else {
                return item;
              }
            })
          };
        }
        case 'sort': {
          const { method } = cmd;
          if (method === 'disabled') {
            return {
              data: rawData,
            };
          } else {
            const baseCmp = (s1, s2) => {
              if (s1 < s2) {
                return -1;
              } else if (s1 === s2) {
                return 0;
              } else {
                return 1;
              }
            }
            const cmp = {
              'by-name-inc': (x, y) => baseCmp(x.name, y.name),
              'by-name-dec': (x, y) => baseCmp(y.name, x.name),
              'by-price-inc': (x, y) => baseCmp(x.price, y.price),
              'by-price-dec': (x, y) => baseCmp(y.price, x.price),
            }[method];
            const newData = [...data];
            newData.sort(cmp);
            return {
              data: newData
            };
          }
        }
        case 'toggleFilterZeroCount': {
          return {
            filterZeroCount: !filterZeroCount,
          };
        }
        case 'toggleFilterPositiveCount': {
          return {
            filterPositiveCount: !filterPositiveCount,
          };
        }
        case 'toggleFilterColorWarm': {
          return {
            filterColorWarm: !filterColorWarm,
          }
        }
        case 'toggleFilterColorCool': {
          return {
            filterColorCool: !filterColorCool,
          }
        }
        case 'resetFilters': {
          return {
            filterZeroCount: true,
            filterPositiveCount: true,
            filterColorWarm: true,
            filterColorCool: true,
          }
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
    const { data, filterZeroCount, filterPositiveCount, filterColorWarm, filterColorCool } = this.state;
    console.log("current state:", this.state)
    const isZeroCount = (item) => (item.count === 0);
    const isPositiveCount = (item) => (item.count > 0);
    const isWarmColor = (item) => {
      console.log("checking item", item)
      return (item.color === "warm")
    };
    const isCoolColor = (item) => (item.color === "cool");
    const filterCountPredicates = [].concat(
      (filterZeroCount ? [isZeroCount] : []),
      (filterPositiveCount ? [isPositiveCount] : [])
    )
    const filterColorPredicates = [].concat(
      (filterColorWarm ? [isWarmColor] : []),
      (filterColorCool ? [isCoolColor] : []),
    )
    const filterPred = (item) => {
      return filterCountPredicates.some((pred) => pred(item)) && filterColorPredicates.some((pred) => pred(item));
    };
    const filteredData = data.filter(filterPred);
    const editor = (cmd) => { this.editor(cmd); }
    const renderCount = ({ name, count }) => {
      const handleDec = (e) => {
        e.preventDefault();
        editor({ kind: 'dec', name: name });
        return false;
      }
      const handleInc = (e) => {
        e.preventDefault();
        editor({ kind: 'inc', name: name });
        return false;
      }
      return (
        <div style={COUNT_STYLE}>
          <button onClick={handleDec}>-</button>
          {count}
          <button onClick={handleInc}>+</button>
        </div>
      );
    }
    const renderHead = (s) => (
      <div style={THEAD_STYLE}>{s.toLocaleUpperCase()}</div>
    )
    const Inventory = makeTableViewer(
      ['icon', 'feel', 'name', 'price', 'count'],
      renderHead,
      {
        icon: ({ icon }) => <span style={ICON_STYLE}>{icon}</span>,
        feel: ({ color }) => <span style={Object.assign({}, ICON_STYLE, { color: { "warm": "red", "cool": "blue"}[color]})}>■</span>,
        name: ({ name }) => <span style={NAME_STYLE}>{name}</span>,
        price: ({ price }) => <span style={PRICE_STYLE}>${price.toFixed(2)}</span>,
        count: renderCount
      },
      {
        icon: '3em',
        feel: "3em",
        name: '1fr',
        price: '4em',
        count: '5em',
      });
    const Summary = makeTableViewer(
      ['name', 'price', 'count', 'total'],
      (s) => s.toLocaleUpperCase(),
      {
        name: ({ name }) => <span style={NAME_STYLE}>{name.toLocaleUpperCase()}</span>,
        price: ({ price }) => <span style={PRICE_STYLE}>${price.toFixed(2)}</span>,
        count: renderCount,
        total: ({ price, count }) => <span style={PRICE_STYLE}>${(parseFloat(price) * count).toFixed(2)}</span>,
      },
      {
        name: '1fr',
        price: 'auto',
        count: '4em',
        total: 'auto',
      });
    const makeStaticHandler = (todo) => (e) => {
      todo();
    }
    const handleSort = (e) => {
      e.preventDefault();
      this.editor({ kind: "sort", method: e.target.value });
      return false;
    };
    const handleResetFilters = makeStaticHandler(() => this.editor({ kind: 'resetFilters' }))
    const handleToggleFilterZeroCount = makeStaticHandler(() => this.editor({ kind: 'toggleFilterZeroCount' }));
    const handleToggleFilterPositiveCount = makeStaticHandler(() => this.editor({ kind: 'toggleFilterPositiveCount' }));
    const handleToggleFilterColorWarm = makeStaticHandler(() => this.editor({ kind: 'toggleFilterColorWarm' }));
    const handleToggleFilterColorCool = makeStaticHandler(() => this.editor({ kind: 'toggleFilterColorCool' }));
    return (
      <div className="App">
        <div>
          <fieldset>
            <legend>Filters:</legend>
            <button onClick={handleResetFilters}>Reset</button>
            <fieldset>
              <legend>By-count:</legend>
              <ul>
                <li>
                  <label>
                    <input type='checkbox' name='zero-count' checked={filterZeroCount}
                      onChange={handleToggleFilterZeroCount} />
                  &nbsp;count = 0
                </label>
                </li>
                <li>
                  <label>
                    <input type='checkbox' name='positive-count' checked={filterPositiveCount}
                      onChange={handleToggleFilterPositiveCount} />
                  &nbsp;count &gt; 0
                </label>
                </li>
              </ul>
            </fieldset>
            and
            <fieldset>
              <legend>By-color:</legend>
              <ul>
                <li>
                  <label>
                    <input type='checkbox' name='warm-color' checked={filterColorWarm}
                      onChange={handleToggleFilterColorWarm} />
                  &nbsp;<span style={{ color: "red" }}>warm color</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type='checkbox' name='cool-color' checked={filterColorCool}
                      onChange={handleToggleFilterColorCool} />
                    &nbsp;<span style={{ color: "blue" }}>cool color</span>
                  </label>
                </li>
              </ul>
            </fieldset>
          </fieldset>
          <fieldset>
            <legend>Sort:</legend>
            <select onChange={handleSort}>
              <option value="disabled">default</option>
              <option value="by-name-inc">by names (a-z)</option>
              <option value="by-name-dec">by names (z-a)</option>
              <option value='by-price-inc'>by prices (0-9)</option>
              <option value='by-price-dec'>by prices (9-0)</option>
            </select>
          </fieldset>
        </div>
        <div style={{ fontSize: 'larger' }}><Inventory data={filteredData} /></div>
        <div style={{ fontSize: 'larger' }}>
          <Summary data={data.filter(isPositiveCount)} />
          <p>
    <strong>{data.reduce((acc, { count }) => acc + count, 0)} items, ${data.reduce((total, { count, price }) => (total + (count * price)), 0).toFixed(2)}</strong>
          </p>
        </div>
      </div>
    );
  }
}
export default App;
