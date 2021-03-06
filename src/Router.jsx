import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { SignIn, ProductList, SignUp, Reset, ProductEdit, ProductDetail, FavoriteList, AdminSignUp, AdminTopPage, TopPage, MyPage, StepForm, CostResult, CostEdit, ProductEntry, CostResultList, CostResultDetail} from './templates';
import Auth from './Auth';
import { getRole } from './reducks/users/selectors';



const Router = () => {
  const selector = useSelector((state) => state);
  const role = getRole(selector);

  function BranchingComponent(){
    if(role === "admin") 
      return <AdminTopPage />;
    else 
      return <TopPage />;
  }
  return(
    <Switch>
      <Route exact path={"/signup"} component={SignUp} />
      <Route exact path={"/signin"} component={SignIn} />
      <Route exact path={"/signin/reset"} component={Reset} />
      <Route exact path={"/admin/signup"} component={AdminSignUp} />
      <Route exact path={"(/)?"} component={BranchingComponent} />
      <Auth>
        <Route exact path={"/product"} component={ProductList} />
        <Route exact path={"/user/mypage"} component={MyPage} />
        <Route exact path={"/product/detail/:id"} component={ProductDetail} />
        <Route exact path={"/product/entry"} component={ProductEntry} />
        <Route path={"/product/edit(/:id)?"} component={ProductEdit} />
        <Route path={"/product/:id/cost/edit(/:id)?"} component={CostEdit} />
        <Route path={"/product/:id/cost/:id/step"} component={StepForm} />
        <Route exact path={"/favorite"} component={FavoriteList} />
        <Route path={"/result/:id"} component={CostResult} />
        <Route exact path={"/resultlist"} component={CostResultList} />
        <Route path={"/cost/detail/:id"} component={CostResultDetail} />
      </Auth>
    </Switch>
  )
}

export default Router;