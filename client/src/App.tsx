import './App.css'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Home from './pages/home'
import Item from './pages/item'
import Mobile from './pages/mobile'
import Guide from './pages/guide'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <Router>
	  <ScrollToTop />
      <Switch>
        <Route path="/guide" component={Guide} />
        <Route path="/mobile" component={Mobile} />
        <Route path="/item/:id" component={Item} />
        <Route path="/share/:hash" component={Item} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}