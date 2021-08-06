import React from 'react'
import NavBar from '@/layout/navbar'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"

import Home from '@/pages/home'
import Activity from '@/pages/activity'
import ActivityPeriod from '@/pages/activityPeriod'
import RegisterActivity from '@/pages/registerActivity'
import PublicRegister from '@/pages/publicRegister'

import Goods from '@/pages/goods'



export default function index() {
   
    return (
        
            <div>
                <NavBar>后台管理系统</NavBar>
                <div style={{ marginTop: '50px' }}>
                    <Switch>
                        <Route exact path='/home' component={Home} />
                        <Route exact path={'/goods'} component={Goods} />
                        <Route exact path={`/activityPeriod`} component={ActivityPeriod} />
                        <Route path={`/registerActivity/*`} component={RegisterActivity} />
                        <Route exact path={`/applyActivity/*`} component={PublicRegister} />
                    </Switch>
                </div>
                
            </div>
         

    )
}
