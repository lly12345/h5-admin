import React, { useState,useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route ,useHistory} from "react-router-dom"
import routes from '@/router'

import './App.css'

function App() {

  return <Router>
    <Switch>
      {
        routes.map(route => <Route key={route.path} path={route.path}>
          <route.component />
        </Route>)
      }
      
    </Switch>
  </Router>
}

export default App
