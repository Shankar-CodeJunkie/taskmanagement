import React, {Component, useEffect, useState} from 'react';
import './App.scss';
import {Content, Theme} from '@carbon/react';
import AppHeader from './components/Header';
import HomePage from './content/HomePage/HomePage';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import RepoPage from './content/RepoPage';
import TaskList from './content/TaskList/TaskList';
import {connect} from 'react-redux';
import {Provider} from "react-redux";
//import store from './redux/store';
import {getService} from './content/httpService/httpService'
import {
  useGetAllProductsQuery,
  useGetProductQuery,
}  from "./redux/slice/taskSlice";
import {useSelector, useDispatch} from "react-redux";
import {getAllTasks} from "./redux/slice/taskSlice1";

function App(props) {
  console.log('stt', props);
 // const {data:allProductsData} = useGetAllProductsQuery();
  //console.log('damn',allProductsData);
  const dispatch = useDispatch()
  const [appTheme, modifyAppTheme] = useState('white')
  const sendDataToParent = (value) => {
    modifyAppTheme(value);
  }
  const [appState, updateAppState] = useState();
  const state = useSelector(state => state);
  console.log('appstate', state.reducer.tasks)

  useEffect(async () => {
    //let data = await getService('/', '/gettasks', '');
    //console.log('hey data', data);
    //props.dispatch({type:'GET_ITEM', value:data});
    let existingTasks = dispatch(getAllTasks())
    updateAppState(existingTasks);
  }, [])


  return (
      <>
        <Theme theme={appTheme}>
          <AppHeader sendDataToParent={sendDataToParent}/>

          <Content>
            <Router>
              <Routes>
                <Route path={'/'} element={<HomePage />} />
                <Route path={'/repopage'} element={<RepoPage />} />
                <Route path={'/tasklist'}  element={<TaskList props={props}  />} />

              </Routes>
            </Router>

          </Content>
        </Theme>
      </>
  );
}

const mapStateToProps = (state) => {
  return {
    taskList: state.tasklist
  }
}

export default connect(mapStateToProps)(App);
